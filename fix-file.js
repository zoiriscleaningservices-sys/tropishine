const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /Preserving the timeless elegance of <strong class="text-sky-400 font-black" id="text-rotate-desc-1">Boca Raton<\/strong>\. We're a family-owned cleaning company, proud to serve Broward, Palm Beach, and Martin counties\. We treat every client like family, delivering a warm, personalized touch that ensures your home remains a <strong class="text-white font-black" id="text-rotate-desc-3">pristine sanctuary<\/strong>\./;

const newHeroText = `Welcome to our family. As a proudly family-owned cleaning company, we serve Broward, Palm Beach, and Martin counties with a warm, personal touch. We treat every client like family—ensuring your space remains a <strong class="text-white font-black" id="text-rotate-desc-3">pristine sanctuary</strong> where you can feel truly comfortable.`;

const replaced = content.replace(regex, newHeroText);

if(replaced !== content) {
    fs.writeFileSync('index.html', replaced);
    console.log('Success - updated description text.');
} else {
    console.log('Failed to match exact string. Content is:', content.substring(content.indexOf('Preserving'), content.indexOf('Preserving') + 200));
}
