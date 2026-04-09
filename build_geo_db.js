const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const start = indexHtml.indexOf('<!-- LOCATIONS DROPDOWN -->');
const end = indexHtml.indexOf('<!-- NEXT-GEN MOBILE NAVIGATION HUB -->');
const html = indexHtml.slice(start, end);

const regex = /href="https:\/\/www\.tropishinecleaning\.com\/([^\/]+)\/"[^>]*>([^<]+)<\/a>/g;
let m;
const locs = [];
while ((m = regex.exec(html)) !== null) {
    const slug = m[1].trim();
    if (!['about-us', 'blogs', 'gallery', 'house-cleaning', 'deep-cleaning'].includes(slug)) {
        // Clean name via slug parsing to prevent formatting issues
        const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        locs.push({ slug, name });
    }
}

// Add Deerfield manually since it was omitted from the root Boca nav originally
locs.push({ slug: 'deerfield-beach', name: 'Deerfield Beach' });

// Strip duplicates
const uniqueLocs = Array.from(new Map(locs.map(item => [item.slug, item])).values());
console.log(`Found ${uniqueLocs.length} unique locations.`);

async function geocode() {
    console.log("Geocoding locations via Nominatim OSM (Please wait approx 75 seconds)...");
    for (let i = 0; i < uniqueLocs.length; i++) {
        const city = uniqueLocs[i];
        
        try {
            const query = `${city.name}, Florida, USA`;
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
            
            const res = await fetch(url, { headers: { 'User-Agent': 'TropishineSEO_Builder/1.0' }});
            const data = await res.json();
            
            if (data && data.length > 0) {
                city.lat = parseFloat(data[0].lat);
                city.lon = parseFloat(data[0].lon);
            } else {
                console.log(`WARN: Coordinates not found for ${city.name}, assigning base coordinates.`);
                city.lat = 26.3587; // Boca Raton base
                city.lon = -80.0831;
            }
        } catch(e) {
            console.log(`ERROR on ${city.name}: ${e.message}`);
            city.lat = 26.3587;
            city.lon = -80.0831;
        }
        
        // Wait 1100ms to strictly respect Nominatim rate limits (Max 1 req/sec)
        await new Promise(r => setTimeout(r, 1100));
        process.stdout.write(`[${i+1}/${uniqueLocs.length}] `);
    }
    
    fs.writeFileSync('locations_db.json', JSON.stringify(uniqueLocs, null, 2));
    console.log('\nGeo database built successfully.');
}

geocode();
