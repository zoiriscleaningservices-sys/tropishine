const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = __dirname;
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// ============================================
// 0. LOAD LOCATIONS FROM GEO DATABASE
// ============================================

console.log("Loading Locations from locations_db.json...");
const locations = JSON.parse(fs.readFileSync(path.join(rootDir, 'locations_db.json'), 'utf8'));

// Haversine Distance Formula
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Generate Localized Dropdown HTML
function getNearbyLocationsHtml(currentSlug) {
    const currentLoc = locations.find(l => l.slug === currentSlug);
    if(!currentLoc || !currentLoc.lat) return null; // fallback to empty if missing
    
    // Sort all locations by distance to current
    let distances = locations.map(loc => {
        return {
            ...loc,
            distance: getDistance(currentLoc.lat, currentLoc.lon, loc.lat, loc.lon)
        }
    }).filter(loc => loc.slug !== currentSlug && loc.slug !== "blog" && loc.distance > 0)
      .sort((a,b) => a.distance - b.distance);
    
    // Take 10 closest
    let closest = distances.slice(0, 10);
    
    let dtHtml = `<!-- LOCATIONS DROPDOWN -->
                <div class="nav-item relative group py-4">
                    <button class="flex items-center gap-1.5 text-zinc-800 hover:text-sky-600 px-4 py-2 rounded-full hover:bg-sky-50 transition-colors nav-link-modern whitespace-nowrap">
                        Nearby Locations <i data-lucide="chevron-down"
                            class="w-4 h-4 transition-transform group-hover:rotate-180"></i>
                    </button>
                    <div class="dropdown-menu absolute top-full left-0 w-[400px] bg-white rounded-3xl shadow-2xl shadow-sky-900/10 border border-sky-100 p-6 mega-scroll"
                        style="max-height: 70vh; overflow-y: auto; right: -200px; left: auto;">
                        <div class="flex flex-col">
                            <h4 class="text-[14px] font-black text-sky-600 uppercase tracking-widest mb-4 border-b border-sky-100 pb-3">Service Areas Near ${currentLoc.name}</h4>
                            <div class="grid grid-cols-2 gap-3">`;
    for(let loc of closest) {
        dtHtml += `
                                <a href="https://www.tropishinecleaning.com/${loc.slug}/"
                                    class="nearby-loc-link text-[13px] text-zinc-950 font-black uppercase py-2 px-3 rounded-lg hover:bg-sky-50 transition-colors truncate"
                                    title="${loc.name}">${loc.name}</a>`;
    }
    dtHtml += `
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END LOCATIONS DROPDOWN -->`;

    let mobHtml = `<!-- LOCATIONS ACCORDION -->
                <div class="mobile-accordion border border-sky-100/50 rounded-2xl overflow-hidden bg-white/50">
                    <button
                        class="mobile-accordion-header w-full p-4 flex items-center justify-between text-zinc-900 font-black text-sm uppercase tracking-widest bg-white hover:bg-sky-50/50 transition-colors">
                        <span class="flex items-center gap-3">
                            <i data-lucide="map-pin" class="w-5 h-5 text-sky-500"></i>
                            Nearby Locations
                        </span>
                        <i data-lucide="chevron-down"
                            class="w-4 h-4 text-zinc-400 transition-transform duration-300"></i>
                    </button>
                    <div class="mobile-accordion-content bg-white/30 backdrop-blur-sm mega-scroll">
                        <div class="p-3 space-y-1" id="mobile-locations-container">`;
    for(let loc of closest) {
        mobHtml += `
                            <a href="https://www.tropishinecleaning.com/${loc.slug}/"
                                class="nearby-loc-link mobile-item-card flex items-center gap-3 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400/20 hover:bg-white/50">
                                <span class="text-[10px] text-zinc-800 font-black uppercase tracking-wide">${loc.name}</span>
                            </a>`;
    }
    mobHtml += `
                        </div>
                    </div>
                </div>
                <!-- END LOCATIONS ACCORDION -->`;

    return { desktop: dtHtml, mobile: mobHtml };
}


console.log(`Loaded ${locations.length} Locations from JSON! Starting Mass V3 Generation Phase...`);

const baseServicesGenerator = fs.readFileSync(path.join(rootDir, 'generate_boca_raton_services.js'), 'utf8');
const baseCoreGenerator = fs.readFileSync(path.join(rootDir, 'generate_core_pages.js'), 'utf8');

// ============================================
// MASS GENERATOR EXECUTION
// ============================================

for (const location of locations) {
    if (location.slug === 'boca-raton') {
        console.log(`Skipping boca-raton silo generation (using root legacy pages instead)...`);
        continue;
    }

    console.log(`\n===========================================`);
    console.log(`Generating Silo for: ${location.name} (${location.slug})`);
    
    // --- 1. GENERATE THE SILO HOMEPAGE (DEPTH: 1) ---
    const siloPath = path.join(rootDir, location.slug);
    if (!fs.existsSync(siloPath)) {
        fs.mkdirSync(siloPath, { recursive: true });
    }

    let hubHtml = indexHtml;
    
        // --- INJECT GEO-PROXIMITY SILO NAVIGATION ---
    const localSiloNav = getNearbyLocationsHtml(location.slug);
    if(localSiloNav) {
        // Desktop injection
        const replaceStartDt = hubHtml.indexOf('<!-- LOCATIONS DROPDOWN -->');
        const replaceEndDt = hubHtml.indexOf('<!-- END LOCATIONS DROPDOWN -->');
        if(replaceStartDt !== -1 && replaceEndDt !== -1) {
            hubHtml = hubHtml.slice(0, replaceStartDt) + localSiloNav.desktop + hubHtml.slice(replaceEndDt + '<!-- END LOCATIONS DROPDOWN -->'.length);
        }

        // Mobile injection
        const replaceStartMob = hubHtml.indexOf('<!-- LOCATIONS ACCORDION -->');
        const replaceEndMob = hubHtml.indexOf('<!-- END LOCATIONS ACCORDION -->');
        if(replaceStartMob !== -1 && replaceEndMob !== -1) {
            hubHtml = hubHtml.slice(0, replaceStartMob) + localSiloNav.mobile + hubHtml.slice(replaceEndMob + '<!-- END LOCATIONS ACCORDION -->'.length);
        }
    }
    
    // Specific fixes for root paths to point correctly relative 1 dir deep
    hubHtml = hubHtml.replace(/(src|href)="images\//g, '$1="../images/');
    hubHtml = hubHtml.replace(/(src|href)="hero-vid\//g, '$1="../hero-vid/');
    hubHtml = hubHtml.replace(/url\('images\//g, "url('../images/");
    
    hubHtml = hubHtml.replace(/<title>.*?<\/title>/s, `<title>Cleaning Services in ${location.name}, FL | Tropishine Cleaning</title>`);
    hubHtml = hubHtml.replace(/<meta name="description" content=".*?">/s, `<meta name="description" content="Tropishine cleaning is the highest rated home cleaning company, commercial cleaning company, and deep cleaning company in ${location.name}, FL.">`);
    
    // Core keyword substitution (Careful here, matching Boca Raton and South Florida as our baselines in index.html)
    hubHtml = hubHtml.replace(/South Florida/g, location.name);
    hubHtml = hubHtml.replace(/Boca Raton/g, location.name);
    
    // Dynamic Schema Localization
    // Map Hillsboro Beach to the specific location name
    hubHtml = hubHtml.replace(/"addressLocality":"Hillsboro Beach"/g, `"addressLocality":"${location.name}"`);
    // Blank out the hardcoded zip code or replace it
    hubHtml = hubHtml.replace(/"postalCode":"33062"/g, `""`);
    // Inject dynamic GeoCoordinates
    if (location.lat && location.lon) {
        hubHtml = hubHtml.replace(/"addressCountry":"United States"}/g, `"addressCountry":"United States"},"geo":{"@type":"GeoCoordinates","latitude":${location.lat},"longitude":${location.lon}}`);
    }

    hubHtml = hubHtml.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="https://www.tropishinecleaning.com/${location.slug}/" />`);
    
    // Insulate Silo Links
    hubHtml = hubHtml.replace(/href="https:\/\/www\.tropishinecleaning\.com\/([a-zA-Z0-9-]+)-boca-raton\/"/g, `href="https://www.tropishinecleaning.com/${location.slug}/$1/"`);
    hubHtml = hubHtml.replace(/href="(?:https:\/\/www\.tropishinecleaning\.com)?\/(about-us|blog|gallery)\/"/g, `href="https://www.tropishinecleaning.com/${location.slug}/$1/"`);
    hubHtml = hubHtml.replace(/href="https:\/\/www\.tropishinecleaning\.com\/"([\s\S]*?>Home<\/a>)/g, `href="https://www.tropishinecleaning.com/${location.slug}/"$1`);
    
    // Fix footer map
    hubHtml = hubHtml.replace(/Tropishine%20Cleaning,%20Deerfield%20Beach,%20FL/g, encodeURIComponent(location.name + ", FL"));
    
    fs.writeFileSync(path.join(siloPath, 'index.html'), hubHtml, 'utf8');
    
    // --- 2. COMPILE & EXECUTE SERVICES GENERATOR FOR THIS LOCATION ---
    let locDStr = baseServicesGenerator;
    
    // Bind generator to the localized Geo-Proximity Silo Base
    locDStr = locDStr.replace(/const indexHtmlPath = path\.join\(__dirname, 'index\.html'\);/, `const indexHtmlPath = path.join(__dirname, "${location.slug}", "index.html");`);
    
    // Basic structural replacements to match the new location
    locDStr = locDStr.replace(/Boca Raton/g, location.name);
    locDStr = locDStr.replace(/boca-raton/g, location.slug);

    // Deep routing manipulation
    locDStr = locDStr.replace("const folderName = `${service.id}-" + location.slug + "`;", `const folderName = "${location.slug}/" + service.id;`);
    
    // Dynamically inject GeoCoordinates into the generated schema of the local services
    if (location.lat && location.lon) {
        locDStr = locDStr.replace(/"addressCountry": "US"/, `"addressCountry": "US"\n        },\n        "geo": {\n            "@type": "GeoCoordinates",\n            "latitude": ${location.lat},\n            "longitude": ${location.lon}`);
    }
    
    // Depth 2 adjustments
    locDStr = locDStr.replace(`finalHtml = finalHtml.replace(/(src|href)="images\\//g, '$1="../images/');`, `finalHtml = finalHtml.replace(/(src|href)="images\\//g, '$1="../../images/');\n    finalHtml = finalHtml.replace(/(src|href)="\\.\\.\\/images\\//g, '$1="../../images/');\n    finalHtml = finalHtml.replace(/url\\('images\\//g, "url('../../images/");\n    finalHtml = finalHtml.replace(/url\\('\\.\\.\\/images\\//g, "url('../../images/");`);
    locDStr = locDStr.replace(`finalHtml = finalHtml.replace(/(src|href)="hero-vid\\//g, '$1="../hero-vid/');`, `finalHtml = finalHtml.replace(/(src|href)="hero-vid\\//g, '$1="../../hero-vid/');\n    finalHtml = finalHtml.replace(/(src|href)="\\.\\.\\/hero-vid\\//g, '$1="../../hero-vid/');`);
    
    // Insulate Links dynamically within generated JS script
    locDStr = locDStr.replace(/\/\/ Fix paths \(since page is generated one level down from root\)/g, `// Insulate Silo Links\n    finalHtml = finalHtml.replace(/href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/([a-zA-Z0-9-]+)-boca-raton\\\/"/g, 'href="https://www.tropishinecleaning.com/${location.slug}/$1/"');\n    finalHtml = finalHtml.replace(/href="(?:https:\\\/\\\/www\\.tropishinecleaning\\.com)?\\\/(about-us|blog|gallery)\\\/"/g, 'href="https://www.tropishinecleaning.com/${location.slug}/$1/"');\n    finalHtml = finalHtml.replace(/<a href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/"/g, '<a href="https://www.tropishinecleaning.com/${location.slug}/"');\n    finalHtml = finalHtml.replace(/href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/([^\\/]+)\\\/"([^>]+nearby-loc-link)/g, 'href="https://www.tropishinecleaning.com/$1/' + service.id + '/"$2');\n    // Fix paths (since page is generated one level down from root)`);

    locDStr = locDStr.replace(/href="\.\.\/index\.html"/g, `href="https://www.tropishinecleaning.com/${location.slug}/"`);
    locDStr = locDStr.replace(/src="\.\.\/\$\{service\.img\}"/g, 'src="../../${service.img}"');
    
    // Fix base script replacements for footer map in generated service pages
    // Note: 'Deerfield Beach' in the original string was already replaced by location.name
    locDStr = locDStr.replace(new RegExp(`Tropishine%20Cleaning,%20${location.name},%20FL`, 'g'), encodeURIComponent(location.name + ", FL"));

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

    // Bind generator to the localized Geo-Proximity Silo Base
    locCStr = locCStr.replace(/const indexHtmlPath = path\.join\(__dirname, 'index\.html'\);/, `const indexHtmlPath = path.join(__dirname, "${location.slug}", "index.html");`);

    // Basic structural replacements to match the new location
    locCStr = locCStr.replace(/Boca Raton/g, location.name);
    locCStr = locCStr.replace(/boca-raton/g, location.slug);
    
    // Deep routing manipulation
    locCStr = locCStr.replace(/const folderPath = path\.join\(__dirname, page\.slug\);/, `const folderPath = path.join(__dirname, "${location.slug}", page.slug);`);
    
    // In case the core generator creates schemas, though unlikely
    if (location.lat && location.lon) {
        locCStr = locCStr.replace(/"addressCountry": "US"/, `"addressCountry": "US"\n        },\n        "geo": {\n            "@type": "GeoCoordinates",\n            "latitude": ${location.lat},\n            "longitude": ${location.lon}`);
    }

    // Depth 2 adjustments
    locCStr = locCStr.replace(`pageHtml = pageHtml.replace(/(src|href)="images\\//g, '$1="../images/');`, `pageHtml = pageHtml.replace(/(src|href)="images\\//g, '$1="../../images/');\n    pageHtml = pageHtml.replace(/(src|href)="\\.\\.\\/images\\//g, '$1="../../images/');\n    pageHtml = pageHtml.replace(/url\\('images\\//g, "url('../../images/");\n    pageHtml = pageHtml.replace(/url\\('\\.\\.\\/images\\//g, "url('../../images/");`);
    locCStr = locCStr.replace(`pageHtml = pageHtml.replace(/(src|href)="hero-vid\\//g, '$1="../hero-vid/');`, `pageHtml = pageHtml.replace(/(src|href)="hero-vid\\//g, '$1="../../hero-vid/');\n    pageHtml = pageHtml.replace(/(src|href)="\\.\\.\\/hero-vid\\//g, '$1="../../hero-vid/');`);
    
    // Insulate Silo Links
    locCStr = locCStr.replace(/\/\/ Fix Paths for links and images/g, `// Insulate Silo Links\n    pageHtml = pageHtml.replace(/href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/([a-zA-Z0-9-]+)-boca-raton\\\/"/g, 'href="https://www.tropishinecleaning.com/${location.slug}/$1/"');\n    pageHtml = pageHtml.replace(/href="(?:https:\\\/\\\/www\\.tropishinecleaning\\.com)?\\\/(about-us|blog|gallery)\\\/"/g, 'href="https://www.tropishinecleaning.com/${location.slug}/$1/"');\n    pageHtml = pageHtml.replace(/<a href="https:\\\/\\\/www\\.tropishinecleaning\\.com\\\/"/g, '<a href="https://www.tropishinecleaning.com/${location.slug}/"');\n    // Fix Paths for links and images`);

    locCStr = locCStr.replace(/href="\.\.\/index\.html"/g, `href="https://www.tropishinecleaning.com/${location.slug}/"`);

    locCStr = locCStr.replace(/src="\.\.\/\$\{img\}"/g, 'src="../../${img}"');
    locCStr = locCStr.replace(/src="\.\.\/\$\{post\.img\}"/g, 'src="../../${post.img}"');

    // Fix base script replacements for footer map in generated core pages
    // Note: 'Deerfield Beach' in the original string was already replaced by location.name
    locCStr = locCStr.replace(new RegExp(`Tropishine%20Cleaning,%20${location.name},%20FL`, 'g'), encodeURIComponent(location.name + ", FL"));

    // Title and Meta localized injection
    locCStr = locCStr.replace(/<title>\$\{page\.title\} - Tropishine Cleaning<\/title>/, `<title>\${page.title} ${location.name} - Tropishine Cleaning</title>`);
    locCStr = locCStr.replace(/content="\$\{page\.desc\}"/, `content="\${page.desc} ${location.name}."`);
    locCStr = locCStr.replace(/<link rel="canonical" href="https:\/\/www\.tropishinecleaning\.com\/\$\{page\.slug\}\/" \/>/, `<link rel="canonical" href="https://www.tropishinecleaning.com/${location.slug}/\${page.slug}/" />`);

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





