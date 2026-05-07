/**
 * Tropishine — Master SEO Fix for ALL location pages
 * Fixes: og:url, og:title, og:description, twitter tags, WebPage schema @id,
 *        Article schema @id, mainEntityOfPage, broken JSON ("","addressCountry"),
 *        meta descriptions, and lastmod dates.
 *
 * Covers: ~1,200 location + location-service pages
 * Skips:  root index.html, boca-raton/* (already fixed), boca-raton/ hub
 */

const fs   = require('fs');
const path = require('path');

const ROOT     = __dirname;
const BASE_URL = 'https://www.tropishinecleaning.com';
const TODAY    = new Date().toISOString();
const PHONE    = '(954) 530-0508';

// Directories that are NOT location silos — skip them
const SKIP_DIRS = new Set([
    'images', 'hero-vid', '.claude', 'new-tropishine-react',
    'about-us', 'gallery', 'blog',             // root-level core pages
    'boca-raton',                               // hub page we just created
    // boca-raton service pages — already fixed by fix_seo_boca_raton.js
    'house-cleaning-boca-raton', 'recurring-house-cleaning-boca-raton',
    'post-construction-cleaning-boca-raton', 'commercial-cleaning-boca-raton',
    'janitorial-cleaning-boca-raton', 'day-porter-service-boca-raton',
    'airbnb-cleaning-boca-raton', 'short-term-rental-cleaning-boca-raton',
    'deep-cleaning-boca-raton', 'move-in-move-out-cleaning-boca-raton',
    'strip-and-wax-floor-care-boca-raton', 'carpet-cleaning-boca-raton',
    'air-duct-cleaning-boca-raton', 'window-cleaning-boca-raton',
    'restaurant-cleaning-boca-raton', 'garage-cleaning-boca-raton',
    'office-cleaning-boca-raton', 'medical-office-cleaning-boca-raton',
    'kitchen-exhaust-cleaning-boca-raton', 'heavy-duty-deep-cleaning-boca-raton',
    'post-fumigation-cleaning-boca-raton',
]);

// Service slug → human title + short meta description template
const SERVICE_META = {
    'house-cleaning':              { title: 'House Cleaning',              desc: 'Professional house cleaning in {city}, FL. Tropishine\'s vetted maids deliver spotless homes. Licensed, insured & eco-friendly. Call {phone} for a free quote!' },
    'recurring-house-cleaning':    { title: 'Recurring House Cleaning',    desc: 'Recurring house cleaning in {city}, FL. Weekly, bi-weekly & monthly plans. Consistent teams, discounted rates, flexible scheduling. Call Tropishine {phone}.' },
    'post-construction-cleaning':  { title: 'Post-Construction Cleaning',  desc: 'Expert post-construction cleaning in {city}, FL. We remove dust, debris & adhesive residue from new builds and renovations. Licensed & insured. Call {phone}.' },
    'commercial-cleaning':         { title: 'Commercial Cleaning',         desc: 'Professional commercial cleaning in {city}, FL. Offices, retail, restaurants & more. Flexible after-hours scheduling. Licensed & insured. Call {phone} today!' },
    'janitorial-cleaning':         { title: 'Janitorial Cleaning',         desc: 'Reliable janitorial services in {city}, FL. Daily & nightly programs, uniformed staff, restroom sanitization & supply restocking. Call Tropishine {phone}.' },
    'day-porter-service':          { title: 'Day Porter Service',          desc: 'Professional day porter service in {city}, FL. On-site cleaning staff during business hours. Lobby upkeep, spill response & restroom checks. Call {phone}.' },
    'airbnb-cleaning':             { title: 'Airbnb Cleaning',             desc: 'Fast Airbnb cleaning & turnover in {city}, FL. Same-day turnovers, linen staging, damage inspection & 5-star ready presentation. Call Tropishine {phone}!' },
    'short-term-rental-cleaning':  { title: 'Short Term Rental Cleaning',  desc: 'Expert vacation rental & short-term rental cleaning in {city}, FL. VRBO, Airbnb & STR turnovers with 5-star standards. Call {phone} for availability.' },
    'deep-cleaning':               { title: 'Deep Cleaning',               desc: 'Thorough deep cleaning in {city}, FL. Every surface, appliance, grout line & hidden corner scrubbed. Perfect for move-ins, seasonal cleans. Call {phone}!' },
    'move-in-move-out-cleaning':   { title: 'Move In Move Out Cleaning',   desc: 'Move-in & move-out cleaning in {city}, FL. Deposit-protecting deep cleans for tenants, landlords & real estate agents. Call Tropishine {phone} today.' },
    'strip-and-wax-floor-care':    { title: 'Strip & Wax Floor Care',      desc: 'Professional strip & wax floor care in {city}, FL. We strip old wax, deep clean & apply a high-gloss finish to tile, vinyl & VCT floors. Call {phone}.' },
    'carpet-cleaning':             { title: 'Carpet Cleaning',             desc: 'Deep carpet cleaning in {city}, FL. Hot water extraction removes dirt, pet odors & allergens. Quick dry times, safe for kids & pets. Call {phone} today!' },
    'air-duct-cleaning':           { title: 'Air Duct Cleaning',           desc: 'Professional air duct cleaning in {city}, FL. Remove mold, allergens & debris from your HVAC system. Improve indoor air quality. Call Tropishine {phone}.' },
    'window-cleaning':             { title: 'Window Cleaning',             desc: 'Crystal-clear window cleaning in {city}, FL. Interior & exterior, salt spray removal, streak-free guarantee. Residential & commercial. Call {phone} today!' },
    'restaurant-cleaning':         { title: 'Restaurant Cleaning',         desc: 'Restaurant & kitchen cleaning in {city}, FL. Health code compliant deep cleans, after-hours scheduling. Licensed & experienced. Call {phone} today!' },
    'garage-cleaning':             { title: 'Garage Cleaning',             desc: 'Professional garage cleaning in {city}, FL. We sweep, degrease floors, remove cobwebs & haul away junk. Residential & commercial. Call {phone} for a quote.' },
    'office-cleaning':             { title: 'Office Cleaning',             desc: 'Professional office cleaning in {city}, FL. After-hours scheduling, flexible contracts, consistent teams. Trusted by 200+ businesses. Call {phone} today!' },
    'medical-office-cleaning':     { title: 'Medical Office Cleaning',     desc: 'OSHA-compliant medical office cleaning in {city}, FL. Hospital-grade disinfection for exam rooms, labs & waiting areas. Call Tropishine {phone}.' },
    'kitchen-exhaust-cleaning':    { title: 'Kitchen Exhaust Cleaning',    desc: 'NFPA 96-compliant kitchen exhaust & hood cleaning in {city}, FL. Prevents fires, satisfies fire marshal inspections. Call Tropishine {phone} today.' },
    'heavy-duty-deep-cleaning':    { title: 'Heavy Duty Deep Cleaning',    desc: 'Extreme heavy-duty deep cleaning in {city}, FL. Neglected properties, hoarder cleanouts & severely soiled spaces. No job too tough. Call {phone} now!' },
    'post-fumigation-cleaning':    { title: 'Post Fumigation Cleaning',    desc: 'Post-fumigation cleaning in {city}, FL. We remove chemical residue, dead insects & ensure safe re-entry after tent fumigation. Call {phone} today.' },
    'about-us':                    { title: 'About Us',                    desc: 'Learn about Tropishine Cleaning, {city}\'s trusted cleaning company. Licensed, insured & eco-friendly. Serving South Florida since 2024. Call {phone}.' },
    'gallery':                     { title: 'Gallery',                     desc: 'See Tropishine Cleaning\'s work in {city}, FL. Browse before & after photos of residential, commercial & specialty cleaning projects. Call {phone}.' },
    'blog':                        { title: 'Blog',                        desc: 'Cleaning tips, guides & local insights from Tropishine Cleaning — {city}\'s trusted cleaning experts. Licensed & insured. Call {phone} today.' },
};

// Location hub — used when there's no service subdirectory
function locationHubDesc(cityName) {
    return `Top-rated cleaning company in ${cityName}, FL. House cleaning, deep cleaning, Airbnb & commercial cleaning. Licensed, insured & eco-friendly. Call ${PHONE} for a free quote!`;
}

// Build a proper title from page title tag (already correct in generated pages)
function buildMeta(html, pageUrl) {
    // Extract current <title>
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const pageTitle  = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : '';

    // Derive city and service slug from URL path
    // e.g. /deerfield-beach/deep-cleaning/ → city=deerfield-beach, service=deep-cleaning
    // e.g. /deerfield-beach/ → city=deerfield-beach, service=''
    const urlPath = pageUrl.replace(BASE_URL, '').replace(/^\/|\/$/g, ''); // e.g. "deerfield-beach/deep-cleaning"
    const parts   = urlPath.split('/');
    const citySlug    = parts[0] || '';
    const serviceSlug = parts[1] || '';

    // Convert slug to display name (e.g. "deerfield-beach" → "Deerfield Beach")
    const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    let desc = '';
    if (serviceSlug && SERVICE_META[serviceSlug]) {
        desc = SERVICE_META[serviceSlug].desc
            .replace(/{city}/g, cityName)
            .replace(/{phone}/g, PHONE);
    } else {
        // Location hub page
        desc = locationHubDesc(cityName);
    }

    // Build correct og:title from page <title> tag
    // The <title> is correct (e.g. "Deep Cleaning in Deerfield Beach | Tropishine Cleaning")
    // but og:title is wrong — fix it to match
    let ogTitle = pageTitle;
    // If the title has the generic pattern "Cleaning Services in X, Florida & X", use a better one
    if (/Cleaning Services in .+, Florida &/.test(ogTitle) && serviceSlug === '') {
        ogTitle = `Cleaning Services in ${cityName}, FL | Tropishine Cleaning`;
    }

    return { pageTitle: ogTitle, desc, cityName, citySlug, serviceSlug };
}

function fixPage(htmlPath) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Derive the page URL from the canonical tag (it's correct in all generated pages)
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"\s*\/>/);
    if (!canonicalMatch) {
        console.warn(`  SKIP (no canonical): ${htmlPath}`);
        return 0;
    }
    const pageUrl = canonicalMatch[1];

    // Skip the homepage (handled separately) and already-fixed boca-raton service pages
    if (pageUrl === `${BASE_URL}/` || pageUrl === `${BASE_URL}`) return 0;

    const { pageTitle, desc, cityName, serviceSlug } = buildMeta(html, pageUrl);

    // 1. Fix <title> for location hubs (they have redundant "& CityName")
    if (!serviceSlug) {
        const betterTitle = `Cleaning Services in ${cityName}, FL | Tropishine Cleaning`;
        html = html.replace(/<title>[^<]+<\/title>/, `<title>${betterTitle}</title>`);
    }

    // 2. Fix meta description (multiline safe)
    html = html.replace(
        /<meta name="description"[\s\S]*?content="[^"]*"\s*\/>/,
        `<meta name="description" content="${desc}" />`
    );

    // 3. Fix og:title (wrong generic title → page-specific)
    html = html.replace(
        /<meta property="og:title" content="[^"]*"\s*\/>/,
        `<meta property="og:title" content="${pageTitle}" />`
    );

    // 4. Fix og:description (multiline safe)
    html = html.replace(
        /<meta property="og:description"[\s\S]*?content="[^"]*"\s*\/>/,
        `<meta property="og:description" content="${desc}" />`
    );

    // 5. Fix og:url → this page's URL
    html = html.replace(
        /<meta property="og:url" content="[^"]*"\s*\/>/,
        `<meta property="og:url" content="${pageUrl}" />`
    );

    // 6. Fix og:updated_time and article:modified_time
    html = html.replace(
        /<meta property="og:updated_time" content="[^"]*"\s*\/>/,
        `<meta property="og:updated_time" content="${TODAY}" />`
    );
    html = html.replace(
        /<meta property="article:modified_time" content="[^"]*"\s*\/>/,
        `<meta property="article:modified_time" content="${TODAY}" />`
    );

    // 7. Fix twitter:title (wrong generic → page-specific)
    html = html.replace(
        /<meta name="twitter:title" content="[^"]*"\s*\/>/,
        `<meta name="twitter:title" content="${pageTitle}" />`
    );

    // 8. Fix twitter:description (multiline safe)
    html = html.replace(
        /<meta name="twitter:description"[\s\S]*?content="[^"]*"\s*\/>/,
        `<meta name="twitter:description" content="${desc}" />`
    );

    // 9. Fix JSON-LD schema — WebPage @id and url (the biggest SEO problem)
    //    Replace: "https://www.tropishinecleaning.com/#webpage"
    //    With:    "{pageUrl}#webpage"
    html = html.replace(
        /"@id":"https:\/\/www\.tropishinecleaning\.com\/#webpage"/g,
        `"@id":"${pageUrl}#webpage"`
    );
    //    Replace the WebPage url field (pointing to root):
    //    "url":"https://www.tropishinecleaning.com/"
    //    We only want to replace the one inside WebPage, not the org url
    //    Pattern: ","url":"https://www.tropishinecleaning.com/","name":"Cleaning Services
    html = html.replace(
        /("@type":"WebPage"[^}]*?"url":")(https:\/\/www\.tropishinecleaning\.com\/)(")/,
        `$1${pageUrl}$3`
    );

    // 10. Fix Article @id (was "#richSnippet" pointing to root)
    html = html.replace(
        /"@id":"https:\/\/www\.tropishinecleaning\.com\/#richSnippet"/,
        `"@id":"${pageUrl}#richSnippet"`
    );

    // 11. Fix mainEntityOfPage @id (was "#webpage" pointing to root)
    html = html.replace(
        /"mainEntityOfPage":\{"@id":"https:\/\/www\.tropishinecleaning\.com\/#webpage"\}/,
        `"mainEntityOfPage":{"@id":"${pageUrl}#webpage"}`
    );

    // 12. Fix isPartOf for Article (was "#webpage" pointing to root)
    html = html.replace(
        /"isPartOf":\{"@id":"https:\/\/www\.tropishinecleaning\.com\/#webpage"\}/g,
        `"isPartOf":{"@id":"${pageUrl}#webpage"}`
    );

    // 13. Fix broken JSON — empty string key: "FL","","addressCountry"
    //     Should be: "FL","addressCountry"
    html = html.replace(/"FL","","addressCountry"/g, '"FL","addressCountry"');

    // 14. Add WebPage breadcrumb if not already present (location service pages)
    if (!html.includes('"BreadcrumbList"') && cityName && serviceSlug) {
        const serviceName = SERVICE_META[serviceSlug] ? SERVICE_META[serviceSlug].title : serviceSlug;
        const breadcrumb = `,"breadcrumb":{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"${BASE_URL}"},{"@type":"ListItem","position":2,"name":"${cityName}","item":"${BASE_URL}/${cityName.toLowerCase().replace(/ /g, '-')}/"},{"@type":"ListItem","position":3,"name":"${serviceName} in ${cityName}","item":"${pageUrl}"}]}`;
        // Insert before closing of WebPage object
        html = html.replace(
            /("@type":"WebPage"[\s\S]*?)"inLanguage":"en-US"\}/,
            `$1"inLanguage":"en-US"${breadcrumb}}`
        );
    }

    fs.writeFileSync(htmlPath, html, 'utf8');
    return 1;
}

// Walk all top-level directories
let fixed = 0;
let skipped = 0;

const topDirs = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && !SKIP_DIRS.has(d.name) && !d.name.startsWith('.'));

for (const topDir of topDirs) {
    const topPath = path.join(ROOT, topDir.name);

    // Check for location hub page: {location}/index.html
    const hubHtml = path.join(topPath, 'index.html');
    if (fs.existsSync(hubHtml)) {
        const n = fixPage(hubHtml);
        if (n) {
            fixed++;
            process.stdout.write(`\rFixed ${fixed} pages...`);
        } else {
            skipped++;
        }
    }

    // Check for service sub-pages: {location}/{service}/index.html
    const subDirs = fs.readdirSync(topPath, { withFileTypes: true })
        .filter(d => d.isDirectory());

    for (const subDir of subDirs) {
        const serviceHtml = path.join(topPath, subDir.name, 'index.html');
        if (fs.existsSync(serviceHtml)) {
            const n = fixPage(serviceHtml);
            if (n) {
                fixed++;
                if (fixed % 50 === 0) process.stdout.write(`\rFixed ${fixed} pages...`);
            } else {
                skipped++;
            }
        }
    }
}

console.log(`\n\n✅ Done! Fixed ${fixed} pages, skipped ${skipped}.`);
console.log('   Fixed: og:url, og:title, og:description, twitter tags,');
console.log('          WebPage @id, Article @id, mainEntityOfPage,');
console.log('          broken JSON schema, meta descriptions, breadcrumbs.');
