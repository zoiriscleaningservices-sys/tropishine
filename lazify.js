const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
// Target img tags without loading attributes
html = html.replace(/<img(?![^>]*loading=[\"']lazy[\"'])([^>]+)>/g, '<img loading="lazy"$1>');
fs.writeFileSync('index.html', html);
console.log('Applied lazy loading to images in index.html');
