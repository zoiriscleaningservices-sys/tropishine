const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldHeroRegex = /As a family-owned cleaning company, we are proud to serve the three counties, ensuring your home remains a <strong class="text-white font-black" id="text-rotate-desc-3">pristine sanctuary<\/strong>\./;

const newHeroText = `We're a family-owned cleaning company, proud to serve Broward, Palm Beach, and Martin counties. We treat every client like family, delivering a warm, personalized touch that ensures your home remains a <strong class="text-white font-black" id="text-rotate-desc-3">pristine sanctuary</strong>.`;

const replaced = content.replace(oldHeroRegex, newHeroText);

if(replaced !== content) {
    fs.writeFileSync('index.html', replaced);
    console.log('Success - replaced hero text.');
} else {
    console.log('Failed to match. The content was:', content.substring(content.indexOf('As a family-owned'), content.indexOf('As a family-owned') + 200));
}
