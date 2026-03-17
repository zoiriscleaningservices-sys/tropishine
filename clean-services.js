const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// 1. Get TRUE locations from the strict desktop dropdown
const trueLocStart = indexHtml.indexOf('<!-- LOCATIONS DROPDOWN -->');
const trueLocEnd = indexHtml.indexOf('<!-- NEXT-GEN MOBILE NAVIGATION HUB -->');
const trueLocHtml = indexHtml.slice(trueLocStart, trueLocEnd);

const locationRegex = /href="https:\/\/www\.tropishinecleaning\.com\/([^\/]+)\/"[^>]*>([^<]+)<\/a>/g;
let match;
const trueLocations = new Set();
while ((match = locationRegex.exec(trueLocHtml)) !== null) {
    trueLocations.add(match[1].trim());
}

// Keep the standard roots
trueLocations.add('deerfield-beach');
trueLocations.add('images');
trueLocations.add('hero-vid');
trueLocations.add('about-us');
trueLocations.add('blog');
trueLocations.add('gallery');
trueLocations.add('.git');
trueLocations.add('.github');
trueLocations.add('node_modules');

// 2. Get BUGGY locations the previous script accidentally parsed
const buggyStart = indexHtml.indexOf('<div class="mobile-accordion-content');
const buggyEnd = indexHtml.indexOf('<!-- LOCATIONS AND MAP SECTION -->');
const buggyHtml = indexHtml.slice(buggyStart, buggyEnd);

locationRegex.lastIndex = 0; // reset
const allParsed = new Set();
while ((match = locationRegex.exec(buggyHtml)) !== null) {
    allParsed.add(match[1].trim());
}

let deletedCount = 0;

for (const slug of allParsed) {
    // If it's a parsed slug that is NOT a true location, then it's a buggy generated folder!
    if (!trueLocations.has(slug)) {
        const badFolder = path.join(rootDir, slug);
        if (fs.existsSync(badFolder) && fs.lstatSync(badFolder).isDirectory()) {
            console.log(`Deleting accidental silo: ${slug}`);
            fs.rmSync(badFolder, { recursive: true, force: true });
            deletedCount++;
        }
    }
}

console.log(`Cleanup complete! Removed ${deletedCount} accidental service-as-location silos.`);
