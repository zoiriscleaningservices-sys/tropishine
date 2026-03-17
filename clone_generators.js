const fs = require('fs');
const path = require('path');

// --- 1. Clone Services Generator ---
let deerfieldStr = fs.readFileSync('generate_deerfield_services.js', 'utf8');

// Replace locations
deerfieldStr = deerfieldStr.replace(/Deerfield Beach/g, 'Hillsboro Beach');
deerfieldStr = deerfieldStr.replace(/deerfield-beach/g, 'hillsboro-beach');

// Change folder generation to nested silo: 'hillsboro-beach/service-name'
deerfieldStr = deerfieldStr.replace(/const folderName = \`\\\$\\{service\.id\\}-hillsboro-beach\`;/g, 'const folderName = path.join("hillsboro-beach", service.id);');

// Because folderName is now nested, Canonical needs to be specifically formatted
deerfieldStr = deerfieldStr.replace(/<link rel="canonical" href="https:\/\/www\.tropishinecleaning\.com\/\$\{folderName\}\/" \/>/, '<link rel="canonical" href="https://www.tropishinecleaning.com/hillsboro-beach/${service.id}/" />');

// Fix Asset Depth (1 level to 2 levels)
deerfieldStr = deerfieldStr.replace(/\$1="\.\.\/images\//g, '$1="../../images/');
deerfieldStr = deerfieldStr.replace(/\$1="\.\.\/hero-vid\//g, '$1="../../hero-vid/');

// Fix absolute index mapping
deerfieldStr = deerfieldStr.replace(/href="\.\.\/index\.html"/g, 'href="https://www.tropishinecleaning.com/hillsboro-beach/"');

// Specifically replace the img src injection which was written as ../\${service.img}
deerfieldStr = deerfieldStr.replace(/src="\.\.\/\\\$\\{service\.img\\}"/g, 'src="../../${service.img}"');

fs.writeFileSync('generate_h_services.js', deerfieldStr);
console.log("Created generate_h_services.js");


// --- 2. Clone Core Pages Generator ---
let coreStr = fs.readFileSync('generate_core_pages.js', 'utf8');

// The Core pages are inherently root-level generic, except we need to inject Hillsboro context inside the page generation.
// It also needs to output to hillsboro-beach/slug/

// Change output folder to silo
coreStr = coreStr.replace(/const folderPath = path\.join\(__dirname, page\.slug\);/, 'const folderPath = path.join(__dirname, "hillsboro-beach", page.slug);');

// Fix Asset Depth
coreStr = coreStr.replace(/\$1="\.\.\/images\//g, '$1="../../images/');
coreStr = coreStr.replace(/\$1="\.\.\/hero-vid\//g, '$1="../../hero-vid/');
coreStr = coreStr.replace(/href="\.\.\/index\.html"/g, 'href="https://www.tropishinecleaning.com/hillsboro-beach/"');

// Fix img injections in core
coreStr = coreStr.replace(/src="\.\.\/\\\$\\{img\\}"/g, 'src="../../${img}"');
coreStr = coreStr.replace(/src="\.\.\/\\\$\\{post\.img\\}"/g, 'src="../../${post.img}"');
// Fix heroImg injection if it exists
coreStr = coreStr.replace(/src="\.\.\/\\\$\\{img\\}"/g, 'src="../../${img}"'); // For buildV3Hero

// Target the build body calls and append Hillsboro Beach to Titles/Descs
coreStr = coreStr.replace(/<title>\$\{page\.title\} - Tropishine Cleaning<\/title>/, '<title>${page.title} Hillsboro Beach - Tropishine Cleaning</title>');
coreStr = coreStr.replace(/content="\$\{page\.desc\}"/, 'content="${page.desc} Available in Hillsboro Beach."');
coreStr = coreStr.replace(/<link rel="canonical" href="https:\/\/www\.tropishinecleaning\.com\/\$\{page\.slug\}\/" \/>/, '<link rel="canonical" href="https://www.tropishinecleaning.com/hillsboro-beach/${page.slug}/" />');

fs.writeFileSync('generate_h_core.js', coreStr);
console.log("Created generate_h_core.js");
