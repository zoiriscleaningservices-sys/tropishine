const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

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

// 1. Extract Head and Nav
const headAndNav = extractSection(indexHtml, '<!DOCTYPE html>', '<!-- HERO - NEVER SEEN BEFORE -->');

// 2. Extract Services Carousel
const servicesSection = extractSection(indexHtml, '<!-- ULTRA-MODERN INFINITY SERVICE CAROUSEL -->', '<!-- NEXT-GEN ULTRA-MODERN NEIGHBORHOOD HUB -->');

// 3. Extract Reviews
const reviewsSection = extractSection(indexHtml, '<!-- TESTIMONIALS -->', '<!-- LOCATIONS AND MAP SECTION -->');

// 4. Extract CTA / Footer
const footerSection = extractSection(indexHtml, '<!-- LOCATIONS AND MAP SECTION -->', '</html>') + '</html>';

if (!headAndNav || !servicesSection || !reviewsSection || !footerSection) {
    console.error("Missing a critical section! Please check the HTML markers.");
    process.exit(1);
}

// Generate pages
services.forEach(service => {
    const folderName = service.id;
    const folderPath = path.join(__dirname, "hillsboro-beach", folderName);
    
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const titleStr = `${service.title} in Hillsboro Beach | Tropishine Cleaning`;
    const descStr = `Professional ${service.title} services in Hillsboro Beach. Tropishine offers premium, eco-friendly cleaning tailored to your needs.`;
    
    const intro = spintax.intros[getRandomInt(spintax.intros.length)].replace(/{service}/g, service.title);
    const middle = spintax.middles[getRandomInt(spintax.middles.length)].replace(/{service}/g, service.title);
    const outro = spintax.outros[getRandomInt(spintax.outros.length)].replace(/{service}/g, service.title);
    
    const selectedFaqs = spintax.faqs[getRandomInt(spintax.faqs.length)];
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": selectedFaqs.map(faq => ({
            "@type": "Question",
            "name": faq.q.replace(/{service}/g, service.title),
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a.replace(/{service}/g, service.title)
            }
        }))
    };

    // Build the custom Hero Section
    const heroContent = `
    <style>
        body { overflow-x: hidden; }

        @keyframes text-slide {
            0%, 20% { transform: translateY(0); }
            25%, 45% { transform: translateY(-20%); }
            50%, 70% { transform: translateY(-40%); }
            75%, 95% { transform: translateY(-60%); }
            100% { transform: translateY(-80%); }
        }
        .animate-text-slide {
            animation: text-slide 8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        
        @keyframes float-rotate {
            0% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-30px) rotate(15deg) scale(1.05); }
            100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        .animate-float-rotate {
            animation: float-rotate 10s ease-in-out infinite;
        }
        
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
        }
    </style>
    <section class="relative pt-32 pb-24 md:pt-48 md:pb-36 overflow-hidden bg-zinc-950 min-h-[75vh] flex items-center">

        <!-- Background Image with Parallax and Zoom -->
        <div class="absolute inset-0 z-0" data-aos="zoom-out" data-aos-duration="2500">
            <img src="../../${service.img}" alt="${service.title} in Hillsboro Beach" class="w-full h-full object-cover opacity-[0.8] mix-blend-overlay">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-900/40"></div>
            <div class="absolute inset-0 bg-sky-900/20 mix-blend-overlay"></div>
        </div>
        
        <div class="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
            <div data-aos="fade-down" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500/10 border border-sky-400/20 backdrop-blur-md mb-8 shadow-lg shadow-sky-500/10">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                <span class="text-xs font-black text-sky-100 uppercase tracking-[0.2em]">${service.title} Specialists</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-tight" data-aos="fade-up" data-aos-delay="100">
                ${service.title} <br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-sky-400 bg-300% animate-gradient">Hillsboro Beach</span>
            </h1>
            
            <div class="text-lg md:text-2xl text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed mb-16" data-aos="fade-up" data-aos-delay="200">
                <span class="block mb-6 text-xl text-zinc-400">${descStr}</span>
                <span class="inline-flex flex-wrap justify-center items-center gap-3 font-black text-sky-400 text-xl md:text-3xl bg-sky-950/40 px-6 py-4 rounded-3xl border border-sky-800/50 backdrop-blur-md shadow-2xl shadow-sky-900/20">
                    <span class="text-zinc-300">We Deliver</span>
                    <span class="relative inline-block w-[220px] md:w-[280px] h-[40px] md:h-[44px] overflow-hidden align-middle text-left text-sky-200">
                        <span class="absolute top-0 left-0 w-full animate-text-slide flex flex-col">
                            <span class="h-[40px] md:h-[44px] flex items-center truncate">Flawless ${service.title}</span>
                            <span class="h-[40px] md:h-[44px] flex items-center truncate">Eco-Friendly Solutions</span>
                            <span class="h-[40px] md:h-[44px] flex items-center truncate">Detailed Perfection</span>
                            <span class="h-[40px] md:h-[44px] flex items-center truncate">Spotless Results</span>
                            <span class="h-[40px] md:h-[44px] flex items-center truncate">Flawless ${service.title}</span> <!-- duplicate for seamless loop -->
                        </span>
                    </span>
                </span>
            </div>
            
            <div data-aos="fade-up" data-aos-delay="300" class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="tel:9545300508" class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-sky-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-sky-500 transition-all shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)] transform hover:-translate-y-1">
                    <i data-lucide="phone" class="w-5 h-5"></i> Call Now
                </a>
                <a href="#details" class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white backdrop-blur-md border border-white/10 font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all text-white">
                    Discover More <i data-lucide="arrow-down" class="w-4 h-4"></i>
                </a>
            </div>
        </div>
        
        <!-- Floating Abstract Hero Shapes -->
        <div class="absolute top-1/4 left-10 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl animate-float-rotate pointer-events-none" style="animation-delay: 0s;"></div>
        <div class="absolute bottom-1/4 right-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-[40px] animate-float-rotate pointer-events-none" style="animation-duration: 12s;"></div>

        <!-- Infinite Scrolling Ticker Divider -->
        <div class="absolute bottom-0 left-0 w-full bg-zinc-900/95 backdrop-blur-xl border-t border-sky-500/20 overflow-hidden z-20 py-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div class="flex whitespace-nowrap animate-marquee w-max">
                <div class="flex items-center gap-12 px-6 text-sky-400 font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs">
                    <span><i data-lucide="star" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> Tropishine Original Quality</span>
                    <span><i data-lucide="shield-check" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> Fully Licensed & Insured</span>
                    <span><i data-lucide="leaf" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> Eco-Friendly Solutions</span>
                    <span><i data-lucide="clock" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> On-Time Execution</span>
                    <span><i data-lucide="award" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> Premium Guaranteed</span>
                    <!-- Duplicate for infinite loop -->
                    <span><i data-lucide="star" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> Tropishine Original Quality</span>
                    <span><i data-lucide="shield-check" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> Fully Licensed & Insured</span>
                    <span><i data-lucide="leaf" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> Eco-Friendly Solutions</span>
                    <span><i data-lucide="clock" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> On-Time Execution</span>
                    <span><i data-lucide="award" class="inline w-4 h-4 mr-2 pb-0.5 text-emerald-400"></i> Premium Guaranteed</span>
                </div>
            </div>
        </div>
    </section>
    `;

    const bodyContent = `
    <!-- Details Section -->
    <section id="details" class="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
        <!-- Floating Background Elements for Details -->
        <div class="absolute top-20 right-[-5%] w-64 h-64 bg-sky-200/40 rounded-full blur-3xl animate-float-rotate pointer-events-none" style="animation-duration: 20s;"></div>
        <div class="absolute bottom-40 left-[-5%] w-96 h-96 bg-indigo-200/30 rounded-full blur-[80px] animate-float-rotate pointer-events-none" style="animation-duration: 25s; animation-delay: -5s;"></div>

        <div class="max-w-6xl mx-auto px-6 relative z-10">
            
            <!-- SEO Text Header -->
            <div class="text-center max-w-3xl mx-auto mb-20" data-aos="fade-up">
                <h2 class="text-4xl md:text-5xl font-black text-zinc-900 mb-6">${service.title} in Hillsboro Beach</h2>
                <div class="w-24 h-1 bg-sky-500 mx-auto rounded-full mb-8"></div>
                <p class="text-xl text-zinc-600 leading-relaxed font-medium">${intro}</p>
            </div>

            <!-- Modern Bento Grid for Benefits (With 3D Tilt) -->
            <div class="grid md:grid-cols-3 gap-6 mb-24 relative z-10">
                <div class="md:col-span-2 bg-white rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 transition-transform duration-500" data-aos="fade-up" data-aos-delay="0" data-tilt data-tilt-max="5" data-tilt-speed="400" data-tilt-glare="true" data-tilt-max-glare="0.2">
                    <div class="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 border border-sky-100">
                        <i data-lucide="sparkles" class="w-7 h-7 text-sky-600"></i>
                    </div>
                    <h3 class="text-2xl font-black text-zinc-900 mb-4">Unmatched Quality</h3>
                    <p class="text-zinc-600 leading-relaxed">${middle}</p>
                </div>
                
                <div class="bg-gradient-to-br from-sky-500 to-sky-700 rounded-3xl p-8 shadow-2xl shadow-sky-900/20 relative overflow-hidden text-white transition-transform duration-500" data-aos="fade-up" data-aos-delay="100" data-tilt data-tilt-max="10" data-tilt-speed="400" data-tilt-glare="true" data-tilt-max-glare="0.4">
                    <div class="absolute -top-10 -right-10 opacity-10">
                        <i data-lucide="shield-check" class="w-48 h-48"></i>
                    </div>
                    <div class="relative z-10">
                        <h3 class="text-2xl font-black mb-4">100% Guaranteed</h3>
                        <p class="text-sky-50 mb-6">Licensed, insured, and deeply committed to Hillsboro Beach property standards.</p>
                        <ul class="space-y-3 font-bold text-sm border-t border-white/20 pt-6">
                            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> Verified Professionals</li>
                            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> Eco-Friendly Products</li>
                            <li class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4 text-emerald-400"></i> Flexible Booking</li>
                        </ul>
                    </div>
                </div>

                <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-transform duration-500" data-aos="fade-up" data-aos-delay="0" data-tilt data-tilt-max="8" data-tilt-speed="400">
                    <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="leaf" class="w-6 h-6 text-emerald-600"></i>
                    </div>
                    <h4 class="text-lg font-black text-zinc-900 mb-2">Safe Solutions</h4>
                    <p class="text-sm text-zinc-600">We prioritize environmentally friendly methods that are safe for luxury finishes and surfaces.</p>
                </div>

                <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-transform duration-500" data-aos="fade-up" data-aos-delay="100" data-tilt data-tilt-max="8" data-tilt-speed="400">
                    <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="clock" class="w-6 h-6 text-purple-600"></i>
                    </div>
                    <h4 class="text-lg font-black text-zinc-900 mb-2">Reliable Scheduling</h4>
                    <p class="text-sm text-zinc-600">Punctual execution for your ${service.title} right when you need it in Hillsboro Beach.</p>
                </div>

                <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-transform duration-500" data-aos="fade-up" data-aos-delay="200" data-tilt data-tilt-max="8" data-tilt-speed="400">
                    <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6">
                        <i data-lucide="star" class="w-6 h-6 text-amber-500"></i>
                    </div>
                    <h4 class="text-lg font-black text-zinc-900 mb-2">Five-Star Results</h4>
                    <p class="text-sm text-zinc-600">Our results speak for themselves. Enjoy a deeply transformed and spotless space.</p>
                </div>
            </div>

            <!-- How It Works (Process) -->
            <div class="mb-24">
                <div class="text-center mb-16" data-aos="fade-up">
                    <h2 class="text-4xl font-black text-zinc-900 mb-4">Our Hillsboro Beach Process</h2>
                    <p class="text-zinc-500 font-medium">Three simple steps to a pristine environment.</p>
                </div>
                <div class="grid md:grid-cols-3 gap-8 relative">
                    <!-- Connecting Line -->
                    <div class="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-sky-100 z-0 border-t border-dashed border-sky-300"></div>
                    
                    <div class="text-center group relative z-10" data-aos="fade-up" data-aos-delay="0">
                        <div class="w-20 h-20 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-900/10 text-2xl font-black text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500" data-tilt data-tilt-max="20" data-tilt-speed="300" data-tilt-scale="1.2">1</div>
                        <h4 class="text-xl font-bold text-zinc-900 mb-3">Book Your Service</h4>
                        <p class="text-zinc-600 text-sm leading-relaxed">Contact us online or by phone to request your ${service.title} assessment.</p>
                    </div>
                    <div class="text-center group relative z-10" data-aos="fade-up" data-aos-delay="100">
                        <div class="w-20 h-20 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-900/10 text-2xl font-black text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500" data-tilt data-tilt-max="20" data-tilt-speed="300" data-tilt-scale="1.2">2</div>
                        <h4 class="text-xl font-bold text-zinc-900 mb-3">Expert Execution</h4>
                        <p class="text-zinc-600 text-sm leading-relaxed">Our trained Hillsboro Beach specialists arrive fully equipped to deliver pristine results.</p>
                    </div>
                    <div class="text-center group relative z-10" data-aos="fade-up" data-aos-delay="200">
                        <div class="w-20 h-20 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-900/10 text-2xl font-black text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500" data-tilt data-tilt-max="20" data-tilt-speed="300" data-tilt-scale="1.2">3</div>
                        <h4 class="text-xl font-bold text-zinc-900 mb-3">Enjoy Your Space</h4>
                        <p class="text-zinc-600 text-sm leading-relaxed">Experience the unmatched standard of a Tropishine cleaned environment.</p>
                    </div>
                </div>
            </div>

            <!-- Outro CTA -->
            <div class="bg-zinc-900 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden" data-aos="zoom-in" data-tilt data-tilt-max="3" data-tilt-speed="600" data-tilt-perspective="1000" data-tilt-glare="true" data-tilt-max-glare="0.1">
                <div class="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div class="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <h2 class="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Experience the Best in Hillsboro Beach</h2>
                <p class="text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10 font-medium">${outro}</p>
                
                <a href="tel:9545300508" class="relative z-10 inline-flex items-center gap-3 px-10 py-5 bg-sky-600 text-white font-black uppercase tracking-widest text-sm rounded-full hover:bg-sky-500 transition-all shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:shadow-[0_0_60px_rgba(14,165,233,0.5)] transform hover:-translate-y-1 group">
                    <i data-lucide="calendar" class="w-5 h-5 group-hover:rotate-12 transition-transform"></i> Schedule ${service.title} Now
                </a>
            </div>

            <!-- SEO FAQ Section -->
            <div class="mt-24 max-w-3xl mx-auto border-t border-slate-200 pt-16">
                <h3 class="text-3xl md:text-4xl font-black text-center text-zinc-900 mb-10" data-aos="fade-up">Frequently Asked Questions</h3>
                <div class="space-y-4">
                    ${selectedFaqs.map((faq, i) => {
                        const q = faq.q.replace(/{service}/g, service.title);
                        const a = faq.a.replace(/{service}/g, service.title);
                        return '<div class="faq-accordion bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-sky-200 transition-colors" data-aos="fade-up" data-aos-delay="' + (i * 100) + '">' +
                            '<button class="faq-accordion-header w-full flex items-center justify-between p-6 text-left focus:outline-none group">' +
                                '<span class="font-bold text-zinc-900 text-[17px] group-hover:text-sky-600 transition-colors">' + q + '</span>' +
                                '<div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors flex-shrink-0">' +
                                    '<i data-lucide="chevron-down" class="chevron-icon w-5 h-5 text-sky-600"></i>' +
                                '</div>' +
                            '</button>' +
                            '<div class="faq-accordion-content px-6 pb-6 text-zinc-600 leading-relaxed font-medium hidden border-t border-slate-100 pt-4">' +
                                a +
                            '</div>' +
                        '</div>';
                    }).join('')}
                </div>
            </div>

        </div>
    </section>
    
    <!-- Include Schema and Local FAQ JS handling -->
    <script type="application/ld+json">
        ${JSON.stringify(faqSchema)}
    <\\/script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.faq-accordion-header').forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
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

    // Fix paths (since page is generated one level down from root)
    finalHtml = finalHtml.replace(/(src|href)="images\//g, '$1="../../images/');
    finalHtml = finalHtml.replace(/(src|href)="hero-vid\//g, '$1="../../hero-vid/');
    finalHtml = finalHtml.replace(/href="index\.html"/g, 'href="https://www.tropishinecleaning.com/hillsboro-beach/"');
    
    // Form iFrame fix just in case
    finalHtml = finalHtml.replace(/<script src="https:\/\/widgets\.leadconnectorhq\.com\/loader\.js" data-resources-url="https:\/\/widgets\.leadconnectorhq\.com\/chat-widget\/loader\.js"><\/script>/g, '<script src="https://widgets.leadconnectorhq.com/loader.js" data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"></script>');

    // Replace SEO tags
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/s, `<title>${titleStr}</title>`);
    finalHtml = finalHtml.replace(/<meta name="description" content=".*?">/s, `<meta name="description" content="${descStr}">`);
    
    // Inject correct UNIQUE Canonical to prevent duplicate content penalty
    finalHtml = finalHtml.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="https://www.tropishinecleaning.com/hillsboro-beach/${service.id}/" />`);
    
    // Replace schema script for business name
    finalHtml = finalHtml.replace(/"name": "Tropishine Cleaning"/, `"name": "${service.title} Hillsboro Beach - Tropishine Cleaning"`);

    const filePath = path.join(folderPath, 'index.html');
    fs.writeFileSync(filePath, finalHtml, 'utf8');
    console.log("Generated " + folderName + "/index.html");
});

console.log('All Hillsboro Beach service pages generated successfully!');
