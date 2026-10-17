// Rebuild product pages, search metadata, structured data and image dimensions.
// Run: node scripts/build-product-pages.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dimensions = require('./image-dimensions.cjs');
const productSeo = require('./product-seo.json');
const root = path.resolve(__dirname, '..');
const origin = 'https://qualitypharmaceuticals.co.in/';
const changedUrls = new Set();
function writePage(filename, content) {
    const clean = content.replace(/[\t ]+$/gm, '');
    if (fs.readFileSync(filename, 'utf8') !== clean) {
        fs.writeFileSync(filename, clean);
        const relative = path.relative(root, filename).replace(/\\/g, '/');
        changedUrls.add(origin + (relative === 'index.html' ? '' : relative));
    }
}
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const homePath = path.join(root, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
const dataStart = source.indexOf('const products = [');
const dataEnd = source.indexOf('\n];', dataStart) + 3;
const slugSource = source.match(/function productPageSlug\(name\) \{[\s\S]*?\n\}/)[0];
const { products, slug } = vm.runInNewContext(`${source.slice(dataStart, dataEnd)}\n${slugSource}\n({products, slug: productPageSlug})`);
const template = home.match(/<template id="productDetailTemplate">\s*<div class="modal-content">([\s\S]*?)\s*<\/div>\s*<\/template>/)[1];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function fill(html, id, value) {
    const pattern = new RegExp(`(<([a-z0-9]+)[^>]* id="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`);
    if (!pattern.test(html)) throw new Error(`Missing template field: ${id}`);
    return html.replace(pattern, (_, start, tag, end) => start + value + end);
}
const list = items => (items || []).map(item => typeof item === 'object'
    ? `<li><span class="detail-primary">${esc(item.en)}</span>${item.hi ? `<span class="detail-hindi" lang="hi">${esc(item.hi)}</span>` : ''}</li>`
    : `<li>${esc(item)}</li>`).join('');
const image = (src, name, lazy = true) => {
    const size = dimensions(src);
    return `<img src="../${esc(src)}" alt="${esc(name)}" width="${size.width}" height="${size.height}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`;
};
function renderProduct(product) {
    const name = product.name;
    const enquiry = `../contact.html?product=${encodeURIComponent(name)}`;
    let html = template.replace(/<button class="modal-close"[\s\S]*?<\/button>/,
        '<a class="product-back-link" href="../#products"><i class="fas fa-arrow-left"></i> All products</a>');
    html = html.replace('<h2 id="modalProductName"></h2>', '<h1 id="modalProductName"></h1>');
    html = html.replace(/<h3 class="modal-section-title">Available packs<\/h3>/, '<h2 class="modal-section-title">Available packs</h2>')
        .replace(/<h4>(<i[^>]*><\/i> (?:Indications|Results))<\/h4>/g, '<h2>$1</h2>')
        .replace('<h3 class="modal-section-title">Key ingredients</h3>', '<h2 class="modal-section-title">Key ingredients</h2>');
    const fields = {
        modalProductName: esc(name), modalProductMeta: esc(`Quality Pharmaceuticals · ${product.category}`),
        modalProductDesc: esc(product.desc), modalSuitableFor: esc(product.suitableFor), modalDose: esc(product.dose),
        modalProductPrice: esc(product.quantities?.[0]?.price || product.price),
        modalIndications: list(product.indications), modalResults: list(product.results),
        mainImage: product.images?.[0] ? image(product.images[0], name, false) : '<i class="fas fa-image"></i>',
        quantityOptions: (product.quantities || []).map((pack, i) => `<button type="button" class="quantity-option${i === 0 ? ' active' : ''}" data-pack="${i}" aria-pressed="${i === 0}"><span class="qty-label">${esc(pack.label)}</span></button>`).join(''),
        ingredientsGridFull: `<div class="ingredients-table">${(product.ingredients || []).map(ingredient => `<div class="ingredient-item">${ingredient.img ? image(ingredient.img, ingredient.name) : `<div class="ingredient-icon"><i class="${esc(ingredient.icon || 'fas fa-leaf')}"></i></div>`}<div><p><strong>${esc(ingredient.name)}</strong></p><p class="ingredient-desc">${esc(ingredient.desc)}</p></div></div>`).join('')}</div>`
    };
    for (const [id, value] of Object.entries(fields)) html = fill(html, id, value);
    for (let i = 0; i < 4; i++) {
        const src = product.images?.[i];
        html = html.replace(`<div class="gallery-image" id="galleryImage${i + 1}"></div>`, src
            ? `<button type="button" class="gallery-image${i === 0 ? ' active' : ''}" data-image="${i}" aria-label="View ${esc(name)} image ${i + 1}" aria-pressed="${i === 0}">${image(src, `${name} ${i + 1}`)}</button>` : '');
    }
    html = html.replace(/(id="(?:modalEnquiryButton|mobileModalEnquiryButton)" href=")contact.html"/g, (_, prefix) => prefix + esc(enquiry) + '"');
    if (!product.quantities?.length) html = html.replace('id="modalQuantitySection"', 'id="modalQuantitySection" hidden');
    return `<main class="product-detail-page" data-product="${slug(name)}">\n${html}\n    </main>`;
}
for (const product of products) {
    const filename = path.join(root, 'products', `${slug(product.name)}.html`);
    let page = fs.readFileSync(filename, 'utf8');
    page = page.replace(/\s*<nav class="breadcrumbs"[\s\S]*?<\/nav>/, '');
    page = page.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, () => renderProduct(product));
    const seo = productSeo[slug(product.name)];
    if (!seo) throw new Error('Missing search metadata: ' + product.name);
    page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
    for (const name of ['description', 'og:description', 'twitter:description']) {
        page = page.replace(new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*`), (_, prefix) => prefix + esc(seo.description));
    }
    for (const name of ['og:title', 'twitter:title']) {
        page = page.replace(new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*`), (_, prefix) => prefix + esc(seo.title));
    }
    if (product.images?.[0]) {
        const size = dimensions(product.images[0]);
        page = page.replace(/(<meta property="og:image:width" content=")[^"]*/, '$1' + size.width)
            .replace(/(<meta property="og:image:height" content=")[^"]*/, '$1' + size.height)
            .replace(/(<meta property="og:image:alt" content=")[^"]*/, (_, prefix) => prefix + esc(product.name + ' by Quality Pharmaceuticals'));
    }
    page = page.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, source) => {
        const schema = JSON.parse(source);
        const graph = schema['@graph'];
        const url = origin + 'products/' + slug(product.name) + '.html';
        const webPage = graph.find(item => item['@type'] === 'WebPage');
        webPage.name = seo.title;
        webPage.description = seo.description;
        webPage.mainEntity = {'@id': url + '#product'};
        webPage.breadcrumb = {'@id': url + '#breadcrumb'};
        graph.find(item => item['@type'] === 'BreadcrumbList')['@id'] = url + '#breadcrumb';
        const item = graph.find(item => item['@type'] === 'Product');
        item.description = product.desc;
        item.category = product.category;
        item.image = (product.images || []).map(src => origin + src.split('/').map(encodeURIComponent).join('/'));
        const packs = product.quantities?.length ? product.quantities : [{label: product.name, price: product.price}];
        // These are individual pack offers, not different merchants' AggregateOffers.
        // Stock is deliberately omitted: the website does not publish live inventory.
        const offers = packs.map(pack => ({
            '@type': 'Offer', name: product.name + ' — ' + pack.label,
            priceCurrency: 'INR', price: String(Number(pack.price.replace(/[^0-9.]/g, ''))),
            url: url + '?pack=' + encodeURIComponent(pack.label),
            seller: {'@id': origin + '#organization'}
        }));
        item.offers = offers.length === 1 ? offers[0] : offers;
        item.additionalProperty = [
            {name: 'Category', value: product.category}, {name: 'Suitable for', value: product.suitableFor},
            {name: 'Dose', value: product.dose}, ...packs.map(pack => ({name: 'Pack and MRP', value: pack.label + ' — ' + pack.price}))
        ].map(property => ({'@type': 'PropertyValue', ...property}));
        return '<script type="application/ld+json">' + JSON.stringify(schema, null, 2).replace(/</g, '\\u003c') + '</script>';
    });
    writePage(filename, page);
}
// The homepage keeps exactly the same cards, now present in HTML before JavaScript runs.
const cards = products.map(product => `<article class="product-card visible" id="product-${slug(product.name)}" data-product-url="products/${slug(product.name)}.html">
    <div class="product-image">${product.images?.[0] ? image(product.images[0], product.name + ' by Quality Pharmaceuticals').replace('src="../', 'src="') : `<i class="${esc(product.icon)}"></i>`}</div>
    <div class="product-info"><span class="product-category">${esc(product.category)}</span><h4>${esc(product.name)}</h4><p class="product-description">${esc(product.desc)}</p>
    <div class="product-card-footer"><div><span class="product-price-label">${product.quantities?.length > 1 ? 'MRP from' : 'MRP'}</span><div class="product-price">${esc(product.price)}</div></div><a class="view-details-cue" href="products/${slug(product.name)}.html" aria-label="View the full ${esc(product.name)} product page">View product <i class="fas fa-arrow-right"></i></a></div></div>
</article>`).join('\n');
home = home.replace(/(<div class="products-grid" id="productsGrid">)[\s\S]*?(<\/div>\s*<div class="product-empty")/, (_, start, end) => start + '\n' + cards + '\n        ' + end);
writePage(homePath, home);
// Apply image dimensions and non-JavaScript fallbacks on all public HTML pages.
const publicFiles = ['index.html', 'about.html', 'manufacturing.html', 'contact.html', '404.html', ...products.map(product => 'products/' + slug(product.name) + '.html')];
for (const relative of publicFiles) {
    const filename = path.join(root, relative);
    let page = fs.readFileSync(filename, 'utf8');
    page = page.replace(/<img\b[^>]*>/g, tag => {
        const src = tag.match(/src="([^"]+)"/)?.[1];
        if (!src || /^https?:/.test(src) || (tag.includes('width=') && tag.includes('height='))) return tag;
        const size = dimensions(src.replace(/^\//, ''));
        return tag.replace(/\s+(?:width|height)="[^"]*"/g, '').replace(/>$/, ` width="${size.width}" height="${size.height}">`);
    });
    if (!page.includes('<noscript>')) page = page.replace('</head>', '<noscript><style>.loading{display:none!important}.fade-in,.product-card,[data-aos]{opacity:1!important;transform:none!important}</style></noscript>\n</head>');
    page = page.replace(/href="index.html#products"/g, 'href="/#products"');
    page = page.replace(/href="(?:\.\.\/)?index.html\?category=/g, 'href="/?category=');
    if (relative === 'index.html') {
        page = page.replace(/<title>[\s\S]*?<\/title>/, '<title>Quality Pharmaceuticals | Ayurvedic Manufacturer Since 1967</title>');
        // Both social title tags must match the document title.
        page = page.replace(/(<meta (?:property|name)="(?:og:title|twitter:title)" content=")[^"]*/g, '$1Quality Pharmaceuticals | Ayurvedic Manufacturer Since 1967');
        page = page.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (_, source) => {
            const schema = JSON.parse(source);
            schema['@graph'].find(item => item['@type'] === 'WebPage').name = 'Quality Pharmaceuticals | Ayurvedic Manufacturer Since 1967';
            schema['@graph'] = schema['@graph'].filter(item => item['@id'] !== origin + '#product-list');
            schema['@graph'].push({'@type': 'ItemList', '@id': origin + '#product-list', name: 'Quality Pharmaceuticals Ayurvedic products', numberOfItems: products.length,
                itemListElement: products.map((product, i) => ({'@type':'ListItem', position:i + 1, name:product.name, url:origin + 'products/' + slug(product.name) + '.html'}))});
            return '<script type="application/ld+json">' + JSON.stringify(schema, null, 2).replace(/</g, '\\u003c') + '</script>';
        });
        if (!page.includes('rel="preload" as="image"')) page = page.replace('    <link rel="preconnect" href="https://fonts.googleapis.com">', '    <link rel="preload" as="image" href="images/optimized/qp-product-family-hero-v15.webp" fetchpriority="high">\n    <link rel="preconnect" href="https://fonts.googleapis.com">');
    }
    if (relative === '404.html') {
        // Vercel serves this document at the missing URL, including nested paths.
        page = page.replace(/(href|src)="(?!https?:|tel:|mailto:|#|\/)([^"]+)"/g, (_, attr, value) => `${attr}="/${value.replace(/^\.\//, '')}"`);
    }
    writePage(filename, page);
}
const sitemapPath = path.join(root, 'sitemap.xml');
const today = new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'});
const sitemap = fs.readFileSync(sitemapPath, 'utf8').replace(/(<url><loc>)([^<]+)(<\/loc><lastmod>)[^<]+/g, (match, prefix, url, middle) => changedUrls.has(url) ? prefix + url + middle + today : match);
fs.writeFileSync(sitemapPath, sitemap);
console.log(`Updated ${products.length} product pages and homepage cards using the existing popup layout.`);
