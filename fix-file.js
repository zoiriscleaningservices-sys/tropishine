const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace the HTML description text
const findHtml = 'we serve Broward, Palm Beach, and Martin counties with a warm, personal touch.';
const replaceHtml = 'we serve <strong class="text-sky-400 font-black" id="text-rotate-desc-1">Broward County</strong> with a warm, personal touch.';

// Replace the JS configuration 
const findJs = `                {
                    id: 'text-rotate-desc-1',
                    texts: ["Boca Raton", "Boca Raton", "Fort Lauderdale", "Palm Beach"],
                    baseClass: 'text-sky-400',
                    interval: 3500 // Staggered interval to avoid sync looping
                },`;

const replaceJs = `                {
                    id: 'text-rotate-desc-1',
                    texts: ["Broward County", "Palm Beach County", "Martin County"],
                    baseClass: 'text-sky-400',
                    interval: 3500 // Staggered interval to avoid sync looping
                },`;

let replaced = content.replace(findHtml, replaceHtml);
replaced = replaced.replace(findJs, replaceJs);

if (replaced !== content) {
    fs.writeFileSync('index.html', replaced);
    console.log('Success - updated description text and JS array.');
} else {
    // If the exact format doesn't match, try simpler regex for JS array
    replaced = replaced.replace(/texts: \["Boca Raton", "Boca Raton", "Fort Lauderdale", "Palm Beach"\]/g, 'texts: ["Broward County", "Palm Beach County", "Martin County"]');
    if (replaced !== content) {
        fs.writeFileSync('index.html', replaced);
        console.log('Success - fallback replace matched.');
    } else {
        console.log('Failed to match anything.');
    }
}
