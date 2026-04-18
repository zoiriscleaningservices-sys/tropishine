const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const regex = /family—ensuring/g;
const newText = 'family, ensuring';

const replaced = content.replace(regex, newText);

if(replaced !== content) {
    fs.writeFileSync('index.html', replaced);
    console.log('Success - updated em-dash to comma.');
} else {
    console.log('Failed to match string.');
}
