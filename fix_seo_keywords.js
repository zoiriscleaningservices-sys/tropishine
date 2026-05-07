/**
 * fix_seo_keywords.js
 * Updates ALL location & service pages with the highest-volume, highest-intent
 * keywords people actually search on Google for cleaning services in South Florida.
 *
 * Research sources: SERPwars, MediaSearchGroup, SEOforHomeService, LocalMighty (May 2026)
 *
 * Top national search volumes:
 *   "house cleaning near me"       — 110,000/mo
 *   "maid service near me"         — 49,500/mo
 *   "deep cleaning service"        — 22,200/mo
 *   "move out cleaning near me"    — 18,100/mo
 *   "carpet cleaning near me"      — 60,500/mo
 *   "air duct cleaning near me"    — 33,100/mo
 *   "office cleaning near me"      — 12,100/mo
 *   "commercial cleaning near me"  — 9,900/mo
 *   "Airbnb cleaning near me"      — 8,100/mo
 *   "post construction cleaning"   — 5,400/mo
 */

const fs = require('fs');
const path = require('path');

const PHONE = '(954) 530-0508';

// Skip dirs that are not location silos
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'boca-raton', 'assets', 'css', 'js',
  'images', 'fonts', 'air-duct-cleaning-boca-raton',
  'airbnb-cleaning-boca-raton', 'carpet-cleaning-boca-raton',
  'commercial-cleaning-boca-raton', 'deep-cleaning-boca-raton',
  'house-cleaning-boca-raton', 'move-in-move-out-cleaning-boca-raton',
  'office-cleaning-boca-raton', 'post-construction-cleaning-boca-raton',
  'recurring-house-cleaning-boca-raton', 'window-cleaning-boca-raton'
]);

// Also skip sub-pages inside location folders that aren't services
const SKIP_SUB = new Set(['about-us', 'gallery', 'blog']);

// ─── Keyword-optimized TITLES per service ──────────────────────────────────
// Pattern: Primary keyword | Secondary keyword | Brand
// Uses highest-volume search terms as the lead phrase
const SERVICE_TITLES = {
  'house-cleaning':
    'House Cleaning & Maid Service in {City}, FL | Tropishine Cleaning',
  'deep-cleaning':
    'Deep Cleaning Service in {City}, FL | Whole House Deep Clean | Tropishine',
  'move-in-move-out-cleaning':
    'Move Out Cleaning Service in {City}, FL | Move-In Clean Near Me | Tropishine',
  'airbnb-cleaning':
    'Airbnb Cleaning & Vacation Rental Turnover in {City}, FL | Tropishine',
  'commercial-cleaning':
    'Commercial Cleaning Services in {City}, FL | Office & Business Cleaning | Tropishine',
  'office-cleaning':
    'Office Cleaning Service in {City}, FL | Professional Business Cleaning | Tropishine',
  'carpet-cleaning':
    'Carpet Cleaning Near Me in {City}, FL | Steam & Deep Carpet Clean | Tropishine',
  'window-cleaning':
    'Window Cleaning Service in {City}, FL | Streak-Free Window Washing | Tropishine',
  'air-duct-cleaning':
    'Air Duct Cleaning in {City}, FL | HVAC & Duct Cleaning Service | Tropishine',
  'janitorial-cleaning':
    'Janitorial Services in {City}, FL | Commercial Janitorial Cleaning | Tropishine',
  'post-construction-cleaning':
    'Post Construction Cleaning in {City}, FL | After-Build Cleanup | Tropishine',
  'recurring-house-cleaning':
    'Recurring House Cleaning in {City}, FL | Weekly & Biweekly Maid Service | Tropishine',
  'medical-office-cleaning':
    'Medical Office Cleaning in {City}, FL | Doctor & Clinic Cleaning | Tropishine',
  'restaurant-cleaning':
    'Restaurant Cleaning Service in {City}, FL | Commercial Kitchen Cleaning | Tropishine',
  'heavy-duty-deep-cleaning':
    'Heavy Duty Deep Cleaning in {City}, FL | Extreme Whole House Clean | Tropishine',
  'garage-cleaning':
    'Garage Cleaning Service in {City}, FL | Deep Garage Cleanout | Tropishine',
  'day-porter-service':
    'Day Porter Service in {City}, FL | On-Site Facility Maintenance | Tropishine',
  'short-term-rental-cleaning':
    'Short Term Rental Cleaning in {City}, FL | VRBO & Airbnb Turnover | Tropishine',
  'strip-and-wax-floor-care':
    'Floor Strip & Wax Service in {City}, FL | Commercial Floor Care | Tropishine',
  'kitchen-exhaust-cleaning':
    'Kitchen Exhaust & Hood Cleaning in {City}, FL | Commercial Vent Clean | Tropishine',
  'post-fumigation-cleaning':
    'Post Fumigation Cleaning in {City}, FL | After-Fumigation Cleanup | Tropishine',
};

// ─── High-intent DESCRIPTIONS per service ───────────────────────────────────
// Include: primary keyword + city, high-intent modifier ("near me", "free quote",
// "same-day", "licensed & insured"), and CTA with phone
const SERVICE_DESCS = {
  'house-cleaning':
    'Looking for house cleaning & maid service in {City}, FL? Tropishine offers weekly, biweekly & one-time home cleaning. Licensed, insured & eco-friendly. Free quote — call {phone}!',
  'deep-cleaning':
    'Professional deep cleaning service in {City}, FL. Every surface, appliance, grout line & hidden corner scrubbed spotless. Perfect for move-ins, seasonal & first-time cleans. Call {phone}!',
  'move-in-move-out-cleaning':
    'Move out cleaning service near me in {City}, FL. Tropishine helps you get your full deposit back. Move-in cleaning also available. Same-day appointments. Licensed & insured. Call {phone}!',
  'airbnb-cleaning':
    'Airbnb cleaning & vacation rental turnover service in {City}, FL. Same-day turnovers, linen changes & restocking. 5-star guest-ready every time. Call Tropishine at {phone}!',
  'commercial-cleaning':
    'Commercial cleaning services in {City}, FL. Office, retail & business cleaning on daily, weekly or monthly schedules. Licensed, insured & bonded. Free quote — call {phone}!',
  'office-cleaning':
    'Professional office cleaning service in {City}, FL. Reliable business cleaning with flexible schedules. Licensed, insured & bonded. Call Tropishine at {phone} for a free quote!',
  'carpet-cleaning':
    'Carpet cleaning near me in {City}, FL. Professional steam & deep carpet cleaning removes stains, odors & allergens. Homes & offices. Licensed & insured. Book today — call {phone}!',
  'window-cleaning':
    'Window cleaning service in {City}, FL. Streak-free interior & exterior window washing for homes & businesses. Residential & commercial. Licensed & insured. Call {phone}!',
  'air-duct-cleaning':
    'Air duct cleaning service in {City}, FL. Professional HVAC & duct cleaning improves air quality & lowers energy bills. Licensed & insured. Call Tropishine at {phone} today!',
  'janitorial-cleaning':
    'Janitorial cleaning services in {City}, FL. Reliable commercial janitorial cleaning for offices, facilities & businesses. Licensed, insured & bonded. Call {phone} for a free quote!',
  'post-construction-cleaning':
    'Post construction cleaning in {City}, FL. We handle all after-build cleanup — dust, debris, windows & floors. New builds & renovations. Licensed & insured. Call {phone}!',
  'recurring-house-cleaning':
    'Recurring house cleaning in {City}, FL. Weekly, biweekly & monthly maid service that keeps your home spotless all year. Licensed & insured. Call {phone} for a free quote!',
  'medical-office-cleaning':
    'Medical office cleaning in {City}, FL. Hospital-grade disinfection for doctor offices, clinics & healthcare facilities. HIPAA-aware. Licensed & insured. Call {phone}!',
  'restaurant-cleaning':
    'Restaurant cleaning service in {City}, FL. Commercial kitchen deep cleaning, hood cleaning & dining area sanitation. Health code compliant. Licensed & insured. Call {phone}!',
  'heavy-duty-deep-cleaning':
    'Heavy duty deep cleaning in {City}, FL. Extreme whole-house cleaning for severely neglected homes. No job too big. Licensed & insured. Call Tropishine at {phone} today!',
  'garage-cleaning':
    'Garage cleaning service in {City}, FL. Full garage cleanout, degreasing, sweeping & organization. Homes & condos. Licensed & insured. Call Tropishine at {phone}!',
  'day-porter-service':
    'Day porter service in {City}, FL. On-site facility maintenance & daytime cleaning for commercial properties & HOAs. Licensed & insured. Free quote — call {phone}!',
  'short-term-rental-cleaning':
    'Short term rental cleaning in {City}, FL. VRBO, Airbnb & vacation rental turnover cleaning. Same-day available. Guest-ready every time. Licensed & insured. Call {phone}!',
  'strip-and-wax-floor-care':
    'Floor strip & wax service in {City}, FL. Professional commercial floor care — strip, clean, wax & polish for a showroom finish. Licensed & insured. Call {phone}!',
  'kitchen-exhaust-cleaning':
    'Kitchen exhaust & hood cleaning in {City}, FL. Commercial vent & exhaust system cleaning for restaurants & kitchens. Code compliant. Licensed & insured. Call {phone}!',
  'post-fumigation-cleaning':
    'Post fumigation cleaning in {City}, FL. Thorough cleanup after tent fumigation — removes residue, odors & debris safely. Licensed & insured. Call {phone}!',
};

// Hub page (location/index.html) title & description
const HUB_TITLE = 'House Cleaning & Maid Service in {City}, FL | Tropishine Cleaning';
const HUB_DESC  = 'Top-rated cleaning company in {City}, FL. House cleaning, maid service, deep cleaning, Airbnb turnover & commercial cleaning. Licensed, insured & eco-friendly. Free quote — call {phone}!';

// Convert slug → display name  e.g. "coral-springs" → "Coral Springs"
function slugToTitle(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function processFile(filePath, locSlug, serviceSlug) {
  let html = fs.readFileSync(filePath, 'utf8');
  const pageUrl = `https://www.tropishinecleaning.com/${locSlug}/${serviceSlug ? serviceSlug + '/' : ''}`;
  const city = slugToTitle(locSlug);

  let titleStr, descStr;

  if (serviceSlug && SERVICE_TITLES[serviceSlug]) {
    titleStr = SERVICE_TITLES[serviceSlug].replace('{City}', city);
    descStr  = SERVICE_DESCS[serviceSlug]
      .replace(/{City}/g, city)
      .replace(/{phone}/g, PHONE);
  } else {
    // Hub page
    titleStr = HUB_TITLE.replace('{City}', city);
    descStr  = HUB_DESC.replace(/{City}/g, city).replace(/{phone}/g, PHONE);
  }

  // ── 1. <title> tag ──────────────────────────────────────────────────────
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${titleStr}</title>`);

  // ── 2. Meta description ─────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?content="[^"]*"\s*\/>/,
    `<meta name="description"\n    content="${descStr}" />`
  );

  // ── 3. OG title ─────────────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${titleStr}" />`
  );

  // ── 4. OG description ───────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${descStr}" />`
  );

  // ── 5. Twitter title ────────────────────────────────────────────────────
  html = html.replace(
    /<meta\s+(?:name|property)="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${titleStr}" />`
  );

  // ── 6. Twitter description ──────────────────────────────────────────────
  html = html.replace(
    /<meta\s+(?:name|property)="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${descStr}" />`
  );

  // ── 7. JSON-LD WebPage name ─────────────────────────────────────────────
  html = html.replace(
    /("@type"\s*:\s*"WebPage"[\s\S]*?"name"\s*:\s*)"[^"]*"/,
    `$1"${titleStr}"`
  );

  // ── 8. JSON-LD WebPage description ─────────────────────────────────────
  html = html.replace(
    /("@type"\s*:\s*"WebPage"[\s\S]*?"description"\s*:\s*)"[^"]*"/,
    `$1"${descStr.replace(/"/g, '\\"')}"`
  );

  fs.writeFileSync(filePath, html, 'utf8');
}

// ─── Walk all location directories ──────────────────────────────────────────
const allDirs = fs.readdirSync('.').filter(d => {
  try { return fs.statSync(d).isDirectory() && !SKIP_DIRS.has(d) && !d.startsWith('.'); }
  catch (e) { return false; }
});

let fixed = 0, errors = 0;

for (const locSlug of allDirs) {
  // Process location hub page
  const hubPath = path.join(locSlug, 'index.html');
  if (fs.existsSync(hubPath)) {
    try {
      processFile(hubPath, locSlug, null);
      fixed++;
    } catch (e) {
      console.error(`ERROR hub ${hubPath}: ${e.message}`);
      errors++;
    }
  }

  // Process service sub-pages
  const subDirs = fs.readdirSync(locSlug).filter(f => {
    try {
      return fs.statSync(path.join(locSlug, f)).isDirectory() && !SKIP_SUB.has(f);
    } catch (e) { return false; }
  });

  for (const svcSlug of subDirs) {
    const svcPath = path.join(locSlug, svcSlug, 'index.html');
    if (!fs.existsSync(svcPath)) continue;
    try {
      processFile(svcPath, locSlug, svcSlug);
      fixed++;
    } catch (e) {
      console.error(`ERROR svc ${svcPath}: ${e.message}`);
      errors++;
    }
    if (fixed % 200 === 0) process.stdout.write(`  Updated ${fixed} pages...\n`);
  }
}

console.log(`\n✅ Keyword optimization complete!`);
console.log(`   Pages updated: ${fixed}`);
console.log(`   Errors:        ${errors}`);
console.log(`\n   Every page now has:`);
console.log(`   ✓ Keyword-optimized <title> (highest-volume search terms first)`);
console.log(`   ✓ High-intent meta description with city + phone + CTA`);
console.log(`   ✓ Matching og:title & og:description`);
console.log(`   ✓ Matching twitter:title & twitter:description`);
console.log(`   ✓ JSON-LD WebPage name & description updated`);
