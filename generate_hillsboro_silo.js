const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const indexHtmlPath = path.join(rootDir, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const siloPath = path.join(rootDir, 'hillsboro-beach');
if (!fs.existsSync(siloPath)) {
    fs.mkdirSync(siloPath);
}

// ============================================
// 1. GENERATE THE SILO HOMEPAGE (DEPTH: 1)
// ============================================

console.log("Generating Hillsboro Beach Hub Homepage...");
let hubHtml = indexHtml;

// Localize the SEO tags and headings to Hillsboro Beach
hubHtml = hubHtml.replace(/<title>.*?<\/title>/s, '<title>Cleaning Services in Hillsboro Beach, FL | Tropishine Cleaning</title>');
hubHtml = hubHtml.replace(/<meta name="description" content=".*?">/s, '<meta name="description" content="Tropishine cleaning is the highest rated home cleaning company, commercial cleaning company, and deep cleaning company in Hillsboro Beach, FL.">');
hubHtml = hubHtml.replace(/South Florida/g, "Hillsboro Beach");
hubHtml = hubHtml.replace(/Deerfield Beach/g, "Hillsboro Beach");
hubHtml = hubHtml.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="https://www.tropishinecleaning.com/hillsboro-beach/" />`);

// Fix Asset Paths for Depth 1 (../)
hubHtml = hubHtml.replace(/(src|href)="images\//g, '$1="../images/');
hubHtml = hubHtml.replace(/(src|href)="hero-vid\//g, '$1="../hero-vid/');

fs.writeFileSync(path.join(siloPath, 'index.html'), hubHtml, 'utf8');
console.log("Successfully generated /hillsboro-beach/index.html");

// ============================================
// 2. GENERATE SILO SERVICE PAGES (DEPTH: 2)
// ============================================

const services = [
    { id: "house-cleaning", title: "House Cleaning", img: "images/House cleaning.JPG" },
    { id: "recurring-house-cleaning", title: "Recurring House Cleaning", img: "images/recurring_house_cleaning.png" },
    { id: "post-construction-cleaning", title: "Post-construction Cleaning", img: "images/Post construction.JPG" },
    { id: "commercial-cleaning", title: "Commercial Cleaning", img: "images/janitorial_commercial.JPG" },
    { id: "janitorial-cleaning", title: "Janitorial Cleaning", img: "images/janitorial_cleaning.png" },
    { id: "day-porter-service", title: "Day Porter Service", img: "images/day_porter_service.png" },
    { id: "airbnb-cleaning", title: "Airbnb Cleaning", img: "images/Airbnb.JPG" },
    { id: "short-term-rental-cleaning", title: "Short Term Rental Cleaning", img: "images/short term rental.JPG" },
    { id: "deep-cleaning", title: "Deep Cleaning", img: "images/deep cleaning.JPG" },
    { id: "move-in-move-out-cleaning", title: "Move In Move Out Cleaning", img: "images/move_in_move_out_cleaning_pro.png" },
    { id: "strip-and-wax-floor-care", title: "Strip & Wax Floor Care", img: "images/Strip & Wax service.JPG" },
    { id: "carpet-cleaning", title: "Carpet Cleaning", img: "images/carpet_cleaning_pro.png" },
    { id: "air-duct-cleaning", title: "Air Duct Cleaning", img: "images/Air duct cleaning.jpeg.png" },
    { id: "window-cleaning", title: "Window Cleaning", img: "images/Window cleaning.jpg" },
    { id: "restaurant-cleaning", title: "Restaurant Cleaning", img: "images/Restaurant cleaning.jpg" },
    { id: "garage-cleaning", title: "Garage Cleaning", img: "images/Garage cleaning.jpg" },
    { id: "office-cleaning", title: "Office Cleaning", img: "images/office cleaning.JPG" },
    { id: "medical-office-cleaning", title: "Medical Office Cleaning", img: "images/medical office cleaning.JPG" },
    { id: "kitchen-exhaust-cleaning", title: "Kitchen Exhaust Cleaning", img: "images/Kitchen exhaust cleaning.jpg" },
    { id: "heavy-duty-deep-cleaning", title: "Heavy Duty Deep Cleaning", img: "images/deep clean.JPG" },
    { id: "post-fumigation-cleaning", title: "Post Fumigation Cleaning", img: "images/post fumigation .JPG" }
];

const spintax = {
    intros: [
        "Welcome to Tropishine, Hillsboro Beach's leading provider of {service}.",
        "Looking for the best {service} in Hillsboro Beach? You've found the right team.",
        "Tropishine offers premium {service} for homes and businesses throughout Hillsboro Beach.",
        "Experience the highest standard of {service} in Hillsboro Beach with Tropishine.",
        "When it comes to top-rated {service} in Hillsboro Beach, Tropishine Cleaning is the absolute standard.",
        "Elevate your environment with Hillsboro Beach's unrivaled {service} specialists at Tropishine.",
        "Your search for meticulous, highly-rated {service} in Hillsboro Beach ends here with Tropishine.",
        "Discover exactly why local residents and businesses consistently choose Tropishine for their {service} needs in Hillsboro Beach."
    ],
    middles: [
        "Our highly trained professionals use industry-leading equipment and eco-friendly products to ensure your property remains pristine.",
        "We understand the unique needs of Hillsboro Beach properties and tailor our approach to deliver unmatched results.",
        "With a strong commitment to quality and customer satisfaction, we guarantee a spotless and healthy environment.",
        "From meticulous attention to detail to reliable scheduling, our team is dedicated to exceeding your expectations.",
        "We leverage cutting-edge techniques alongside verified green solutions to protect both your property and the environment.",
        "Our fully vetted Hillsboro Beach crew handles every aspect of the job with precision, allowing you to relax and enjoy the flawless outcome.",
        "By focusing on the finest details, we consistently achieve a level of cleanliness that completely transforms your living or working area.",
        "Whether it's a one-time project or ongoing maintenance, our systematic workflow guarantees consistent, 5-star perfection."
    ],
    outros: [
        "Ready to transform your space? Contact us today to schedule your {service} in Hillsboro Beach.",
        "Don't settle for less. Give your property the care it deserves with our professional {service}.",
        "Reach out now for a free estimate and discover why Hillsboro Beach trusts Tropishine.",
        "Book your appointment today and experience the Tropishine difference firsthand.",
        "Call us or book online instantly to secure your preferred {service} slot in Hillsboro Beach.",
        "Upgrade your property's cleanliness standard today. Connect with our Hillsboro Beach experts immediately.",
        "Take the first step toward a completely refreshed environment by requesting your custom {service} quote now.",
        "Experience our award-winning dedication. Schedule your {service} assessment today!"
    ],
    faqs: [
        [
            {q: "Why choose Tropishine for {service} in Hillsboro Beach?", a: "Tropishine offers top-tier {service} with highly trained professionals and eco-friendly solutions tailored to Hillsboro Beach properties."},
            {q: "Are your {service} professionals verified?", a: "Yes, every member of our team is fully licensed, insured, and thoroughly vetted to ensure your peace of mind and the safety of your property."},
            {q: "How do I schedule a {service}?", a: "You can easily schedule your {service} by calling our Hillsboro Beach hotline or filling out an online request form. We offer flexible scheduling to meet your needs."}
        ],
        [
            {q: "What makes your {service} different?", a: "Our meticulous attention to detail and commitment to using advanced, eco-friendly cleaning technology sets our {service} apart in the Hillsboro Beach area."},
            {q: "Do I need to provide supplies for the {service}?", a: "No, Tropishine brings all necessary premium supplies and modern equipment required for comprehensive {service}."},
            {q: "Do you offer satisfaction guarantees?", a: "Absolutely. We stand behind our {service} quality. If you are not completely satisfied, we work to make it right."}
        ]
    ]
};

function extractSection(html, startMarker, endMarker) {
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) {
        console.warn(`Start marker not found: ${startMarker}`);
        return '';
    }
    let content;
    if (endMarker) {
         const endIndex = html.indexOf(endMarker, startIndex);
         if (endIndex === -1) {
             console.warn(`End marker not found: ${endMarker}`);
             return '';
         }
         content = html.slice(startIndex, endIndex);
    } else {
         content = html.slice(startIndex);
    }
    return content;
}

// Extract base UI sections from index.html
const headAndNav = extractSection(indexHtml, '<!DOCTYPE html>', '<!-- HERO - NEVER SEEN BEFORE -->');
const servicesSection = extractSection(indexHtml, '<!-- ULTRA-MODERN INFINITY SERVICE CAROUSEL -->', '<!-- NEXT-GEN ULTRA-MODERN NEIGHBORHOOD HUB -->');
const reviewsSection = extractSection(indexHtml, '<!-- TESTIMONIALS -->', '<!-- LOCATIONS AND MAP SECTION -->');
const footerSection = extractSection(indexHtml, '<!-- LOCATIONS AND MAP SECTION -->', '</html>') + '</html>';

// Function to get random item
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

console.log("Generating Hillsboro Beach Services Silo...");

services.forEach(service => {
    const folderPath = path.join(siloPath, service.id);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const titleStr = `${service.title} in Hillsboro Beach | Tropishine Cleaning`;
    const descStr = `Book premium ${service.title.toLowerCase()} in Hillsboro Beach. Tropishine Cleaning delivers eco-friendly, highly-rated cleaning services across South Florida.`;

    const intro = getRandom(spintax.intros).replace(/\{service\}/g, service.title);
    const middle = getRandom(spintax.middles).replace(/\{service\}/g, service.title.toLowerCase());
    const outroText = getRandom(spintax.outros).replace(/\{service\}/g, service.title.toLowerCase());
    const serviceFaqs = getRandom(spintax.faqs).map(faq => ({
        q: faq.q.replace(/\{service\}/g, service.title),
        a: faq.a.replace(/\{service\}/g, service.title.toLowerCase())
    }));

    const heroContent = `
    <!-- ENHANCED PARALLAX SERVICE HERO -->
    <div class="relative min-h-[70vh] flex items-center pt-24 pb-16 overflow-hidden">
        <!-- V3 Dynamic Floating Background Elements -->
        <div class="absolute inset-0 z-0">
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
            <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
            <div class="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
        </div>

        <div class="absolute inset-0 z-0 bg-zinc-900">
            <img src="../../${service.img}" alt="${service.title} Background" class="w-full h-full object-cover opacity-30 select-none pointer-events-none transform scale-105 transition-transform duration-[20s] ease-out hover:scale-110" data-aos="zoom-out" data-aos-duration="3000">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-sky-900/50 to-transparent"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-6 w-full mt-10">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div data-aos="fade-right" data-aos-duration="1000">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-6 transform hover:scale-105 transition-transform cursor-pointer">
                        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span class="text-sm font-semibold tracking-wide uppercase">Top Rated in Hillsboro Beach</span>
                    </div>
                    
                    <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 font-heading">
                        Expert <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">${service.title}</span><br/> in Hillsboro Beach
                    </h1>
                    
                    <p class="text-xl text-zinc-300 mb-8 max-w-lg leading-relaxed border-l-4 border-sky-500 pl-4">
                        ${intro}
                    </p>

                    <!-- V3 Rotating Deliverables Ticker -->
                    <div class="h-12 overflow-hidden relative mb-8">
                        <div class="animate-text-slide absolute top-0 left-0 text-sky-400 font-bold text-xl tracking-wide flex flex-col gap-4">
                            <span>Vetted Professionals</span>
                            <span>Eco-Friendly Products</span>
                            <span>100% Satisfaction Guarantee</span>
                            <span>Custom ${service.title} Plans</span>
                            <span>Vetted Professionals</span>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4">
                        <a href="tel:9544207218" class="group relative px-8 py-4 bg-sky-500 text-white font-bold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(14,165,233,0.4)] block w-max">
                            <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            <span class="relative flex items-center gap-2">
                                <i class="fa-solid fa-phone"></i> Call Now
                            </span>
                        </a>
                        <a href="#services-tier" class="group px-8 py-4 bg-white/10 text-white font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-105 flex items-center gap-2">
                            Explore Services <i class="fa-solid fa-arrow-down group-hover:translate-y-1 transition-transform"></i>
                        </a>
                    </div>
                </div>

                <!-- Bento Style Quality Grid -->
                <div class="hidden lg:grid grid-cols-2 gap-4" data-aos="fade-left" data-aos-duration="1200">
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl col-span-2 transform hover:-translate-y-2 transition-transform duration-300">
                        <div class="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mb-4 text-white text-xl">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <h3 class="text-white font-bold text-xl mb-2">Bulletproof Quality</h3>
                        <p class="text-zinc-300 text-sm">We don't leave until it's perfectly spotless.</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl transform hover:-translate-y-2 transition-transform duration-300">
                        <div class="text-sky-400 text-3xl mb-3"><i class="fa-solid fa-leaf"></i></div>
                        <h3 class="text-white font-bold mb-1">Eco Safe</h3>
                        <p class="text-zinc-400 text-xs">Pet & child safe solutions.</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl transform hover:-translate-y-2 transition-transform duration-300">
                        <div class="text-sky-400 text-3xl mb-3"><i class="fa-solid fa-clock"></i></div>
                        <h3 class="text-white font-bold mb-1">On Time</h3>
                        <p class="text-zinc-400 text-xs">Reliable scheduling.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- INFINITE V3 BADGE MARQUEE -->
    <div class="bg-sky-600 text-white py-3 border-y border-sky-400/30 overflow-hidden relative shadow-[0_0_20px_rgba(2,132,199,0.5)]">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] z-0"></div>
        <div class="flex whitespace-nowrap animate-marquee relative z-10">
            <div class="flex items-center gap-12 font-bold tracking-widest text-sm uppercase px-6">
                <span class="flex items-center gap-2"><i class="fa-solid fa-star text-yellow-300"></i> Local Experts</span>
                <span>•</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-certificate text-blue-200"></i> Licensed & Insured</span>
                <span>•</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-shield-heart text-pink-300"></i> Satisfaction Guaranteed</span>
                <span>•</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-house-chimney-window text-emerald-300"></i> Move In/Out Ready</span>
                <span>•</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-star text-yellow-300"></i> Local Experts</span>
                <span>•</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-certificate text-blue-200"></i> Licensed & Insured</span>
                <span>•</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-shield-heart text-pink-300"></i> Satisfaction Guaranteed</span>
                <span>•</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-house-chimney-window text-emerald-300"></i> Move In/Out Ready</span>
            </div>
        </div>
    </div>
    `;

    const bodyContent = `
    <!-- MAIN CONTENT MODULE -->
    <section class="py-24 bg-white relative overflow-hidden">
        <!-- Abstract decorations -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
        
        <div class="max-w-4xl mx-auto px-6 relative z-10">
            <div class="text-center mb-16" data-aos="fade-up">
                <span class="text-sky-500 font-bold tracking-wider uppercase text-sm mb-3 block">Premium Service</span>
                <h2 class="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 font-heading">
                    The Best <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">${service.title}</span><br/> in Hillsboro Beach
                </h2>
                <div class="w-24 h-1.5 bg-sky-500 mx-auto rounded-full mb-8"></div>
                <p class="text-xl text-zinc-600 leading-relaxed border-x-4 border-sky-100 px-6 py-2 rounded-xl bg-slate-50 shadow-sm">
                    ${middle}
                </p>
            </div>

            <!-- Enhanced Process Timeline -->
            <div class="mt-20">
                <h3 class="text-3xl font-bold text-center mb-12 font-heading">Our Hillsboro Beach Process</h3>
                <div class="relative border-l-4 border-sky-100 ml-6 md:ml-0 md:border-l-0 md:border-t-4 md:flex md:justify-between pt-10 md:pt-0">
                    
                    <div class="mb-10 md:mb-0 relative pl-8 md:pl-0 md:pt-8 md:w-1/3 md:text-center group" data-aos="fade-up" data-aos-delay="100">
                        <div class="absolute -left-[22px] md:-top-[22px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-sky-500 flex items-center justify-center font-bold text-sky-500 z-10 shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-colors group-hover:bg-sky-500 group-hover:text-white">1</div>
                        <h4 class="text-xl font-bold text-zinc-900 mb-2">Schedule</h4>
                        <p class="text-zinc-600 text-sm">Book your ${service.title} appointment online or give us a call.</p>
                    </div>

                    <div class="mb-10 md:mb-0 relative pl-8 md:pl-0 md:pt-8 md:w-1/3 md:text-center group" data-aos="fade-up" data-aos-delay="200">
                        <div class="absolute -left-[22px] md:-top-[22px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-sky-500 flex items-center justify-center font-bold text-sky-500 z-10 shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-colors group-hover:bg-sky-500 group-hover:text-white">2</div>
                        <h4 class="text-xl font-bold text-zinc-900 mb-2">We Clean</h4>
                        <p class="text-zinc-600 text-sm">Our Hillsboro Beach crew arrives on time with premium equipment.</p>
                    </div>

                    <div class="relative pl-8 md:pl-0 md:pt-8 md:w-1/3 md:text-center group" data-aos="fade-up" data-aos-delay="300">
                        <div class="absolute -left-[22px] md:-top-[22px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-white border-4 border-sky-500 flex items-center justify-center font-bold text-sky-500 z-10 shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-colors group-hover:bg-sky-500 group-hover:text-white">3</div>
                        <h4 class="text-xl font-bold text-zinc-900 mb-2">You Relax</h4>
                        <p class="text-zinc-600 text-sm">Enjoy your newly refreshed and spotless property.</p>
                    </div>

                </div>
            </div>

            <!-- CTA Block -->
            <div class="mt-20 bg-gradient-to-br from-sky-900 to-blue-900 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden" data-aos="zoom-in" data-vanilla-tilt>
                <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div class="relative z-10">
                    <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">${service.title} Done Right.</h3>
                    <p class="text-sky-100 mb-8 max-w-2xl mx-auto text-lg">${outroText}</p>
                    <a href="tel:9544207218" class="inline-block px-10 py-5 bg-white text-sky-900 font-bold rounded-xl hover:bg-zinc-100 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] font-heading text-lg">
                        Get Your Free Estimate
                    </a>
                </div>
            </div>

            <!-- FAQs -->
            <div class="mt-24 max-w-3xl mx-auto">
                <div class="text-center mb-10">
                    <i class="fa-solid fa-clipboard-question text-4xl text-sky-500 mb-4 opacity-50"></i>
                    <h3 class="text-3xl font-bold text-zinc-900 font-heading">Frequently Asked Questions</h3>
                </div>
                <div class="space-y-4">
                    ${serviceFaqs.map(faq => `
                    <div class="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow faq-accordion-container" data-aos="fade-up">
                        <button class="w-full text-left px-6 py-5 font-bold text-zinc-900 flex justify-between items-center focus:outline-none faq-accordion-header">
                            <span class="pr-8">${faq.q}</span>
                            <span class="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 transition-colors">
                                <i class="fa-solid fa-chevron-down chevron-icon transition-transform"></i>
                            </span>
                        </button>
                        <div class="px-6 pb-5 text-zinc-600 hidden faq-accordion-content border-t border-zinc-50 pt-4">
                            ${faq.a}
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <!-- Custom Scripts for specific logic -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Vanilla Accordion Logic
            const accordions = document.querySelectorAll('.faq-accordion-container');
            accordions.forEach(acc => {
                const header = acc.querySelector('.faq-accordion-header');
                const content = acc.querySelector('.faq-accordion-content');
                
                header.addEventListener('click', () => {
                    // Close others
                    accordions.forEach(other => {
                        if (other !== acc) {
                            other.querySelector('.faq-accordion-content').classList.add('hidden');
                            other.querySelector('.chevron-icon').style.transform = 'rotate(0deg)';
                        }
                    });

                    // Toggle current
                    const icon = header.querySelector('.chevron-icon');
                    
                    if (content.classList.contains('hidden')) {
                        content.classList.remove('hidden');
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        content.classList.add('hidden');
                        icon.style.transform = 'rotate(0deg)';
                    }
                });
            });
        });
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js"></script>
    `;

    let finalHtml = headAndNav + heroContent + bodyContent + servicesSection + reviewsSection + footerSection;

    // VERY IMPORTANT: Depth Calculation Fix for Silo structure (Depth 2: ../../)
    finalHtml = finalHtml.replace(/(src|href)="images\//g, '$1="../../images/');
    finalHtml = finalHtml.replace(/(src|href)="hero-vid\//g, '$1="../../hero-vid/');
    finalHtml = finalHtml.replace(/(src|href)="\.\.\/images\//g, '$1="../../images/'); // Clean up base replacements
    finalHtml = finalHtml.replace(/(src|href)="\.\.\/hero-vid\//g, '$1="../../hero-vid/'); // Clean up base replacements

    // Fix absolute domains pointing to index (to domain root instead)
    finalHtml = finalHtml.replace(/href="index\.html"/g, 'href="https://www.tropishinecleaning.com/"');
    
    // Form iFrame fix just in case
    finalHtml = finalHtml.replace(/<script src="https:\/\/widgets\.leadconnectorhq\.com\/loader\.js" data-resources-url="https:\/\/widgets\.leadconnectorhq\.com\/chat-widget\/loader\.js"><\/script>/g, '<script src="https://widgets.leadconnectorhq.com/loader.js" data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"></script>');

    // Replace SEO tags
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/s, `<title>${titleStr}</title>`);
    finalHtml = finalHtml.replace(/<meta name="description" content=".*?">/s, `<meta name="description" content="${descStr}">`);
    
    // Inject correct UNIQUE Canonical to prevent duplicate content penalty
    finalHtml = finalHtml.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="https://www.tropishinecleaning.com/hillsboro-beach/${service.id}/" />`);
    
    // Replace schema script for business name
    finalHtml = finalHtml.replace(/"name":"Tropishine Cleaning"/g, `"name":"${service.title} Hillsboro Beach - Tropishine Cleaning"`);

    const outputPath = path.join(folderPath, 'index.html');
    fs.writeFileSync(outputPath, finalHtml);
    console.log("Generated /hillsboro-beach/" + service.id + "/index.html");
});

// ============================================
// 3. GENERATE SILO CORE PAGES (DEPTH: 2)
// ============================================

const corePages = [
    { slug: 'about-us', title: 'About Tropishine Hillsboro Beach', desc: 'Learn about our meticulous cleaning process and our commitment to Hillsboro Beach.' },
    { slug: 'gallery', title: 'Hillsboro Beach Cleaning Gallery', desc: 'View our flawless cleaning results across Hillsboro Beach.' },
    { slug: 'blog', title: 'Hillsboro Beach Cleaning Blog', desc: 'Latest tips, tricks, and cleaning news for Hillsboro Beach properties.' }
];

corePages.forEach(page => {
    const pagePath = path.join(siloPath, page.slug);
    if (!fs.existsSync(pagePath)) {
        fs.mkdirSync(pagePath, { recursive: true });
    }

    let coreHtml = hubHtml; // Use the Hillsboro Hub HTML as a base
    
    // Remove Hero and Form, inject custom body based on slug
    coreHtml = coreHtml.replace(/<!-- HERO - NEVER SEEN BEFORE -->.*?<!-- ULTRA-MODERN INFINITY SERVICE CAROUSEL -->/s, `<!-- CORE CONTENT -->${getCoreContent(page.slug)}<!-- ULTRA-MODERN INFINITY SERVICE CAROUSEL -->`);
    
    // Fix Asset Paths for Depth 2
    coreHtml = coreHtml.replace(/(src|href)="\.\.\/images\//g, '$1="../../images/');
    coreHtml = coreHtml.replace(/(src|href)="\.\.\/hero-vid\//g, '$1="../../hero-vid/');

    // Fix SEO Tags
    coreHtml = coreHtml.replace(/<title>.*?<\/title>/s, `<title>${page.title} - Tropishine Cleaning</title>`);
    coreHtml = coreHtml.replace(/<meta name="description" content=".*?">/s, `<meta name="description" content="${page.desc}">`);
    
    coreHtml = coreHtml.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="https://www.tropishinecleaning.com/hillsboro-beach/${page.slug}/" />`);
    
    fs.writeFileSync(path.join(pagePath, 'index.html'), coreHtml, 'utf8');
    console.log(`Generated /hillsboro-beach/${page.slug}/index.html`);
});

console.log('All Hillsboro Beach Silo pages generated successfully!');

// Core Content Helper Function
function getCoreContent(slug) {
    if (slug === 'about-us') {
        return `
        <div class="pt-32 pb-20 bg-gradient-to-b from-sky-50 to-white relative overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 relative z-10">
                <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
                    <h1 class="text-5xl font-bold text-zinc-900 mb-6 font-heading">About Tropishine <span class="text-sky-500">Hillsboro Beach</span></h1>
                    <p class="text-xl text-zinc-600">We are South Florida's premier cleaning service, dedicated to bringing unparalleled cleanliness and shine to your Hillsboro Beach properties.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="100">
                    <div class="bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 hover:shadow-xl transition-shadow text-center">
                        <div class="w-16 h-16 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-6"><i class="fa-solid fa-bullseye"></i></div>
                        <h3 class="text-2xl font-bold mb-4">Our Mission</h3>
                        <p class="text-zinc-600">To elevate the standard of living and working environments in Hillsboro Beach through exceptional, reliable, and eco-friendly cleaning services.</p>
                    </div>
                    <div class="bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 hover:shadow-xl transition-shadow text-center md:-translate-y-4">
                        <div class="w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center mx-auto text-3xl mb-6"><i class="fa-solid fa-gem"></i></div>
                        <h3 class="text-2xl font-bold mb-4">Our Values</h3>
                        <p class="text-zinc-600">Integrity, attention to detail, and a relentless commitment to customer satisfaction drive every wipe, sweep, and scrub we perform.</p>
                    </div>
                    <div class="bg-white p-8 rounded-3xl shadow-lg border border-zinc-100 hover:shadow-xl transition-shadow text-center">
                        <div class="w-16 h-16 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center mx-auto text-3xl mb-6"><i class="fa-solid fa-eye"></i></div>
                        <h3 class="text-2xl font-bold mb-4">Our Vision</h3>
                        <p class="text-zinc-600">To be the most trusted and sought-after cleaning partner in Hillsboro Beach, known for transforming spaces and improving lives.</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else if (slug === 'gallery') {
        return `
        <div class="pt-32 pb-20 bg-zinc-50 relative overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 relative z-10">
                <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
                    <h1 class="text-5xl font-bold text-zinc-900 mb-6 font-heading">Our <span class="text-sky-500">Hillsboro Beach</span> Gallery</h1>
                    <p class="text-xl text-zinc-600">A visual showcase of the pristine results we deliver to homes and businesses across Hillsboro Beach.</p>
                </div>
                
                <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    <div class="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"><img src="../../images/deep cleaning.JPG" class="w-full h-auto" alt="Cleaning Example"></div>
                    <div class="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"><img src="../../images/House cleaning.JPG" class="w-full h-auto" alt="Cleaning Example"></div>
                    <div class="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"><img src="../../images/janitorial_commercial.JPG" class="w-full h-auto" alt="Cleaning Example"></div>
                    <div class="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"><img src="../../images/office cleaning.JPG" class="w-full h-auto" alt="Cleaning Example"></div>
                    <div class="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"><img src="../../images/Airbnb.JPG" class="w-full h-auto" alt="Cleaning Example"></div>
                </div>
            </div>
        </div>
        `;
    } else if (slug === 'blog') {
        return `
        <div class="pt-32 pb-20 bg-white relative overflow-hidden">
            <div class="max-w-7xl mx-auto px-6 relative z-10">
                <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
                    <h1 class="text-5xl font-bold text-zinc-900 mb-6 font-heading">Tropishine <span class="text-sky-500">Insights</span></h1>
                    <p class="text-xl text-zinc-600">The latest cleaning tips, company news, and local Hillsboro Beach updates.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Blog Post 1 -->
                    <div class="bg-white rounded-3xl overflow-hidden shadow-lg border border-zinc-100 hover:shadow-xl transition-all group cursor-pointer" data-aos="fade-up">
                        <div class="h-48 overflow-hidden relative">
                            <img src="../../images/House cleaning.JPG" alt="Blog Image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                            <div class="absolute top-4 left-4 bg-sky-500 text-white text-xs font-bold px-3 py-1 rounded-full">Tips & Tricks</div>
                        </div>
                        <div class="p-6">
                            <p class="text-zinc-400 text-sm mb-2"><i class="fa-regular fa-calendar-alt mr-2"></i>Oct 15, 2025</p>
                            <h3 class="text-xl font-bold text-zinc-900 mb-3 group-hover:text-sky-500 transition-colors">How to Maintain a Coastal Home in Hillsboro Beach</h3>
                            <p class="text-zinc-600 mb-4 line-clamp-3">Living by the ocean is beautiful, but salt and moisture bring unique cleaning challenges. Here are our top tips for coastal properties...</p>
                            <span class="text-sky-500 font-bold flex items-center gap-2">Read Article <i class="fa-solid fa-arrow-right text-sm"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}
