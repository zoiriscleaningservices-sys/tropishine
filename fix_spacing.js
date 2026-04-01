const fs = require('fs');
const files = [
    'generate_core_pages.js',
    'generate_deerfield_services.js',
    'generate_hillsboro_silo.js',
    'generate_h_core.js',
    'generate_h_services.js'
];

// Reusing the exact same responsive conversions we established
const replacements = [
    { target: /py-32(?!\s)/g, replace: 'py-6 md:py-32' },
    { target: /py-24(?!\s)/g, replace: 'py-6 md:py-24' },
    { target: /pt-32(?!\s)/g, replace: 'pt-8 md:pt-32' },
    { target: /pt-48(?!\s)/g, replace: 'pt-16 md:pt-48' },
    { target: /pb-32(?!\s)/g, replace: 'pb-8 md:pb-32' },
    { target: /mt-20(?!\s)/g, replace: 'mt-4 md:mt-20' },
    { target: /mb-20(?!\s)/g, replace: 'mb-4 md:mb-20' },
    { target: /mt-12(?!\s)/g, replace: 'mt-4 md:mt-12' },
    { target: /pb-20(?!\s)/g, replace: 'pb-2 md:pb-20' }
];

let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(r => {
        // Only replace if they aren't already preceded by md:, lg:, sm: or followed by responsive classes
        // Easiest safe replace is targeting classes like " py-32 ", "py-32\"", etc.
        // We ensure no responsive prefixes.
        // Node regex does not easily do lookbehinds without breaking on old versions, 
        // but since we are running locally on v16+, negative lookbehinds are supported!
        content = content.replace(/(?<![a-zA-Z0-9:-])(py-32|py-24|pt-32|pt-48|pb-32|mt-20|mb-20|mt-12|pb-20)(?![a-zA-Z0-9:-])/g, (match) => {
            const map = {
                'py-32': 'py-6 md:py-32',
                'py-24': 'py-6 md:py-24',
                'pt-32': 'pt-8 md:pt-32',
                'pt-48': 'pt-16 md:pt-48',
                'pb-32': 'pb-8 md:pb-32',
                'mt-20': 'mt-4 md:mt-20',
                'mb-20': 'mb-4 md:mb-20',
                'mt-12': 'mt-4 md:mt-12',
                'pb-20': 'pb-2 md:pb-20'
            };
            return map[match];
        });
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log(`Updated mobile spacing in: ${file}`);
    }
});

console.log(`Finished processing JS generator files. Applied to ${changedCount} files.`);
