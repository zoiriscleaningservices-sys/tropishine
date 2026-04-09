const fs = require('fs');
const path = require('path');

const domain = "https://www.tropishinecleaning.com";
const today = new Date().toISOString().split('T')[0];

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Ensure we only scan the nav header for locations to prevent snagging generic service buttons
const megaMenuStart = indexHtml.indexOf('<!-- LOCATIONS DROPDOWN -->');
const megaMenuEnd = indexHtml.indexOf('<!-- NEXT-GEN MOBILE NAVIGATION HUB -->');

let megaMenuHtml = "";
if (megaMenuStart !== -1 && megaMenuEnd !== -1) {
    megaMenuHtml = indexHtml.slice(megaMenuStart, megaMenuEnd);
} else {
    console.error("Failed to extract mega menu!");
    process.exit(1);
}

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

const coreRoutes = [
    "/",
    "/about-us/",
    "/gallery/",
    "/blog/"
];

const services = [
    "house-cleaning",
    "recurring-house-cleaning",
    "post-construction-cleaning",
    "commercial-cleaning",
    "janitorial-cleaning",
    "day-porter-service",
    "airbnb-cleaning",
    "short-term-rental-cleaning",
    "deep-cleaning",
    "move-in-move-out-cleaning",
    "strip-and-wax-floor-care",
    "carpet-cleaning",
    "air-duct-cleaning",
    "window-cleaning",
    "restaurant-cleaning",
    "garage-cleaning",
    "office-cleaning",
    "medical-office-cleaning",
    "kitchen-exhaust-cleaning",
    "heavy-duty-deep-cleaning",
    "post-fumigation-cleaning"
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Root Core Routes
coreRoutes.forEach(route => {
    xml += `  <url>\n    <loc>${domain}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;
});

// 2. Root Service Routes (Deerfield Beach Legacy Setup)
services.forEach(service => {
    const route = `/${service}-deerfield-beach/`;
    xml += `  <url>\n    <loc>${domain}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;
});

let siloCount = 0;

// 3. Dynamic Mass Location Silos
locations.forEach(location => {
    if (location === 'deerfield-beach') return;

    // Location Hub
    xml += `  <url>\n    <loc>${domain}/${location}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;
    siloCount++;
    
    // Core routes inside Silo
    ["about-us", "gallery", "blog"].forEach(coreSlug => {
        xml += `  <url>\n    <loc>${domain}/${location}/${coreSlug}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;
        siloCount++;
    });

    // Services inside Silo
    services.forEach(service => {
        xml += `  <url>\n    <loc>${domain}/${location}/${service}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;
        siloCount++;
    });
});

xml += `</urlset>`;

const sitemapPath = path.join(__dirname, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`Generated sitemap.xml with ${coreRoutes.length + services.length + siloCount} total routes.`);
