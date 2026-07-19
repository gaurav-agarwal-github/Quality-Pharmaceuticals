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
    mobileMenu.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        mobileMenu.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-expanded', 'false');
    }));
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
    AOS.init({ duration: 600, once: true, offset: 60, easing: 'ease-out' });
}

// ── Stats Counter Animation ──────────────────────────────────
function animateCounters() {
    document.querySelectorAll('[data-target]').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 1500;
        const startedAt = performance.now();
        const update = now => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased).toLocaleString('en-IN');
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    });
}

// ── Fade-in + Stats Observer ─────────────────────────────────
let countersAnimated = false;
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (!countersAnimated && entry.target.querySelector('[data-target]')) {
                countersAnimated = true;
                animateCounters();
            }
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── Product Cards: staggered appearance ──────────────────────
const productObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 70);
            productObserver.unobserve(entry.target);
        }
    });
});
document.querySelectorAll('.product-card').forEach(card => productObserver.observe(card));


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

// ── Contact ───────────────────────────────────────────────────
const _ce = atob('Y2F0Y2hnYXVyYXZhZ2Fyd2FsQGdtYWlsLmNvbQ==');

function openGmail(subject, body) {
    const url = 'https://mail.google.com/mail/?view=cm&to=' +
        encodeURIComponent(_ce) +
        '&su=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    window.open(url, '_blank');
}

const enquiryProduct = new URLSearchParams(window.location.search).get('product');
const contactForm = document.querySelector('.contact-form');
if (contactForm && enquiryProduct) {
    const messageField = contactForm.querySelector('textarea');
    if (messageField) messageField.value = `I would like to enquire about ${enquiryProduct}. Please share availability and ordering details.`;
}
if (contactForm) {
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdardaey';

    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const fields    = e.target.querySelectorAll('input, textarea');

        // Disable button while sending
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        const data = {
            name:    fields[0].value,
            email:   fields[1].value,
            phone:   fields[2].value,
            message: fields[3].value,
            product: enquiryProduct || 'General enquiry'
        };

        try {
            const res = await fetch(FORMSPREE_ENDPOINT, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body:    JSON.stringify(data)
            });

            if (res.ok) {
                // Show success message inside the form
                contactForm.innerHTML = `
                    <div style="text-align:center;padding:3rem 1rem;">
                        <div style="font-size:3rem;color:var(--primary-teal);margin-bottom:1rem;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h3 style="color:var(--navy-blue);margin-bottom:0.75rem;">Thank You!</h3>
                        <p style="color:var(--navy-light);">Your message has been sent. We will get back to you soon.</p>
                    </div>`;
            } else {
                throw new Error('Failed');
            }
        } catch {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            alert('Something went wrong. Please try again or call us directly.');
        }
    });
}

const emailBtn = document.getElementById('emailBtn');
if (emailBtn) {
    emailBtn.addEventListener('click', () => openGmail('Enquiry – Quality Pharmaceuticals', ''));
}

// ── Products Data ─────────────────────────────────────────────
const products = [
    {
        name: "QuasoCOL", price: "₹140",
        suitableFor: "Ladies only",
        dose: "Two teaspoons (10 mL) twice or three times daily with water.",
        category: "Women\u0027s Wellness",
        indications: [{"en":"Painful, irregular, scanty, or delayed menstrual cycles","hi":"दर्दनाक, अनियमित, कम या देर से आने वाला मासिक धर्म"},{"en":"Anaemia and waist pain","hi":"एनीमिया और कमर दर्द"},{"en":"Leucorrhoea","hi":"श्वेत प्रदर"},{"en":"Physical weakness","hi":"शारीरिक कमजोरी"},{"en":"Convalescence support","hi":"स्वास्थ्य लाभ में मदद"}],
        results: ["Helps regulate the menstrual cycle and improve flow","Supports reproductive health","Reduces menstrual pain and vaginal discharge","Supports haemoglobin improvement and reduced weakness"],
        desc: "This proprietary Ayurvedic medicine is a comprehensive herbal formula primarily indicated for addressing menstrual disorders, including painful, irregular, or delayed cycles. Enriched with a potent blend of traditional ingredients such as Ashoka Bark, Kala Jeera, and Arjuna Bark, the syrup is formulated to alleviate physical weakness, anemia, and pelvic pain. Designed for Improved Quality, this health tonic serves as a restorative supplement to support reproductive health and overall vitality.",
        icon: "fas fa-capsules",
        images: ["images/optimized/QuasoCOL1.png.webp","images/optimized/QuasoCOL2.png.webp","images/optimized/QuasoCOL3.png.webp","images/optimized/QuasoCOL4.png.webp"],
        ingredients: [
            { name: "Ashoka Bark (Saraca asoca)",           img: "images/optimized/Ashoka Bark.jpg.webp",        desc: "Ashoka bark is a highly valued Ayurvedic ingredient traditionally used to support women's wellness and reproductive health. It may help promote hormonal balance, comfort, and overall vitality." },
            { name: "Kala Jeera Seed (Bunium persicum)",    img: "images/optimized/Kala Jeera Seed.jpg.webp",    desc: "Kala Jeera seeds are traditionally used in Ayurveda for their digestive and wellness-supporting properties. They may help support digestion, metabolism, and overall body balance." },
            { name: "Daru Haldi Rhizome (Berberis aristata)", img: "images/optimized/Daru Haldi Rhizome.jpg.webp", desc: "Daru Haldi rhizome is known in Ayurveda for its cleansing and anti-inflammatory properties. It may help support skin health, digestion, immunity, and overall wellness." },
            { name: "Lal Chandan (Pterocarpus santalinus)", img: "images/optimized/Lal Chandan Powder.jpg.webp", desc: "Lal Chandan powder, also known as Red Sandalwood, is valued for its cooling and soothing properties. It may help support skin wellness, relaxation, and overall natural balance." },
            { name: "Chansoor Seed (Lepidium sativum)",     img: "images/optimized/Chansoor Seed.jpg.webp",      desc: "Chansoor seeds are rich in nutrients and traditionally used in Ayurveda to support strength, digestion, and overall wellness. They may also help promote energy and nourishment." },
            { name: "Konch Seed (Mucuna pruriens)",         img: "images/optimized/Konch Seed.jpg.webp",         desc: "Konch seeds, also known as Mucuna Pruriens, are valued in Ayurveda for supporting strength, stamina, nervous system health, and overall vitality." },
            { name: "Arjuna Bark (Terminalia arjuna)",      img: "images/optimized/Arjuna Bark.jpg.webp",        desc: "Arjuna bark is a respected Ayurvedic ingredient traditionally used to support heart health and circulation. It may help promote cardiovascular wellness, stamina, and overall vitality." },
            { name: "Punarnava Root (Boerhavia diffusa)",   img: "images/optimized/Punarnava Root.jpg.webp",     desc: "Punarnava root is widely used in Ayurveda for its rejuvenating and cleansing properties. It may help support kidney health, digestion, fluid balance, and overall body wellness." },
            { name: "Palash Flowers (Butea monosperma)",   img: "images/optimized/Palash Flowers.jpg.webp",     desc: "Palash flowers are traditionally used in Ayurveda for their cleansing and wellness-supporting properties. They may help support digestion, skin wellness, and overall natural health." }
        ],
        quantities: [{ label: "225ML", price: "₹140" }, { label: "450ML", price: "₹240" }]
    },
    {
        name: "Femina", price: "₹70",
        suitableFor: "Ladies only",
        dose: "Two capsules daily after meals, or as directed by a physician.",
        category: "Women\u0027s Wellness",
        indications: [{"en":"Painful, irregular, scanty, or delayed menstrual cycles","hi":"दर्दनाक, अनियमित, कम या देर से आने वाला मासिक धर्म"},{"en":"Leucorrhoea","hi":"श्वेत प्रदर"},{"en":"Physical weakness","hi":"शारीरिक कमजोरी"}],
        results: ["Helps regulate the menstrual cycle and improve flow","Supports reproductive health","Improves uterine strength and daily wellness","Reduces menstrual pain"],
        desc: "A proprietary Ayurvedic medicine for women’s health, Femina Capsules are formulated to support menstrual wellness and help in conditions related to irregular, painful, scanty, or delayed menstrual cycles. Enriched with trusted Ayurvedic herbs, it acts as a uterine stimulant and tonic for women’s care.",
        icon: "fas fa-capsules",
        images: ["images/optimized/Femina1.PNG.png.webp","images/optimized/Femina2.PNG.png.webp"],
        ingredients: [
            { name: "Ashoka Bark (Saraca asoca)",           img: "images/optimized/Ashoka Bark.jpg.webp",      desc: "Ashoka bark is a revered Ayurvedic herb traditionally used to support women's reproductive health and menstrual wellness." },
            { name: "Lodhra Bark (Symplocos racemosa)",     img: "images/optimized/Lodhra Bark.jpg.webp",      desc: "Lodhra bark is widely valued in Ayurveda for its cooling and astringent properties. It may help support women's wellness and promote healthy skin." },
            { name: "Konch Seed (Mucuna pruriens)",         img: "images/optimized/Konch Seed.jpg.webp",       desc: "Konch seed is a powerful Ayurvedic ingredient known for supporting strength, stamina, and nervous system health." },
            { name: "Sonth Rhizome (Zingiber officinale)",  img: "images/optimized/Sonth Rhizome.jpg.webp",    desc: "Sonth rhizome, or dried ginger, is highly valued in Ayurveda for its warming and digestive properties." },
            { name: "Ashwagandha Root (Withania somnifera)",img: "images/optimized/Ashwagandha Root.jpg.webp", desc: "Ashwagandha root is a renowned Ayurvedic herb known for its adaptogenic and rejuvenating properties." },
            { name: "Shatavari Root (Asparagus racemosus)", img: "images/optimized/Shatavari Root.jpg.webp",   desc: "Shatavari root is a highly respected Ayurvedic herb traditionally used to support women's health and hormonal balance." },
            { name: "Gokhru Fruit (Tribulus terrestris)",   img: "images/optimized/Gokhru Fruit.jpg.webp",     desc: "Gokhru fruit is valued in Ayurveda for supporting urinary health, stamina, and vitality." }
        ],
        quantities: [{ label: "10CAPS", price: "₹70" }]
    },
    {
        name: "Liv-top", price: "₹100",
        suitableFor: "All ages - children and adults",
        dose: "Children: 2-3 teaspoons twice daily. Adults: 3-4 teaspoons twice daily.",
        category: "Liver \u0026 Tonics",
        indications: [{"en":"Hepatitis, cirrhosis, and alcohol-related liver damage","hi":"हेपेटाइटिस, सिरोसिस और शराब से संबंधित लिवर की क्षति"},{"en":"Jaundice and biliary dysfunctions","hi":"पीलिया और पित्त-संबंधी विकार"},{"en":"Indigestion and poor appetite","hi":"अपच और भूख न लगना"}],
        results: ["Supports liver protection","Supports jaundice care","Promotes appetite and digestion"],
        desc: "Liv-top Syrup is marketed as a Liver Stimulant & Tonic and is intended to be a dietary supplement. Enriched with powerful Ayurvedic herbs including Bhringraj, Arjun bark, Makoi, and Tulsi, it is formulated to support healthy liver function and overall wellness. GMP-certified and trusted since 1967.",
        icon: "fas fa-lungs",
        images: ["images/optimized/Liv-top 1.PNG.png.webp","images/optimized/Liv-top 2.PNG.png.webp","images/optimized/Liv-top 3.PNG.png.webp","images/optimized/Liv-top 4.PNG.png.webp"],
        ingredients: [
            { name: "Bhringraj Plant (Eclipta alba)",          img: "images/optimized/Bhringraj plant.PNG.jpg.webp",    desc: "Bhringraj is a medicinal herb widely used in Ayurveda, known for supporting liver health and hair growth." },
            { name: "Arjun Bark (Terminalia arjuna)",          img: "images/optimized/Arjun Bark.PNG.jpg.webp",         desc: "Arjuna bark contains natural antioxidants that may help strengthen heart muscles and improve blood circulation." },
            { name: "Makoi Fruit (Solanum nigrum)",            img: "images/optimized/Makoi fruit.PNG.webp",            desc: "Makoi, also known as Black Nightshade, may help reduce inflammation and support liver function." },
            { name: "Tulsi Leaf (Ocimum sanctum)",             img: "images/optimized/Tulsi leaf.PNG.webp",             desc: "Tulsi, Holy Basil, is known for boosting immunity and supporting respiratory health." },
            { name: "Pittapapda Plant (Fumaria officinalis)",  img: "images/optimized/Pittapapda plant.PNG.webp",       desc: "Pittapapda is an Ayurvedic herb traditionally used for liver health, skin problems, and body cooling." },
            { name: "Sarpunkha Panchang (Tephrosia purpurea)",img: "images/optimized/Sarpunkha Panchang.PNG.PNG.webp", desc: "Sarpunkha is traditionally known for supporting liver and spleen health, improving digestion, and body detoxification." },
            { name: "Vidanga Seed (Embelia ribes)",            img: "images/optimized/Vidanga seed.PNG.webp",           desc: "Vidanga seeds are widely used for digestive and detox support, with anti-parasitic and antimicrobial properties." },
            { name: "Ghritkumari Sap (Aloe barbadensis)",     img: "images/optimized/Ghritkumari sap.PNG.webp",        desc: "Ghritkumari sap (Aloe Vera) may help improve digestion, support liver health, and boost hydration." }
        ],
        quantities: [
            { label: "110ML Syrup", price: "₹100" },
            { label: "220ML Syrup", price: "₹140" },
            { label: "30ML Drops",  price: "₹70",  images: ["images/optimized/LivtopDrops1.PNG.png.webp","images/optimized/LivtopDrops2.PNG.png.webp"] },
            { label: "10 CAPS",     price: "₹70",  images: ["images/optimized/Liv-top 7.PNG.png.webp","images/optimized/Liv-top 8.PNG.png.webp"] }
        ]
    },
    {
        name: "QoughSOL", price: "₹70",
        suitableFor: "All ages - children and adults",
        dose: "Children: 5 mL three times daily. Adults: 10 mL three times daily.",
        category: "Cough \u0026 Allergy",
        indications: [{"en":"All types of cough","hi":"सभी प्रकार की खाँसी"},{"en":"Sore throat","hi":"गले की खराश"},{"en":"Bronchitis","hi":"ब्रोंकाइटिस"},{"en":"Smoker\u0027s cough","hi":"धूम्रपान से होने वाली खाँसी"},{"en":"Catarrh","hi":"बलगम की समस्या"}],
        results: ["Relieves cough","Helps clear mucus","Soothes sore throat","Supports easy breathing"],
        desc: "QoughSol is an herbal cough syrup that provides quick relief from various cough symptoms. As a GMP-certified product established in 1967, it blends long-standing tradition with certified manufacturing standards to support respiratory health.",
        icon: "fas fa-bacteria",
        images: ["images/optimized/Qoughsol 1.PNG.png.webp","images/optimized/Qoughsol 2.PNG.png.webp","images/optimized/Qoughsol 3.PNG.png.webp","images/optimized/Qoughsol 4.PNG.png.webp"],
        ingredients: [
            { name: "Vasika Leaves (Adhatoda vasica)",      img: "images/optimized/Vasika leaf.jpg.webp",     desc: "Vasika leaves are a well-known Ayurvedic herb traditionally used to support respiratory and lung health." },
            { name: "Tulsi Leaf (Ocimum sanctum)",          img: "images/optimized/Tulsi leaf.PNG.webp",      desc: "Tulsi, Holy Basil, is a popular Ayurvedic herb known for boosting immunity and supporting respiratory health." },
            { name: "Mulethi Rhizome (Glycyrrhiza glabra)", img: "images/optimized/Mulethi rhizome.jpg.webp", desc: "Mulethi (Licorice root) is used in Ayurveda for soothing throat irritation and respiratory support." },
            { name: "Khareti (Sida cordifolia)",            img: "images/optimized/Khareti.jpg.webp",         desc: "Khareti is a traditional Ayurvedic herb known for its strengthening and rejuvenating properties." },
            { name: "Amaltas Pulp (Cassia fistula)",        img: "images/optimized/Amaltas pulp.jpg.webp",    desc: "Amaltas pulp is a widely used Ayurvedic ingredient known for its gentle cleansing and digestive-supporting properties." },
            { name: "Neelophar (Nymphaea stellata)",        img: "images/optimized/Neelophar.jpg.webp",       desc: "Neelophar (Blue Lotus) may help promote relaxation, reduce stress, and support restful sleep." },
            { name: "Unnab (Ziziphus jujuba)",              img: "images/optimized/Unnab.jpg.webp",           desc: "Unnab (Jujube) may help support respiratory health, improve digestion, and strengthen immunity." },
            { name: "Banafsha (Viola odorata)",             img: "images/optimized/Banafsha.jpg.webp",        desc: "Banafsha (Sweet Violet) may help support respiratory health and relieve cough and throat irritation." },
            { name: "Peppermint (Mentha piperita)",         img: "images/optimized/Peppermint.jpg.webp",      desc: "Peppermint is a refreshing herb known for its cooling and digestive-supporting properties." }
        ],
        quantities: [{ label: "60ML", price: "₹70" }, { label: "110ML", price: "₹100" }]
    },
    {
        name: "Infantol (Babies Tonic)", price: "₹70",
        suitableFor: "Infants and children",
        dose: "Infants: 1/2 teaspoon (2.5 mL) twice daily. Children: 1 teaspoon (5 mL) twice daily.",
        category: "Baby \u0026 Family",
        indications: [{"en":"Growth failure","hi":"विकास में रुकावट"},{"en":"Physical fatigue","hi":"शारीरिक थकान"},{"en":"Convalescence","hi":"आरोग्यलाभ"},{"en":"Malnutrition and loss of appetite","hi":"कुपोषण और भूख न लगना"}],
        results: ["Supports healthy growth and development","Improves appetite and digestion","Strengthens immunity","Supports healthy weight gain","Promotes overall strength and wellness"],
        desc: "Infantol (Babies Tonic) is a gentle health tonic specially formulated for babies to support healthy growth, digestion, immunity, and overall development. Made with carefully selected ingredients, it helps promote strength, appetite, and daily wellness in growing children.",
        icon: "fas fa-bone",
        images: ["images/optimized/Infantol (Babies Tonic)1.PNG.png.webp","images/optimized/Infantol (Babies Tonic)2.PNG.png.webp","images/optimized/Infantol (Babies Tonic)3.PNG.png.webp","images/optimized/Infantol (Babies Tonic)4.PNG.png.webp"],
        ingredients: [
            { name: "Javitri Leaves (Myristica fragrans)",         img: "images/optimized/Javitri leaves.jpg.webp",    desc: "Javitri leaves are valued for their aromatic and wellness-supporting properties." },
            { name: "Pushkarmool Root (Inula racemosa)",           img: "images/optimized/Pushkarmool root.jpg.webp",  desc: "Pushkarmool root is used to support respiratory and heart health." },
            { name: "Atis Root (Aconitum heterophyllum)",          img: "images/optimized/Atis root.jpg.webp",         desc: "Atis root is valued for its digestive and wellness-supporting properties." },
            { name: "Black Pepper Seeds (Piper nigrum)",           img: "images/optimized/Black Pepper seeds.jpg.webp",desc: "Black Pepper seeds may help improve digestion and boost immunity." },
            { name: "Unnab (Ziziphus jujuba)",                     img: "images/optimized/Unnab.jpg.webp",             desc: "Unnab (Jujube) supports respiratory health, digestion, and immunity." },
            { name: "Nagarmotha Root (Cyperus rotundus)",          img: "images/optimized/Nagarmotha root.jpg.webp",   desc: "Nagarmotha root is known for its digestive and detoxifying properties." },
            { name: "Kantkari (Solanum xanthocarpum)",             img: "images/optimized/Kantkari.jpg.webp",          desc: "Kantkari is widely used for respiratory health support." },
            { name: "Baheda Root (Terminalia bellirica)",          img: "images/optimized/Baheda root.jpg.webp",       desc: "Baheda root is valued for its detoxifying and rejuvenating properties." },
            { name: "Tulsi Leaf (Ocimum sanctum)",                 img: "images/optimized/Tulsi leaf.PNG.webp",        desc: "Tulsi boosts immunity and supports respiratory health." }
        ],
        quantities: [
            { label: "60ML Syrup",  price: "₹70" },
            { label: "30ML Drops",  price: "₹60", images: ["images/optimized/Infantol Drops1.PNG.png.webp","images/optimized/Infantol Drops2.PNG.png.webp","images/optimized/Infantol Drops3.PNG.png.webp","images/optimized/Infantol Drops4.PNG.png.webp"] }
        ]
    },
    {
        name: "Infantol (Family Tonic)", price: "₹100",
        suitableFor: "All ages - children and adults",
        dose: "Two to three teaspoonfuls three times daily after meals, or as directed by a physician.",
        category: "Baby \u0026 Family",
        indications: [{"en":"Malnutrition and loss of appetite","hi":"कुपोषण और भूख न लगना"},{"en":"Physical fatigue","hi":"शारीरिक थकान"},{"en":"Convalescence","hi":"आरोग्यलाभ"},{"en":"Weight loss","hi":"वज़न घटना"}],
        results: ["Strengthens immunity","Improves digestion","Supports daily energy and vitality","Promotes strength, recovery, and healthy functioning"],
        desc: "Infantol (Family Tonic) is a nourishing family health tonic formulated to support overall wellness, immunity, digestion, and daily energy levels. Enriched with beneficial herbal ingredients, it helps maintain strength and vitality for all age groups as part of a healthy lifestyle.",
        icon: "fas fa-heart",
        images: ["images/optimized/Infantol1.PNG.png.webp","images/optimized/Infantol2.PNG.png.webp","images/optimized/Infantol3.PNG.png.webp","images/optimized/Infantol4.PNG.png.webp"],
        ingredients: [
            { name: "Pokharmool Root (Inula racemosa)",       img: "images/optimized/Pokharmool root.jpg.webp",  desc: "Pokharmool root is valued for supporting respiratory and heart health." },
            { name: "Atees Root (Aconitum heterophyllum)",    img: "images/optimized/Atees root.jpg.webp",        desc: "Atees root supports digestion, appetite, and overall wellness." },
            { name: "Pepper Seed (Piper nigrum)",             img: "images/optimized/pepper seed.jpg.webp",       desc: "Pepper seeds support digestion, metabolism, and immunity." },
            { name: "Unnab (Ziziphus jujuba)",                img: "images/optimized/Unnab.jpg.webp",             desc: "Unnab (Jujube) supports respiratory health and immunity." },
            { name: "Nagarmotha Root (Cyperus rotundus)",     img: "images/optimized/Nagarmotha root.jpg.webp",   desc: "Nagarmotha root supports digestion and detoxification." },
            { name: "Kantkari Herb (Solanum xanthocarpum)",   img: "images/optimized/Kantkari herb.jpg.webp",     desc: "Kantkari supports respiratory wellness." },
            { name: "Baheda Root (Terminalia bellirica)",     img: "images/optimized/Baheda root.jpg.webp",       desc: "Baheda root supports detoxification and respiratory health." },
            { name: "Tulsi Leaf (Ocimum sanctum)",            img: "images/optimized/Tulsi leaf.PNG.webp",        desc: "Tulsi boosts immunity and supports respiratory health." },
            { name: "Bhringraj Seed (Eclipta alba)",          img: "images/optimized/Bhringraj seed.jpg.webp",    desc: "Bhringraj seeds support hair health, liver function, and overall wellness." }
        ],
        quantities: [{ label: "100ML", price: "₹100" }, { label: "200ML", price: "₹140" }]
    },
    {
        name: "Energyon", price: "₹100",
        suitableFor: "All ages - children and adults",
        dose: "Two teaspoons (10 mL) twice daily after meals.",
        category: "Tonics \u0026 Wellness",
        indications: [{"en":"Physical and mental weakness with poor stamina","hi":"शारीरिक और मानसिक कमजोरी, कम स्टैमिना और थकान"},{"en":"Malnutrition and poor appetite","hi":"कुपोषण और भूख न लगना"},{"en":"Liver dysfunction and detox support","hi":"लिवर की खराबी और डिटॉक्स सहायता"},{"en":"Fatigue and convalescence","hi":"थकान और बीमारी से उबरना"}],
        results: ["Improves energy and stamina","Supports recovery","Boosts vitality"],
        desc: "EnergyOn Syrup is a proprietary Ayurvedic restorative tonic designed to support overall physical and mental well-being. Formulated with Ashwagandha, Shatavari, Kesar (Saffron), and Amla, this syrup is indicated for addressing poor stamina, malnutrition, and lack of appetite.",
        icon: "fas fa-bolt",
        images: ["images/optimized/Energyon1.png.webp","images/optimized/Energyon2.png.webp","images/optimized/Energyon3.png.webp","images/optimized/Energyon4.png.webp"],
        ingredients: [
            { name: "Ashwagandha Root (Withania somnifera)",    img: "images/optimized/Ashwagandha Root.jpg.webp",   desc: "Ashwagandha root is known for its adaptogenic and rejuvenating properties." },
            { name: "Shatawari Root (Asparagus racemosus)",     img: "images/optimized/Shatawari Root.jpg.webp",     desc: "Shatawari root supports vitality, hormonal balance, and overall wellness." },
            { name: "Kavach Seed (Mucuna pruriens)",            img: "images/optimized/Kavach Seed.jpg.webp",        desc: "Kavach seed supports strength, stamina, and nervous system health." },
            { name: "Vidarikand Root (Pueraria tuberosa)",      img: "images/optimized/Vidarikand Root.jpg.webp",    desc: "Vidarikand root supports energy, physical strength, and immunity." },
            { name: "Shankhpushpi Herb (Convolvulus pluricaulis)", img: "images/optimized/Shankhpushpi Herb.jpg.webp", desc: "Shankhpushpi supports memory, focus, and mental wellness." },
            { name: "Brahmi Booti (Bacopa monnieri)",           img: "images/optimized/Brahmi Booti.jpg.webp",       desc: "Brahmi supports memory, concentration, and nervous system wellness." },
            { name: "Amla Fruit (Phyllanthus emblica)",         img: "images/optimized/Amla Fruit.jpg.webp",         desc: "Amla is rich in antioxidants and Vitamin C, supporting immunity and digestion." },
            { name: "Punarnava Root (Boerhavia diffusa)",       img: "images/optimized/Punarnava Root.jpg.webp",     desc: "Punarnava root supports kidney health, digestion, and overall body wellness." },
            { name: "Arjuna Bark (Terminalia arjuna)",          img: "images/optimized/Arjuna Bark.jpg.webp",        desc: "Arjuna bark supports heart health, circulation, and overall vitality." }
        ],
        quantities: [
            { label: "100ML Syrup", price: "₹100" },
            { label: "200ML Syrup", price: "₹140" },
            { label: "10CAPS",      price: "₹150", images: ["images/optimized/Energyoncaps1.png.webp","images/optimized/Energyoncaps2.png.webp"] }
        ]
    },
    {
        name: "M.C Plus", price: "₹90",
        suitableFor: "Ladies only",
        dose: "Four teaspoons (20 mL) three times daily for at least two days after meals with warm water or milk.",
        category: "Women\u0027s Wellness",
        indications: [{"en":"Stopped or irregular menstruation","hi":"मासिक धर्म का रुकना या अनियमित होना"},{"en":"Scanty menstrual flow","hi":"कम मासिक स्राव"},{"en":"Painful menstruation","hi":"दर्दयुक्त मासिक धर्म"}],
        results: ["Helps regulate the menstrual cycle","Supports healthy menstrual flow","Reduces menstrual discomfort","Promotes women\u0027s reproductive wellness"],
        desc: "M.C Plus is a specialized Ayurvedic proprietary medicine formulated to support women's menstrual disorders. Designed for menstrual irregularities, these capsules leverage a traditional blend of botanical extracts to help regulate and restore a healthy monthly cycle.",
        icon: "fas fa-female",
        images: ["images/optimized/M.C Plus syrup1.PNG.png.webp","images/optimized/M.C Plus syrup2.PNG.png.webp","images/optimized/M.C Plus syrup3.PNG.png.webp","images/optimized/M.C Plus syrup4.PNG.png.webp"],
        ingredients: [
            { name: "Kalaunji (Nigella sativa)",          img: "images/optimized/Kalaunji.PNG.png.webp",    desc: "Kalonji (Black Seed) may help support immunity, digestion, and heart health." },
            { name: "Kapasmool (Gossypium herbaceum)",    img: "images/optimized/Kapasmool.PNG.png.webp",   desc: "Kapasmool supports women's health, digestion, and pain relief." },
            { name: "Olatkambal (Abroma augusta)",        img: "images/optimized/Olatkambal.PNG.png.webp",  desc: "Olatkambal root supports women's reproductive health and healthy menstrual cycles." },
            { name: "Gajar Seed (Daucus carota)",         img: "images/optimized/Gajar seed.PNG.png.webp",  desc: "Gajar seeds support digestion, urinary health, and body balance." },
            { name: "Indrayan (Citrullus colocynthis)",   img: "images/optimized/Indrayan.PNG.png.webp",    desc: "Indrayan supports detoxification and digestive health." },
            { name: "Soya (Glycine max)",                 img: "images/optimized/Soya.PNG.png.webp",        desc: "Soya seeds are rich in protein, fiber, vitamins, and antioxidants." },
            { name: "Kala Til (Sesamum indicum)",         img: "images/optimized/Kala Til.PNG.jpg.webp",    desc: "Kala Til (Black Sesame) supports bone strength, heart health, and digestion." },
            { name: "Muli (Raphanus sativus)",            img: "images/optimized/Muli.PNG.png.webp",        desc: "Muli seeds support digestion and liver function." },
            { name: "Sonth (Zingiber officinale)",        img: "images/optimized/Sonth.PNG.png.jpg.webp",   desc: "Sonth (Dry Ginger) improves digestion and reduces inflammation." }
        ],
        quantities: [
            { label: "100ML Syrup", price: "₹110" },
            { label: "200ML Syrup", price: "₹170" },
            { label: "6CAPS",       price: "₹90", images: ["images/optimized/M.E Plus1.PNG.png.webp","images/optimized/M.E Plus2.PNG.png.webp"] }
        ]
    },
    {
        name: "Quality LAL TEL", price: "₹70",
        suitableFor: "Babies only",
        dose: "For external use. Application directions are not specified in the brochure.",
        category: "Baby \u0026 Family",
        indications: [{"en":"Baby massage and physical-development support","hi":"शिशु मालिश और शारीरिक विकास में सहायता"}],
        results: ["Supports stronger bones and muscles","Deeply nourishes the skin","Improves muscle tone","Supports healthy physical development"],
        desc: "Quality Lal Tel is a premium baby massage oil specially formulated to strengthen bones and improve muscle tone. Enriched with Till Oil (Sesame) and traditional herbs like Shankhapushpi and Arjuna Bark, this GMP-certified oil deeply nourishes delicate skin while promoting physical development.",
        icon: "fas fa-baby",
        images: ["images/optimized/Quality lal tel1.PNG.png.webp","images/optimized/Quality lal tel2.PNG.png.webp","images/optimized/Quality lal tel3.PNG.png.webp","images/optimized/Quality lal tel4.PNG.png.webp"],
        ingredients: [
            { name: "Shankhapushpi (Convolvulus pluricaulis)", img: "images/optimized/Shankhapushpi.jpg.webp",    desc: "Shankhapushpi supports brain and nervous system health." },
            { name: "Manjistha Root (Rubia cordifolia)",       img: "images/optimized/Manjistha root.jpg.webp",   desc: "Manjistha root supports healthy skin and natural body cleansing." },
            { name: "Daruharidra Root (Berberis aristata)",    img: "images/optimized/Daruharidra root.jpg.webp", desc: "Daruharidra root supports liver health, healthy skin, and immunity." },
            { name: "Arjun Bark (Terminalia arjuna)",          img: "images/optimized/Arjun Bark.PNG.jpg.webp",   desc: "Arjuna bark supports heart health and blood circulation." },
            { name: "Urad Seeds (Vigna mungo)",                img: "images/optimized/Urad seeds.jpg.webp",       desc: "Urad seeds are highly nutritious, supporting strength and digestion." },
            { name: "Ratanjot (Alkanna tinctoria)",            img: "images/optimized/Ratanjot.jpg.webp",         desc: "Ratanjot supports skin health with cooling and anti-inflammatory properties." },
            { name: "Karpoor (Cinnamomum camphora)",           img: "images/optimized/Karpoor.jpg.webp",          desc: "Karpoor (Camphor) supports respiratory comfort and relaxation." },
            { name: "Neem Oil (Azadirachta indica)",           img: "images/optimized/Neem oil.jpg.webp",         desc: "Neem oil supports healthy skin and protection from infections." },
            { name: "Kala Til Oil (Sesamum indicum)",          img: "images/optimized/Til tel.jpg.webp",          desc: "Sesame oil supports joint and bone health and promotes overall strength." }
        ],
        quantities: [{ label: "50ML", price: "₹70" }, { label: "100ML", price: "₹110" }]
    },
{
    name: "Quality Gripe Water",
    suitableFor: "Babies only",
    dose: "1-6 months: 1/4-1 teaspoon. 6-12 months: 1-2 teaspoons. 1-2 years: 2-3 teaspoons. Give three times daily for one month.",
    category: "Baby \u0026 Family",
    indications: [{"en":"Gas, griping, and bloating","hi":"गैस, पेट में मरोड़ और फूलना"},{"en":"Indigestion, acidity, and teething discomfort","hi":"अपच, एसिडिटी और दाँत निकलने की परेशानी"}],
    results: ["Relieves gas, griping, and bloating","Improves digestion and digestive comfort","Helps soothe teething-related tummy discomfort"],
    price: "₹60",
    desc: "Quality Gripe Water is a proprietary Ayurvedic medicine formulated for infants and young children to support relief from indigestion, acidity, griping, flatulence, and digestive discomfort associated with teething. Its traditional herbal formulation helps promote comfortable digestion, regular bowel movement, and healthy growth when used as directed.",
    icon: "fas fa-baby",
    images: [
        "images/optimized/gripewater1.png.webp",
        "images/optimized/gripewater2.png.webp",
        "images/optimized/gripewater3.png.webp",
        "images/optimized/gripewater4.png.webp"
    ],
  ingredients: [
    {
        name: "Kauni",
        img: "images/optimized/kauni.jpg.webp",
        desc: "Kauni is traditionally used in digestive formulations to help support digestion and ease gas, griping, and abdominal discomfort."
    },
    {
        name: "Saunf (Foeniculum vulgare)",
        img: "images/optimized/Saunf.jpg.webp",
        desc: "Saunf, or fennel, is traditionally used to support digestion and help reduce gas, bloating, and digestive discomfort."
    },
    {
        name: "Pudina (Mentha)",
        img: "images/optimized/Podina Leaf.jpg.webp",
        desc: "Pudina, or mint, provides a cooling and soothing effect and is traditionally used to support comfortable digestion."
    },
    {
        name: "Saphura / Sharpunkha (Tephrosia purpurea)",
        img: "images/optimized/saphura.jpg.webp",
        desc: "Sharpunkha is an Ayurvedic herb traditionally used to support digestion, liver function, and overall gastrointestinal wellness."
    }
],
    quantities: [
        { label: "100ML", price: "₹60" }
    ]
},
    {
        name: "DADOL Skin Ointment", price: "₹60",
        suitableFor: "All ages - children and adults",
        dose: "Apply a thin layer to the affected area 2-3 times daily, or as directed by a physician.",
        category: "Skin Allergy",
        indications: [{"en":"Ringworm and fungal infections","hi":"दाद एवं फंगल संक्रमण"},{"en":"Scabies and itching","hi":"खुजली एवं स्केबीज़"},{"en":"Eczema and skin irritation","hi":"एक्जिमा एवं त्वचा की जलन"},{"en":"Skin rashes","hi":"त्वचा पर चकत्ते"}],
        results: ["Relieves itching","Helps control fungal infections","Soothes irritated skin","Promotes healthy skin"],
        desc: "This Ayurvedic skin ointment is a specialized herbal formula enriched with Neem to effectively treat various fungal and inflammatory skin conditions. It is specifically indicated for the relief of ringworm, scabies, eczema, and itchy skin.",
        icon: "fas fa-spray-can",
        images: ["images/optimized/DADOL1.png.webp","images/optimized/DADOL2.png.webp"],
        ingredients: [
            { name: "Gandhak (Sulphur purificatum)",      img: "images/optimized/Gandhak.jpg.webp",           desc: "Gandhak (purified Sulphur) supports healthy skin and reduces itching." },
            { name: "Babchi Oil (Psoralea corylifolia)",  img: "images/optimized/Babchi Oil.jpg.webp",         desc: "Babchi Oil supports healthy skin texture and skin balance." },
            { name: "Coaltar Solution (Coal Tar)",        img: "images/optimized/Coaltar Solution.jpg.webp",   desc: "Coaltar Solution soothes dry and irritated skin conditions." },
            { name: "Neem Oil (Azadirachta indica)",      img: "images/optimized/Neem Oil.jpg.webp",           desc: "Neem Oil supports skin health and reduces irritation." },
            { name: "Samudraphene (Sepia officinalis)",   img: "images/optimized/Samudraphene.jpg.webp",       desc: "Samudraphene supports skin comfort and wellness." },
            { name: "Maulshri Flowers (Mimusops elengi)", img: "images/optimized/Maulshri Flowers.jpg.webp",  desc: "Maulshri Flowers support skin nourishment and freshness." },
            { name: "Babool Flowers (Acacia nilotica)",   img: "images/optimized/Babool Flowers.jpg.webp",     desc: "Babool Flowers support healthy skin and natural balance." },
            { name: "Paraffin Base (Paraffinum liquidum)",img: "images/optimized/Paraffin Base.jpg.webp",      desc: "Paraffin Base keeps skin soft and supports hydration." }
        ],
        quantities: [{ label: "10GM", price: "₹60" }]
    },
    {
        name: "Joint Pain Relieve Oil", price: "₹35",
        suitableFor: "All ages - children and adults",
        dose: "Apply to the affected area and massage gently for a few minutes. Repeat as often as required, or as directed by a physician.",
        category: "Pain \u0026 Joint",
        indications: [{"en":"Joint pain","hi":"जोड़ों का दर्द"},{"en":"Arthritis","hi":"गठिया"},{"en":"Frozen shoulder","hi":"फ्रोजन शोल्डर"},{"en":"Sprains and strains","hi":"मोच एवं खिंचाव"},{"en":"Neck stiffness","hi":"गर्दन का अकड़ना"},{"en":"Sciatica","hi":"साइटिका"},{"en":"Cervical spondylitis","hi":"सर्वाइकल स्पॉन्डिलाइटिस"},{"en":"Lower back pain","hi":"कमर दर्द"}],
        results: ["Relieves pain and stiffness","Improves joint mobility","Reduces muscle discomfort"],
        desc: "This Joint Pain Reliever Oil is a premium Ayurvedic formulation designed to provide fast and effective relief from chronic discomfort. Enriched with Ashwagandha, Shatavari, and Maha Haldi, it targets inflammation at the source to ease joint pains, arthritis, and muscle stiffness.",
        icon: "fas fa-bone",
        images: ["images/optimized/Zoint oil1.PNG.png.webp","images/optimized/Zoint oil2.PNG.png.webp","images/optimized/Zoint oil3.PNG.png.webp","images/optimized/Zoint oil4.PNG.png.webp"],
        ingredients: [
            { name: "Ashwagandha Root (Withania somnifera)",  img: "images/optimized/Ashwagangha root.jpg.webp",  desc: "Ashwagandha root supports energy, stamina, and overall wellness." },
            { name: "Karpoor Crystal (Cinnamomum camphora)",  img: "images/optimized/Karpoor Crystal.jpg.webp",   desc: "Karpoor crystal supports respiratory comfort and relaxation." },
            { name: "Mash Urad Seed (Vigna mungo)",           img: "images/optimized/Mash Urad Seed.jpg.webp",    desc: "Urad seeds are rich in protein and support strength and digestion." },
            { name: "Jatamansi Plant (Nardostachys jatamansi)", img: "images/optimized/Jatamansi Plant.jpg.webp", desc: "Jatamansi supports calming, restful sleep, and mental clarity." },
            { name: "Kuchala Seed (Strychnos nux-vomica)",    img: "images/optimized/Kuchala Seed.jpg.webp",      desc: "Kuchala seeds support nervous system function and joint comfort." },
            { name: "Dhatura Leaf (Datura stramonium)",       img: "images/optimized/Dhatura Leaf.jpg.webp",      desc: "Dhatura leaves support pain and respiratory relief." },
            { name: "Aama Haldi Root (Curcuma amada)",        img: "images/optimized/Aama Haldi Root.jpg.webp",   desc: "Aama Haldi root supports digestion and reduces inflammation." },
            { name: "Shatawari Root (Asparagus racemosus)",   img: "images/optimized/Shatawari Root.jpg.webp",    desc: "Shatawari root supports hormonal balance and overall rejuvenation." }
        ],
        quantities: [
            { label: "10ML", price: "₹35" },
            { label: "30ML", price: "₹100" },
            { label: "60ML", price: "₹170" }
        ]
    },
    {
        name: "EAROL", price: "₹60",
        suitableFor: "All ages - children and adults",
        dose: "Pour 2-3 drops into the ear three times daily.",
        category: "Ear Care",
        indications: [{"en":"Ear pain","hi":"कान दर्द"},{"en":"Ear itching and irritation","hi":"कान में खुजली एवं जलन"},{"en":"Ear wax buildup","hi":"कान में मैल जमना"},{"en":"Ringing or vibrations in the ear","hi":"कान में आवाज़ या कंपन"},{"en":"Reduced hearing","hi":"सुनने की क्षमता में कमी"}],
        results: ["Relieves ear pain","Helps remove ear wax","Soothes itching and irritation","Supports clear hearing"],
        desc: "Earol Ear Drops is a proprietary Ayurvedic formulation designed to provide fast-acting and comprehensive relief from common ear discomforts including ear-ache, itching, ear wax buildup, and decreased hearing clarity.",
        icon: "fas fa-seedling",
        images: ["images/optimized/Earoil1.PNG.png.webp","images/optimized/Earoil2.PNG.png.webp","images/optimized/Earoil3.PNG.png.webp","images/optimized/Earoil4.PNG.png.webp"],
        ingredients: [
            { name: "Sonapatha (Oroxylum indicum)",       img: "images/optimized/Sonapatha.jpg.webp",   desc: "Sonapatha supports joint health, digestion, and respiratory wellness." },
            { name: "Ankol (Alangium salvifolium)",       img: "images/optimized/Ankol.jpg.webp",       desc: "Ankol supports skin health, joint comfort, and digestion." },
            { name: "Kakjangha (Uraria picta)",           img: "images/optimized/Kakjangha.jpg.webp",   desc: "Kakjangha supports joint health and overall physical wellness." },
            { name: "Nagdaun (Premna integrifolia)",      img: "images/optimized/Nagdaun.jpg.webp",     desc: "Nagdaun supports digestion, respiratory comfort, and detoxification." },
            { name: "Arjuna (Terminalia arjuna)",         img: "images/optimized/Arjuna.jpg.webp",      desc: "Arjuna supports healthy blood circulation and heart wellness." },
            { name: "Surajmukhi (Helianthus annuus)",     img: "images/optimized/Surajmukhi.jpg.webp",  desc: "Surajmukhi (Sunflower) supports heart health and energy levels." },
            { name: "Nirgundi (Vitex negundo)",           img: "images/optimized/Nirgundi.jpg.webp",    desc: "Nirgundi supports joint comfort and respiratory wellness." },
            { name: "Lahsun (Allium sativum)",            img: "images/optimized/Lahsun.jpg.webp",      desc: "Lahsun (Garlic) supports heart health, digestion, and immunity." }
        ],
        quantities: [{ label: "5ML", price: "₹60" }]
    },
    {
        name: "Mangal Prabhat (Laxative Churan)", price: "₹22",
        suitableFor: "All ages - children and adults",
        dose: "Take 5 g of powder with water at bedtime or late at night.",
        category: "Digestive Health",
        indications: [{"en":"Constipation","hi":"कब्ज"},{"en":"Acidity","hi":"एसिडिटी"},{"en":"Heartburn","hi":"छाती में जलन"},{"en":"Anal ulcers","hi":"गुदा के छाले"},{"en":"Piles (haemorrhoids)","hi":"बवासीर"}],
        results: ["Supports healthy bowel movements","Relieves constipation","Supports digestive health","Reduces acidity and heartburn"],
        desc: "Mangal Prabhat Churn is a time-tested Ayurvedic remedy formulated to combat chronic constipation, hyperacidity, and heartburn. This GMP-certified, Saunf-flavored churan promotes healthy bowel movements and regulates acid levels.",
        icon: "fas fa-hand-holding-medical",
        images: ["images/optimized/Mangal Prabhat1.PNG.png.webp","images/optimized/Mangal Prabhat2.PNG.png.webp","images/optimized/Mangal Prabhat3.PNG.png.webp"],
        ingredients: [
            { name: "Senna Leaf (Cassia angustifolia)",           img: "images/optimized/Senna Leaf.jpg.webp",    desc: "Senna leaves support natural cleansing and digestive health." },
            { name: "Ajwain Seed (Trachyspermum ammi)",           img: "images/optimized/Ajwain Seed.jpg.webp",   desc: "Ajwain seeds relieve indigestion, bloating, and gas." },
            { name: "Kala Namak (Black Rock Salt)",               img: "images/optimized/Kala Namak.jpg.webp",    desc: "Kala Namak (Black Salt) supports digestion and appetite." },
            { name: "Nisoth (Operculina turpethum)",              img: "images/optimized/Nisoth.jpg.webp",        desc: "Nisoth supports detoxification and healthy bowel function." },
            { name: "Amaltash Pulp (Cassia fistula)",             img: "images/optimized/Amaltash Pulp.jpg.webp", desc: "Amaltash pulp supports constipation relief and bowel health." },
            { name: "Gulab Flowers (Rosa damascena)",             img: "images/optimized/Gulab Flowers.jpg.webp", desc: "Gulab flowers support skin health and relaxation." },
            { name: "Saunf (Foeniculum vulgare)",                 img: "images/optimized/Saunf.jpg.webp",         desc: "Saunf (Fennel) improves digestion, freshens breath, and reduces acidity." },
            { name: "Sentha Namak (Rock Salt)",                   img: "images/optimized/Sentha Namak.jpg.webp",  desc: "Sentha Namak (Rock Salt) supports digestion and mineral balance." },
            { name: "Yastimadhu (Glycyrrhiza glabra)",            img: "images/optimized/Yastimadhu.jpg.webp",    desc: "Yastimadhu (Mulethi/Licorice) supports respiratory health and digestion." }
        ],
        quantities: [{ label: "10GM", price: "₹22" }, { label: "50GM", price: "₹75" }]
    },
    {
        name: "Amrit (Anti Dycentrical)", price: "₹55",
        suitableFor: "All ages - children and adults",
        dose: "Take 2 tablets three times daily, or as directed by a physician.",
        category: "Digestive Health",
        indications: [{"en":"Diarrhoea","hi":"दस्त"},{"en":"Dysentery","hi":"पेचिश"},{"en":"Loose stools","hi":"पतले दस्त"},{"en":"Digestive upset","hi":"पाचन संबंधी गड़बड़ी"},{"en":"Intestinal discomfort","hi":"आंतों की असुविधा"}],
        results: ["Controls loose motions","Restores digestive balance","Soothes the digestive tract","Promotes healthy bowel function"],
        desc: "Amrit Anti-Diarrheal Tablets provide a trusted, natural approach to digestive health. This Ayurvedic remedy is specifically formulated to manage diarrhea and dysentery, helping to soothe the digestive tract and restore normal function quickly and effectively.",
        icon: "fas fa-pills",
        images: ["images/optimized/Amrit.PNG.png.webp"],
        ingredients: [
            { name: "Ajwain Seed (Trachyspermum ammi)",       img: "images/optimized/Ajwain Seed.jpg.webp",       desc: "Ajwain seed is traditionally used to support digestion and ease gas and bloating." },
            { name: "Saunf Seed (Foeniculum vulgare)",        img: "images/optimized/Saunf.jpg.webp",             desc: "Saunf seed is traditionally used to support digestion and digestive comfort." },
            { name: "Bael Giri (Aegle marmelos)",             img: "images/optimized/Bael Giri.jpg.webp",         desc: "Bael giri is traditionally used in Ayurvedic preparations to support digestive health." },
            { name: "Heeng Sap (Ferula asafoetida)",          img: "images/optimized/Heeng.jpg.webp",             desc: "Heeng is traditionally used to support digestion and help relieve abdominal discomfort." },
            { name: "Pudina Leaf (Mentha)",                   img: "images/optimized/Podina Leaf.jpg.webp",       desc: "Pudina leaf provides a cooling effect and supports comfortable digestion." },
            { name: "Kapur Crystal (Cinnamomum camphora)",    img: "images/optimized/Karpoor Crystal.jpg.webp",   desc: "Kapur crystal is traditionally used in Ayurvedic formulations in carefully controlled quantities." },
            { name: "Indrajaun (Holarrhena pubescens)",       img: "images/optimized/Indrajaun.jpg.webp",         desc: "Indrajaun helps enhance appetite and invigorate low digestive fire." },
            { name: "Jeera Seed (Cuminum cyminum)",           img: "images/optimized/Jeera Seed.jpg.webp",        desc: "Jeera seed is traditionally used to support appetite and healthy digestion." },
            { name: "Sonth Rhizome (Zingiber officinale)",    img: "images/optimized/Sonth Rhizome.jpg.webp",     desc: "Sonth, or dry ginger, is traditionally used to support digestion and reduce bloating." },
            { name: "Anar Peel (Punica granatum)",            img: "images/optimized/Anar Peel.jpg.webp",         desc: "Anar peel is traditionally used in Ayurvedic preparations for digestive support." }
        ],
        quantities: [{ label: "25 Tabs", price: "₹55" }, { label: "500 Tabs", price: "₹700" }]
    },
    {
        name: "Mal Mix", price: "₹45",
        suitableFor: "All ages - children and adults",
        dose: "Up to 12 years: 3 mL three times daily. Over 12 years: 5 mL three times daily.",
        category: "Fever Care",
        indications: [{"en":"Malaria","hi":"मलेरिया"},{"en":"Malarial fever","hi":"मलेरिया जनित बुखार"},{"en":"Chills and body ache","hi":"ठंड लगना और शरीर दर्द"},{"en":"General body pain and fatigue","hi":"पूरे शरीर में दर्द और थकान"}],
        results: ["Supports recovery from malaria","Relieves chills and body discomfort","Helps reduce body temperature","Restores energy and well-being","Supports detoxification and liver health"],
        desc: "MALMIX Syrup is a proprietary Ayurvedic medicine formulated to act as an effective anti-malarial and anti-pyretic treatment. This time-tested remedy, with a heritage dating back to 1967, is crafted in a GMP-certified facility.",
        icon: "fas fa-dumbbell",
        images: ["images/optimized/Mal Mix.PNG.png.webp"],
        ingredients: [
            { name: "Agnihas Herb (Helicteres isora)",      img: "images/optimized/Agnihas Herb.jpg.webp",   desc: "Agnihas Herb supports digestion, metabolism, and natural detoxification." },
            { name: "Bindal Fruit (Ziziphus nummularia)",   img: "images/optimized/Bindal Fruit.jpg.webp",   desc: "Bindal Fruit supports digestive health and body strength." },
            { name: "Kanchana (Bauhinia variegata)",        img: "images/optimized/Kanchana.jpg.webp",       desc: "Kanchana supports glandular health and healthy metabolism." },
            { name: "Guduchi Root (Tinospora cordifolia)",  img: "images/optimized/Guduchi Root.jpg.webp",   desc: "Guduchi (Giloy) supports immunity, digestion, and energy levels." },
            { name: "Chiretta Fruit (Swertia chirata)",     img: "images/optimized/Chiretta Fruit.jpg.webp", desc: "Chiretta Fruit supports liver wellness and natural detoxification." },
            { name: "Nagpheni (Opuntia elatior)",           img: "images/optimized/Nagpheni.jpg.webp",       desc: "Nagpheni supports digestion, body hydration, and skin wellness." },
            { name: "Shankhauli (Canscora decussata)",      img: "images/optimized/Shankhauli.jpg.webp",     desc: "Shankhauli supports digestion, body strength, and overall wellness." }
        ],
        quantities: [{ label: "30ML", price: "₹45" }, { label: "60ML", price: "₹65" }]
    },
    {
        name: "Gas Q", price: "₹90",
        suitableFor: "All ages - children and adults",
        dose: "Two teaspoons (10 mL) twice daily after meals, or as directed by a physician.",
        category: "Digestive Health",
        indications: [{"en":"Acidity","hi":"एसिडिटी"},{"en":"Indigestion","hi":"अपच"},{"en":"Excess gas","hi":"पेट की गैस"},{"en":"Abdominal and stomach cramps","hi":"पेट में ऐंठन और मरोड़"},{"en":"Other stomach problems","hi":"पेट की अन्य समस्याएँ"}],
        results: ["Relieves acidity and gas","Reduces flatulence and bloating","Improves digestion and soothes the digestive tract","Supports overall gut health"],
        desc: "Gas-Q Gastric Syrup is a premium Ayurvedic digestive aid designed to provide rapid relief from gastric problems, acidity, and flatulence. Utilizing Saunf, Podina, Ajmoda, and Jeera, this GMP-certified syrup soothes the digestive tract and improves overall gut health.",
        icon: "fas fa-leaf",
        images: ["images/optimized/Gas Q1.PNG.png.webp","images/optimized/Gas Q2.PNG.png.webp","images/optimized/Gas Q3.PNG.png.webp","images/optimized/Gas Q4.PNG.png.webp"],
        ingredients: [
            { name: "Saunf Big (Foeniculum vulgare)",         img: "images/optimized/Saunf Big.jpg.webp",       desc: "Saunf (Fennel) improves digestion, reduces bloating, and freshens breath." },
            { name: "Jeera Black (Nigella sativa)",           img: "images/optimized/Jeera Black Seed.jpg.webp", desc: "Black Jeera supports healthy digestion and reduces gas." },
            { name: "Podina Leaf (Mentha spicata)",           img: "images/optimized/Podina Leaf.jpg.webp",      desc: "Podina (Mint) supports digestion and relieves nausea." },
            { name: "Dhania Seed (Coriandrum sativum)",       img: "images/optimized/Dhania Seed.jpg.webp",      desc: "Dhania seeds support healthy digestion and reduce acidity." },
            { name: "Harad Small (Terminalia chebula)",       img: "images/optimized/Harad Small Fruit.jpg.webp",desc: "Harad Small Fruit supports digestion, gut health, and detoxification." },
            { name: "Makoy Fruit (Solanum nigrum)",           img: "images/optimized/Makoy Fruit.jpg.webp",      desc: "Makoy fruit supports liver function and natural detoxification." },
            { name: "Baheda Fruit (Terminalia bellirica)",    img: "images/optimized/Baheda Fruit.jpg.webp",     desc: "Baheda fruit supports digestion, respiratory health, and immunity." },
            { name: "Ajmoda Seed (Apium graveolens)",         img: "images/optimized/Ajmoda Seed.jpg.webp",      desc: "Ajmoda seeds support digestion and reduce bloating." },
            { name: "Guduch Root (Tinospora cordifolia)",     img: "images/optimized/Guduch Root.jpg.webp",      desc: "Guduch (Giloy) supports immunity, energy, and overall health." }
        ],
        quantities: [{ label: "110ML", price: "₹90" }, { label: "220ML", price: "₹140" }]
    },
    {
        name: "Dige Q", price: "₹90",
        suitableFor: "All ages - children and adults",
        dose: "Two teaspoons (10 mL) twice daily after meals, or as directed by a physician.",
        category: "Digestive Health",
        indications: [{"en":"Indigestion","hi":"अपच"},{"en":"Loss of appetite","hi":"भूख न लगना"},{"en":"Gastric problems","hi":"पेट की समस्याएँ"},{"en":"Other stomach problems","hi":"पेट की अन्य समस्याएँ"}],
        results: ["Relieves gastric discomfort","Supports healthy digestive function","Improves digestion and soothes the digestive tract","Stimulates appetite"],
        desc: "Dige-Q Digestive Syrup is an Ayurvedic medicine formulated over 51 years in healthcare. This GMP-certified syrup is an effective remedy for indigestion, lack of appetite, and various gastric and stomach troubles.",
        icon: "fas fa-heartbeat",
        images: ["images/optimized/Dige Q1.PNG.png.webp","images/optimized/Dige Q2.PNG.png.webp","images/optimized/Dige Q3.PNG.png.webp","images/optimized/Dige Q4.PNG.png.webp"],
        ingredients: [
            { name: "Harad Fruit (Terminalia chebula)",       img: "images/optimized/Harad Fruit.jpg.webp",    desc: "Harad (Haritaki) supports healthy digestion and natural body cleansing." },
            { name: "Baheda Fruit (Terminalia bellirica)",    img: "images/optimized/Baheda Fruit.jpg.webp",   desc: "Baheda supports respiratory health, digestion, and detoxification." },
            { name: "Amla Fruit (Phyllanthus emblica)",       img: "images/optimized/Amla Fruit.jpg.webp",     desc: "Amla is rich in Vitamin C and antioxidants, supporting immunity." },
            { name: "Sonth Rhizome (Zingiber officinale)",    img: "images/optimized/Sonth Rhizome.jpg.webp",  desc: "Sonth (Dry Ginger) improves digestion and reduces bloating." },
            { name: "Pippli Seed (Piper longum)",             img: "images/optimized/Pippli Seed.jpg.webp",    desc: "Pippli (Long Pepper) supports digestion and respiratory health." },
            { name: "Methi Seed (Trigonella foenum-graecum)", img: "images/optimized/Methi Seed.jpg.webp",    desc: "Methi seeds support digestion and healthy metabolism." },
            { name: "Jeera Seed (Cuminum cyminum)",           img: "images/optimized/Jeera Seed.jpg.webp",     desc: "Jeera seeds improve appetite and support digestive comfort." },
            { name: "Ajmoda Seed (Apium graveolens)",         img: "images/optimized/Ajmoda Seed.jpg.webp",    desc: "Ajmoda seeds support digestion and reduce bloating." },
            { name: "Guduch Root (Tinospora cordifolia)",     img: "images/optimized/Guduch Root.jpg.webp",    desc: "Guduch (Giloy) supports immunity, digestion, and energy." }
        ],
        quantities: [{ label: "110ML", price: "₹90" }, { label: "220ML", price: "₹140" }]
    },
    {
        name: "Memory Q", price: "₹140",
        suitableFor: "All ages - children and adults",
        dose: "Two teaspoons (10 mL) twice daily after meals.",
        category: "Memory \u0026 Wellness",
        indications: [{"en":"Memory loss","hi":"याददाश्त की कमी"},{"en":"Forgetfulness","hi":"भूलने की बीमारी"},{"en":"Poor concentration","hi":"कम एकाग्रता"},{"en":"Low intelligence","hi":"बुद्धि की कमी"}],
        results: ["Improves memory","Enhances concentration","Supports learning"],
        desc: "Memory-Q Syrup is a premium Ayurvedic brain tonic and memory booster designed to enhance cognitive function and mental clarity. Enriched with Ashwagandha, Brahmi, Shankhapushpi, and Saffron, it supports peak mental performance and focus.",
        icon: "fas fa-brain",
        images: ["images/optimized/Memory Q1.PNG.png.webp","images/optimized/Memory Q2.PNG.png.webp","images/optimized/Memory Q3.PNG.png.webp","images/optimized/Memory Q4.PNG.png.webp"],
        ingredients: [
            { name: "Ashwagandha Root (Withania somnifera)",     img: "images/optimized/Ashwagandha Root.jpg.webp",   desc: "Ashwagandha root supports energy, stamina, and overall wellness." },
            { name: "Shatawari Root (Asparagus racemosus)",      img: "images/optimized/Shatawari Root.jpg.webp",     desc: "Shatawari root supports nourishment, strength, and wellness." },
            { name: "Kavach Seed (Mucuna pruriens)",             img: "images/optimized/Kavach Seed.jpg.webp",        desc: "Kavach seed supports strength, vitality, and nervous system health." },
            { name: "Vidarikand Root (Pueraria tuberosa)",       img: "images/optimized/Vidarikand Root.jpg.webp",    desc: "Vidarikand root supports energy and physical wellness." },
            { name: "Shankhapushpi Herb (Convolvulus pluricaulis)", img: "images/optimized/Shankhapushpi Herb.jpg.webp", desc: "Shankhapushpi supports memory, concentration, and mental clarity." },
            { name: "Brahmi Booti (Bacopa monnieri)",            img: "images/optimized/Brahmi Booti.jpg.webp",       desc: "Brahmi supports memory, focus, and nervous system health." },
            { name: "Amla Fruit (Phyllanthus emblica)",          img: "images/optimized/Amla Fruit.jpg.webp",         desc: "Amla supports immunity, digestion, and overall wellness." },
            { name: "Punarnava Root (Boerhavia diffusa)",        img: "images/optimized/Punarnava Root.jpg.webp",     desc: "Punarnava root supports kidney and liver health." },
            { name: "Arjuna Bark (Terminalia arjuna)",           img: "images/optimized/Arjuna Bark.jpg.webp",        desc: "Arjuna bark supports heart health and blood circulation." }
        ],
        quantities: [{ label: "220ML", price: "₹140" }]
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
        document.getElementById('galleryImage3'),
        document.getElementById('galleryImage4')
    ];

    function setGalleryImages(images, productName) {
        galleryImgEls.forEach(el => {
            el.innerHTML = '';
            el.onclick = null;
            el.classList.remove('active');
            el.style.display = 'none';
        });
        images.forEach((src, i) => {
            if (i >= galleryImgEls.length) return;
            const el = galleryImgEls[i];
            el.style.display = 'flex';
            el.innerHTML = `<img src="${src}" alt="${productName} ${i + 1}" loading="lazy" decoding="async">`;
            el.onclick = () => {
                mainImage.innerHTML = `<img src="${src}" alt="${productName}" decoding="async">`;
                galleryImgEls.forEach(g => g.classList.remove('active'));
                el.classList.add('active');
            };
        });
        if (images.length > 0) galleryImgEls[0].classList.add('active');
    }

    function renderDetailList(elementId, items) {
        const list = document.getElementById(elementId);
        list.innerHTML = '';
        (items || []).forEach(entry => {
            const item = document.createElement('li');
            if (typeof entry === 'object' && entry !== null) {
                const english = document.createElement('span');
                english.className = 'detail-primary';
                english.textContent = entry.en;
                item.appendChild(english);

                if (entry.hi) {
                    const hindi = document.createElement('span');
                    hindi.className = 'detail-hindi';
                    hindi.lang = 'hi';
                    hindi.textContent = entry.hi;
                    item.appendChild(hindi);
                }
            } else {
                item.textContent = entry;
            }
            list.appendChild(item);
        });
    }

    let modalHistoryPushed = false;
    let lastFocusedElement = null;

    function openProductModal(product) {
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductMeta').textContent = `Quality Pharmaceuticals · ${product.category}`;
        document.getElementById('modalProductDesc').textContent = product.desc;
        document.getElementById('modalSuitableFor').textContent = product.suitableFor;
        document.getElementById('modalDose').textContent = product.dose;
        const enquiryUrl = 'contact.html?product=' + encodeURIComponent(product.name);
        document.getElementById('modalEnquiryButton').href = enquiryUrl;
        document.getElementById('mobileModalEnquiryButton').href = enquiryUrl;
        renderDetailList('modalIndications', product.indications);
        renderDetailList('modalResults', product.results);

        const quantitySection = document.getElementById('modalQuantitySection');
        const quantityOptions = document.getElementById('quantityOptions');
        const priceElement    = document.getElementById('modalProductPrice');

        const defaultImages = product.images && product.images.length ? product.images : [];

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
                    mainImage.innerHTML = imgs[0] ? `<img src="${imgs[0]}" alt="${product.name}" decoding="async">` : '<i class="fas fa-image" style="font-size:4rem;color:var(--gray);"></i>';
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
            ? `<img src="${defaultImages[0]}" alt="${product.name}" decoding="async">`
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
                    ? `<img src="${ing.img}" alt="${ing.name}" loading="lazy" decoding="async">`
                    : `<div class="ingredient-icon"><i class="${ing.icon || 'fas fa-leaf'}"></i></div>`;
                item.innerHTML = `${imgHtml}<div><p><strong>${ing.name}</strong></p><p class="ingredient-desc">${ing.desc || ''}</p></div>`;
                container.appendChild(item);
            });
            grid.appendChild(container);
        }

        lastFocusedElement = document.activeElement;
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const modalContent = productModal.querySelector('.modal-content');
        modalContent.scrollTop = 0;
        productModal.querySelectorAll('.modal-section-nav a').forEach((link, index) => link.classList.toggle('active', index === 0));
        setTimeout(() => modalClose.focus(), 50);

        // Push history state so browser back button closes the modal
        history.pushState({ modal: true }, '');
        modalHistoryPushed = true;
    }

    function closeProductModal(skipHistory) {
        if (!productModal.classList.contains('active')) return;
        productModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (lastFocusedElement) lastFocusedElement.focus();
        if (!skipHistory && modalHistoryPushed) {
            modalHistoryPushed = false;
            history.back();
        } else {
            modalHistoryPushed = false;
        }
    }

    // Browser back button closes modal
    window.addEventListener('popstate', () => {
        if (productModal.classList.contains('active')) {
            closeProductModal(true);
        }
    });

    if (modalClose) modalClose.addEventListener('click', () => closeProductModal(false));
    productModal.addEventListener('click', e => { if (e.target === productModal) closeProductModal(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProductModal(false); });
    productModal.querySelectorAll('.modal-section-nav a').forEach(link => {
        link.addEventListener('click', () => {
            productModal.querySelectorAll('.modal-section-nav a').forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Product discovery and cards
    const grid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('productSearch');
    const filtersContainer = document.getElementById('productFilters');
    const productCount = document.getElementById('productCount');
    const emptyState = document.getElementById('productEmpty');

    if (grid) {
        const categories = ['All', ...new Set(products.map(product => product.category))];
        const requestedCategory = new URLSearchParams(window.location.search).get('category');
        let activeCategory = categories.includes(requestedCategory) ? requestedCategory : 'All';

        function searchableProductText(product) {
            const indicationText = (product.indications || []).map(item =>
                typeof item === 'object' ? `${item.en} ${item.hi || ''}` : item
            ).join(' ');
            return `${product.name} ${product.category} ${product.desc} ${indicationText}`.toLowerCase();
        }

        function createProductCard(product) {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View ${product.name} details`);
            const imgSrc = product.images && product.images.length ? product.images[0] : '';
            const hasMultiplePacks = product.quantities && product.quantities.length > 1;
            card.innerHTML = `
                <div class="product-image">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${product.name}" loading="lazy" decoding="async">` : `<i class="${product.icon}"></i>`}
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h4>${product.name}</h4>
                    <p class="product-description">${product.desc}</p>
                    <div class="product-card-footer">
                        <div><span class="product-price-label">${hasMultiplePacks ? 'MRP from' : 'MRP'}</span><div class="product-price">${product.price}</div></div>
                        <span class="view-details-cue">View details <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            `;
            const openCard = () => openProductModal(product);
            card.addEventListener('click', openCard);
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openCard();
                }
            });
            productObserver.observe(card);
            return card;
        }

        function renderProducts() {
            const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
            const visibleProducts = products.filter(product => {
                const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
                const searchMatch = !query || searchableProductText(product).includes(query);
                return categoryMatch && searchMatch;
            });

            grid.innerHTML = '';
            visibleProducts.forEach(product => grid.appendChild(createProductCard(product)));
            if (productCount) productCount.textContent = `${visibleProducts.length} of ${products.length} products`;
            if (emptyState) emptyState.hidden = visibleProducts.length !== 0;
        }

        if (filtersContainer) {
            const priorityOrder = ['All', 'Digestive Health', 'Baby & Family', "Women's Wellness", 'Pain & Joint'];
            const primaryCategories = priorityOrder.filter(category => categories.includes(category));
            const secondaryCategories = categories.filter(category => !primaryCategories.includes(category));
            let filtersExpanded = secondaryCategories.includes(activeCategory);

            function selectCategory(category) {
                activeCategory = category;
                if (secondaryCategories.includes(category)) filtersExpanded = true;
                renderFilterButtons();
                renderProducts();
            }

            function createFilterButton(category) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'product-filter' + (category === activeCategory ? ' active' : '');
                button.textContent = category;
                button.setAttribute('aria-pressed', String(category === activeCategory));
                button.addEventListener('click', () => selectCategory(category));
                return button;
            }

            function renderFilterButtons() {
                filtersContainer.innerHTML = '';
                primaryCategories.forEach(category => filtersContainer.appendChild(createFilterButton(category)));
                if (filtersExpanded) secondaryCategories.forEach(category => filtersContainer.appendChild(createFilterButton(category)));
                if (secondaryCategories.length) {
                    const moreButton = document.createElement('button');
                    moreButton.type = 'button';
                    moreButton.className = 'product-filter product-filter-more';
                    moreButton.innerHTML = filtersExpanded ? 'Less <i class="fas fa-chevron-up"></i>' : `More <span>+${secondaryCategories.length}</span> <i class="fas fa-chevron-down"></i>`;
                    moreButton.setAttribute('aria-expanded', String(filtersExpanded));
                    moreButton.addEventListener('click', () => {
                        filtersExpanded = !filtersExpanded;
                        renderFilterButtons();
                    });
                    filtersContainer.appendChild(moreButton);
                }
            }

            renderFilterButtons();
        }

        if (searchInput) searchInput.addEventListener('input', renderProducts);
        renderProducts();
    }
}
