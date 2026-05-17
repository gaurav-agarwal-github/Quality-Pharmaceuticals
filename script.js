/* ============================================================
   script.js – Quality Pharmaceuticals
   ============================================================ */

// ── Loading Screen ──────────────────────────────────────────
window.addEventListener('load', () => {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
});

// ── Navbar: scroll effect + mobile toggle ───────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 100);
});

const mobileMenu = document.querySelector('.mobile-menu');
const navLinks   = document.querySelector('.nav-links');
if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Smooth Scrolling ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navLinks) navLinks.classList.remove('open');
        }
    });
});

// ── AOS Initialization ───────────────────────────────────────
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 100 });
}

// ── Stats Counter Animation ──────────────────────────────────
function animateCounters() {
    document.querySelectorAll('[data-target]').forEach(counter => {
        const target    = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current     = 0;
        const suffix    = target > 100 ? '+' : '';

        const update = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(update);
            } else {
                counter.textContent = target + suffix;
            }
        };
        update();
    });
}

// ── Fade-in + Stats Observer ─────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.querySelector('[data-target]')) animateCounters();
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── Product Cards: staggered appearance ──────────────────────
const productObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
        }
    });
});
document.querySelectorAll('.product-card').forEach(card => productObserver.observe(card));

// ── Parallax on floating icons ───────────────────────────────
window.addEventListener('scroll', () => {
    const icons = document.querySelector('.floating-icons');
    if (icons) icons.style.transform = `translateY(${window.pageYOffset * 0.5}px)`;
});

// ── Testimonial auto-slider ───────────────────────────────────
(function () {
    const slider = document.getElementById('testimonialSlider');
    if (!slider) return;
    const slides = slider.querySelectorAll('.testimonial');
    if (!slides.length) return;
    let idx = 0;
    setInterval(() => {
        idx = (idx + 1) % slides.length;
        slider.scrollTo({ left: idx * slider.clientWidth, behavior: 'smooth' });
    }, 5000);
})();

// ── Contact Form ──────────────────────────────────────────────
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        e.target.reset();
    });
}

// ── Products Data ─────────────────────────────────────────────
const products = [
    {
        name: "QuasoCOL", price: "₹100",
        desc: "This proprietary Ayurvedic medicine is a comprehensive herbal formula primarily indicated for addressing menstrual disorders, including painful, irregular, or delayed cycles. Enriched with a potent blend of traditional ingredients such as Ashoka Bark, Kala Jeera, and Arjuna Bark, the syrup is formulated to alleviate physical weakness, anemia, and pelvic pain. Designed for Improved Quality, this health tonic serves as a restorative supplement to support reproductive health and overall vitality.",
        icon: "fas fa-capsules",
        images: ["images/QuasoCOL1.png","images/QuasoCOL2.png","images/QuasoCOL3.png","images/QuasoCOL4.png"],
        ingredients: [
            { name: "Ashoka Bark",        img: "images/Ashoka Bark.jpg",        desc: "Ashoka bark is a highly valued Ayurvedic ingredient traditionally used to support women's wellness and reproductive health. It may help promote hormonal balance, comfort, and overall vitality." },
            { name: "Kala Jeera Seed",    img: "images/Kala Jeera Seed.jpg",    desc: "Kala Jeera seeds are traditionally used in Ayurveda for their digestive and wellness-supporting properties. They may help support digestion, metabolism, and overall body balance." },
            { name: "Daru Haldi Rhizome", img: "images/Daru Haldi Rhizome.jpg", desc: "Daru Haldi rhizome is known in Ayurveda for its cleansing and anti-inflammatory properties. It may help support skin health, digestion, immunity, and overall wellness." },
            { name: "Lal Chandan Powder", img: "images/Lal Chandan Powder.jpg", desc: "Lal Chandan powder, also known as Red Sandalwood, is valued for its cooling and soothing properties. It may help support skin wellness, relaxation, and overall natural balance." },
            { name: "Chansoor Seed",      img: "images/Chansoor Seed.jpg",      desc: "Chansoor seeds are rich in nutrients and traditionally used in Ayurveda to support strength, digestion, and overall wellness. They may also help promote energy and nourishment." },
            { name: "Konch Seed",         img: "images/Konch Seed.jpg",         desc: "Konch seeds, also known as Mucuna Pruriens, are valued in Ayurveda for supporting strength, stamina, nervous system health, and overall vitality." },
            { name: "Arjuna Bark",        img: "images/Arjuna Bark.jpg",        desc: "Arjuna bark is a respected Ayurvedic ingredient traditionally used to support heart health and circulation. It may help promote cardiovascular wellness, stamina, and overall vitality." },
            { name: "Punarnava Root",     img: "images/Punarnava Root.jpg",     desc: "Punarnava root is widely used in Ayurveda for its rejuvenating and cleansing properties. It may help support kidney health, digestion, fluid balance, and overall body wellness." },
            { name: "Palash Flowers",     img: "images/Palash Flowers.jpg",     desc: "Palash flowers are traditionally used in Ayurveda for their cleansing and wellness-supporting properties. They may help support digestion, skin wellness, and overall natural health." }
        ],
        quantities: [{ label: "225ML", price: "₹100" }, { label: "450ML", price: "₹175" }]
    },
    {
        name: "Femina", price: "₹50",
        desc: "Boosts immunity and overall health. Our Femina capsules contain 500mg of ascorbic acid with added bioflavonoids for enhanced absorption. This powerful antioxidant supports immune system function, collagen synthesis, and protects cells from oxidative stress. Ideal for daily wellness and immune defense.",
        icon: "fas fa-capsules",
        images: ["images/Femina1.PNG.png","images/Femina2.PNG.png"],
        ingredients: [
            { name: "Ashoka Bark",     img: "images/Ashoka Bark.jpg",     desc: "Ashoka bark is a revered Ayurvedic herb traditionally used to support women's reproductive health and menstrual wellness." },
            { name: "Lodhra Bark",     img: "images/Lodhra Bark.jpg",     desc: "Lodhra bark is widely valued in Ayurveda for its cooling and astringent properties. It may help support women's wellness and promote healthy skin." },
            { name: "Konch Seed",      img: "images/Konch Seed.jpg",      desc: "Konch seed is a powerful Ayurvedic ingredient known for supporting strength, stamina, and nervous system health." },
            { name: "Sonth Rhizome",   img: "images/Sonth Rhizome.jpg",   desc: "Sonth rhizome, or dried ginger, is highly valued in Ayurveda for its warming and digestive properties." },
            { name: "Ashwagandha Root",img: "images/Ashwagandha Root.jpg",desc: "Ashwagandha root is a renowned Ayurvedic herb known for its adaptogenic and rejuvenating properties." },
            { name: "Shatavari Root",  img: "images/Shatavari Root.jpg",  desc: "Shatavari root is a highly respected Ayurvedic herb traditionally used to support women's health and hormonal balance." },
            { name: "Gokhru Fruit",    img: "images/Gokhru Fruit.jpg",    desc: "Gokhru fruit is valued in Ayurveda for supporting urinary health, stamina, and vitality." }
        ],
        quantities: [{ label: "10CAPS", price: "₹50" }]
    },
    {
        name: "Liv-top", price: "₹100.00",
        desc: "Liv-top Syrup is marketed as a Liver Stimulant & Tonic and is intended to be a dietary supplement. Enriched with powerful Ayurvedic herbs including Bhringraj, Arjun bark, Makoi, and Tulsi, it is formulated to support healthy liver function and overall wellness. GMP-certified and trusted since 1967.",
        icon: "fas fa-lungs",
        images: ["images/Liv-top 1.PNG.png","images/Liv-top 2.PNG.png","images/Liv-top 3.PNG.png","images/Liv-top 4.PNG.png"],
        ingredients: [
            { name: "Bhringraj Plant",    img: "images/Bhringraj plant.PNG.jpg", desc: "Bhringraj is a medicinal herb widely used in Ayurveda, known for supporting liver health and hair growth." },
            { name: "Arjun Bark",         img: "images/Arjun Bark.PNG.jpg",      desc: "Arjuna bark contains natural antioxidants that may help strengthen heart muscles and improve blood circulation." },
            { name: "Makoi Fruit",        img: "images/Makoi fruit.PNG",         desc: "Makoi, also known as Black Nightshade, may help reduce inflammation and support liver function." },
            { name: "Tulsi Leaf",         img: "images/Tulsi leaf.PNG",          desc: "Tulsi, Holy Basil, is known for boosting immunity and supporting respiratory health." },
            { name: "Pittapapda Plant",   img: "images/Pittapapda plant.PNG",    desc: "Pittapapda is an Ayurvedic herb traditionally used for liver health, skin problems, and body cooling." },
            { name: "Sarpunkha Panchang", img: "images/Sarpunkha Panchang.PNG.PNG", desc: "Sarpunkha is traditionally known for supporting liver and spleen health, improving digestion, and body detoxification." },
            { name: "Vidanga Seed",       img: "images/Vidanga seed.PNG",        desc: "Vidanga seeds are widely used for digestive and detox support, with anti-parasitic and antimicrobial properties." },
            { name: "Ghritkumari Sap",    img: "images/Ghritkumari sap.PNG",     desc: "Ghritkumari sap (Aloe Vera) may help improve digestion, support liver health, and boost hydration." }
        ],
        quantities: [
            { label: "110ML Syrup", price: "₹70" },
            { label: "220ML Syrup", price: "₹100" },
            { label: "30ML Drops",  price: "₹50",  images: ["images/LivtopDrops1.PNG.png","images/LivtopDrops2.PNG.png"] },
            { label: "10 CAPS",     price: "₹50",  images: ["images/Liv-top 7.PNG.png","images/Liv-top 8.PNG.png"] }
        ]
    },
    {
        name: "QoughSOL", price: "₹50",
        desc: "QoughSol is an herbal cough syrup that provides quick relief from various cough symptoms. As a GMP-certified product established in 1967, it blends long-standing tradition with certified manufacturing standards to support respiratory health.",
        icon: "fas fa-bacteria",
        images: ["images/Qoughsol 1.PNG.png","images/Qoughsol 2.PNG.png","images/Qoughsol 3.PNG.png","images/Qoughsol 4.PNG.png"],
        ingredients: [
            { name: "Vasika Leaves",  img: "images/Vasika leaf.jpg",    desc: "Vasika leaves are a well-known Ayurvedic herb traditionally used to support respiratory and lung health." },
            { name: "Tulsi Leaf",     img: "images/Tulsi leaf.PNG",     desc: "Tulsi, Holy Basil, is a popular Ayurvedic herb known for boosting immunity and supporting respiratory health." },
            { name: "Mulethi Rhizome",img: "images/Mulethi rhizome.jpg",desc: "Mulethi (Licorice root) is used in Ayurveda for soothing throat irritation and respiratory support." },
            { name: "Khareti",        img: "images/Khareti.jpg",        desc: "Khareti is a traditional Ayurvedic herb known for its strengthening and rejuvenating properties." },
            { name: "Amaltas Pulp",   img: "images/Amaltas pulp.jpg",   desc: "Amaltas pulp is a widely used Ayurvedic ingredient known for its gentle cleansing and digestive-supporting properties." },
            { name: "Neelophar",      img: "images/Neelophar.jpg",      desc: "Neelophar (Blue Lotus) may help promote relaxation, reduce stress, and support restful sleep." },
            { name: "Unnab",          img: "images/Unnab.jpg",          desc: "Unnab (Jujube) may help support respiratory health, improve digestion, and strengthen immunity." },
            { name: "Banafsha",       img: "images/Banafsha.jpg",       desc: "Banafsha (Sweet Violet) may help support respiratory health and relieve cough and throat irritation." },
            { name: "Peppermint",     img: "images/Peppermint.jpg",     desc: "Peppermint is a refreshing herb known for its cooling and digestive-supporting properties." }
        ],
        quantities: [{ label: "60ML", price: "₹50" }, { label: "110ML", price: "₹70" }]
    },
    {
        name: "Infantol (Babies Tonic)", price: "₹55",
        desc: "Infantol (Babies Tonic) is a gentle health tonic specially formulated for babies to support healthy growth, digestion, immunity, and overall development. Made with carefully selected ingredients, it helps promote strength, appetite, and daily wellness in growing children.",
        icon: "fas fa-bone",
        images: ["images/Infantol (Babies Tonic)1.PNG.png","images/Infantol (Babies Tonic)2.PNG.png","images/Infantol (Babies Tonic)3.PNG.png","images/Infantol (Babies Tonic)4.PNG.png"],
        ingredients: [
            { name: "Javitri Leaves",    img: "images/Javitri leaves.jpg",   desc: "Javitri leaves are valued for their aromatic and wellness-supporting properties." },
            { name: "Pushkarmool Root",  img: "images/Pushkarmool root.jpg", desc: "Pushkarmool root is used to support respiratory and heart health." },
            { name: "Atis Root",         img: "images/Atis root.jpg",        desc: "Atis root is valued for its digestive and wellness-supporting properties." },
            { name: "Black Pepper Seeds",img: "images/Black Pepper seeds.jpg",desc: "Black Pepper seeds may help improve digestion and boost immunity." },
            { name: "Unnab",             img: "images/Unnab.jpg",            desc: "Unnab (Jujube) supports respiratory health, digestion, and immunity." },
            { name: "Nagarmotha Root",   img: "images/Nagarmotha root.jpg",  desc: "Nagarmotha root is known for its digestive and detoxifying properties." },
            { name: "Kantkari",          img: "images/Kantkari.jpg",         desc: "Kantkari is widely used for respiratory health support." },
            { name: "Baheda Root",       img: "images/Baheda root.jpg",      desc: "Baheda root is valued for its detoxifying and rejuvenating properties." },
            { name: "Tulsi Leaf",        img: "images/Tulsi leaf.PNG",       desc: "Tulsi boosts immunity and supports respiratory health." }
        ],
        quantities: [
            { label: "60ML Syrup",  price: "₹55" },
            { label: "30ML Drops",  price: "₹45", images: ["images/Infantol Drops1.PNG.png","images/Infantol Drops2.PNG.png","images/Infantol Drops3.PNG.png","images/Infantol Drops4.PNG.png"] }
        ]
    },
    {
        name: "Infantol (Family Tonic)", price: "₹70",
        desc: "Infantol (Family Tonic) is a nourishing family health tonic formulated to support overall wellness, immunity, digestion, and daily energy levels. Enriched with beneficial herbal ingredients, it helps maintain strength and vitality for all age groups as part of a healthy lifestyle.",
        icon: "fas fa-heart",
        images: ["images/Infantol1.PNG.png","images/Infantol2.PNG.png","images/Infantol3.PNG.png","images/Infantol4.PNG.png"],
        ingredients: [
            { name: "Pokharmool Root",  img: "images/Pokharmool root.jpg",  desc: "Pokharmool root is valued for supporting respiratory and heart health." },
            { name: "Atees Root",       img: "images/Atees root.jpg",       desc: "Atees root supports digestion, appetite, and overall wellness." },
            { name: "Pepper Seed",      img: "images/pepper seed.jpg",      desc: "Pepper seeds support digestion, metabolism, and immunity." },
            { name: "Unnab",            img: "images/Unnab.jpg",            desc: "Unnab (Jujube) supports respiratory health and immunity." },
            { name: "Nagarmotha Root",  img: "images/Nagarmotha root.jpg",  desc: "Nagarmotha root supports digestion and detoxification." },
            { name: "Kantkari Herb",    img: "images/Kantkari herb.jpg",    desc: "Kantkari supports respiratory wellness." },
            { name: "Baheda Root",      img: "images/Baheda root.jpg",      desc: "Baheda root supports detoxification and respiratory health." },
            { name: "Tulsi Leaf",       img: "images/Tulsi leaf.PNG",       desc: "Tulsi boosts immunity and supports respiratory health." },
            { name: "Bhringraj Seed",   img: "images/Bhringraj seed.jpg",   desc: "Bhringraj seeds support hair health, liver function, and overall wellness." }
        ],
        quantities: [{ label: "100ML", price: "₹70" }, { label: "200ML", price: "₹100" }]
    },
    {
        name: "Energyon", price: "₹110",
        desc: "EnergyOn Syrup is a proprietary Ayurvedic restorative tonic designed to support overall physical and mental well-being. Formulated with Ashwagandha, Shatavari, Kesar (Saffron), and Amla, this syrup is indicated for addressing poor stamina, malnutrition, and lack of appetite.",
        icon: "fas fa-bolt",
        images: ["images/Energyon1.png","images/Energyon2.png","images/Energyon3.png","images/Energyon4.png"],
        ingredients: [
            { name: "Ashwagandha Root",   img: "images/Ashwagandha Root.jpg",   desc: "Ashwagandha root is known for its adaptogenic and rejuvenating properties." },
            { name: "Shatawari Root",     img: "images/Shatawari Root.jpg",     desc: "Shatawari root supports vitality, hormonal balance, and overall wellness." },
            { name: "Kavach Seed",        img: "images/Kavach Seed.jpg",        desc: "Kavach seed supports strength, stamina, and nervous system health." },
            { name: "Vidarikand Root",    img: "images/Vidarikand Root.jpg",    desc: "Vidarikand root supports energy, physical strength, and immunity." },
            { name: "Shankhpushpi Herb",  img: "images/Shankhpushpi Herb.jpg",  desc: "Shankhpushpi supports memory, focus, and mental wellness." },
            { name: "Brahmi Booti",       img: "images/Brahmi Booti.jpg",       desc: "Brahmi supports memory, concentration, and nervous system wellness." },
            { name: "Amla Fruit",         img: "images/Amla Fruit.jpg",         desc: "Amla is rich in antioxidants and Vitamin C, supporting immunity and digestion." },
            { name: "Punarnava Root",     img: "images/Punarnava Root.jpg",     desc: "Punarnava root supports kidney health, digestion, and overall body wellness." },
            { name: "Arjuna Bark",        img: "images/Arjuna Bark.jpg",        desc: "Arjuna bark supports heart health, circulation, and overall vitality." }
        ],
        quantities: [
            { label: "100ML Syrup", price: "₹70" },
            { label: "200ML Syrup", price: "₹100" },
            { label: "10CAPS",      price: "₹110", images: ["/images/energyoncaps1.png","images/Energyoncaps2.png"] }
        ]
    },
    {
        name: "M.C Plus", price: "₹60",
        desc: "M.C Plus is a specialized Ayurvedic proprietary medicine formulated to support women's reproductive wellness. Designed for menstrual irregularities, these capsules leverage a traditional blend of botanical extracts to help regulate and restore a healthy monthly cycle.",
        icon: "fas fa-female",
        images: ["images/M.C Plus syrup1.PNG.png","images/M.C Plus syrup2.PNG.png","images/M.C Plus syrup3.PNG.png","images/M.C Plus syrup4.PNG.png"],
        ingredients: [
            { name: "Kalaunji",    img: "images/Kalaunji.PNG.png",    desc: "Kalonji (Black Seed) may help support immunity, digestion, and heart health." },
            { name: "Kapasmool",   img: "images/Kapasmool.PNG.png",   desc: "Kapasmool supports women's health, digestion, and pain relief." },
            { name: "Olatkambal",  img: "images/Olatkambal.PNG.png",  desc: "Olatkambal root supports women's reproductive health and healthy menstrual cycles." },
            { name: "Gajar Seed",  img: "images/Gajar seed.PNG.png",  desc: "Gajar seeds support digestion, urinary health, and body balance." },
            { name: "Indrayan",    img: "images/Indrayan.PNG.png",    desc: "Indrayan supports detoxification and digestive health." },
            { name: "Soya",        img: "images/Soya.PNG.png",        desc: "Soya seeds are rich in protein, fiber, vitamins, and antioxidants." },
            { name: "Kala Til",    img: "images/Kala Til.PNG.jpg",    desc: "Kala Til (Black Sesame) supports bone strength, heart health, and digestion." },
            { name: "Muli",        img: "images/Muli.PNG.png",        desc: "Muli seeds support digestion and liver function." },
            { name: "Sonth",       img: "images/Sonth.PNG.png.jpg",   desc: "Sonth (Dry Ginger) improves digestion and reduces inflammation." }
        ],
        quantities: [
            { label: "100ML Syrup", price: "₹80" },
            { label: "200ML Syrup", price: "₹125" },
            { label: "6CAPS",       price: "₹60", images: ["images/M.E Plus1.PNG.png","images/M.E Plus2.PNG.png"] }
        ]
    },
    {
        name: "Quality LAL TEL", price: "₹50",
        desc: "Quality Lal Tel is a premium baby massage oil specially formulated to strengthen bones and improve muscle tone. Enriched with Till Oil (Sesame) and traditional herbs like Shankhapushpi and Arjuna Bark, this GMP-certified oil deeply nourishes delicate skin while promoting physical development.",
        icon: "fas fa-baby",
        images: ["images/Quality lal tel1.PNG.png","images/Quality lal tel2.PNG.png","images/Quality lal tel3.PNG.png","images/Quality lal tel4.PNG.png"],
        ingredients: [
            { name: "Shankhapushpi",    img: "images/Shankhapushpi.jpg",     desc: "Shankhapushpi supports brain and nervous system health." },
            { name: "Manjistha Root",   img: "images/Manjistha root.jpg",    desc: "Manjistha root supports healthy skin and natural body cleansing." },
            { name: "Daruharidra Root", img: "images/Daruharidra root.jpg",  desc: "Daruharidra root supports liver health, healthy skin, and immunity." },
            { name: "Arjun Bark",       img: "images/Arjun Bark.PNG.jpg",    desc: "Arjuna bark supports heart health and blood circulation." },
            { name: "Urad Seeds",       img: "images/Urad seeds.jpg",        desc: "Urad seeds are highly nutritious, supporting strength and digestion." },
            { name: "Ratanjot",         img: "images/Ratanjot.jpg",          desc: "Ratanjot supports skin health with cooling and anti-inflammatory properties." },
            { name: "Karpoor",          img: "images/Karpoor.jpg",           desc: "Karpoor (Camphor) supports respiratory comfort and relaxation." },
            { name: "Neem Oil",         img: "images/Neem oil.jpg",          desc: "Neem oil supports healthy skin and protection from infections." },
            { name: "Kala Til Oil",     img: "images/Til tel.jpg",           desc: "Sesame oil supports joint and bone health and promotes overall strength." }
        ],
        quantities: [{ label: "50ML", price: "₹50" }, { label: "100ML", price: "₹80" }]
    },
    {
        name: "Quality Gripe Water", price: "₹43",
        desc: "Quality Gripe Water is a trusted Ayurvedic formulation designed to provide gentle relief for babies from common digestive discomforts including colic, gas, and indigestion. Made with time-tested herbal ingredients, it supports healthy digestion and comfort in infants.",
        icon: "fas fa-baby",
        images: [],
        ingredients: [
            { name: "Bhringraj Plant",    img: "images/Bhringraj plant.PNG.jpg",   desc: "Bhringraj supports liver health and overall wellness." },
            { name: "Arjun Bark",         img: "images/Arjun Bark.PNG.jpg",        desc: "Arjuna bark supports heart health and blood circulation." },
            { name: "Makoi Fruit",        img: "images/Makoi fruit.PNG",           desc: "Makoi supports liver function and improves digestion." },
            { name: "Tulsi Leaf",         img: "images/Tulsi leaf.PNG",            desc: "Tulsi boosts immunity and supports respiratory health." },
            { name: "Pittapapda Plant",   img: "images/Pittapapda plant.PNG",      desc: "Pittapapda supports liver health, skin wellness, and body cooling." },
            { name: "Sarpunkha Panchang", img: "images/Sarpunkha Panchang.PNG.PNG",desc: "Sarpunkha supports liver and spleen health and body detoxification." },
            { name: "Vidanga Seed",       img: "images/Vidanga seed.PNG",          desc: "Vidanga seeds support gut health and natural body cleansing." },
            { name: "Ghritkumari Sap",    img: "images/Ghritkumari sap.PNG",       desc: "Aloe Vera sap supports liver health, digestion, and hydration." }
        ],
        quantities: [{ label: "100ML", price: "₹43" }]
    },
    {
        name: "DADOL Skin Ointment", price: "₹45",
        desc: "This Ayurvedic skin ointment is a specialized herbal formula enriched with Neem to effectively treat various fungal and inflammatory skin conditions. It is specifically indicated for the relief of ringworm, scabies, eczema, and itchy skin.",
        icon: "fas fa-spray-can",
        images: ["images/DADOL1.png","images/DADOL2.png"],
        ingredients: [
            { name: "Gandhak",          img: "images/Gandhak.jpg",           desc: "Gandhak (purified Sulphur) supports healthy skin and reduces itching." },
            { name: "Babchi Oil",       img: "images/Babchi Oil.jpg",        desc: "Babchi Oil supports healthy skin texture and skin balance." },
            { name: "Coaltar Solution", img: "images/Coaltar Solution.jpg",  desc: "Coaltar Solution soothes dry and irritated skin conditions." },
            { name: "Neem Oil",         img: "images/Neem Oil.jpg",          desc: "Neem Oil supports skin health and reduces irritation." },
            { name: "Samudraphene",     img: "images/Samudraphene.jpg",      desc: "Samudraphene supports skin comfort and wellness." },
            { name: "Maulshri Flowers", img: "images/Maulshri Flowers.jpg",  desc: "Maulshri Flowers support skin nourishment and freshness." },
            { name: "Babool Flowers",   img: "images/Babool Flowers.jpg",    desc: "Babool Flowers support healthy skin and natural balance." },
            { name: "Paraffin Base",    img: "images/Paraffin Base.jpg",     desc: "Paraffin Base keeps skin soft and supports hydration." }
        ],
        quantities: [{ label: "10GM", price: "₹45" }]
    },
    {
        name: "Joint Pain Relieve Oil", price: "₹25",
        desc: "This Joint Pain Reliever Oil is a premium Ayurvedic formulation designed to provide fast and effective relief from chronic discomfort. Enriched with Ashwagandha, Shatavari, and Maha Haldi, it targets inflammation at the source to ease joint pains, arthritis, and muscle stiffness.",
        icon: "fas fa-bone",
        images: ["images/Zoint oil1.PNG.png","images/Zoint oil2.PNG.png","images/Zoint oil3.PNG.png","images/Zoint oil4.PNG.png"],
        ingredients: [
            { name: "Ashwagandha Root",  img: "images/Ashwagangha root.jpg",  desc: "Ashwagandha root supports energy, stamina, and overall wellness." },
            { name: "Karpoor Crystal",   img: "images/Karpoor Crystal.jpg",   desc: "Karpoor crystal supports respiratory comfort and relaxation." },
            { name: "Mash (Urad) Seed",  img: "images/Mash Urad Seed.jpg",   desc: "Urad seeds are rich in protein and support strength and digestion." },
            { name: "Jatamansi Plant",   img: "images/Jatamansi Plant.jpg",   desc: "Jatamansi supports calming, restful sleep, and mental clarity." },
            { name: "Kuchala Seed",      img: "images/Kuchala Seed.jpg",      desc: "Kuchala seeds support nervous system function and joint comfort." },
            { name: "Dhatura Leaf",      img: "images/Dhatura Leaf.jpg",      desc: "Dhatura leaves support pain and respiratory relief." },
            { name: "Aama Haldi Root",   img: "images/Aama Haldi Root.jpg",   desc: "Aama Haldi root supports digestion and reduces inflammation." },
            { name: "Shatawari Root",    img: "images/Shatawari Root.jpg",    desc: "Shatawari root supports hormonal balance and overall rejuvenation." }
        ],
        quantities: [
            { label: "10ML", price: "₹25" },
            { label: "30ML", price: "₹75" },
            { label: "60ML", price: "₹120" }
        ]
    },
    {
        name: "EAROL", price: "₹45",
        desc: "Earol Ear Drops is a proprietary Ayurvedic formulation designed to provide fast-acting and comprehensive relief from common ear discomforts including ear-ache, itching, ear wax buildup, and decreased hearing clarity.",
        icon: "fas fa-seedling",
        images: ["images/Earoil1.PNG.png","images/Earoil2.PNG.png","images/Earoil3.PNG.png","images/Earoil4.PNG.png"],
        ingredients: [
            { name: "Sonapatha",  img: "images/Sonapatha.jpg",  desc: "Sonapatha supports joint health, digestion, and respiratory wellness." },
            { name: "Ankol",      img: "images/Ankol.jpg",      desc: "Ankol supports skin health, joint comfort, and digestion." },
            { name: "Kakjangha",  img: "images/Kakjangha.jpg",  desc: "Kakjangha supports joint health and overall physical wellness." },
            { name: "Nagdaun",    img: "images/Nagdaun.jpg",    desc: "Nagdaun supports digestion, respiratory comfort, and detoxification." },
            { name: "Arjuna",     img: "images/Arjuna.jpg",     desc: "Arjuna supports healthy blood circulation and heart wellness." },
            { name: "Surajmukhi", img: "images/Surajmukhi.jpg", desc: "Surajmukhi (Sunflower) supports heart health and energy levels." },
            { name: "Nirgundi",   img: "images/Nirgundi.jpg",   desc: "Nirgundi supports joint comfort and respiratory wellness." },
            { name: "Lahsun",     img: "images/Lahsun.jpg",     desc: "Lahsun (Garlic) supports heart health, digestion, and immunity." }
        ],
        quantities: [{ label: "5ML", price: "₹45" }]
    },
    {
        name: "Mangal Prabhat (Laxative Churan)", price: "₹16",
        desc: "Mangal Prabhat Churn is a time-tested Ayurvedic remedy formulated to combat chronic constipation, hyperacidity, and heartburn. This GMP-certified, Saunf-flavored churan promotes healthy bowel movements and regulates acid levels.",
        icon: "fas fa-hand-holding-medical",
        images: ["images/Mangal Prabhat1.PNG.png","images/Mangal Prabhat2.PNG.png","images/Mangal Prabhat3.PNG.png"],
        ingredients: [
            { name: "Senna Leaf",    img: "images/Senna Leaf.jpg",    desc: "Senna leaves support natural cleansing and digestive health." },
            { name: "Ajwain Seed",   img: "images/Ajwain Seed.jpg",   desc: "Ajwain seeds relieve indigestion, bloating, and gas." },
            { name: "Kala Namak",    img: "images/Kala Namak.jpg",    desc: "Kala Namak (Black Salt) supports digestion and appetite." },
            { name: "Nisoth",        img: "images/Nisoth.jpg",        desc: "Nisoth supports detoxification and healthy bowel function." },
            { name: "Amaltash Pulp", img: "images/Amaltash Pulp.jpg", desc: "Amaltash pulp supports constipation relief and bowel health." },
            { name: "Gulab Flowers", img: "images/Gulab Flowers.jpg", desc: "Gulab flowers support skin health and relaxation." },
            { name: "Saunf",         img: "images/Saunf.jpg",         desc: "Saunf (Fennel) improves digestion, freshens breath, and reduces acidity." },
            { name: "Sentha Namak",  img: "images/Sentha Namak.jpg",  desc: "Sentha Namak (Rock Salt) supports digestion and mineral balance." },
            { name: "Yastimadhu",    img: "images/Yastimadhu.jpg",    desc: "Yastimadhu (Mulethi/Licorice) supports respiratory health and digestion." }
        ],
        quantities: [{ label: "10GM", price: "₹16" }, { label: "50GM", price: "₹55" }]
    },
    {
        name: "Amrit (Anti Dycentrical)", price: "₹40",
        desc: "Amrit Anti-Diarrheal Tablets provide a trusted, natural approach to digestive health. This Ayurvedic remedy is specifically formulated to manage diarrhea and dysentery, helping to soothe the digestive tract and restore normal function quickly and effectively.",
        icon: "fas fa-pills",
        images: ["images/Amrit.PNG.png"],
        ingredients: [
            { name: "Bhringraj Plant",    img: "images/Bhringraj plant.PNG.jpg",   desc: "Bhringraj supports liver health and overall wellness." },
            { name: "Arjun Bark",         img: "images/Arjun Bark.PNG.jpg",        desc: "Arjuna bark supports heart health and blood circulation." },
            { name: "Makoi Fruit",        img: "images/Makoi fruit.PNG",           desc: "Makoi supports liver function and improves digestion." },
            { name: "Tulsi Leaf",         img: "images/Tulsi leaf.PNG",            desc: "Tulsi boosts immunity and supports respiratory health." },
            { name: "Pittapapda Plant",   img: "images/Pittapapda plant.PNG",      desc: "Pittapapda supports liver health and body cooling." },
            { name: "Sarpunkha Panchang", img: "images/Sarpunkha Panchang.PNG.PNG",desc: "Sarpunkha supports liver and spleen health and detoxification." },
            { name: "Vidanga Seed",       img: "images/Vidanga seed.PNG",          desc: "Vidanga seeds support gut health and natural body cleansing." },
            { name: "Ghritkumari Sap",    img: "images/Ghritkumari sap.PNG",       desc: "Aloe Vera sap supports liver health, digestion, and hydration." }
        ],
        quantities: [{ label: "25 Tabs", price: "₹40" }, { label: "500 Tabs", price: "₹500" }]
    },
    {
        name: "Woemol (Antiwarm)", price: "₹29",
        desc: "Woemol is an Ayurvedic formulation designed to address common digestive concerns including worm-related issues. Made with time-tested herbal ingredients, it supports healthy gut function and digestive wellness.",
        icon: "fas fa-thermometer-half",
        images: [],
        ingredients: [
            { name: "Bhringraj Plant",    img: "images/Bhringraj plant.PNG.jpg",   desc: "Bhringraj supports liver health and overall wellness." },
            { name: "Arjun Bark",         img: "images/Arjun Bark.PNG.jpg",        desc: "Arjuna bark supports heart health and blood circulation." },
            { name: "Makoi Fruit",        img: "images/Makoi fruit.PNG",           desc: "Makoi supports liver function and improves digestion." },
            { name: "Tulsi Leaf",         img: "images/Tulsi leaf.PNG",            desc: "Tulsi boosts immunity and supports respiratory health." },
            { name: "Pittapapda Plant",   img: "images/Pittapapda plant.PNG",      desc: "Pittapapda supports liver health and body cooling." },
            { name: "Sarpunkha Panchang", img: "images/Sarpunkha Panchang.PNG.PNG",desc: "Sarpunkha supports liver and spleen health and detoxification." },
            { name: "Vidanga Seed",       img: "images/Vidanga seed.PNG",          desc: "Vidanga seeds support gut health and natural body cleansing." },
            { name: "Ghritkumari Sap",    img: "images/Ghritkumari sap.PNG",       desc: "Aloe Vera sap supports liver health, digestion, and hydration." }
        ],
        quantities: [{ label: "30ML", price: "₹29" }]
    },
    {
        name: "Mal Mix", price: "₹32",
        desc: "MALMIX Syrup is a proprietary Ayurvedic medicine formulated to act as an effective anti-malarial and anti-pyretic treatment. This time-tested remedy, with a heritage dating back to 1967, is crafted in a GMP-certified facility.",
        icon: "fas fa-dumbbell",
        images: ["images/Mal Mix.PNG.png"],
        ingredients: [
            { name: "Agnihas Herb",  img: "images/Agnihas Herb.jpg",  desc: "Agnihas Herb supports digestion, metabolism, and natural detoxification." },
            { name: "Bindal Fruit",  img: "images/Bindal Fruit.jpg",  desc: "Bindal Fruit supports digestive health and body strength." },
            { name: "Kanchana",      img: "images/Kanchana.jpg",      desc: "Kanchana supports glandular health and healthy metabolism." },
            { name: "Guduchi Root",  img: "images/Guduchi Root.jpg",  desc: "Guduchi (Giloy) supports immunity, digestion, and energy levels." },
            { name: "Chiretta Fruit",img: "images/Chiretta Fruit.jpg",desc: "Chiretta Fruit supports liver wellness and natural detoxification." },
            { name: "Nagpheni",      img: "images/Nagpheni.jpg",      desc: "Nagpheni supports digestion, body hydration, and skin wellness." },
            { name: "Shankhauli",    img: "images/Shankhauli.jpg",    desc: "Shankhauli supports digestion, body strength, and overall wellness." }
        ],
        quantities: [{ label: "30ML", price: "₹32" }, { label: "60ML", price: "₹45" }]
    },
    {
        name: "Gas Q", price: "₹70",
        desc: "Gas-Q Gastric Syrup is a premium Ayurvedic digestive aid designed to provide rapid relief from gastric problems, acidity, and flatulence. Utilizing Saunf, Podina, Ajmoda, and Jeera, this GMP-certified syrup soothes the digestive tract and improves overall gut health.",
        icon: "fas fa-leaf",
        images: ["images/Gas Q1.PNG.png","images/Gas Q2.PNG.png","images/Gas Q3.PNG.png","images/Gas Q4.PNG.png"],
        ingredients: [
            { name: "Saunf Big",      img: "images/Saunf Big.jpg",      desc: "Saunf (Fennel) improves digestion, reduces bloating, and freshens breath." },
            { name: "Jeera Black",    img: "images/Jeera Black Seed.jpg",desc: "Black Jeera supports healthy digestion and reduces gas." },
            { name: "Podina Leaf",    img: "images/Podina Leaf.jpg",     desc: "Podina (Mint) supports digestion and relieves nausea." },
            { name: "Dhania Seed",    img: "images/Dhania Seed.jpg",     desc: "Dhania seeds support healthy digestion and reduce acidity." },
            { name: "Harad Small",    img: "images/Harad Small Fruit.jpg",desc: "Harad Small Fruit supports digestion, gut health, and detoxification." },
            { name: "Makoy Fruit",    img: "images/Makoy Fruit.jpg",     desc: "Makoy fruit supports liver function and natural detoxification." },
            { name: "Baheda Fruit",   img: "images/Baheda Fruit.jpg",    desc: "Baheda fruit supports digestion, respiratory health, and immunity." },
            { name: "Ajmoda Seed",    img: "images/Ajmoda Seed.jpg",     desc: "Ajmoda seeds support digestion and reduce bloating." },
            { name: "Guduch Root",    img: "images/Guduch Root.jpg",     desc: "Guduch (Giloy) supports immunity, energy, and overall health." }
        ],
        quantities: [{ label: "110ML", price: "₹70" }, { label: "220ML", price: "₹100" }]
    },
    {
        name: "Dige Q", price: "₹70",
        desc: "Dige-Q Digestive Syrup is an Ayurvedic medicine formulated over 51 years in healthcare. This GMP-certified syrup is an effective remedy for indigestion, lack of appetite, and various gastric and stomach troubles.",
        icon: "fas fa-heartbeat",
        images: ["images/Dige Q1.PNG.png","images/Dige Q2.PNG.png","images/Dige Q3.PNG.png","images/Dige Q4.PNG.png"],
        ingredients: [
            { name: "Harad Fruit",   img: "images/Harad Fruit.jpg",   desc: "Harad (Haritaki) supports healthy digestion and natural body cleansing." },
            { name: "Baheda Fruit",  img: "images/Baheda Fruit.jpg",  desc: "Baheda supports respiratory health, digestion, and detoxification." },
            { name: "Amla Fruit",    img: "images/Amla Fruit.jpg",    desc: "Amla is rich in Vitamin C and antioxidants, supporting immunity." },
            { name: "Sonth Rhizome", img: "images/Sonth Rhizome.jpg", desc: "Sonth (Dry Ginger) improves digestion and reduces bloating." },
            { name: "Pippli Seed",   img: "images/Pippli Seed.jpg",   desc: "Pippli (Long Pepper) supports digestion and respiratory health." },
            { name: "Methi Seed",    img: "images/Methi Seed.jpg",    desc: "Methi seeds support digestion and healthy metabolism." },
            { name: "Jeera Seed",    img: "images/Jeera Seed.jpg",    desc: "Jeera seeds improve appetite and support digestive comfort." },
            { name: "Ajmoda Seed",   img: "images/Ajmoda Seed.jpg",   desc: "Ajmoda seeds support digestion and reduce bloating." },
            { name: "Guduch Root",   img: "images/Guduch Root.jpg",   desc: "Guduch (Giloy) supports immunity, digestion, and energy." }
        ],
        quantities: [{ label: "110ML", price: "₹70" }, { label: "220ML", price: "₹100" }]
    },
    {
        name: "Memory Q", price: "₹100",
        desc: "Memory-Q Syrup is a premium Ayurvedic brain tonic and memory booster designed to enhance cognitive function and mental clarity. Enriched with Ashwagandha, Brahmi, Shankhapushpi, and Saffron, it supports peak mental performance and focus.",
        icon: "fas fa-brain",
        images: ["images/Memory Q1.PNG.png","images/Memory Q2.PNG.png","images/Memory Q3.PNG.png","images/Memory Q4.PNG.png"],
        ingredients: [
            { name: "Ashwagandha Root",   img: "images/Ashwagandha Root.jpg",  desc: "Ashwagandha root supports energy, stamina, and overall wellness." },
            { name: "Shatawari Root",     img: "images/Shatawari Root.jpg",    desc: "Shatawari root supports nourishment, strength, and wellness." },
            { name: "Kavach Seed",        img: "images/Kavach Seed.jpg",       desc: "Kavach seed supports strength, vitality, and nervous system health." },
            { name: "Vidarikand Root",    img: "images/Vidarikand Root.jpg",   desc: "Vidarikand root supports energy and physical wellness." },
            { name: "Shankhapushpi Herb", img: "images/Shankhapushpi Herb.jpg",desc: "Shankhapushpi supports memory, concentration, and mental clarity." },
            { name: "Brahmi Booti",       img: "images/Brahmi Booti.jpg",      desc: "Brahmi supports memory, focus, and nervous system health." },
            { name: "Amla Fruit",         img: "images/Amla Fruit.jpg",        desc: "Amla supports immunity, digestion, and overall wellness." },
            { name: "Punarnava Root",     img: "images/Punarnava Root.jpg",    desc: "Punarnava root supports kidney and liver health." },
            { name: "Arjuna Bark",        img: "images/Arjuna Bark.jpg",       desc: "Arjuna bark supports heart health and blood circulation." }
        ],
        quantities: [{ label: "220ML", price: "₹100" }]
    }
];

// ── Modal Logic ───────────────────────────────────────────────
const productModal = document.getElementById('productModal');
if (productModal) {
    const modalClose   = document.getElementById('modalClose');
    const mainImage    = document.getElementById('mainImage');
    const galleryImgEls = [
        document.getElementById('galleryImage1'),
        document.getElementById('galleryImage2'),
        document.getElementById('galleryImage3')
    ];

    function setGalleryImages(images, productName) {
        galleryImgEls.forEach((el, i) => {
            el.innerHTML = '<i class="fas fa-image" style="font-size:1.5rem;color:var(--gray);"></i>';
            el.onclick = null;
            el.classList.remove('active');
            el.style.display = 'none';
        });
        galleryImgEls.forEach((el, i) => {
            if (images[i + 1]) {
                el.style.display = 'flex';
                el.innerHTML = `<img src="${images[i+1]}" alt="${productName} ${i+2}">`;
                el.onclick = () => {
                    const prev = mainImage.querySelector('img').src;
                    mainImage.innerHTML = `<img src="${images[i+1]}" alt="${productName}">`;
                    el.innerHTML = `<img src="${prev}" alt="${productName} ${i+2}">`;
                    galleryImgEls.forEach(g => g.classList.remove('active'));
                    el.classList.add('active');
                };
            }
        });
    }

    function openProductModal(product) {
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductDesc').textContent = product.desc;

        const quantitySection  = document.getElementById('modalQuantitySection');
        const quantityOptions  = document.getElementById('quantityOptions');
        const priceElement     = document.getElementById('modalProductPrice');

        const defaultImages = product.images && product.images.length ? product.images : [''];

        if (product.quantities && product.quantities.length) {
            quantitySection.style.display = 'block';
            quantityOptions.innerHTML = '';
            product.quantities.forEach((qty, idx) => {
                const btn = document.createElement('div');
                btn.className = 'quantity-option' + (idx === 0 ? ' active' : '');
                btn.innerHTML = `<span class="qty-label">${qty.label}</span>`;
                btn.onclick = () => {
                    priceElement.textContent = qty.price;
                    document.querySelectorAll('.quantity-option').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const imgs = qty.images && qty.images.length ? qty.images : defaultImages;
                    mainImage.innerHTML = imgs[0] ? `<img src="${imgs[0]}" alt="${product.name}">` : '<i class="fas fa-image" style="font-size:4rem;color:var(--gray);"></i>';
                    setGalleryImages(imgs, product.name);
                };
                quantityOptions.appendChild(btn);
            });
            priceElement.textContent = product.quantities[0].price;
        } else {
            quantitySection.style.display = 'none';
            priceElement.textContent = product.price;
        }

        mainImage.innerHTML = defaultImages[0]
            ? `<img src="${defaultImages[0]}" alt="${product.name}">`
            : '<i class="fas fa-image" style="font-size:4rem;color:var(--gray);"></i>';
        setGalleryImages(defaultImages, product.name);

        // Ingredients
        const grid = document.getElementById('ingredientsGridFull');
        grid.innerHTML = '';
        if (product.ingredients && product.ingredients.length) {
            const container = document.createElement('div');
            container.className = 'ingredients-table';
            product.ingredients.forEach(ing => {
                const item = document.createElement('div');
                item.className = 'ingredient-item';
                const imgHtml = ing.img
                    ? `<img src="${ing.img}" alt="${ing.name}">`
                    : `<div class="ingredient-icon"><i class="${ing.icon || 'fas fa-leaf'}"></i></div>`;
                item.innerHTML = `${imgHtml}<div><p><strong>${ing.name}</strong></p><p class="ingredient-desc">${ing.desc || ''}</p></div>`;
                container.appendChild(item);
            });
            grid.appendChild(container);
        }

        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
        productModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (modalClose) modalClose.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', e => { if (e.target === productModal) closeProductModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProductModal(); });

    // Generate product cards
    const grid = document.getElementById('productsGrid');
    if (grid) {
        products.forEach((product, i) => {
            const card = document.createElement('div');
            card.className = 'product-card fade-in';
            const imgSrc = product.images && product.images.length ? product.images[0] : '';
            card.innerHTML = `
                <div class="product-image" style="background:linear-gradient(135deg,var(--light-gray),var(--white));">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${product.name}" style="width:100%;height:100%;object-fit:contain;padding:1rem;">` : `<i class="${product.icon}" style="font-size:3rem;color:var(--primary-teal);"></i>`}
                </div>
                <div class="product-info">
                    <div class="product-price">${product.price}</div>
                    <h4>${product.name}</h4>
                    <p>${product.desc.substring(0,60)}...</p>
                </div>
            `;
            card.addEventListener('click', () => openProductModal(product));
            grid.appendChild(card);
            productObserver.observe(card);
        });
    }
}
