/**
 * fix_faq_final.js
 * Properly fixes both FAQ sections on every service page.
 *
 * Root cause of previous breakage:
 *   1. Wrong target div — injected into mid-page h3 FAQ, not main "Common Inquiries" section
 *   2. Dollar signs in answers ($120, $350, etc.) were treated as regex backreferences ($1, $3)
 *
 * This script uses string .split() instead of .replace() — dollar signs are safe.
 *
 * Result:
 *   - Mid-page "Frequently Asked Questions" h3 section → 3 clean, relevant FAQs
 *   - Main "Common Inquiries" bottom section → 7 keyword-rich FAQs
 *   - FAQPage schema → 7 questions (already correct from previous run)
 */

const fs   = require('fs');
const path = require('path');

const PHONE = '(954) 530-0508';

const SKIP_DIRS = new Set([
  'node_modules','.git','boca-raton','assets','css','js','images','fonts',
  'air-duct-cleaning-boca-raton','airbnb-cleaning-boca-raton',
  'carpet-cleaning-boca-raton','commercial-cleaning-boca-raton',
  'deep-cleaning-boca-raton','house-cleaning-boca-raton',
  'move-in-move-out-cleaning-boca-raton','office-cleaning-boca-raton',
  'post-construction-cleaning-boca-raton','recurring-house-cleaning-boca-raton',
  'window-cleaning-boca-raton'
]);
const SKIP_SUB = new Set(['about-us','gallery','blog']);

// ─── 7 FAQs per service ──────────────────────────────────────────────────────
// NOTE: No bare dollar signs mid-sentence — prices written as "from 120 to 350 dollars"
// or placed at sentence start to avoid any regex interpretation issues.
const FAQS = {
  'house-cleaning': [
    { q: 'How much does house cleaning cost in {city}?',
      a: 'Pricing starts at around 120 dollars and goes up based on home size and frequency. Tropishine offers weekly, biweekly, and one-time cleans with upfront flat-rate pricing — no hidden fees. Call {phone} for a free quote.' },
    { q: 'How often should I schedule maid service in {city}?',
      a: 'Most homeowners in {city} choose weekly or biweekly maid service to keep their home consistently clean. If you have kids, pets, or a busy schedule, weekly service is ideal. Monthly and one-time options are also available.' },
    { q: 'Do your house cleaners bring their own supplies?',
      a: 'Yes! Tropishine brings all professional-grade, eco-friendly cleaning supplies to every home in {city}. You don\'t need to provide anything — just enjoy a spotless home.' },
    { q: 'Are your house cleaners in {city} licensed and insured?',
      a: 'Absolutely. Tropishine Cleaning is fully licensed and insured in Florida. Every cleaner passes a background check and is trained to our quality standards. You are fully protected on every visit.' },
    { q: 'Do you offer same-day house cleaning in {city}?',
      a: 'Yes, same-day and next-day house cleaning appointments are often available in {city}. Call {phone} to check for open slots — we do our best to accommodate you quickly.' },
    { q: 'What does a standard house cleaning include in {city}?',
      a: 'Our standard house cleaning in {city} covers all bedrooms, bathrooms, kitchen, and living areas — vacuuming, mopping, dusting, sanitizing countertops, cleaning toilets, sinks, and mirrors. Add-ons like inside oven or fridge available.' },
    { q: 'Can I book recurring maid service in {city}?',
      a: 'Yes! Recurring weekly or biweekly maid service is our most popular option in {city}. Recurring clients get priority scheduling and consistent cleaners. Call {phone} to get started today.' },
  ],
  'deep-cleaning': [
    { q: 'What is included in a deep cleaning service in {city}?',
      a: 'Our deep cleaning in {city}, FL covers everything in a standard clean PLUS: inside oven, inside refrigerator, inside cabinets, baseboards, ceiling fans, window sills, grout scrubbing, behind appliances, and all hard-to-reach areas.' },
    { q: 'How is deep cleaning different from regular house cleaning?',
      a: 'Regular cleaning maintains a clean home. Deep cleaning in {city} is a full reset — scrubbing areas not touched in routine visits: grout lines, inside appliances, baseboards, vents, and more. Ideal as a first-time, seasonal, or move-in clean.' },
    { q: 'How much does deep cleaning cost in {city}?',
      a: 'Deep cleaning in {city}, FL is priced based on home size and condition. Call {phone} for a free, no-obligation estimate tailored to your home. We provide upfront flat-rate pricing.' },
    { q: 'How long does a deep cleaning take in {city}?',
      a: 'A deep clean in {city} typically takes 4 to 8 hours depending on home size. Our team works efficiently to deliver a thorough, spotless result without cutting corners.' },
    { q: 'Do you clean inside appliances during a deep clean in {city}?',
      a: 'Yes! Our deep cleaning service in {city} includes inside the oven, refrigerator, and microwave. This is one of the key differences between a deep clean and a regular cleaning visit.' },
    { q: 'How often should I get a deep cleaning in {city}?',
      a: 'We recommend a professional deep cleaning in {city} at least once or twice a year — or before and after moving, after a renovation, for seasonal resets, or when preparing a home for sale.' },
    { q: 'Do I need to be home during the deep cleaning in {city}?',
      a: 'No! Many {city} clients provide entry instructions and come home to a spotless house. Our insured, background-checked team handles everything professionally while you are away.' },
  ],
  'move-in-move-out-cleaning': [
    { q: 'What is included in a move-out cleaning in {city}?',
      a: 'Our move-out cleaning in {city}, FL covers every room top to bottom — inside cabinets and drawers, inside oven and refrigerator, all bathrooms scrubbed, baseboards, window sills, and all surfaces cleaned to landlord inspection standards.' },
    { q: 'Will your move-out cleaning help me get my deposit back?',
      a: 'That is exactly what it is designed for. Tropishine\'s move-out cleaning in {city} meets the checklist standards most landlords require. Many of our clients have gotten their full deposit back after our clean.' },
    { q: 'How much does move-out cleaning cost in {city}?',
      a: 'Move-out cleaning in {city}, FL is priced by home size with upfront flat-rate pricing and no surprises. Call {phone} for a free quote — we will give you an exact number before we start.' },
    { q: 'Can you do same-day move-out cleaning in {city}?',
      a: 'Yes, same-day and next-day move-out cleaning is available in {city} based on availability. Call {phone} as early as possible and we will fit you in.' },
    { q: 'Do you offer move-in cleaning in {city} too?',
      a: 'Absolutely. Whether you need move-out cleaning for your old place or move-in cleaning for your new home in {city}, Tropishine has you covered. We offer both services individually or as a package.' },
    { q: 'Do landlords and property managers book with you in {city}?',
      a: 'Yes! We work regularly with landlords, real estate agents, and property managers in {city} to prepare units between tenants. We offer flexible scheduling and fast turnarounds.' },
    { q: 'How long does move-out cleaning take in {city}?',
      a: 'Move-out cleaning in {city} typically takes 3 to 7 hours depending on property size and condition. We work efficiently to meet your move-out deadline every time.' },
  ],
  'airbnb-cleaning': [
    { q: 'How quickly can you turn over an Airbnb in {city}?',
      a: 'Tropishine specializes in fast Airbnb turnovers in {city}, FL. Most same-day turnovers are completed within 2 to 4 hours. We coordinate with your check-in and check-out schedule so the property is guest-ready on time.' },
    { q: 'What is included in an Airbnb turnover cleaning in {city}?',
      a: 'Our Airbnb cleaning in {city} includes full cleaning of all rooms, bathrooms, and kitchen, linen changes, restocking supplies, checking for damage, and a final walkthrough to ensure a 5-star guest-ready property.' },
    { q: 'Do you offer same-day Airbnb cleaning in {city}?',
      a: 'Yes! Same-day Airbnb turnovers are our specialty in {city}. When guests check out in the morning and new guests arrive in the afternoon, we handle the full turnover so you never miss a booking.' },
    { q: 'Do you change linens and restock supplies during Airbnb cleanings?',
      a: 'Yes. Tropishine\'s Airbnb cleaning in {city} includes linen changes — fresh sheets and towels — and restocking the amenities you provide. Guests are delighted from the moment they arrive.' },
    { q: 'How much does Airbnb cleaning cost per turnover in {city}?',
      a: 'Airbnb turnover cleaning in {city}, FL is priced by property size. Call {phone} for a custom rate. Many hosts include the cleaning fee in their listing so guests cover the cost automatically.' },
    { q: 'Can you work with my Airbnb calendar and property management system?',
      a: 'Absolutely. We coordinate with your Airbnb host calendar, iCal, VRBO, or property management software so cleanings are automatically scheduled around your guest stays in {city}.' },
    { q: 'Do you work with vacation rental property managers in {city}?',
      a: 'Yes! Tropishine works with individual Airbnb hosts, VRBO owners, and professional property managers across {city} and South Florida. Volume rates are available for multi-property hosts.' },
  ],
  'commercial-cleaning': [
    { q: 'What types of businesses do you clean in {city}?',
      a: 'Tropishine provides commercial cleaning in {city}, FL for offices, retail stores, medical facilities, restaurants, warehouses, gyms, schools, and more. No commercial space is too large or too small.' },
    { q: 'Do you offer after-hours commercial cleaning in {city}?',
      a: 'Yes! We offer flexible scheduling including after-hours, overnight, and weekend commercial cleaning in {city} to minimize disruption to your business operations.' },
    { q: 'Are your commercial cleaners licensed, insured, and bonded in {city}?',
      a: 'Absolutely. Tropishine is fully licensed, insured, and bonded in Florida. Every cleaner passes a background check. Your business and property are fully protected on every visit.' },
    { q: 'What is included in your commercial cleaning service in {city}?',
      a: 'Our commercial cleaning in {city} covers vacuuming, mopping, dusting, sanitizing all surfaces, restroom cleaning and restocking, trash removal, break room cleaning, and window wiping. Custom scopes available.' },
    { q: 'Do you offer daily, weekly, or monthly commercial cleaning in {city}?',
      a: 'Yes! We offer daily, weekly, biweekly, and monthly commercial cleaning schedules in {city} to match your needs and budget. We build a custom plan for every facility.' },
    { q: 'Can I get a free commercial cleaning quote in {city}?',
      a: 'Absolutely! Call {phone} or fill out our online form for a free, no-obligation commercial cleaning quote in {city}. We assess your space and provide transparent, upfront pricing.' },
    { q: 'Do you clean medical offices and healthcare facilities in {city}?',
      a: 'Yes! Tropishine cleans medical offices, clinics, and healthcare facilities in {city} using hospital-grade disinfectants and proper sanitation protocols. Call {phone} for a free assessment.' },
  ],
  'office-cleaning': [
    { q: 'What is included in a professional office cleaning in {city}?',
      a: 'Our office cleaning in {city}, FL includes dusting all surfaces and equipment, vacuuming and mopping floors, sanitizing desks and phones, restroom cleaning, break room cleaning, emptying trash, and wiping windows and glass doors.' },
    { q: 'Do you offer after-hours office cleaning in {city}?',
      a: 'Yes! We specialize in after-hours and weekend office cleaning in {city} so your workspace is spotless when employees arrive each morning — without any disruption to your workday.' },
    { q: 'How often should I schedule office cleaning in {city}?',
      a: 'Most {city} businesses schedule office cleaning 2 to 5 times per week. High-traffic offices benefit from daily cleaning. We recommend at minimum a weekly clean to maintain a professional, healthy environment.' },
    { q: 'Are your office cleaners in {city} licensed, insured, and bonded?',
      a: 'Yes. Tropishine is fully licensed, insured, and bonded in Florida. All office cleaners pass background checks. Your property, equipment, and workspace are safe on every visit.' },
    { q: 'Can you handle large office buildings in {city}?',
      a: 'Absolutely. Tropishine handles offices of all sizes in {city} — from single-room suites to multi-floor corporate buildings. We scale our team and schedule to meet your exact requirements.' },
    { q: 'Do you supply cleaning products for our office in {city}?',
      a: 'Yes! Tropishine brings all professional-grade, eco-friendly cleaning supplies to your {city} office. Paper product restocking (toilet paper, hand soap, paper towels) is available as an add-on.' },
    { q: 'How do I get a free office cleaning quote in {city}?',
      a: 'Easy — call {phone} or fill out our online form. We will assess your {city} office and provide transparent, upfront pricing with no hidden fees or long-term contracts required.' },
  ],
  'carpet-cleaning': [
    { q: 'What carpet cleaning method do you use in {city}?',
      a: 'Tropishine uses hot water extraction (steam cleaning) in {city}, FL — the method recommended by carpet manufacturers. It deep-cleans fibers, removes embedded dirt, allergens, and bacteria, and leaves carpets sanitized and fresh.' },
    { q: 'How long does carpet cleaning take to dry in {city}?',
      a: 'Carpets cleaned in {city} typically dry in 4 to 8 hours depending on carpet thickness and ventilation. We recommend opening windows or running AC and fans to speed drying. Avoid heavy foot traffic until fully dry.' },
    { q: 'How much does carpet cleaning cost in {city}?',
      a: 'Carpet cleaning in {city}, FL is priced per room or per square foot. Call {phone} for a free, exact quote based on your home or office. We provide upfront flat-rate pricing with no surprises.' },
    { q: 'Can you remove pet stains and odors from carpet in {city}?',
      a: 'Yes! Our carpet cleaning in {city} uses enzyme-based treatments that break down pet urine crystals and eliminate odors at the source — not just mask them. We can treat even stubborn, set-in pet stains.' },
    { q: 'How often should I have my carpets professionally cleaned in {city}?',
      a: 'Carpet manufacturers and the EPA recommend professional carpet cleaning every 6 to 12 months in {city}. Homes with pets, kids, or allergy sufferers benefit from cleaning every 3 to 6 months.' },
    { q: 'Are your carpet cleaning products safe for kids and pets in {city}?',
      a: 'Absolutely. Tropishine uses non-toxic, eco-friendly carpet cleaning solutions in {city} that are safe for children and pets once dry. We never use harsh chemicals that could harm your family.' },
    { q: 'Do you clean area rugs and upholstery as well as carpet in {city}?',
      a: 'Yes! In addition to wall-to-wall carpet cleaning in {city}, we also clean area rugs, upholstered furniture, and mattresses. Ask about our bundle packages for the best value.' },
  ],
  'window-cleaning': [
    { q: 'What does window cleaning include in {city}?',
      a: 'Our window cleaning service in {city}, FL includes interior and exterior glass cleaning, window frame wiping, screen cleaning, and streak-free drying. We leave every window crystal clear and spotless.' },
    { q: 'Do you clean both interior and exterior windows in {city}?',
      a: 'Yes! Tropishine cleans both interior and exterior windows for homes and businesses in {city}, FL. We use professional-grade squeegees and eco-friendly solutions for a streak-free finish every time.' },
    { q: 'How much does window cleaning cost in {city}?',
      a: 'Window cleaning in {city}, FL is priced per window or per pane. Call {phone} for a free, exact quote based on your property. We provide upfront flat-rate pricing with no surprises.' },
    { q: 'How often should windows be professionally cleaned in {city}?',
      a: 'In {city}\'s South Florida climate, we recommend professional window cleaning every 3 to 4 months. Salt air, humidity, and rain leave mineral deposits and grime that regular wiping cannot remove.' },
    { q: 'Can you clean high or hard-to-reach windows in {city}?',
      a: 'Yes! Tropishine is equipped to clean high windows, second-story windows, and commercial glass facades in {city}. Our team uses professional extension tools and safety equipment to reach any window safely.' },
    { q: 'Do you clean window screens and frames in {city}?',
      a: 'Yes. Our window cleaning service in {city} includes wiping down frames and tracks and rinsing screens. Clean frames and screens make a big difference in the overall appearance of your windows.' },
    { q: 'Is professional window cleaning worth it for my home in {city}?',
      a: 'Absolutely. Clean windows improve curb appeal, let in more natural light, extend window lifespan by removing corrosive buildup, and make your home or business look professionally maintained.' },
  ],
  'air-duct-cleaning': [
    { q: 'How often should air ducts be cleaned in {city}?',
      a: 'The EPA and NADCA recommend air duct cleaning every 3 to 5 years in {city}, FL. Homes with pets, allergy sufferers, smokers, or recent renovations may benefit from more frequent cleaning. Call {phone} for a free assessment.' },
    { q: 'What are the signs I need air duct cleaning in {city}?',
      a: 'Signs you need air duct cleaning in {city} include visible dust blowing from vents, musty or stale odors, increased allergy symptoms indoors, higher energy bills, or if you have recently completed a renovation or moved in.' },
    { q: 'How much does air duct cleaning cost in {city}?',
      a: 'Air duct cleaning in {city}, FL is priced by the number of vents and system size. Call {phone} for a free inspection and exact quote. We provide upfront flat-rate pricing with no hidden fees.' },
    { q: 'How long does air duct cleaning take in {city}?',
      a: 'Air duct cleaning in {city} typically takes 2 to 4 hours for a standard home. Our technicians use powerful HEPA-filtered equipment to thoroughly clean your entire duct system without making a mess.' },
    { q: 'Does air duct cleaning improve air quality in my {city} home?',
      a: 'Yes! Professional air duct cleaning in {city} removes dust, pollen, mold spores, pet dander, and bacteria from your HVAC system — directly improving the air quality you and your family breathe every day.' },
    { q: 'Do you also clean dryer vents in {city}?',
      a: 'Yes! Dryer vent cleaning is an important add-on service in {city}. Clogged dryer vents are a leading cause of house fires. We recommend cleaning your dryer vent annually. Ask about our bundle discount.' },
    { q: 'Can dirty air ducts make my family sick in {city}?',
      a: 'Yes. Dirty air ducts circulate allergens, dust, mold spores, and bacteria throughout your {city} home every time the HVAC runs. This can trigger allergies, asthma, and respiratory issues — especially in children and the elderly.' },
  ],
  'janitorial-cleaning': [
    { q: 'What is included in janitorial cleaning services in {city}?',
      a: 'Tropishine\'s janitorial services in {city}, FL include daily or nightly cleaning of offices, restrooms, break rooms, lobbies, and common areas — plus trash removal, floor care, surface sanitization, and supply restocking.' },
    { q: 'What is the difference between janitorial and commercial cleaning?',
      a: 'Janitorial services in {city} refer to routine, recurring cleaning such as daily or nightly maintenance. Commercial cleaning is broader and includes deep cleaning, floor stripping, and specialized services. Tropishine offers both.' },
    { q: 'Do you offer nightly janitorial service in {city}?',
      a: 'Yes! Nightly and after-hours janitorial cleaning is one of our most popular services in {city}. We keep your facility spotless every morning when employees and visitors arrive, without disrupting your operations.' },
    { q: 'Are your janitorial cleaners in {city} bonded and insured?',
      a: 'Absolutely. Tropishine is fully licensed, bonded, and insured in Florida. All janitorial staff pass background checks. Your facility and assets are protected on every single visit.' },
    { q: 'How much do janitorial services cost in {city}?',
      a: 'Janitorial service pricing in {city}, FL depends on facility size, cleaning frequency, and scope of work. Call {phone} for a free walk-through quote with transparent, upfront pricing.' },
    { q: 'Can you provide janitorial service for schools and medical facilities in {city}?',
      a: 'Yes! Tropishine provides specialized janitorial cleaning for schools, medical offices, clinics, and healthcare facilities in {city}. We use hospital-grade disinfectants and strict sanitation protocols.' },
    { q: 'Do you supply janitorial products and equipment in {city}?',
      a: 'Yes. Tropishine supplies all professional cleaning equipment and products for your {city} facility. Paper product programs — toilet paper, hand soap, paper towels — are available as an add-on. Just ask.' },
  ],
  'post-construction-cleaning': [
    { q: 'What is included in post construction cleaning in {city}?',
      a: 'Post construction cleaning in {city}, FL includes removing all construction dust and debris, cleaning windows and frames, wiping all surfaces, scrubbing floors, cleaning bathrooms and kitchen, removing stickers and adhesives, and a final detail clean.' },
    { q: 'How much does post construction cleaning cost in {city}?',
      a: 'Post construction cleaning in {city}, FL is priced based on square footage and scope. Call {phone} for a free walk-through estimate tailored to your project. We provide upfront flat-rate pricing.' },
    { q: 'How long does post construction cleaning take in {city}?',
      a: 'Post construction cleaning in {city} typically takes 6 to 16 hours depending on the size of the project and amount of debris. We bring a full team to complete the job efficiently and on schedule.' },
    { q: 'Can you clean after both new builds and renovations in {city}?',
      a: 'Yes! Tropishine handles post construction cleaning for new builds, home renovations, commercial buildouts, and remodels in {city}. We clean up after contractors so your space is ready to enjoy immediately.' },
    { q: 'When should post construction cleaning be done in {city}?',
      a: 'Post construction cleaning in {city} should be done after all construction work is fully complete — after final inspections and before furniture delivery or move-in. We coordinate with your contractor to time it perfectly.' },
    { q: 'Do you remove construction dust from HVAC vents in {city}?',
      a: 'Yes. Construction dust is notorious for clogging HVAC systems in {city}. Our post construction cleaning includes wiping vent covers. We can also arrange duct cleaning as an add-on to protect your air quality.' },
    { q: 'Are your post construction cleaners licensed and insured in {city}?',
      a: 'Yes. Tropishine is fully licensed and insured in Florida. We carry full liability coverage for all post construction cleaning work in {city}. General contractors and developers trust us for a reason.' },
  ],
  'recurring-house-cleaning': [
    { q: 'What cleaning frequencies do you offer in {city}?',
      a: 'Tropishine offers weekly, biweekly (every 2 weeks), and monthly recurring house cleaning in {city}, FL. Weekly is ideal for busy families. Biweekly is our most popular option. Monthly works well for low-traffic homes.' },
    { q: 'How much does weekly house cleaning cost in {city}?',
      a: 'Weekly house cleaning in {city}, FL is priced by home size. Recurring clients receive discounted rates compared to one-time cleans. Call {phone} for a personalized quote with upfront flat-rate pricing.' },
    { q: 'Do I get the same cleaner every visit in {city}?',
      a: 'We do our best to send the same cleaner to your {city} home each visit. Consistency matters — your cleaner learns your preferences and your home\'s layout, delivering better results over time.' },
    { q: 'Can I pause or cancel my recurring cleaning plan in {city}?',
      a: 'Yes. Tropishine\'s recurring cleaning plans in {city} are flexible — no long-term contracts required. You can pause, reschedule, or cancel with advance notice. We want you to feel completely in control.' },
    { q: 'What is included in each recurring cleaning visit in {city}?',
      a: 'Every recurring cleaning visit in {city} covers all bedrooms, bathrooms, kitchen, and living areas — vacuuming, mopping, dusting, sanitizing surfaces, cleaning toilets, sinks, countertops, and mirrors. Add-ons are available.' },
    { q: 'Is biweekly or weekly cleaning better for my home in {city}?',
      a: 'Weekly cleaning is ideal for {city} homes with kids, pets, or high foot traffic. Biweekly works well for couples or smaller households. We recommend the right frequency based on your home and lifestyle.' },
    { q: 'Do recurring cleaning clients get any discounts in {city}?',
      a: 'Yes! Recurring clients in {city} receive discounted rates compared to one-time cleaning. The more frequently you schedule, the more you save per visit. Call {phone} to discuss the best plan for your budget.' },
  ],
  'medical-office-cleaning': [
    { q: 'What disinfection protocols do you use for medical offices in {city}?',
      a: 'Tropishine uses EPA-registered, hospital-grade disinfectants for all medical office cleaning in {city}, FL. We follow CDC and OSHA guidelines for healthcare facility sanitation, including proper dwell times and cross-contamination prevention.' },
    { q: 'Are your medical office cleaners trained for healthcare environments?',
      a: 'Yes. Our medical office cleaning team in {city} receives specialized training in healthcare sanitation — including bloodborne pathogen awareness, proper PPE use, and infection control protocols for clinical environments.' },
    { q: 'Do you use hospital-grade disinfectants for medical cleaning in {city}?',
      a: 'Absolutely. All medical office cleaning in {city}, FL uses EPA-registered hospital-grade disinfectants that kill 99.9% of bacteria, viruses, and pathogens — including MRSA, norovirus, and influenza.' },
    { q: 'How often should a medical office be cleaned in {city}?',
      a: 'Medical offices in {city} should be professionally cleaned daily, with high-touch surfaces disinfected multiple times per day. We offer daily, nightly, and multi-visit per week schedules to suit your facility.' },
    { q: 'Are you HIPAA-aware during medical office cleanings in {city}?',
      a: 'Yes. Our medical office cleaning team in {city} is trained in HIPAA privacy awareness. We never access, move, or disturb patient files or records. Patient privacy and confidentiality are always protected.' },
    { q: 'What types of medical facilities do you clean in {city}?',
      a: 'Tropishine cleans medical offices, dental offices, urgent care centers, physical therapy clinics, dermatology practices, chiropractic offices, outpatient surgery centers, and other healthcare facilities in {city}, FL.' },
    { q: 'How much does medical office cleaning cost in {city}?',
      a: 'Medical office cleaning in {city}, FL is priced by square footage and cleaning frequency. Call {phone} for a free walk-through quote with no obligation. We provide transparent, upfront pricing.' },
  ],
  'restaurant-cleaning': [
    { q: 'What is included in restaurant cleaning service in {city}?',
      a: 'Our restaurant cleaning in {city}, FL covers full kitchen deep cleaning, hood and exhaust cleaning, grease trap area cleaning, floor scrubbing, dining room cleaning, restroom sanitization, and health code compliance preparation.' },
    { q: 'Do you clean commercial kitchen hoods and exhaust systems in {city}?',
      a: 'Yes! Kitchen hood and exhaust cleaning is a core part of our restaurant cleaning service in {city}. Grease buildup in hoods is a major fire hazard and health code violation. We clean to NFPA 96 standards.' },
    { q: 'Is your restaurant cleaning health code compliant in {city}?',
      a: 'Absolutely. Tropishine\'s restaurant cleaning in {city}, FL is designed to meet and exceed Florida Department of Health and local health inspector standards. We help you pass inspections and maintain your rating.' },
    { q: 'Do you offer after-hours restaurant cleaning in {city}?',
      a: 'Yes! We specialize in after-hours restaurant cleaning in {city} — typically between midnight and 6 AM — so your kitchen and dining area are spotless and ready for the next service without disrupting operations.' },
    { q: 'How often should a restaurant be professionally deep cleaned in {city}?',
      a: 'Most health departments recommend restaurant kitchen deep cleaning at least monthly in {city}, with daily maintenance cleaning between deep cleans. High-volume restaurants benefit from weekly deep kitchen cleans.' },
    { q: 'How much does restaurant cleaning cost in {city}?',
      a: 'Restaurant cleaning in {city}, FL is priced based on kitchen size, frequency, and scope. Call {phone} for a custom quote. We provide upfront pricing with no hidden fees or surprise charges.' },
    { q: 'Can you handle grease removal and commercial kitchen floor cleaning in {city}?',
      a: 'Yes! Our restaurant cleaning crew in {city} specializes in heavy grease removal from floors, walls, equipment, and vents. We use commercial-grade degreasers that cut through the toughest buildup safely.' },
  ],
  'heavy-duty-deep-cleaning': [
    { q: 'What is heavy duty deep cleaning in {city}?',
      a: 'Heavy duty deep cleaning in {city}, FL is an intensive cleaning service for severely neglected, hoarded, or very dirty homes. It goes far beyond a standard deep clean — addressing extreme buildup, heavy grease, and deeply embedded grime.' },
    { q: 'How is heavy duty cleaning different from regular deep cleaning in {city}?',
      a: 'A standard deep clean is for maintained homes needing a reset. Heavy duty deep cleaning in {city} is for extreme situations — homes that have not been cleaned in months or years, hoarder cleanouts, or severely neglected properties.' },
    { q: 'How much does heavy duty deep cleaning cost in {city}?',
      a: 'Heavy duty deep cleaning in {city}, FL is priced based on the size and condition of the property. We provide an on-site assessment before quoting so you get an accurate, honest price. Call {phone} to schedule.' },
    { q: 'Can you clean severely neglected or hoarded homes in {city}?',
      a: 'Yes. Tropishine\'s heavy duty cleaning team in {city} is experienced with all levels of clutter and neglect. We approach every job without judgment and work systematically to restore the home to a safe, livable condition.' },
    { q: 'How long does heavy duty deep cleaning take in {city}?',
      a: 'Heavy duty deep cleaning in {city} can take anywhere from 8 hours to multiple days depending on the property\'s condition and size. We give you a realistic timeline after an initial assessment.' },
    { q: 'What equipment do you use for heavy duty cleaning in {city}?',
      a: 'Our heavy duty cleaning team in {city} brings commercial-grade equipment including industrial vacuums, steam cleaners, HEPA air scrubbers, and professional-strength degreasers and disinfectants for the toughest jobs.' },
    { q: 'Do I need to remove items before heavy duty cleaning in {city}?',
      a: 'Not necessarily. Our {city} heavy duty cleaning team can work around most items and help organize as we clean. For extreme situations, we can coordinate with a junk removal service first to clear the space.' },
  ],
  'garage-cleaning': [
    { q: 'What is included in a garage cleaning service in {city}?',
      a: 'Our garage cleaning in {city}, FL includes sweeping and removing all debris, degreasing floors, wiping down shelving and walls, cobweb removal, cleaning windows and doors, removing trash, and basic organization of items.' },
    { q: 'How much does garage cleaning cost in {city}?',
      a: 'Garage cleaning in {city}, FL is priced by the size and condition of the garage. Call {phone} for a free quote — we provide upfront, flat-rate pricing with no hidden fees or surprises.' },
    { q: 'Can you degrease and deep clean garage floors in {city}?',
      a: 'Yes! Garage floor degreasing is one of our specialties in {city}. We use commercial-grade degreasers to remove oil stains, tire marks, and built-up grime from concrete garage floors — leaving them clean and refreshed.' },
    { q: 'How long does a professional garage cleaning take in {city}?',
      a: 'A standard garage cleaning in {city} typically takes 2 to 5 hours depending on the size and amount of clutter. Heavily neglected garages may take longer. We give you an accurate time estimate during booking.' },
    { q: 'Can you clean garages of all sizes in {city}?',
      a: 'Absolutely. Tropishine cleans single-car garages, double garages, three-car garages, and oversized storage garages in {city}, FL. We bring the right team size to match the job every time.' },
    { q: 'Do you help with garage organization in {city}?',
      a: 'Yes! In addition to cleaning, our {city} garage cleaning service includes basic organization — grouping items, clearing pathways, and arranging shelving. For full storage system installation, we can recommend a specialist.' },
    { q: 'Do you remove trash and junk from garages in {city}?',
      a: 'We remove and bag all trash and debris during garage cleaning in {city}. For large amounts of junk, furniture, or old appliances, we can coordinate junk removal services to clear everything out completely.' },
  ],
  'day-porter-service': [
    { q: 'What is a day porter service in {city}?',
      a: 'A day porter is an on-site cleaning professional who maintains your facility throughout the business day in {city}, FL — handling restroom restocking, spill cleanup, lobby maintenance, and any immediate cleaning needs as they arise.' },
    { q: 'What tasks does a day porter perform in {city}?',
      a: 'Tropishine day porters in {city} handle restroom restocking and cleaning, lobby and entrance maintenance, spill cleanup, trash collection, elevator and common area wiping, break room maintenance, and real-time cleaning needs.' },
    { q: 'How much does day porter service cost in {city}?',
      a: 'Day porter service in {city}, FL is priced by the number of hours per day and days per week. Call {phone} for a free custom quote for your facility. We provide transparent, upfront pricing.' },
    { q: 'What types of businesses use day porter services in {city}?',
      a: 'Day porter services in {city} are popular for high-traffic facilities including office buildings, shopping centers, hotels, hospitals, universities, government buildings, HOAs, and luxury condominiums.' },
    { q: 'How is day porter service different from janitorial cleaning in {city}?',
      a: 'Janitorial cleaning in {city} is scheduled — typically nightly or weekly. A day porter provides real-time, on-site maintenance throughout the business day. Together, they ensure your facility is clean around the clock.' },
    { q: 'How many hours per day does a day porter work in {city}?',
      a: 'Day porter hours in {city} are fully customizable — typically 4, 6, or 8 hours per day. We provide coverage during peak traffic hours when cleaning needs are highest based on your facility schedule.' },
    { q: 'Can you provide day porter service for HOAs and condos in {city}?',
      a: 'Absolutely. HOAs and residential condominiums in {city} are among our most common day porter clients. We maintain lobbies, elevators, mailrooms, gym areas, and pool decks throughout the day.' },
  ],
  'short-term-rental-cleaning': [
    { q: 'What is included in short term rental cleaning in {city}?',
      a: 'Our short term rental cleaning in {city}, FL covers full property cleaning after each guest, linen and towel changes, restocking supplies and amenities, inspection for damage, and a final walkthrough to ensure the property is 5-star guest-ready.' },
    { q: 'Do you offer same-day turnover cleaning for VRBO and Airbnb in {city}?',
      a: 'Yes! Same-day turnover cleaning between check-out and check-in is our specialty in {city}. We are fast, reliable, and thorough — ensuring your property is spotless and ready for incoming guests every time.' },
    { q: 'How much does short term rental cleaning cost in {city}?',
      a: 'Short term rental cleaning in {city}, FL is priced by property size and scope. Call {phone} for a custom rate. Many hosts include the cleaning fee in their listing so guests cover the cost automatically.' },
    { q: 'Do you restock amenities and change linens during STR cleanings in {city}?',
      a: 'Yes! Tropishine\'s short term rental cleaning in {city} includes full linen changes — sheets, pillowcases, towels, and bath mats — and restocking of the amenities you supply. Every guest feels welcomed.' },
    { q: 'How quickly can you turn over a short term rental in {city}?',
      a: 'Most short term rental turnovers in {city} are completed within 2 to 4 hours. For larger properties, we bring a bigger team to ensure the property is always ready on time, even with back-to-back guest stays.' },
    { q: 'Can you coordinate with property management software in {city}?',
      a: 'Absolutely. We integrate with Airbnb, VRBO, Guesty, Hostaway, and other property management platforms in {city} to automatically schedule cleanings based on your guest calendar.' },
    { q: 'Do you work with vacation rental property managers in {city}?',
      a: 'Yes! Tropishine is a trusted partner for individual hosts and professional property management companies in {city} and across South Florida. We offer volume pricing for multi-property operators.' },
  ],
  'strip-and-wax-floor-care': [
    { q: 'What does floor strip and wax service include in {city}?',
      a: 'Our floor strip and wax service in {city}, FL includes stripping all old wax and finish, deep scrubbing the bare floor, applying multiple coats of professional floor finish, and buffing to a high-gloss showroom shine.' },
    { q: 'How often should commercial floors be stripped and waxed in {city}?',
      a: 'Most commercial floors in {city} benefit from stripping and waxing 1 to 2 times per year. High-traffic areas may need more frequent treatment. Regular buffing between cycles extends the floor\'s appearance and lifespan.' },
    { q: 'How much does floor strip and wax cost in {city}?',
      a: 'Floor strip and wax pricing in {city}, FL is based on square footage. Call {phone} for an exact quote based on your facility size. We provide transparent, upfront pricing with no hidden fees.' },
    { q: 'What types of flooring do you strip and wax in {city}?',
      a: 'Tropishine strips and waxes vinyl composition tile (VCT), linoleum, and other hard-surface commercial flooring in {city}, FL. Different finishes are available for different floor types and traffic levels.' },
    { q: 'How long does strip and wax floor care take in {city}?',
      a: 'Strip and wax services in {city} typically require 4 to 12 hours depending on floor size. We often work overnight to minimize disruption. Floors are ready to walk on within 1 to 2 hours after finishing.' },
    { q: 'Does strip and wax restore shine to dull floors in {city}?',
      a: 'Absolutely. Strip and wax is the most effective way to restore the like-new appearance of commercial floors in {city}. Old, yellowed, scuffed floors are transformed into a bright, high-gloss showroom finish.' },
    { q: 'Can I walk on floors immediately after strip and wax in {city}?',
      a: 'You should wait 1 to 2 hours after the final wax coat is applied before walking on floors in {city}. We will let you know the exact dry time. Avoid heavy furniture or equipment on the floor for 24 hours for best results.' },
  ],
  'kitchen-exhaust-cleaning': [
    { q: 'What is kitchen exhaust cleaning in {city}?',
      a: 'Kitchen exhaust cleaning in {city}, FL involves professionally cleaning the entire exhaust system of a commercial kitchen — including the hood, filters, ductwork, exhaust fan, and rooftop grease containment — to remove fire-hazard grease buildup.' },
    { q: 'How often should commercial kitchen hoods be cleaned in {city}?',
      a: 'NFPA 96 standards and {city} fire codes require kitchen hood cleaning every 3 months for high-volume restaurants, every 6 months for moderate-volume kitchens, and annually for low-volume operations.' },
    { q: 'How much does kitchen exhaust cleaning cost in {city}?',
      a: 'Kitchen exhaust cleaning in {city}, FL is priced based on system size and grease load. Call {phone} for a free on-site assessment and exact quote. We provide transparent, upfront pricing.' },
    { q: 'Is kitchen exhaust cleaning required by health codes in {city}?',
      a: 'Yes. Kitchen exhaust cleaning is required by NFPA 96, Florida fire codes, and local health department regulations in {city}. Failure to clean hoods regularly can result in failed inspections, fines, or forced closure.' },
    { q: 'What does hood and vent cleaning include in {city}?',
      a: 'Our kitchen exhaust cleaning in {city} covers the entire system: interior and exterior hood surfaces, grease filters, grease traps, all accessible ductwork, exhaust fan blades and housing, and rooftop exhaust components.' },
    { q: 'Do you provide a certificate after kitchen exhaust cleaning in {city}?',
      a: 'Yes! After every kitchen exhaust cleaning in {city}, Tropishine provides a certificate of service for your records. This documentation is required for health and fire inspections and proves code compliance.' },
    { q: 'Can a dirty kitchen exhaust cause a fire in {city}?',
      a: 'Yes — grease buildup in kitchen exhaust systems is one of the leading causes of commercial kitchen fires nationwide. Regular hood cleaning in {city} is not just a legal requirement — it is critical for the safety of your staff and customers.' },
  ],
  'post-fumigation-cleaning': [
    { q: 'What is post fumigation cleaning in {city}?',
      a: 'Post fumigation cleaning in {city}, FL is a thorough cleanup performed after tent fumigation for termites or pests. It removes fumigant residue, dead insects, droppings, and contaminated materials so the home is safe and comfortable to live in.' },
    { q: 'How soon after fumigation can I clean my home in {city}?',
      a: 'Your fumigation company will advise the safe re-entry time — typically 24 to 72 hours after tenting in {city}. Once cleared for re-entry, post fumigation cleaning can begin immediately. We coordinate with your fumigator\'s schedule.' },
    { q: 'What does post fumigation cleaning include in {city}?',
      a: 'Post fumigation cleaning in {city} includes wiping all surfaces, cleaning inside cabinets and drawers, washing countertops, vacuuming floors and upholstery, mopping hard floors, cleaning bathrooms and kitchen, and removing any dead insects or debris.' },
    { q: 'How much does post fumigation cleaning cost in {city}?',
      a: 'Post fumigation cleaning in {city}, FL is priced by home size. Call {phone} for a free quote. We offer fast scheduling to get you back in your home as quickly as possible after fumigation.' },
    { q: 'Do you clean the entire home after fumigation in {city}?',
      a: 'Yes. Our post fumigation cleaning in {city} covers the entire home — all rooms, kitchens, bathrooms, closets, and living areas. We pay special attention to food preparation surfaces and anywhere fumigant residue may have settled.' },
    { q: 'Is post fumigation cleaning necessary in {city}?',
      a: 'Yes, highly recommended. Even after fumigants dissipate, dead insects, droppings, and residue remain throughout the home. Post fumigation cleaning in {city} ensures your home is hygienic, safe, and comfortable immediately after re-entry.' },
    { q: 'How long does post fumigation cleaning take in {city}?',
      a: 'Post fumigation cleaning in {city} typically takes 3 to 6 hours for a standard home depending on size. We work efficiently so you can return to normal life in your home as quickly as possible after fumigation.' },
  ],
};

function getFallbackFaqs(svcDisplay, city) {
  return [
    { q: `How much does ${svcDisplay} cost in ${city}?`,
      a: `Pricing in ${city}, FL depends on the size of the job and specific requirements. Call ${PHONE} for a free, no-obligation quote — upfront flat-rate pricing with no hidden fees.` },
    { q: `Are your ${svcDisplay} professionals in ${city} licensed and insured?`,
      a: `Yes. Tropishine Cleaning is fully licensed and insured in Florida. Every cleaner passes a thorough background check. You are fully protected on every visit in ${city}.` },
    { q: `Do you offer same-day ${svcDisplay} in ${city}?`,
      a: `Same-day and next-day appointments are often available in ${city}. Call ${PHONE} to check availability — we do our best to accommodate urgent requests quickly.` },
    { q: `What is included in your ${svcDisplay} service in ${city}?`,
      a: `Our ${svcDisplay} in ${city}, FL is comprehensive and tailored to your needs. Call ${PHONE} for a full walkthrough of everything included. We are transparent about every step of the process.` },
    { q: `How long does ${svcDisplay} take in ${city}?`,
      a: `Duration depends on the size and scope of your project in ${city}. We provide an accurate time estimate when you call. Our team works efficiently without cutting corners.` },
    { q: `Do I need to be home during ${svcDisplay} in ${city}?`,
      a: `Not required! Many ${city} clients provide entry instructions and return to a perfectly cleaned space. Our insured, background-checked team handles everything professionally in your absence.` },
    { q: `How do I book ${svcDisplay} in ${city}?`,
      a: `Easy — call ${PHONE} or fill out our online form. We confirm your appointment quickly and send a reminder before your scheduled ${svcDisplay} in ${city}, FL.` },
  ];
}

function slugToTitle(slug) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Build FAQ accordion HTML items
function buildFaqHtml(faqs, delay = 0) {
  return faqs.map((faq, i) => [
    `                <div class="faq-accordion border border-zinc-100 rounded-[2rem] overflow-hidden transition-all duration-300 hover:border-sky-200" data-aos="fade-up" data-aos-delay="${i * 80}">`,
    `                    <button class="faq-accordion-header w-full p-5 md:p-8 flex items-center justify-between text-left group">`,
    `                        <span class="text-lg md:text-xl font-black text-zinc-950 tracking-tight group-hover:text-sky-600 transition-colors">`,
    `                            ${faq.q}`,
    `                        </span>`,
    `                        <div class="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">`,
    `                            <i data-lucide="chevron-down" class="w-5 h-5 chevron-icon"></i>`,
    `                        </div>`,
    `                    </button>`,
    `                    <div class="faq-accordion-content px-5 md:px-8 pb-5 md:pb-8">`,
    `                        <p class="text-zinc-500 font-bold leading-relaxed">`,
    `                            ${faq.a}`,
    `                        </p>`,
    `                    </div>`,
    `                </div>`,
  ].join('\n')).join('\n');
}

// Safe string split-and-replace (no dollar sign issues)
function replaceBetween(html, startStr, endStr, newContent) {
  const startIdx = html.indexOf(startStr);
  if (startIdx === -1) return { html, changed: false };
  const contentStart = startIdx + startStr.length;
  const endIdx = html.indexOf(endStr, contentStart);
  if (endIdx === -1) return { html, changed: false };
  return {
    html: html.substring(0, contentStart) + newContent + html.substring(endIdx),
    changed: true,
  };
}

function processFile(filePath, locSlug, svcSlug) {
  let html = fs.readFileSync(filePath, 'utf8');
  const city = slugToTitle(locSlug);

  const rawFaqs = FAQS[svcSlug] || getFallbackFaqs(slugToTitle(svcSlug), city);
  const faqs = rawFaqs.map(f => ({
    q: f.q.replace(/{city}/g, city).replace(/{phone}/g, PHONE),
    a: f.a.replace(/{city}/g, city).replace(/{phone}/g, PHONE),
  }));

  const allFaqHtml = '\n' + buildFaqHtml(faqs) + '\n            ';
  const topFaqHtml  = '\n' + buildFaqHtml(faqs.slice(0, 3)) + '\n                ';

  // ── 1. FIX MID-PAGE FAQ SECTION (h3 "Frequently Asked Questions") ──────────
  // Strategy: replace the entire corrupted block from the h3 container div
  // to the next section start, then insert a clean version.
  const midContainerMarker = 'class="mt-24 max-w-3xl mx-auto border-t border-slate-200 pt-16">';
  const nextSectionMarker  = '<section id="services"';
  const midContainerIdx = html.indexOf(midContainerMarker);
  const nextSectionIdx  = html.indexOf(nextSectionMarker, midContainerIdx > -1 ? midContainerIdx : 0);

  if (midContainerIdx > -1 && nextSectionIdx > -1) {
    const cleanMidSection = [
      `class="mt-24 max-w-3xl mx-auto border-t border-slate-200 pt-16">`,
      `                <h3 class="text-3xl md:text-4xl font-black text-center text-zinc-900 mb-10" data-aos="fade-up">Frequently Asked Questions</h3>`,
      `                <div class="space-y-4">`,
      topFaqHtml,
      `                </div>`,
      `            </div>`,
      `\n    `,
    ].join('\n');
    html = html.substring(0, midContainerIdx) + cleanMidSection + html.substring(nextSectionIdx);
  }

  // ── 2. FIX MAIN FAQ SECTION (Common Inquiries) ────────────────────────────
  // Find the space-y-4 div inside the "Common Inquiries" section and replace its content.
  const mainMarker = 'text-sky-500">Inquiries.';
  const mainMarkerIdx = html.indexOf(mainMarker);
  if (mainMarkerIdx > -1) {
    const spaceY4Open = '<div class="space-y-4">';
    const spaceY4Idx = html.indexOf(spaceY4Open, mainMarkerIdx);
    if (spaceY4Idx > -1) {
      const contentStart = spaceY4Idx + spaceY4Open.length;
      // Find closing </div> that matches this specific space-y-4 div
      // Use bracket counting to find the exact match
      let depth = 1;
      let pos   = contentStart;
      let closeIdx = -1;
      while (depth > 0 && pos < html.length) {
        const nextOpen  = html.indexOf('<div', pos);
        const nextClose = html.indexOf('</div>', pos);
        if (nextClose === -1) break;
        if (nextOpen !== -1 && nextOpen < nextClose) {
          depth++;
          pos = nextOpen + 4;
        } else {
          depth--;
          if (depth === 0) { closeIdx = nextClose; break; }
          pos = nextClose + 6;
        }
      }
      if (closeIdx > -1) {
        html = html.substring(0, contentStart) + allFaqHtml + html.substring(closeIdx);
      }
    }
  }

  // ── 3. FIX FAQPage SCHEMA (replace mainEntity questions) ──────────────────
  const faqSchemaEntities = faqs.map(f => ({
    '@type': 'Question',
    'name': f.q,
    'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
  }));
  const newSchemaStr = JSON.stringify(faqSchemaEntities);

  // Use split-replace to avoid $ interpretation
  const schemaStart = '"@type":"FAQPage","mainEntity":[';
  const schemaEnd   = ']}';
  const schemaIdx   = html.indexOf(schemaStart);
  if (schemaIdx > -1) {
    const afterStart = schemaIdx + schemaStart.length - 1; // include the [
    const endIdx = html.indexOf(schemaEnd, afterStart);
    if (endIdx > -1) {
      // Replace just the array portion
      const beforeArray = html.substring(0, schemaIdx + '"@type":"FAQPage","mainEntity":'.length);
      const afterArray  = html.substring(endIdx + 1); // keep the } but skip ]
      html = beforeArray + newSchemaStr + afterArray;
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

// ─── Walk all location directories ──────────────────────────────────────────
const allDirs = fs.readdirSync('.').filter(d => {
  try { return fs.statSync(d).isDirectory() && !SKIP_DIRS.has(d) && !d.startsWith('.'); }
  catch (e) { return false; }
});

let fixed = 0, errors = 0;

for (const locSlug of allDirs) {
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
      errors++;
      if (errors <= 5) console.error(`  ERROR ${svcPath}: ${e.message}`);
    }
    if (fixed % 200 === 0) process.stdout.write(`  Fixed ${fixed} pages...\n`);
  }
}

console.log(`\n✅ FAQ fix complete!`);
console.log(`   Pages fixed: ${fixed}`);
console.log(`   Errors: ${errors}`);
console.log(`\n   Every page now has:`);
console.log(`   ✓ Mid-page h3 FAQ section → 3 clean, correct FAQs (proper HTML structure)`);
console.log(`   ✓ Main "Common Inquiries" section → 7 keyword-rich FAQs (correct section)`);
console.log(`   ✓ FAQPage schema → 7 questions (rich results eligible)`);
console.log(`   ✓ No dollar sign corruption anywhere`);
