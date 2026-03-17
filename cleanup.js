const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const megaMenuStart = indexHtml.indexOf('<div class="mobile-accordion-content');
const megaMenuEnd = indexHtml.indexOf('<!-- LOCATIONS AND MAP SECTION -->');
const megaMenuHtml = indexHtml.slice(megaMenuStart, megaMenuEnd);

const locationRegex = /href="https:\/\/www\.tropishinecleaning\.com\/([^\/]+)\/"[^>]*>([^<]+)<\/a>/g;
let match;
const locationsMap = new Map();

while ((match = locationRegex.exec(megaMenuHtml)) !== null) {
    const slug = match[1].trim();
    if (["about-us", "blogs", "gallery", "house-cleaning", "deep-cleaning"].includes(slug)) {
        continue;
    }
    locationsMap.set(slug, true);
}

const locations = Array.from(locationsMap.keys());

const services = [
    "house-cleaning", "recurring-house-cleaning", "post-construction-cleaning", "commercial-cleaning",
    "janitorial-cleaning", "day-porter-service", "airbnb-cleaning", "short-term-rental-cleaning",
    "deep-cleaning", "move-in-move-out-cleaning", "strip-and-wax-floor-care", "carpet-cleaning",
    "air-duct-cleaning", "window-cleaning", "restaurant-cleaning", "garage-cleaning",
    "office-cleaning", "medical-office-cleaning", "kitchen-exhaust-cleaning",
    "heavy-duty-deep-cleaning", "post-fumigation-cleaning"
];

let deleted = 0;
locations.forEach(slug => {
    // Keep deerfield-beach root services because they are the foundation
    if (slug === 'deerfield-beach') return; 
    
    services.forEach(service => {
        const badFolder = path.join(rootDir, `${service}-${slug}`);
        if (fs.existsSync(badFolder)) {
            fs.rmSync(badFolder, { recursive: true, force: true });
            deleted++;
        }
        
        // Also clean up any messed up nested folders if service name combined (saw this bug earlier)
        const messyComboFolder = path.join(rootDir, `${service}-${service}`);
        if(fs.existsSync(messyComboFolder)){
             fs.rmSync(messyComboFolder, { recursive: true, force: true });
        }
    });
});

// A unique bug from earlier matching: 'kitchen-exhaust-cleaning-heavy-duty-deep-cleaning'
const badRoot = path.join(rootDir, 'kitchen-exhaust-cleaning-heavy-duty-deep-cleaning');
if(fs.existsSync(badRoot)) fs.rmSync(badRoot, { recursive: true, force: true });

console.log(`Cleanup complete! Removed ${deleted} misplaced root service folders.`);
