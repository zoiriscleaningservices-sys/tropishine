const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// ============================================
// 0. EXTRACT ALL 73 LOCATIONS FROM MEGA MENU
// ============================================

console.log("Extracting Locations from Document...");
const megaMenuStart = indexHtml.indexOf('<!-- LOCATIONS DROPDOWN -->');
const megaMenuEnd = indexHtml.indexOf('<!-- NEXT-GEN MOBILE NAVIGATION HUB -->');

if (megaMenuStart === -1 || megaMenuEnd === -1) {
    console.error("Failed to find mega menu block!");
    process.exit(1);
}

const megaMenuHtml = indexHtml.slice(megaMenuStart, megaMenuEnd);

const locationRegex = /href="https:\/\/www\.tropishinecleaning\.com\/([^\/]+)\/"[^>]*>([^<]+)<\/a>/g;
let match;
const locationsMap = new Map();

while ((match = locationRegex.exec(megaMenuHtml)) !== null) {
    const slug = match[1].trim();
    const rawName = match[2].trim();
    const name = rawName.replace(/[\r\n\s]+/g, ' ');

    if (["about-us", "blogs", "gallery", "house-cleaning", "deep-cleaning"].includes(slug)) {
        continue;
    }
    locationsMap.set(slug, name);
}

const locations = Array.from(locationsMap.entries()).map(([slug, name]) => ({ slug, name }));
console.log(`Found ${locations.length} Locations! Starting Mass Generation Phase using V3 Base Clones...`);

const baseServicesGenerator = fs.readFileSync(path.join(rootDir, 'generate_deerfield_services.js'), 'utf8');
const baseCoreGenerator = fs.readFileSync(path.join(rootDir, 'generate_core_pages.js'), 'utf8');

// ============================================
// MASS GENERATOR EXECUTION
// ============================================

for (const location of locations) {
    console.log(`\n===========================================`);
    console.log(`Generating Silo for: ${location.name} (${location.slug})`);
    
    // --- 1. GENERATE THE SILO HOMEPAGE (DEPTH: 1) ---
    const siloPath = path.join(rootDir, location.slug);
    if (!fs.existsSync(siloPath)) {
        fs.mkdirSync(siloPath, { recursive: true });
    }

    let hubHtml = indexHtml;
    // Specific fixes for root paths to point correctly relative 1 dir deep
    hubHtml = hubHtml.replace(/(src|href)="images\//g, '$1="../images/');
    hubHtml = hubHtml.replace(/(src|href)="hero-vid\//g, '$1="../hero-vid/');
    
    hubHtml = hubHtml.replace(/<title>.*?<\/title>/s, `<title>Cleaning Services in ${location.name}, FL | Tropishine Cleaning</title>`);
    hubHtml = hubHtml.replace(/<meta name="description" content=".*?">/s, `<meta name="description" content="Tropishine cleaning is the highest rated home cleaning company, commercial cleaning company, and deep cleaning company in ${location.name}, FL.">`);
    
    // Core keyword substitution (Careful here, matching Deerfield Beach and South Florida as our baselines in index.html)
    hubHtml = hubHtml.replace(/South Florida/g, location.name);
    hubHtml = hubHtml.replace(/Deerfield Beach/g, location.name);
    
    hubHtml = hubHtml.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="https://www.tropishinecleaning.com/${location.slug}/" />`);
    
    // Insulate Silo Links
    hubHtml = hubHtml.replace(/href="https:\/\/www\.tropishinecleaning\.com\/([a-zA-Z0-9-]+)-deerfield-beach\/"/g, `href="https://www.tropishinecleaning.com/${location.slug}/$1/"`);
    hubHtml = hubHtml.replace(/href="https:\/\/www\.tropishinecleaning\.com\/(about-us|blog|gallery)\/"/g, `href="https://www.tropishinecleaning.com/${location.slug}/$1/"`);
    hubHtml = hubHtml.replace(/href="https:\/\/www\.tropishinecleaning\.com\/"([\s\S]*?>Home<\/a>)/g, `href="https://www.tropishinecleaning.com/${location.slug}/"$1`);
    
    fs.writeFileSync(path.join(siloPath, 'index.html'), hubHtml, 'utf8');
    
    // --- 2. COMPILE & EXECUTE SERVICES GENERATOR FOR THIS LOCATION ---
    let locDStr = baseServicesGenerator;
    
    // Basic structural replacements to match the new location
    locDStr = locDStr.replace(/Deerfield Beach/g, location.name);
    locDStr = locDStr.replace(/deerfield-beach/g, location.slug);

    // Deep routing manipulation
    locDStr = locDStr.replace("const folderName = `${service.id}-" + location.slug + "`;", `const folderName = "${location.slug}/" + service.id;`);
    
    // Depth 2 adjustments
    locDStr = locDStr.replace(/\$1="\.\.\/images\//g, '$1="../../images/');
    locDStr = locDStr.replace(/\$1="\.\.\/hero-vid\//g, '$1="../../hero-vid/');
    
    // Insulate Links dynamically within generated JS script
    locDStr = locDStr.replace(/\/\/ Fix paths \(since page is generated one level down from root\)/g, `// Insulate Silo Links\n    finalHtml = finalHtml.replace(/href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/([a-zA-Z0-9-]+)-deerfield-beach\\\/"/g, 'href="https://www.tropishinecleaning.com/${location.slug}/$1/"');\n    finalHtml = finalHtml.replace(/href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/(about-us|blog|gallery)\\\/"/g, 'href="https://www.tropishinecleaning.com/${location.slug}/$1/"');\n    finalHtml = finalHtml.replace(/<a href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/"/g, '<a href="https://www.tropishinecleaning.com/${location.slug}/"');\n    // Fix paths (since page is generated one level down from root)`);

    locDStr = locDStr.replace(/href="\.\.\/index\.html"/g, `href="https://www.tropishinecleaning.com/${location.slug}/"`);
    locDStr = locDStr.replace(/src="\.\.\/\$\{service\.img\}"/g, 'src="../../${service.img}"');

    const tempServicesPath = path.join(rootDir, `generate_services_${location.slug}.js`);
    fs.writeFileSync(tempServicesPath, locDStr);

    try {
        console.log(`   Running Service Generator for ${location.slug}...`);
        execSync(`node ${tempServicesPath}`, { cwd: rootDir, stdio: 'ignore' });
    } catch (e) {
        console.error(`   Failed setting up services for ${location.slug}:`, e);
    }
    fs.unlinkSync(tempServicesPath);


    // --- 3. COMPILE & EXECUTE CORE PAGES GENERATOR FOR THIS LOCATION ---
    let locCStr = baseCoreGenerator;
    
    // Deep routing manipulation
    locCStr = locCStr.replace(/const folderPath = path\.join\(__dirname, page\.slug\);/, `const folderPath = path.join(__dirname, "${location.slug}", page.slug);`);

    // Depth 2 adjustments
    locCStr = locCStr.replace(/\$1="\.\.\/images\//g, '$1="../../images/');
    locCStr = locCStr.replace(/\$1="\.\.\/hero-vid\//g, '$1="../../hero-vid/');
    
    // Insulate Silo Links
    locCStr = locCStr.replace(/\/\/ Fix Paths for links and images/g, `// Insulate Silo Links\n    pageHtml = pageHtml.replace(/href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/([a-zA-Z0-9-]+)-deerfield-beach\\\/"/g, 'href="https://www.tropishinecleaning.com/${location.slug}/$1/"');\n    pageHtml = pageHtml.replace(/href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/(about-us|blog|gallery)\\\/"/g, 'href="https://www.tropishinecleaning.com/${location.slug}/$1/"');\n    pageHtml = pageHtml.replace(/<a href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/"/g, '<a href="https://www.tropishinecleaning.com/${location.slug}/"');\n    // Fix Paths for links and images`);

    locCStr = locCStr.replace(/href="\.\.\/index\.html"/g, `href="https://www.tropishinecleaning.com/${location.slug}/"`);

    locCStr = locCStr.replace(/src="\.\.\/\$\{img\}"/g, 'src="../../${img}"');
    locCStr = locCStr.replace(/src="\.\.\/\$\{post\.img\}"/g, 'src="../../${post.img}"');

    // Title and Meta localized injection
    locCStr = locCStr.replace(/<title>\$\{page\.title\} - Tropishine Cleaning<\/title>/, `<title>\\$\\{page.title\\} ${location.name} - Tropishine Cleaning</title>`);
    locCStr = locCStr.replace(/content="\$\{page\.desc\}"/, `content="\\$\\{page.desc\\} ${location.name}."`);
    locCStr = locCStr.replace(/<link rel="canonical" href="https:\/\/www\.tropishinecleaning\.com\/\$\{page\.slug\}\/" \/>/, `<link rel="canonical" href="https://www.tropishinecleaning.com/${location.slug}/\\$\\{page.slug\\}/" />`);

    const tempCorePath = path.join(rootDir, `generate_core_${location.slug}.js`);
    fs.writeFileSync(tempCorePath, locCStr);

    try {
        console.log(`   Running Core Generator for ${location.slug}...`);
        execSync(`node ${tempCorePath}`, { cwd: rootDir, stdio: 'ignore' });
    } catch (e) {
        console.error(`   Failed setting up core for ${location.slug}:`, e);
    }
    fs.unlinkSync(tempCorePath);
}

console.log("\n===========================================");
console.log("SUCCESS! Highly optimized V3 Local SEO silos deployed for 70+ locations (approx 1750+ localized HTML files).");
