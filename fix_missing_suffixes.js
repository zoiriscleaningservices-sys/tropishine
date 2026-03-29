const fs = require('fs');

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

let html = fs.readFileSync('index.html', 'utf8');

let replaced = 0;

services.forEach(service => {
    const regex1 = new RegExp(`href="https://www.tropishinecleaning.com/${service}/"`, 'g');
    html = html.replace(regex1, match => {
        replaced++;
        return `href="https://www.tropishinecleaning.com/${service}-deerfield-beach/"`;
    });
    
    const regex2 = new RegExp(`href="/${service}/"`, 'g');
    html = html.replace(regex2, match => {
        replaced++;
        return `href="/${service}-deerfield-beach/"`;
    });
    
    const regex3 = new RegExp(`href="\\.\\./${service}/"`, 'g');
    html = html.replace(regex3, match => {
        replaced++;
        return `href="../${service}-deerfield-beach/"`;
    });
});

fs.writeFileSync('index.html', html, 'utf8');
console.log(`Replaced ${replaced} missing -deerfield-beach suffixes in index.html.`);
