const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace href="../[path]/" with href="https://www.tropishinecleaning.com/[path]/"
const regex = /href="\.\.\/([^"]+)"/g;
html = html.replace(regex, 'href="https://www.tropishinecleaning.com/$1"');

// Save it back
fs.writeFileSync(indexPath, html, 'utf8');
console.log("Replaced all relative ../ links with absolute domain links in index.html");
