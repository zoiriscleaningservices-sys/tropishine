const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Fix encoding damage
content = content.replace(/â€™/g, '’');
content = content.replace(/â€”/g, '—');

// Update the hero description text based on the user's latest input
const oldHeroRegex = /As a trusted family-owned business, <strong class="text-white font-black hover:text-sky-300 transition-colors" id="text-rotate-desc-2">our specialized team<\/strong> creates a welcoming vibe, ensuring your space remains a <strong class="text-white font-black" id="text-rotate-desc-3">pristine sanctuary<\/strong>\./;

const newHeroText = `As a family-owned cleaning company, we are proud to serve the three counties, ensuring your home remains a <strong class="text-white font-black" id="text-rotate-desc-3">pristine sanctuary</strong>.`;

content = content.replace(oldHeroRegex, newHeroText);

fs.writeFileSync('index.html', content);
console.log('Fixed encoding and replaced hero text.');
