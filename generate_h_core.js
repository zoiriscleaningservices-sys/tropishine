const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

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

// Extract base sections from index.html
const headAndNav = extractSection(indexHtml, '<!DOCTYPE html>', '<!-- HERO - NEVER SEEN BEFORE -->');
const reviewsSection = extractSection(indexHtml, '<!-- TESTIMONIALS -->', '<!-- LOCATIONS AND MAP SECTION -->');
const footerSection = extractSection(indexHtml, '<!-- LOCATIONS AND MAP SECTION -->', '</html>') + '</html>';

if (!headAndNav || !reviewsSection || !footerSection) {
    console.error("Missing a critical section! Please check the HTML markers in index.html");
    process.exit(1);
}

const baseStyles = `
    <style>
        body { overflow-x: hidden; }

        @keyframes float-rotate {
            0% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-30px) rotate(15deg) scale(1.05); }
            100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        .animate-float-rotate { animation: float-rotate 10s ease-in-out infinite; }

        @keyframes text-slide {
            0%, 20% { transform: translateY(0); }
            25%, 45% { transform: translateY(-20%); }
            50%, 70% { transform: translateY(-40%); }
            75%, 95% { transform: translateY(-60%); }
            100% { transform: translateY(-80%); }
        }
        .animate-text-slide { animation: text-slide 8s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite; }
        
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
    </style>
`;

const baseScripts = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js"></script>
`;

function buildV3Hero(badge, titleHtml, desc, img, phrases = ["Flawless Execution", "Eco-Friendly Care", "Spotless Results", "Deep Sanitization"]) {
    // Generate the span elements for the rotator dynamically so they are unique per page
    const phraseItems = phrases.map(p => `<span class="h-[40px] md:h-[44px] flex items-center truncate">${p}</span>`).join('\n                                    ');
    // Duplicate the first item to ensure a smooth infinite scroll animation loop
    const rotatorHtml = phraseItems + '\n                                    <span class="h-[40px] md:h-[44px] flex items-center truncate">' + phrases[0] + '</span>';

    return `
            <!-- V3 Hero -->
            <section class="relative pt-8 md:pt-32 pb-24 md:pt-48 md:pb-36 overflow-hidden bg-zinc-950 min-h-[75vh] flex items-center">

                <!-- Background Image with Parallax and Parallax -->
                <div class="absolute inset-0 z-0" data-aos="zoom-out" data-aos-duration="2500">
                    <img src="../../${img}" alt="Hero Image" class="w-full h-full object-cover opacity-[0.8] mix-blend-overlay">
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-900/40"></div>
                    <div class="absolute inset-0 bg-sky-900/20 mix-blend-overlay"></div>
                </div>
                
                <div class="max-w-7xl mx-auto px-6 relative z-10 w-full text-center">
                    <div data-aos="fade-down" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500/10 border border-sky-400/20 backdrop-blur-md mb-8 shadow-lg shadow-sky-500/10">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                        <span class="text-xs font-black text-sky-100 uppercase tracking-[0.2em]">${badge}</span>
                    </div>
                    
                    <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-tight" data-aos="fade-up" data-aos-delay="100">
                        ${titleHtml}
                    </h1>
                    
                    <div class="text-lg md:text-2xl text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed mb-16" data-aos="fade-up" data-aos-delay="200">
                        <span class="block mb-6 text-xl text-zinc-400">${desc}</span>
                        <span class="inline-flex flex-wrap justify-center items-center gap-3 font-black text-sky-400 text-xl md:text-3xl bg-sky-950/40 px-6 py-4 rounded-3xl border border-sky-800/50 backdrop-blur-md shadow-2xl shadow-sky-900/20">
                            <span class="text-zinc-300">We Deliver</span>
                            <span class="relative inline-block w-[220px] md:w-[280px] h-[40px] md:h-[44px] overflow-hidden align-middle text-left text-sky-200">
                                <span class="absolute top-0 left-0 w-full animate-text-slide flex flex-col">
                                    ${rotatorHtml}
                                </span>
                            </span>
                        </span>
                    </div>
                    
                    <div data-aos="fade-up" data-aos-delay="300" class="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="tel:9545300508" class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-sky-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-sky-500 transition-all shadow-[0_0_30px_rgba(14,165,233,0.4)] hover:shadow-[0_0_40px_rgba(14,165,233,0.6)] transform hover:-translate-y-1">
                            <i data-lucide="phone" class="w-5 h-5"></i> Call Now
                        </a>
                        <a href="#explore" class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white backdrop-blur-md border border-white/10 font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all text-white">
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
}

const pages = [
    {
        id: "about-us",
        slug: "about-us",
        title: "About Us",
        desc: "Learn about the mission, values, and story behind Tropishine Cleaning.",
        heroImg: "images/office cleaning.JPG",
        buildBody: () => {
            return buildV3Hero(
                "Our Story",
                `Elevating Standards <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-sky-400 bg-300% animate-gradient">About Us</span>`,
                "We are more than a cleaning service. We are a dedicated team committed to creating pristine, healthy environments across South Florida.",
                "images/office cleaning.JPG",
                ["Unmatched Quality", "Trusted Partnerships", "Our Core Values", "Community Focus"]
            ) + `
            <!-- Mission/Values Bento Grid -->
            <section id="explore" class="py-6 md:py-24 bg-slate-50 relative overflow-hidden">
                <div class="absolute top-20 right-[-5%] w-64 h-64 bg-sky-200/40 rounded-full blur-3xl animate-float-rotate pointer-events-none" style="animation-duration: 20s;"></div>
                <div class="absolute bottom-40 left-[-5%] w-96 h-96 bg-emerald-200/30 rounded-full blur-[80px] animate-float-rotate pointer-events-none" style="animation-duration: 25s; animation-delay: -5s;"></div>

                <div class="max-w-6xl mx-auto px-6 relative z-10">
                    <div class="text-center mb-16" data-aos="fade-up">
                        <h2 class="text-4xl font-black text-zinc-900 mb-4">Our Core Philosophy</h2>
                        <div class="w-24 h-1 bg-sky-500 mx-auto rounded-full mb-8"></div>
                    </div>

                    <div class="grid md:grid-cols-3 gap-6 mb-24 relative z-10">
                        <!-- Mission Box (Wide) -->
                        <div class="md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-700 transition-transform duration-500 text-white" data-aos="fade-up" data-aos-delay="0" data-tilt data-tilt-max="5" data-tilt-speed="400" data-tilt-glare="true" data-tilt-max-glare="0.2">
                            <div class="w-14 h-14 bg-sky-500/20 rounded-2xl flex items-center justify-center mb-6 border border-sky-400/30">
                                <i data-lucide="target" class="w-7 h-7 text-sky-400"></i>
                            </div>
                            <h3 class="text-3xl font-black text-white mb-4">Our Mission</h3>
                            <p class="text-zinc-300 leading-relaxed text-lg">To provide unparalleled cleaning solutions that enhance the quality of life and productivity for our clients, prioritizing eco-friendly methods and uncompromised quality.</p>
                        </div>
                        
                        <!-- Value 1 -->
                        <div class="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 transition-transform duration-500" data-aos="fade-up" data-aos-delay="100" data-tilt data-tilt-max="8" data-tilt-speed="400">
                            <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                                <i data-lucide="leaf" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <h4 class="text-xl font-black text-zinc-900 mb-2">Sustainability</h4>
                            <p class="text-zinc-600">We utilize green cleaning products that are tough on dirt but safe for your family, pets, and the planet.</p>
                        </div>

                        <!-- Value 2 -->
                        <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] transition-transform duration-500" data-aos="fade-up" data-aos-delay="0" data-tilt data-tilt-max="8" data-tilt-speed="400">
                            <div class="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6">
                                <i data-lucide="shield-check" class="w-6 h-6 text-sky-600"></i>
                            </div>
                            <h4 class="text-xl font-black text-zinc-900 mb-2">Trust & Safety</h4>
                            <p class="text-zinc-600">Every Tropishine professional is strictly vetted, fully licensed, and comprehensively insured for your peace of mind.</p>
                        </div>

                        <!-- Vision Box (Wide) -->
                        <div class="md:col-span-2 bg-gradient-to-br from-sky-500 to-sky-700 rounded-3xl p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(14,165,233,0.3)] border border-sky-400 transition-transform duration-500 text-white overflow-hidden relative" data-aos="fade-up" data-aos-delay="100" data-tilt data-tilt-max="5" data-tilt-speed="400" data-tilt-glare="true" data-tilt-max-glare="0.3">
                            <div class="absolute -top-10 -right-10 opacity-10">
                                <i data-lucide="eye" class="w-48 h-48"></i>
                            </div>
                            <div class="relative z-10">
                                <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 border border-white/30 backdrop-blur-sm">
                                    <i data-lucide="eye" class="w-7 h-7 text-white"></i>
                                </div>
                                <h3 class="text-3xl font-black mb-4">Our Vision</h3>
                                <p class="text-sky-50 leading-relaxed text-lg">To be the undisputed standard of excellence in the cleaning industry across South Florida, continuously innovating our methods while maintaining the personalized, original quality our clients trust.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            `;
        }
    },
    {
        id: "gallery",
        slug: "gallery",
        title: "Our Gallery",
        desc: "View the stunning results of Tropishine Cleaning's premium services.",
        heroImg: "images/deep clean.JPG",
        buildBody: () => {
            const images = [
                "images/deep clean.JPG", "images/Post construction.JPG", "images/janitorial_commercial.JPG",
                "images/janitorial_cleaning.png", "images/day_porter_service.png", "images/Airbnb.JPG",
                "images/move_in_move_out_cleaning_pro.png", "images/Strip & Wax service.JPG", "images/carpet_cleaning_pro.png",
                "images/Window cleaning.jpg", "images/Restaurant cleaning.jpg", "images/Garage cleaning.jpg",
                "images/office cleaning.JPG", "images/medical office cleaning.JPG", "images/Kitchen exhaust cleaning.jpg"
            ];
            
            // Build Masonry Grid HTML
            let masonryHtml = '<div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">';
            images.forEach((img, i) => {
                masonryHtml += `
                <div class="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-lg border border-slate-200" data-aos="fade-up" data-aos-delay="${(i % 3) * 100}" data-tilt data-tilt-max="15" data-tilt-speed="400" data-tilt-glare="true" data-tilt-max-glare="0.5">
                    <img src="../../${img}" alt="Gallery Image ${i+1}" class="w-full h-auto transform transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                        <span class="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Premium Finish</span>
                        <span class="text-sky-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">Tropishine Excellence</span>
                    </div>
                </div>
                `;
            });
            masonryHtml += '</div>';

            return buildV3Hero(
                "Visual Proof",
                `The Tropishine <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-sky-400 bg-300% animate-gradient">Gallery</span>`,
                "Browse through our portfolio of transformations. Unmatched quality, visible in every detail.",
                "images/deep clean.JPG",
                ["Stunning Results", "Impeccable Details", "Spotless Spaces", "Premium Finishes"]
            ) + `
            <!-- 3D Masonry Grid -->
            <section id="explore" class="py-6 md:py-24 bg-slate-50 relative overflow-hidden">
                <div class="absolute top-20 right-[-5%] w-64 h-64 bg-sky-200/40 rounded-full blur-3xl animate-float-rotate pointer-events-none" style="animation-duration: 20s;"></div>
                <div class="absolute bottom-40 left-[-5%] w-96 h-96 bg-indigo-200/30 rounded-full blur-[80px] animate-float-rotate pointer-events-none" style="animation-duration: 25s; animation-delay: -5s;"></div>

                <div class="max-w-7xl mx-auto px-6 relative z-10">
                    ${masonryHtml}
                </div>
            </section>
            `;
        }
    },
    {
        id: "blog",
        slug: "blog",
        title: "Cleaning Insights & Blogs",
        desc: "Expert tips, news, and insights from the Tropishine professionals.",
        heroImg: "images/janitorial_commercial.JPG",
        buildBody: () => {
            const blogPosts = [
                { title: "The Ultimate Guide to Eco-Friendly Cleaning", date: "Mar 10, 2026", category: "Eco-Friendly", img: "images/deep clean.JPG", excerpt: "Discover how switching to green cleaning methods can improve your indoor air quality and protect the environment." },
                { title: "Why Post-Construction Cleaning is Crucial", date: "Feb 28, 2026", category: "Construction", img: "images/Post construction.JPG", excerpt: "Renovating? Learn why professional post-construction cleaning is essential before moving back into your space." },
                { title: "Maintaining a Pristine Airbnb for 5-Star Reviews", date: "Feb 15, 2026", category: "Hospitality", img: "images/Airbnb.JPG", excerpt: "Turnover cleaning is the key to host success. Check out our checklist for staging and sanitizing short-term rentals." },
                { title: "The ROI of Professional Commercial Cleaning", date: "Jan 30, 2026", category: "Commercial", img: "images/office cleaning.JPG", excerpt: "A clean office reduces sick days and boosts productivity. Explore the long-term benefits of a janitorial contract." },
                { title: "Signs It's Time for Air Duct Cleaning", date: "Jan 12, 2026", category: "Deep Clean", img: "images/Air duct cleaning.jpeg.png", excerpt: "Don't ignore indoor air quality. Here are the top 5 signs that your HVAC system needs professional attention." },
                { title: "Strip & Wax: Extending Floor Lifespan", date: "Dec 20, 2025", category: "Floor Care", img: "images/Strip & Wax service.JPG", excerpt: "Protect your commercial flooring investment with regular strip and wax maintenance schedules." }
            ];

            let blogHtml = '';
            blogPosts.forEach((post, i) => {
                blogHtml += `
                <div class="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 group transition-transform duration-500 hover:-translate-y-2 flex flex-col h-full" data-aos="fade-up" data-aos-delay="${(i % 3) * 100}" data-tilt data-tilt-max="5" data-tilt-speed="400">
                    <div class="relative h-64 overflow-hidden">
                        <img src="../../${post.img}" alt="${post.title}" class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110">
                        <div class="absolute top-4 left-4 bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full backdrop-blur-md bg-opacity-90">
                            ${post.category}
                        </div>
                    </div>
                    <div class="p-8 flex flex-col flex-grow">
                        <span class="text-zinc-400 text-sm font-bold tracking-wider uppercase mb-3">${post.date}</span>
                        <h3 class="text-2xl font-black text-zinc-900 mb-4 group-hover:text-sky-600 transition-colors">${post.title}</h3>
                        <p class="text-zinc-600 leading-relaxed mb-6 flex-grow">${post.excerpt}</p>
                        <a href="#" class="inline-flex items-center gap-2 text-sky-600 font-bold uppercase text-sm tracking-widest hover:text-sky-800 transition-colors border-b-2 border-transparent hover:border-sky-600 pb-1 w-max">
                            Read More <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                    </div>
                </div>
                `;
            });

            return buildV3Hero(
                "Insights & News",
                `The Tropishine <br><span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-sky-400 bg-300% animate-gradient">Journal</span>`,
                "Expert advice, industry insights, and the latest news from South Florida's premier cleaning team.",
                "images/janitorial_commercial.JPG",
                ["Expert Advice", "Industry Insights", "Cleaning Hacks", "Healthy Homes"]
            ) + `
            <!-- Blog Post Grid -->
            <section id="explore" class="py-6 md:py-24 bg-slate-50 relative overflow-hidden">
                <div class="absolute top-20 right-[-5%] w-64 h-64 bg-sky-200/40 rounded-full blur-3xl animate-float-rotate pointer-events-none" style="animation-duration: 20s;"></div>
                <div class="absolute bottom-40 left-[-5%] w-96 h-96 bg-emerald-200/30 rounded-full blur-[80px] animate-float-rotate pointer-events-none" style="animation-duration: 25s; animation-delay: -5s;"></div>

                <div class="max-w-7xl mx-auto px-6 relative z-10">
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${blogHtml}
                    </div>
                    
                    <div class="mt-16 text-center" data-aos="fade-up">
                        <button class="inline-flex items-center gap-3 px-8 py-4 bg-sky-100 text-sky-700 font-black uppercase tracking-widest text-sm rounded-full hover:bg-sky-200 transition-all shadow-sm">
                            Load More Articles <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </section>
            `;
        }
    }
];

// Generate Pages
pages.forEach(page => {
    const folderPath = path.join(__dirname, "hillsboro-beach", page.slug);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    let pageHtml = headAndNav;
    
    // Inject Custom CSS
    pageHtml = pageHtml.replace('</head>', baseStyles + '</head>');
    
    // Fix SEO Tags
    pageHtml = pageHtml.replace(/<title>.*?<\/title>/s, `<title>${page.title} Hillsboro Beach - Tropishine Cleaning</title>`);
    pageHtml = pageHtml.replace(/<meta name="description" content=".*?">/s, `<meta name="description" content="${page.desc} Available in Hillsboro Beach.">`);
    
    // Inject correct UNIQUE Canonical SEO tag
    pageHtml = pageHtml.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="https://www.tropishinecleaning.com/hillsboro-beach/${page.slug}/" />`);
    
    // Inject Body, then Reviews, then Footer
    pageHtml += page.buildBody() + reviewsSection + footerSection;
    
    // Inject Custom Scripts before closing body
    pageHtml = pageHtml.replace('</body>', baseScripts + '</body>');

    // Fix Paths for links and images
    pageHtml = pageHtml.replace(/(src|href)="images\//g, '$1="../../images/');
    pageHtml = pageHtml.replace(/(src|href)="hero-vid\//g, '$1="../../hero-vid/');
    pageHtml = pageHtml.replace(/href="index\.html"/g, 'href="https://www.tropishinecleaning.com/hillsboro-beach/"');
    
    // Form iFrame fix just in case
    pageHtml = pageHtml.replace(/<script src="https:\/\/widgets\.leadconnectorhq\.com\/loader\.js" data-resources-url="https:\/\/widgets\.leadconnectorhq\.com\/chat-widget\/loader\.js"><\/script>/g, '<script src="https://widgets.leadconnectorhq.com/loader.js" data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"></script>');

    const outputPath = path.join(folderPath, 'index.html');
    fs.writeFileSync(outputPath, pageHtml, 'utf8');
    console.log(`Generated ${page.slug}/index.html`);
});

console.log('All core pages (About Us, Blog, Gallery) generated successfully!');
