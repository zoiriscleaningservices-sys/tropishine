const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// The exact string to find:
const searchString = `<i data-lucide="leaf" class="w-3.5 h-3.5 text-green-400"></i>
                        <span class="text-white">Non-Toxic</span>`;
                        
const replaceString = `<i data-lucide="users" class="w-3.5 h-3.5 text-sky-400"></i>
                        <span class="text-white uppercase font-black text-[12px] tracking-[0.05em]">Family Owned</span>`;

let replaced = content.replace(searchString, replaceString);

if(replaced !== content) {
    fs.writeFileSync('index.html', replaced);
    console.log('Success - replaced non-toxic badge.');
} else {
    console.log('Failed to match exact string.');
    // Let's do a fallback replace if line endings are different:
    replaced = content.replace(/Non-Toxic/g, 'FAMILY OWNED').replace(/data-lucide="leaf" class="w-3.5 h-3.5 text-green-400"/g, 'data-lucide="users" class="w-3.5 h-3.5 text-sky-400"');
    fs.writeFileSync('index.html', replaced);
    console.log('Fell back to regex replace.');
}
