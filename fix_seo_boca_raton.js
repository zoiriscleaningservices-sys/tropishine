/**
 * Tropishine SEO Fix — Boca Raton Service Pages
 * Fixes: OG tags, JSON-LD WebPage/Article schema, adds richer FAQs, adds Service schema
 */
const fs = require('fs');
const path = require('path');

const PHONE = '9545300508';
const PHONE_DISPLAY = '(954) 530-0508';
const BASE_URL = 'https://www.tropishinecleaning.com';

const services = [
    {
        id: "house-cleaning",
        title: "House Cleaning",
        keyword: "house cleaning",
        desc: "Professional house cleaning services in Boca Raton, FL. Tropishine's vetted maids deep-clean every room — kitchens, bathrooms, bedrooms. Trusted by 500+ Boca Raton homeowners. Call for a free quote!",
        included: ["Kitchen deep clean (counters, appliances, sink)", "All bathrooms scrubbed and sanitized", "Bedroom dusting and vacuuming", "Living areas cleaned and mopped", "Baseboards and ceiling fans wiped", "Trash removal from all rooms"],
        faqs: [
            { q: "How often should I get my Boca Raton home professionally cleaned?", a: "Most Boca Raton homeowners choose weekly or bi-weekly house cleaning for active households. Monthly deep cleaning works well for smaller homes or couples. Tropishine offers flexible recurring schedules that fit your lifestyle." },
            { q: "Do your house cleaners bring their own supplies?", a: "Yes! Tropishine supplies all eco-friendly, non-toxic cleaning products and professional equipment. You don't need to provide anything — just a clean slate for us to work with." },
            { q: "Are your house cleaning professionals background-checked?", a: "Absolutely. Every Tropishine cleaning professional undergoes thorough background checks and in-person vetting before entering your Boca Raton home. We're fully licensed and insured." },
            { q: "What areas of Boca Raton do you serve?", a: "We serve all of Boca Raton including Boca Del Mar, Mizner Park area, Boca Greens, Broken Sound, Boca West, Woodfield, and all surrounding neighborhoods in Palm Beach County." },
            { q: "Can I customize what gets cleaned in my house?", a: "Yes. We offer fully customizable cleaning checklists. Tell us which rooms to prioritize, which to skip, and any special attention areas and we'll tailor every visit to your needs." }
        ]
    },
    {
        id: "recurring-house-cleaning",
        title: "Recurring House Cleaning",
        keyword: "recurring house cleaning",
        desc: "Set-it-and-forget-it recurring house cleaning in Boca Raton. Tropishine offers weekly, bi-weekly & monthly plans. Consistent, reliable cleaners you can trust. Book your recurring schedule today!",
        included: ["Weekly, bi-weekly, or monthly scheduling", "Consistent assigned cleaning team", "Full home cleaning every visit", "Priority booking and flexible rescheduling", "Discounted recurring rates", "Satisfaction guarantee on every visit"],
        faqs: [
            { q: "What recurring house cleaning plans do you offer in Boca Raton?", a: "Tropishine offers weekly, bi-weekly (every two weeks), and monthly recurring cleaning plans in Boca Raton. Each plan includes a full home clean with priority scheduling and discounted rates compared to one-time services." },
            { q: "Can I pause or cancel my recurring cleaning plan?", a: "Yes. We offer flexible plans with no long-term contracts. You can pause, reschedule, or cancel your recurring cleaning in Boca Raton with advance notice. We work around your schedule." },
            { q: "Will I get the same cleaners every time?", a: "We do our best to send the same trusted team to your Boca Raton home for every recurring visit. This ensures your cleaners learn your preferences and your home's layout for consistent results." },
            { q: "Is recurring cleaning cheaper than one-time cleaning?", a: "Yes. Tropishine's recurring cleaning clients in Boca Raton receive discounted rates compared to one-time bookings. The more frequently you schedule, the more you save per visit." },
            { q: "What if I need to skip a scheduled cleaning?", a: "Simply call or message us at least 24 hours before your scheduled clean in Boca Raton and we'll reschedule at no charge. We understand life happens and offer flexible accommodations." }
        ]
    },
    {
        id: "post-construction-cleaning",
        title: "Post-Construction Cleaning",
        keyword: "post-construction cleaning",
        desc: "Expert post-construction cleaning in Boca Raton, FL. We remove construction dust, debris, adhesive residue & packaging waste from new builds and renovations. Fast turnaround. Licensed & insured.",
        included: ["Removal of all construction dust and debris", "Window and glass cleaning inside & out", "Adhesive and paint overspray removal", "Vacuuming all surfaces and vents", "Deep clean of all fixtures and surfaces", "Final polish and inspection-ready finish"],
        faqs: [
            { q: "What does post-construction cleaning include in Boca Raton?", a: "Our post-construction cleaning in Boca Raton covers full debris removal, construction dust elimination from every surface including vents and fixtures, window cleaning, adhesive and paint removal, and a final polish to make your property inspection-ready." },
            { q: "How long does post-construction cleaning take?", a: "Timing depends on the property size and scope of construction. A typical Boca Raton post-construction clean for a 2,000 sq ft home takes 4–8 hours. We provide estimates before starting." },
            { q: "Do you clean newly built homes and renovation projects?", a: "Yes. Tropishine handles both brand-new construction cleanup and post-renovation cleaning throughout Boca Raton and Palm Beach County. We work with contractors, developers, and homeowners." },
            { q: "Can you handle large commercial post-construction projects?", a: "Absolutely. We have the crew and equipment to handle large-scale commercial post-construction cleaning in Boca Raton — offices, retail spaces, restaurants, and multi-unit residential buildings." },
            { q: "Is your team experienced with fine surfaces in luxury Boca Raton homes?", a: "Yes. Our Boca Raton post-construction team is trained to handle luxury finishes — marble, stone, hardwood, and custom cabinetry — with appropriate products that clean without damaging premium materials." }
        ]
    },
    {
        id: "commercial-cleaning",
        title: "Commercial Cleaning",
        keyword: "commercial cleaning",
        desc: "Professional commercial cleaning in Boca Raton, FL. Tropishine keeps offices, retail, medical, and business spaces spotless. Flexible after-hours scheduling. Licensed & fully insured. Get a free quote.",
        included: ["Office common areas and workstations", "Restroom sanitization and restocking", "Kitchen/break room deep clean", "Floor care (vacuuming, mopping, buffing)", "Trash removal and recycling", "Window and glass partition cleaning"],
        faqs: [
            { q: "What types of commercial properties do you clean in Boca Raton?", a: "Tropishine provides commercial cleaning for offices, retail stores, medical offices, restaurants, warehouses, gyms, and multi-tenant commercial buildings throughout Boca Raton and Palm Beach County." },
            { q: "Do you offer after-hours commercial cleaning in Boca Raton?", a: "Yes. We understand businesses can't interrupt operations. We offer flexible scheduling including evenings, weekends, and early mornings to clean your Boca Raton commercial space without disrupting your team." },
            { q: "Are your commercial cleaners bonded and insured?", a: "Yes. All Tropishine commercial cleaning teams in Boca Raton are fully bonded, licensed, and insured. We carry general liability insurance and workers compensation for your complete protection." },
            { q: "Can you set up a recurring commercial cleaning contract?", a: "Yes. We offer daily, weekly, and bi-weekly commercial cleaning contracts in Boca Raton with competitive pricing for long-term agreements. Contact us for a custom commercial cleaning quote." },
            { q: "Do you use green cleaning products for commercial spaces?", a: "We offer both standard and eco-friendly green cleaning options for Boca Raton businesses. Green commercial cleaning uses EPA-registered, non-toxic products that are safe for employees, customers, and the environment." }
        ]
    },
    {
        id: "janitorial-cleaning",
        title: "Janitorial Cleaning",
        keyword: "janitorial cleaning",
        desc: "Reliable janitorial cleaning services in Boca Raton, FL. Daily & nightly janitorial programs for offices, buildings & facilities. Trained, uniformed staff. Fully insured. Request a custom janitorial quote.",
        included: ["Daily restroom cleaning and sanitization", "Trash and recycling collection", "Common area cleaning and tidying", "Floor sweeping, mopping, and vacuuming", "Surface disinfecting at high-touch points", "Supply restocking (paper towels, soap, etc.)"],
        faqs: [
            { q: "What is included in janitorial cleaning services in Boca Raton?", a: "Janitorial cleaning in Boca Raton typically covers daily restroom sanitization, trash removal, floor care, common area cleaning, supply restocking, and disinfecting of high-touch surfaces like door handles and elevator buttons." },
            { q: "How often do janitorial services come to our Boca Raton facility?", a: "Tropishine offers janitorial schedules ranging from daily to weekly, depending on your facility's needs. High-traffic Boca Raton offices typically benefit from 5-day-a-week janitorial service." },
            { q: "Do you provide day porter services along with janitorial cleaning?", a: "Yes. In addition to standard janitorial contracts, Tropishine offers day porter services for Boca Raton facilities that need on-site cleaning staff during business hours to handle spills, lobby upkeep, and restroom checks." },
            { q: "Can I get a janitorial cleaning contract for a multi-building campus in Boca Raton?", a: "Yes. We service multi-building corporate campuses, business parks, and large facilities in Boca Raton. We'll create a custom janitorial program with dedicated teams for each building." },
            { q: "Are your janitorial staff uniformed and identifiable?", a: "Yes. All Tropishine janitorial staff in Boca Raton wear company uniforms and carry identification. We maintain professional standards at all times while working in your facility." }
        ]
    },
    {
        id: "day-porter-service",
        title: "Day Porter Service",
        keyword: "day porter service",
        desc: "Professional day porter service in Boca Raton, FL. On-site cleaning staff during business hours to handle lobbies, restrooms, and common areas. Keep your facility spotless all day. Call for rates.",
        included: ["Lobby and reception area maintenance", "Restroom checks and cleaning throughout the day", "Spill response and immediate cleanup", "Trash monitoring and removal", "Conference room setup and cleanup", "Elevator and high-traffic area upkeep"],
        faqs: [
            { q: "What does a day porter do at a Boca Raton facility?", a: "A day porter provides continuous cleaning and upkeep during business hours. At Boca Raton facilities, our day porters handle lobby cleaning, restroom checks, spill response, trash monitoring, conference room turns, and general appearance upkeep throughout the day." },
            { q: "How many hours per day does a day porter work?", a: "Day porter hours are fully customizable. Boca Raton businesses commonly schedule day porters for 4, 6, or 8-hour shifts aligned with their operating hours. We work around your peak traffic times." },
            { q: "Is day porter service different from regular janitorial cleaning?", a: "Yes. Janitorial cleaning typically happens after hours as a scheduled deep clean. Day porter service provides a visible, on-site cleaning presence during business hours for real-time maintenance — not a full clean, but keeping everything presentable all day." },
            { q: "What types of facilities in Boca Raton use day porter services?", a: "Boca Raton businesses that benefit most from day porter services include corporate offices, luxury apartment complexes, shopping centers, medical facilities, hotels, universities, and any facility with high daily foot traffic." },
            { q: "Can you provide a day porter and nightly janitorial cleaning together?", a: "Yes. Tropishine offers combined day porter plus nightly janitorial packages for Boca Raton facilities that want 24-hour facility coverage. Contact us for a custom quote bundling both services." }
        ]
    },
    {
        id: "airbnb-cleaning",
        title: "Airbnb Cleaning",
        keyword: "Airbnb cleaning",
        desc: "Fast, reliable Airbnb cleaning in Boca Raton, FL. Same-day turnover cleaning between guests. We restock linens, check for damage & ensure 5-star ready presentation. Trusted by local hosts. Book now!",
        included: ["Full property turnover between guests", "Fresh linens and towel staging", "Kitchen and bathroom deep sanitization", "Restocking of amenities and supplies", "Damage inspection and photo report", "Ready for same-day or next-day check-in"],
        faqs: [
            { q: "How quickly can you turn over an Airbnb in Boca Raton?", a: "Tropishine specializes in fast Airbnb turnovers in Boca Raton. For a standard 2-bedroom unit, we typically complete the turnover in 2–3 hours. We work with your check-out/check-in window to ensure guests always arrive to a spotless property." },
            { q: "Do you work with Airbnb's scheduling or the host directly?", a: "We work directly with Boca Raton Airbnb hosts and property managers. You can share your calendar with us and we'll automatically schedule cleanings around your bookings. We also integrate with platforms like Turno." },
            { q: "Do you restock supplies during Airbnb cleaning?", a: "Yes. Our Boca Raton Airbnb cleaning team can restock toiletries, paper products, coffee supplies, and other guest amenities you provide. Just keep a supply area stocked and we'll ensure guests always have what they need." },
            { q: "Can you handle multiple Airbnb units in the same Boca Raton complex?", a: "Absolutely. We're experienced managing multiple Airbnb units for property managers and investors in Boca Raton. We coordinate simultaneous turnovers efficiently to minimize time between check-out and check-in." },
            { q: "Do you provide a condition report after each Airbnb clean?", a: "Yes. After each turnover in Boca Raton, our team can provide a condition report with photos noting any guest damage, low supplies, or maintenance issues — protecting your property and your Airbnb rating." }
        ]
    },
    {
        id: "short-term-rental-cleaning",
        title: "Short Term Rental Cleaning",
        keyword: "short-term rental cleaning",
        desc: "Expert short-term rental cleaning in Boca Raton, FL. We handle VRBO, Airbnb & vacation rental turnovers with 5-star standards. Linen staging, damage inspection & same-day availability. Call today!",
        included: ["Complete property turnover and deep clean", "Fresh linen and towel staging", "Vacation rental amenity restocking", "Full kitchen and bathroom sanitization", "Outdoor area and pool deck cleanup", "Pre-check-in inspection and readiness report"],
        faqs: [
            { q: "What short-term rental platforms do you support in Boca Raton?", a: "Tropishine provides turnover cleaning for all short-term rental platforms in Boca Raton including Airbnb, VRBO, Booking.com, and privately listed vacation rentals. We work with property management companies and individual hosts." },
            { q: "Do you offer cleaning for beachfront rental properties in Boca Raton?", a: "Yes. We specialize in beach and waterfront vacation rental cleaning in Boca Raton and along the Hillsboro Beach and Deerfield Beach coastline. We're experienced with sand management, salt air residue, and the specific demands of coastal properties." },
            { q: "Can you handle same-day short-term rental turnovers in Boca Raton?", a: "Yes. Same-day turnovers are our specialty. As long as check-out is by early afternoon, Tropishine's Boca Raton team can have your vacation rental cleaned and ready for evening check-in." },
            { q: "How do you ensure consistent quality across multiple vacation rental units?", a: "We use standardized cleaning checklists for all Boca Raton vacation rental units and require photo confirmation from our teams. Property managers receive a post-clean report with photos after every turnover." },
            { q: "Do you clean outdoor areas and pools for short-term rentals?", a: "Yes. For Boca Raton vacation rentals with outdoor spaces, we include patio furniture cleaning, pool deck sweeping, BBQ grill cleaning, and outdoor staging as part of our comprehensive short-term rental turnover service." }
        ]
    },
    {
        id: "deep-cleaning",
        title: "Deep Cleaning",
        keyword: "deep cleaning",
        desc: "Thorough deep cleaning services in Boca Raton, FL. We scrub every surface, appliance, grout line & hidden corner. Perfect for move-in, seasonal, or first-time cleans. Licensed & insured. Book today!",
        included: ["Inside oven, refrigerator & microwave cleaning", "Cabinet interiors and drawers wiped down", "Grout scrubbing in bathrooms and kitchen", "Baseboards, door frames & light switches", "Behind and under furniture vacuumed", "Window sills, blinds & ceiling fan blades"],
        faqs: [
            { q: "What's the difference between regular cleaning and deep cleaning in Boca Raton?", a: "A regular house cleaning maintains cleanliness between visits — surfaces, floors, and bathrooms. Deep cleaning in Boca Raton goes much further: inside appliances, grout scrubbing, baseboards, cabinet interiors, behind furniture, and areas typically skipped in routine cleans." },
            { q: "How long does a deep cleaning take in Boca Raton?", a: "A Boca Raton deep cleaning typically takes 4–8 hours depending on the home's size and current condition. A 3-bedroom, 2-bathroom home usually takes a team of two about 5–6 hours for a comprehensive deep clean." },
            { q: "When should I get a deep cleaning in Boca Raton?", a: "Deep cleaning is ideal before moving in or out, after a renovation, before hosting guests, at the start of a new season, or as a first-time clean to establish a baseline. Many Boca Raton homeowners do a deep clean every 3–6 months." },
            { q: "Do you clean inside appliances during a deep cleaning?", a: "Yes. Tropishine's deep cleaning in Boca Raton includes cleaning inside the oven, refrigerator, and microwave as standard. We remove built-up grease, food residue, and odors for a truly thorough clean." },
            { q: "Can deep cleaning help with Florida humidity and mold issues?", a: "Yes. Florida's humidity can cause mildew and mold buildup in bathrooms, grout lines, and under appliances. Our Boca Raton deep cleaning tackles these problem areas with appropriate products designed to eliminate mold and prevent recurrence." }
        ]
    },
    {
        id: "move-in-move-out-cleaning",
        title: "Move In Move Out Cleaning",
        keyword: "move-in move-out cleaning",
        desc: "Professional move-in & move-out cleaning in Boca Raton, FL. We ensure spotless properties for tenants, landlords & real estate agents. Deposit-protecting deep cleans. Fast scheduling. Call us today!",
        included: ["Complete deep clean of entire property", "Inside all appliances (oven, fridge, microwave)", "Cabinet and drawer interiors wiped", "All bathrooms sanitized and scrubbed", "Windows, sills and blinds cleaned", "Floors mopped and carpets vacuumed"],
        faqs: [
            { q: "What does move-out cleaning include in Boca Raton?", a: "Our Boca Raton move-out cleaning is a top-to-bottom deep clean of the entire property — kitchen appliance interiors, cabinet interiors, all bathrooms, floors, walls, windows, and every area a landlord or next tenant will inspect. It's designed to maximize your deposit return." },
            { q: "Can you help me get my security deposit back with move-out cleaning?", a: "Yes. Our move-out cleaning in Boca Raton is specifically designed to meet landlord and property manager inspection standards. We clean to the same level of detail that move-in inspection checklists require, giving you the best chance of a full deposit return." },
            { q: "How far in advance should I book move-out cleaning in Boca Raton?", a: "We recommend booking your Boca Raton move-out cleaning 3–5 days in advance. During peak moving seasons (spring and summer), booking 1–2 weeks ahead ensures availability on your preferred date." },
            { q: "Do you offer move-in cleaning for new Boca Raton residents?", a: "Yes. Move-in cleaning in Boca Raton gives you a fresh, sanitized start in your new home. Even if the property appears clean, a professional deep clean ensures the previous occupant's grime, allergens, and bacteria are fully removed." },
            { q: "Can real estate agents and property managers schedule move-out cleans directly?", a: "Absolutely. Tropishine works regularly with Boca Raton real estate agents, property managers, and landlords to coordinate move-out cleaning between tenancies. We can also coordinate directly with departing tenants." }
        ]
    },
    {
        id: "strip-and-wax-floor-care",
        title: "Strip & Wax Floor Care",
        keyword: "strip and wax floor care",
        desc: "Professional strip & wax floor care in Boca Raton, FL. We strip old wax, deep clean & apply fresh high-gloss finish to tile, vinyl & VCT floors. Commercial & residential. Request a floor care quote.",
        included: ["Strip existing wax buildup and old finish", "Deep scrub and clean of bare floor surface", "Application of commercial-grade floor finish", "Multiple coats for maximum durability and shine", "Buffing and burnishing for high-gloss result", "Furniture moving and replacement included"],
        faqs: [
            { q: "What types of floors benefit from strip and wax service in Boca Raton?", a: "Strip and wax floor care in Boca Raton is ideal for vinyl composition tile (VCT), linoleum, terrazzo, and certain commercial tile floors. It's commonly done in offices, retail stores, healthcare facilities, schools, and warehouses." },
            { q: "How often should floors be stripped and waxed in Florida?", a: "In Boca Raton's high-traffic commercial environments, strip and wax is typically done 1–2 times per year. Regular buffing and restoring can extend the time between full strip-and-wax treatments." },
            { q: "How long does strip and wax floor care take in Boca Raton?", a: "A standard strip and wax for a 1,000 sq ft commercial floor in Boca Raton takes approximately 3–5 hours. Larger facilities require overnight scheduling. Floors need 24 hours to fully cure before heavy foot traffic." },
            { q: "What's the difference between floor buffing and strip and wax?", a: "Buffing restores shine to existing wax layers. Strip and wax completely removes all old wax buildup, cleans the bare floor, and applies fresh commercial-grade finish. Strip and wax delivers a much deeper restoration — ideal for dull or heavily trafficked floors." },
            { q: "Do you strip and wax floors in residential Boca Raton homes?", a: "Yes. While strip and wax is most common for commercial applications, Tropishine also performs strip and wax floor care for Boca Raton homes with VCT or vinyl tile in garages, kitchens, and Florida rooms." }
        ]
    },
    {
        id: "carpet-cleaning",
        title: "Carpet Cleaning",
        keyword: "carpet cleaning",
        desc: "Deep carpet cleaning in Boca Raton, FL. Hot water extraction removes embedded dirt, stains, pet odors & allergens. Safe for kids and pets. Quick dry times. Residential & commercial. Book online now!",
        included: ["Hot water extraction (steam cleaning)", "Pre-treatment of stains and high-traffic areas", "Pet odor and urine treatment available", "Deodorizing and sanitizing treatment", "Carpet grooming for faster drying", "Furniture moving for full-coverage clean"],
        faqs: [
            { q: "What carpet cleaning method do you use in Boca Raton?", a: "Tropishine uses hot water extraction (commonly called steam cleaning) for carpet cleaning in Boca Raton. This method is recommended by major carpet manufacturers as it most effectively removes embedded dirt, allergens, and bacteria from deep within carpet fibers." },
            { q: "How long does carpet cleaning take to dry in Boca Raton?", a: "With our hot water extraction method, carpets in Boca Raton typically dry within 4–8 hours. Running ceiling fans or AC accelerates drying. Florida's humidity can extend drying time slightly — we recommend opening windows when possible." },
            { q: "Can you remove pet stains and odors from carpets in Boca Raton?", a: "Yes. We offer specialized pet stain and odor treatment for Boca Raton homes. We apply enzyme-based pre-treatment to break down pet urine proteins before extraction, effectively eliminating odors rather than just masking them." },
            { q: "How often should carpets be professionally cleaned in Boca Raton?", a: "The Carpet and Rug Institute recommends professional carpet cleaning every 12–18 months. In Boca Raton homes with pets, children, or allergy sufferers, every 6–12 months is ideal. High-traffic commercial carpets often need quarterly cleaning." },
            { q: "Is carpet cleaning safe for children and pets?", a: "Yes. Tropishine uses child and pet-safe cleaning solutions for all Boca Raton carpet cleanings. Our products are non-toxic and biodegradable. We recommend keeping pets and small children off wet carpets until fully dry." }
        ]
    },
    {
        id: "air-duct-cleaning",
        title: "Air Duct Cleaning",
        keyword: "air duct cleaning",
        desc: "Professional air duct cleaning in Boca Raton, FL. Remove dust, mold, allergens & debris from your HVAC system. Improve indoor air quality & lower energy bills. NADCA-standard service. Call today!",
        included: ["Complete duct system inspection", "High-powered vacuum extraction of all debris", "All supply and return vents cleaned", "Blower motor and air handler cleaning", "Sanitizing treatment to eliminate mold and bacteria", "HEPA filtration during cleaning process"],
        faqs: [
            { q: "How often should air ducts be cleaned in Boca Raton, FL?", a: "The EPA and NADCA recommend air duct cleaning every 3–5 years for most Boca Raton homes. Florida's humidity and high AC usage mean ducts can accumulate mold, dust mites, and debris faster than in drier climates. Homes with pets, smokers, or allergy sufferers should clean ducts every 2–3 years." },
            { q: "Can dirty air ducts cause health problems in Boca Raton?", a: "Yes. Contaminated air ducts in Boca Raton can circulate dust, mold spores, pet dander, pollen, and bacteria throughout your home every time your AC runs. This is particularly problematic in Florida where AC runs year-round, leading to respiratory issues and allergy flare-ups." },
            { q: "Will air duct cleaning improve my energy bills?", a: "Yes. Clean air ducts improve HVAC airflow efficiency in your Boca Raton home, reducing the workload on your AC system. Clean ducts can improve energy efficiency by 20–40%, lowering your monthly utility bills — significant in South Florida's hot climate." },
            { q: "Do you clean dryer vents as well as AC ducts in Boca Raton?", a: "Yes. In addition to HVAC duct cleaning, Tropishine offers dryer vent cleaning for Boca Raton homes. Clogged dryer vents are a leading cause of house fires and significantly reduce dryer efficiency — we recommend annual dryer vent cleaning." },
            { q: "How long does air duct cleaning take for a Boca Raton home?", a: "Air duct cleaning for an average 2,000–3,000 sq ft Boca Raton home typically takes 2–4 hours. Larger homes or systems with heavy contamination may take longer. We provide a time estimate before starting." }
        ]
    },
    {
        id: "window-cleaning",
        title: "Window Cleaning",
        keyword: "window cleaning",
        desc: "Crystal-clear window cleaning in Boca Raton, FL. Interior & exterior window cleaning for homes, condos & commercial buildings. We remove salt spray, water spots & grime. Streak-free guarantee. Call now!",
        included: ["Interior window glass cleaning", "Exterior window cleaning", "Window frame and sill wiping", "Screen cleaning and reinstallation", "Salt spray and hard water deposit removal", "High-rise and second-story window cleaning"],
        faqs: [
            { q: "How often should I get windows cleaned in Boca Raton?", a: "In Boca Raton's coastal environment, salt air deposits build up on windows quickly. We recommend professional window cleaning every 1–3 months for beachfront properties and every 3–6 months for inland Boca Raton homes. Commercial buildings typically benefit from monthly window cleaning." },
            { q: "Can you remove salt spray and hard water stains from windows in Boca Raton?", a: "Yes. Salt spray from ocean breezes is a major issue for Boca Raton windows. We use specialized treatments to dissolve mineral deposits and hard water stains that regular cleaning can't remove, restoring your windows to crystal clarity." },
            { q: "Do you clean high-rise windows in Boca Raton condos?", a: "Yes. Tropishine provides professional high-rise window cleaning for Boca Raton condos and commercial buildings. We use water-fed pole systems and appropriate safety equipment to safely clean windows at height." },
            { q: "Do you clean both interior and exterior windows?", a: "Yes. Our standard Boca Raton window cleaning package includes both interior and exterior cleaning, frame wiping, sill cleaning, and screen cleaning. We also offer exterior-only packages for quick maintenance visits." },
            { q: "Will you clean windows on my second floor or above?", a: "Yes. Tropishine cleans windows on all floors of Boca Raton homes and commercial properties. We use water-fed extension poles for second and third-story windows without the need for ladders or scaffolding in most cases." }
        ]
    },
    {
        id: "restaurant-cleaning",
        title: "Restaurant Cleaning",
        keyword: "restaurant cleaning",
        desc: "Restaurant & commercial kitchen cleaning in Boca Raton, FL. Health code compliant deep cleaning for kitchens, dining areas & more. After-hours scheduling. Licensed, insured & experienced. Call today!",
        included: ["Commercial kitchen deep cleaning", "Grease trap and hood cleaning preparation", "Food prep surface sanitization", "Dining room and bar area cleaning", "Restroom commercial-grade sanitization", "Health code compliance checklist"],
        faqs: [
            { q: "What does restaurant cleaning include in Boca Raton?", a: "Tropishine's restaurant cleaning in Boca Raton covers the entire facility: commercial kitchen deep cleaning (equipment, surfaces, and floors), dining room cleaning, restroom sanitization, bar area cleaning, and hood/exhaust system exterior cleaning. We follow Palm Beach County health code standards." },
            { q: "Do you clean restaurants during or after business hours in Boca Raton?", a: "We primarily schedule Boca Raton restaurant cleaning after closing hours to avoid disrupting service. We're available for late-night and early-morning cleaning slots to ensure your restaurant is inspection-ready every morning." },
            { q: "Can you help my Boca Raton restaurant pass a health inspection?", a: "Yes. Our restaurant cleaning protocols in Boca Raton are aligned with Palm Beach County Environmental Health standards. We document our cleaning procedures and can provide service records to support your health inspection." },
            { q: "How often should a restaurant be deep cleaned in Boca Raton?", a: "Boca Raton restaurants should have a full deep clean monthly at minimum, with daily kitchen cleaning essential. High-volume restaurants may need weekly deep cleaning of the kitchen. Daily surface sanitation is required by law." },
            { q: "Do you clean restaurant hoods and exhaust systems in Boca Raton?", a: "We clean the exterior of hood systems and surrounding areas. For full kitchen exhaust hood cleaning and grease trap service, we recommend our specialized kitchen exhaust cleaning service which is a separate offering." }
        ]
    },
    {
        id: "garage-cleaning",
        title: "Garage Cleaning",
        keyword: "garage cleaning",
        desc: "Professional garage cleaning & organizing in Boca Raton, FL. We sweep, mop, degrease garage floors & haul away junk. Transform your garage in one day. Residential & commercial. Call for a free quote!",
        included: ["Complete garage sweep and debris removal", "Floor degreasing and pressure wash prep", "Cobweb and wall surface cleaning", "Shelving and storage area cleaning", "Oil stain treatment on concrete floors", "Haul-away of unwanted items available"],
        faqs: [
            { q: "What does garage cleaning include in Boca Raton?", a: "Tropishine's garage cleaning in Boca Raton includes a full sweep, debris removal, degreasing of the floor, cobweb and wall surface cleaning, shelving and storage area cleaning, oil stain treatment on concrete, and haul-away of unwanted items." },
            { q: "Can you remove oil stains from my garage floor in Boca Raton?", a: "Yes. We treat oil and grease stains on concrete garage floors using commercial-grade degreasers. While very old, deeply set stains may not be 100% removable, our treatment significantly reduces and often eliminates garage floor stains in Boca Raton homes." },
            { q: "Do you help organize the garage or just clean it?", a: "Our primary service is cleaning. We can help consolidate and tidy items during the clean, but for full organizational systems we recommend pairing our garage cleaning with a professional organizer. We're happy to refer trusted Boca Raton organizing services." },
            { q: "Can you haul away junk from my garage in Boca Raton?", a: "Yes. We offer junk haul-away as an add-on to garage cleaning in Boca Raton. Just identify the items you want removed and we'll dispose of them properly. Pricing is based on volume." },
            { q: "How long does a garage cleaning take in Boca Raton?", a: "A standard 2-car garage clean in Boca Raton takes 2–4 hours depending on the level of clutter and cleaning needed. We provide a time estimate after reviewing photos or doing a quick assessment." }
        ]
    },
    {
        id: "office-cleaning",
        title: "Office Cleaning",
        keyword: "office cleaning",
        desc: "Professional office cleaning in Boca Raton, FL. We keep workspaces, conference rooms & restrooms spotless. Flexible scheduling including after-hours. Trusted by 200+ Boca Raton businesses. Get a quote!",
        included: ["Workstation dusting and surface wiping", "Conference room cleaning and setup", "Restroom disinfection and supply restocking", "Kitchen and break room cleaning", "Reception and lobby area cleaning", "Vacuuming, mopping, and floor care"],
        faqs: [
            { q: "How often should my Boca Raton office be professionally cleaned?", a: "Most Boca Raton offices benefit from 3–5 day-per-week professional cleaning. Small offices with fewer than 10 employees can manage with weekly cleaning. High-traffic offices, medical offices, and client-facing spaces should be cleaned daily." },
            { q: "Do you clean offices after business hours in Boca Raton?", a: "Yes. Tropishine provides flexible after-hours office cleaning throughout Boca Raton. Evening and early morning scheduling ensures zero disruption to your employees and operations while keeping your office consistently clean." },
            { q: "Can you clean multiple office locations in Boca Raton and Palm Beach County?", a: "Yes. We service multi-location businesses throughout Boca Raton, Delray Beach, Boynton Beach, and all of Palm Beach County. We assign dedicated teams and supervisors to ensure consistent quality across all your locations." },
            { q: "Do you disinfect high-touch surfaces in offices?", a: "Yes. In addition to standard cleaning, Tropishine offers enhanced disinfection protocols for Boca Raton offices that target high-touch surfaces — door handles, light switches, keyboards, elevator buttons, and shared equipment — using EPA-registered disinfectants." },
            { q: "Are your office cleaning contracts flexible?", a: "Yes. We offer month-to-month office cleaning agreements in Boca Raton with no long-term commitments required. We also offer discounted annual contracts for businesses looking for maximum savings." }
        ]
    },
    {
        id: "medical-office-cleaning",
        title: "Medical Office Cleaning",
        keyword: "medical office cleaning",
        desc: "Specialized medical office cleaning in Boca Raton, FL. OSHA-compliant disinfection for exam rooms, waiting areas & labs. Trained in healthcare cleaning protocols. Fully insured. Contact us today!",
        included: ["Exam room disinfection and sanitization", "Waiting room cleaning and high-touch disinfection", "Medical-grade restroom sanitization", "OSHA-compliant cleaning protocols", "Biohazard area precaution procedures", "Regulated medical waste disposal coordination"],
        faqs: [
            { q: "Why do medical offices need specialized cleaning in Boca Raton?", a: "Medical facilities in Boca Raton require cleaning that goes beyond standard commercial cleaning. Our medical office cleaning uses OSHA-compliant protocols, EPA-registered hospital-grade disinfectants, and trained staff who understand infection control requirements for exam rooms, waiting areas, and treatment spaces." },
            { q: "Are your medical office cleaners HIPAA-aware?", a: "Yes. All Tropishine staff assigned to Boca Raton medical offices receive training on maintaining patient privacy and HIPAA compliance during cleaning. We never handle patient records and follow strict protocols in treatment areas." },
            { q: "What types of medical facilities do you clean in Boca Raton?", a: "We clean a wide range of Boca Raton medical facilities including physician offices, dental practices, urgent care centers, physical therapy clinics, chiropractic offices, dermatology practices, and specialty medical suites." },
            { q: "Do you follow CDC and OSHA cleaning guidelines for Boca Raton medical offices?", a: "Yes. Tropishine's medical office cleaning protocols align with CDC environmental cleaning recommendations and OSHA bloodborne pathogen standards. We use appropriate PPE and proper disinfectant dwell times in all medical environments." },
            { q: "How often should a medical office be cleaned in Boca Raton?", a: "Boca Raton medical offices should be cleaned daily at minimum. High patient-volume practices benefit from multiple cleaning sessions per day, particularly for exam rooms between patients, waiting areas, and restrooms." }
        ]
    },
    {
        id: "kitchen-exhaust-cleaning",
        title: "Kitchen Exhaust Cleaning",
        keyword: "kitchen exhaust cleaning",
        desc: "NFPA 96-compliant kitchen exhaust & hood cleaning in Boca Raton, FL. Removes grease buildup, prevents fires & satisfies fire marshal inspections. Certified technicians. Call for commercial hood cleaning quote.",
        included: ["Full kitchen exhaust hood cleaning", "Ductwork degreasing from hood to rooftop fan", "Exhaust fan cleaning and inspection", "Grease filter removal and degreasing", "Access panel installation if needed", "Before and after photos for fire marshal records"],
        faqs: [
            { q: "How often is kitchen exhaust cleaning required in Boca Raton?", a: "The NFPA 96 standard (adopted by Palm Beach County fire codes) requires kitchen exhaust cleaning frequency based on cooking volume: high-volume operations (quarterly), moderate-volume (semi-annually), and low-volume operations (annually). Your fire marshal can provide specific guidance for your Boca Raton restaurant." },
            { q: "What happens if I don't clean my kitchen exhaust system in Boca Raton?", a: "Grease buildup in kitchen exhaust systems is one of the leading causes of restaurant fires. In Boca Raton, a non-compliant kitchen exhaust system can result in failed fire inspections, forced closure, voided insurance, and serious fire risk to your restaurant and staff." },
            { q: "Do you provide documentation for fire marshal inspections after cleaning?", a: "Yes. Tropishine provides before and after photos plus a signed service report after every kitchen exhaust cleaning in Boca Raton. This documentation is required for fire marshal inspections and insurance compliance." },
            { q: "Do you clean kitchen exhaust systems for all types of restaurants in Boca Raton?", a: "Yes. We clean kitchen exhaust systems for all Boca Raton food service establishments — full-service restaurants, fast casual, cafeterias, food trucks with permanent kitchen setups, hotel kitchens, and institutional food service facilities." },
            { q: "How long does kitchen exhaust cleaning take at a Boca Raton restaurant?", a: "A standard kitchen exhaust cleaning at a Boca Raton restaurant typically takes 2–5 hours depending on the system size and grease buildup level. We schedule after closing hours to minimize disruption to your kitchen operations." }
        ]
    },
    {
        id: "heavy-duty-deep-cleaning",
        title: "Heavy Duty Deep Cleaning",
        keyword: "heavy duty deep cleaning",
        desc: "Extreme heavy-duty deep cleaning in Boca Raton, FL. We tackle neglected properties, hoarder cleanouts, post-party messes & severely soiled spaces. No job too tough. Licensed, insured. Call us now!",
        included: ["Removal of heavy grime, grease & buildup", "Trash and debris haul-away available", "Deep scrubbing of all surfaces top to bottom", "Mold and mildew treatment", "Biohazard precaution protocols when needed", "Multiple team members for fast turnaround"],
        faqs: [
            { q: "What is heavy-duty deep cleaning in Boca Raton?", a: "Heavy-duty deep cleaning in Boca Raton goes beyond standard deep cleaning to tackle severely neglected, soiled, or damaged properties. This includes hoarder cleanouts, post-foreclosure cleaning, heavily soiled rentals, post-party cleaning, and properties that haven't been cleaned professionally in years." },
            { q: "Can you clean a heavily neglected property in Boca Raton?", a: "Yes. Tropishine's heavy-duty deep cleaning team is specifically equipped for severely neglected Boca Raton properties. We bring additional staff, heavy-duty equipment, and industrial cleaning products to restore even the most challenging spaces." },
            { q: "Do you handle hoarder cleanouts in Boca Raton?", a: "Yes. We provide compassionate, professional hoarder cleanout and cleaning services in Boca Raton. Our team handles removal of accumulated items (with the client's guidance on what to keep), deep cleaning, and deodorizing of the space." },
            { q: "How much does heavy-duty deep cleaning cost in Boca Raton?", a: "Heavy-duty deep cleaning pricing in Boca Raton varies significantly based on property size, level of soiling, and services required. We always provide a free on-site assessment and quote before beginning any heavy-duty project." },
            { q: "Can heavy-duty deep cleaning address mold and biohazard situations in Boca Raton?", a: "We can treat surface mold as part of heavy-duty cleaning. For extensive mold remediation or biohazard situations, we recommend a licensed remediation contractor. We can coordinate with remediation companies and provide post-remediation cleaning in Boca Raton." }
        ]
    },
    {
        id: "post-fumigation-cleaning",
        title: "Post Fumigation Cleaning",
        keyword: "post-fumigation cleaning",
        desc: "Professional post-fumigation cleaning in Boca Raton, FL. After tent fumigation, we remove chemical residue, dead insects & off-gassing chemicals. Safe re-entry cleaning for your home. Call today!",
        included: ["Removal of all dead insects and debris", "Wipe-down of all food-contact surfaces", "Cabinet and drawer interior cleaning", "Ventilation and airing-out support", "Floor cleaning after fumigation tent removal", "Disposal of any opened food items"],
        faqs: [
            { q: "Why do I need cleaning after fumigation in Boca Raton?", a: "After tent fumigation in Boca Raton, dead insects, chemical residue, and fumigant off-gassing particles settle throughout the home. Professional post-fumigation cleaning removes these residues from food-contact surfaces, counters, cabinets, and floors to ensure your home is truly safe to return to." },
            { q: "How soon after fumigation can cleaning begin in Boca Raton?", a: "Post-fumigation cleaning should begin 24–48 hours after re-entry clearance from your fumigation company. Tropishine coordinates with your fumigator's re-entry schedule to clean your Boca Raton home as quickly as possible after clearance." },
            { q: "What surfaces are cleaned after fumigation in Boca Raton?", a: "We clean all food-contact surfaces (counters, tables, cabinet interiors, dishware storage areas), floors, bathroom surfaces, and any areas where dead insects have fallen. We also wipe down sealed food storage areas and appliance exteriors." },
            { q: "Do you dispose of food items that can't be safely used after fumigation?", a: "As part of post-fumigation cleaning in Boca Raton, we help identify and dispose of any opened or improperly sealed food items that may have been exposed to fumigants. Your fumigation company will provide guidance on which items need disposal." },
            { q: "Is post-fumigation cleaning different from regular cleaning?", a: "Yes. Post-fumigation cleaning requires specific protocols for Boca Raton homes: thorough wipe-down of all food-contact surfaces, removal of dead insects, and attention to areas where chemical residue may have settled. Standard cleaning doesn't address these fumigation-specific concerns." }
        ]
    }
];

const today = new Date().toISOString().split('T')[0];

function fixServicePage(service) {
    const folderName = `${service.id}-boca-raton`;
    const filePath = path.join(__dirname, folderName, 'index.html');

    if (!fs.existsSync(filePath)) {
        console.warn(`SKIP: ${folderName}/index.html not found`);
        return;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    const pageUrl = `${BASE_URL}/${folderName}/`;
    const pageTitle = `${service.title} in Boca Raton, FL | Tropishine Cleaning`;
    const desc = service.desc;
    const imageUrl = `${BASE_URL}/images/cleaning-services-boca-raton.jpg`;

    // 1. Fix <title>
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`);

    // 2. Fix meta description (handles both single-line and multi-line formats)
    html = html.replace(/<meta name="description"[\s\S]*?content="[^"]*"\s*\/>/, `<meta name="description" content="${desc}" />`);

    // 3. Fix og:title
    html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${pageTitle}" />`);

    // 4. Fix og:description
    html = html.replace(/<meta property="og:description"\s*\n?\s*content="[^"]*"\s*\/>/, `<meta property="og:description" content="${desc}" />`);
    html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${desc}" />`);

    // 5. Fix og:url
    html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${pageUrl}" />`);

    // 6. Fix canonical
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${pageUrl}" />`);

    // 7. Fix twitter:title
    html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${pageTitle}" />`);

    // 8. Fix twitter:description
    html = html.replace(/<meta name="twitter:description"\s*\n?\s*content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${desc}" />`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${desc}" />`);

    // 9. Fix og:updated_time and article times
    html = html.replace(/<meta property="og:updated_time" content="[^"]*"\s*\/>/, `<meta property="og:updated_time" content="${today}T08:00:00+00:00" />`);
    html = html.replace(/<meta property="article:modified_time" content="[^"]*"\s*\/>/, `<meta property="article:modified_time" content="${today}T08:00:00+00:00" />`);

    // 10. Fix the main Rank Math JSON-LD schema block (WebPage and Article)
    const rankMathSchemaRegex = /<script type="application\/ld\+json"\s+class="rank-math-schema">([\s\S]*?)<\/script>/;
    const newRankMathSchema = buildRankMathSchema(service, pageUrl, pageTitle, desc, imageUrl);
    html = html.replace(rankMathSchemaRegex, `<script type="application/ld+json" class="rank-math-schema">${JSON.stringify(newRankMathSchema)}</script>`);

    // 11. Replace the inline FAQ + LocalBusiness schema block at bottom of body
    const bottomSchemaRegex = /<!-- Include Schema and Local FAQ JS handling -->\s*<script type="application\/ld\+json">[\s\S]*?<\\\/script>/;
    const newBottomSchema = buildBottomSchema(service, pageUrl);
    html = html.replace(bottomSchemaRegex, `<!-- Include Schema and Local FAQ JS handling -->\n    <script type="application/ld+json">\n        ${JSON.stringify(newBottomSchema, null, 2)}\n    <\\/script>`);

    // 12. Inject "What's Included" section and expanded FAQs
    html = injectRichContent(html, service);

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`FIXED: ${folderName}/index.html`);
}

function buildRankMathSchema(service, pageUrl, pageTitle, desc, imageUrl) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Place",
                "@id": `${BASE_URL}/#place`,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "1167 Hillsboro Mile",
                    "addressLocality": "Hillsboro Beach",
                    "addressRegion": "FL",
                    "postalCode": "33062",
                    "addressCountry": "United States"
                }
            },
            {
                "@type": ["LocalBusiness", "Organization"],
                "@id": `${BASE_URL}/#organization`,
                "name": "Tropishine Cleaning",
                "url": BASE_URL,
                "telephone": `+1 ${PHONE_DISPLAY}`,
                "priceRange": "$$",
                "areaServed": [
                    "Boca Raton, FL", "Deerfield Beach, FL", "Delray Beach, FL", "Boynton Beach, FL",
                    "Pompano Beach, FL", "Fort Lauderdale, FL", "Coral Springs, FL", "Parkland, FL",
                    "Coconut Creek, FL", "Margate, FL", "Lighthouse Point, FL", "Hillsboro Beach, FL",
                    "West Palm Beach, FL", "Palm Beach Gardens, FL", "Wellington, FL", "Lake Worth Beach, FL",
                    "Hollywood, FL", "Miramar, FL", "Pembroke Pines, FL", "Plantation, FL",
                    "Davie, FL", "Cooper City, FL", "Weston, FL", "Sunrise, FL", "Tamarac, FL",
                    "North Lauderdale, FL", "Oakland Park, FL", "Wilton Manors, FL", "Hallandale Beach, FL"
                ],
                "sameAs": [
                    "https://www.facebook.com/profile.php?id=61555255394351",
                    "https://www.instagram.com/tropishinecleaning",
                    "https://www.yelp.com/biz/tropishine-cleaning-hillsboro-beach"
                ],
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "1167 Hillsboro Mile",
                    "addressLocality": "Hillsboro Beach",
                    "addressRegion": "FL",
                    "postalCode": "33062",
                    "addressCountry": "United States"
                },
                "logo": {
                    "@type": "ImageObject",
                    "@id": `${BASE_URL}/#logo`,
                    "url": `${BASE_URL}/wp-content/uploads/2024/01/cropped-tropishine-logo-edited-png.png`,
                    "caption": "Tropishine Cleaning",
                    "inLanguage": "en-US",
                    "width": "421",
                    "height": "397"
                },
                "openingHours": ["Monday,Tuesday,Wednesday,Thursday,Friday,Saturday 09:00-17:00"],
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "128",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            },
            {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                "url": BASE_URL,
                "name": "Tropishine Cleaning",
                "alternateName": "Tropishine",
                "publisher": { "@id": `${BASE_URL}/#organization` },
                "inLanguage": "en-US"
            },
            {
                "@type": "WebPage",
                "@id": `${pageUrl}#webpage`,
                "url": pageUrl,
                "name": service.title + " in Boca Raton, FL | Tropishine Cleaning",
                "description": service.desc,
                "datePublished": "2025-04-13T02:54:15+00:00",
                "dateModified": `${today}T08:00:00+00:00`,
                "about": { "@id": `${BASE_URL}/#organization` },
                "isPartOf": { "@id": `${BASE_URL}/#website` },
                "inLanguage": "en-US",
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
                        { "@type": "ListItem", "position": 2, "name": "Services", "item": `${BASE_URL}/#services` },
                        { "@type": "ListItem", "position": 3, "name": service.title + " in Boca Raton", "item": pageUrl }
                    ]
                }
            },
            {
                "@type": "Service",
                "@id": `${pageUrl}#service`,
                "name": service.title + " in Boca Raton, FL",
                "description": service.desc,
                "provider": { "@id": `${BASE_URL}/#organization` },
                "areaServed": {
                    "@type": "City",
                    "name": "Boca Raton",
                    "containedInPlace": {
                        "@type": "State",
                        "name": "Florida"
                    }
                },
                "serviceType": service.title,
                "url": pageUrl
            }
        ]
    };
}

function buildBottomSchema(service, pageUrl) {
    return [
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": service.faqs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        },
        {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `${service.title} - Tropishine Cleaning`,
            "image": `${BASE_URL}/wp-content/uploads/2024/01/asian-cleaning-service-woman-worker-cleaning-in-li-2023-11-27-05-01-19-utc-1-1024x880.jpg`,
            "@id": `${BASE_URL}/#${service.id}`,
            "url": pageUrl,
            "telephone": PHONE,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Boca Raton",
                "addressRegion": "FL",
                "addressCountry": "US"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "128",
                "bestRating": "5"
            }
        }
    ];
}

function injectRichContent(html, service) {
    // Build "What's Included" HTML block
    const includedListItems = service.included.map(item =>
        `<li class="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
            <div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i>
            </div>
            <span class="text-zinc-700 font-medium">${item}</span>
        </li>`
    ).join('\n');

    const whatsIncludedSection = `
    <!-- WHAT'S INCLUDED SECTION -->
    <section class="py-12 md:py-20 bg-white" id="whats-included">
        <div class="max-w-4xl mx-auto px-6">
            <div class="text-center mb-10" data-aos="fade-up">
                <span class="text-sky-600 font-black tracking-[0.4em] uppercase text-[10px]">Transparent Service</span>
                <h2 class="text-3xl md:text-4xl font-black text-zinc-900 mt-3 mb-4">What's Included in Our ${service.title}</h2>
                <p class="text-zinc-500 font-medium max-w-2xl mx-auto">Every ${service.title} in Boca Raton includes the following as standard. No hidden extras, no surprises.</p>
            </div>
            <div class="bg-slate-50 rounded-3xl p-8 border border-slate-100" data-aos="fade-up" data-aos-delay="100">
                <ul class="space-y-0">
                    ${includedListItems}
                </ul>
                <div class="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p class="text-sm text-zinc-500 font-medium"><i data-lucide="shield-check" class="inline w-4 h-4 text-emerald-500 mr-1"></i> 100% satisfaction guaranteed on every Boca Raton ${service.title}</p>
                    <a href="tel:${PHONE}" class="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-sky-500 transition-all">
                        <i data-lucide="phone" class="w-4 h-4"></i> Get a Quote
                    </a>
                </div>
            </div>
        </div>
    </section>
    <!-- END WHAT'S INCLUDED SECTION -->`;

    // Build expanded FAQ HTML
    const expandedFaqItems = service.faqs.map((faq, i) =>
        `<div class="faq-accordion bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors" data-aos="fade-up" data-aos-delay="${i * 80}">
            <button class="faq-accordion-header w-full flex items-center justify-between p-6 text-left focus:outline-none group">
                <span class="font-bold text-zinc-900 text-[16px] group-hover:text-sky-600 transition-colors">${faq.q}</span>
                <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors flex-shrink-0">
                    <i data-lucide="chevron-down" class="chevron-icon w-5 h-5 text-sky-600"></i>
                </div>
            </button>
            <div class="faq-accordion-content px-6 pb-6 text-zinc-600 leading-relaxed font-medium hidden border-t border-slate-100 pt-4">${faq.a}</div>
        </div>`
    ).join('\n');

    // Replace the existing FAQ section with the expanded one
    const faqSectionRegex = /<!-- SEO FAQ Section -->[\s\S]*?<\/div>\s*<\/div>\s*\n\s*<!-- Dynamic Local SEO Google Map -->/;
    const newFaqSection = `<!-- SEO FAQ Section -->
            <div class="mt-24 max-w-3xl mx-auto border-t border-slate-200 pt-16">
                <div class="text-center mb-10" data-aos="fade-up">
                    <h3 class="text-3xl md:text-4xl font-black text-zinc-900 mb-3">Frequently Asked Questions</h3>
                    <p class="text-zinc-500 font-medium">${service.title} in Boca Raton — answers to what our customers ask most.</p>
                </div>
                <div class="space-y-4">
                    ${expandedFaqItems}
                </div>
            </div>

            <!-- Dynamic Local SEO Google Map -->`;

    if (faqSectionRegex.test(html)) {
        html = html.replace(faqSectionRegex, newFaqSection);
    }

    // Inject "What's Included" before the services carousel
    const carouselMarker = '<!-- ULTRA-MODERN INFINITY SERVICE CAROUSEL -->';
    if (html.includes(carouselMarker)) {
        html = html.replace(carouselMarker, whatsIncludedSection + '\n\n    ' + carouselMarker);
    }

    return html;
}

// Run fixes on all service pages
services.forEach(fixServicePage);

console.log('\n✅ All Boca Raton service pages patched successfully!');
console.log('   Fixed: OG tags, canonical URLs, JSON-LD schema, expanded FAQs, What\'s Included sections');
