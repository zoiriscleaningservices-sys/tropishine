const fs = require('fs');
const path = require('path');

const domain = "https://www.tropishinecleaning.com";
const today = new Date().toISOString().split('T')[0];

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const locationsDbPath = path.join(__dirname, 'locations_db.json');
const locationsDb = JSON.parse(fs.readFileSync(locationsDbPath, 'utf8'));
const locations = locationsDb.map(loc => loc.slug);

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
    xml += `  <url>\n    <loc>${domain}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.9</priority>\n  </url>\n`;
});

let siloCount = 0;

// 3. Dynamic Mass Location Silos
locations.forEach(location => {
    if (location === 'deerfield-beach') return;

    // Location Hub
    xml += `  <url>\n    <loc>${domain}/${location}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.9</priority>\n  </url>\n`;
    siloCount++;
    
    // Core routes inside Silo
    ["about-us", "gallery", "blog"].forEach(coreSlug => {
        xml += `  <url>\n    <loc>${domain}/${location}/${coreSlug}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
        siloCount++;
    });

    // Services inside Silo
    services.forEach(service => {
        xml += `  <url>\n    <loc>${domain}/${location}/${service}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
        siloCount++;
    });
});

xml += `</urlset>`;

const sitemapPath = path.join(__dirname, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`Generated sitemap.xml with ${coreRoutes.length + services.length + siloCount} total routes.`);
