// Rebuild static product content from the same data and layout used by the homepage.
// Run: node scripts/build-product-pages.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const homePath = path.join(root, 'index.html');
let home = fs.readFileSync(homePath, 'utf8');
const dataStart = source.indexOf('const products = [');
const dataEnd = source.indexOf('\n];', dataStart) + 3;
const slugSource = source.match(/function productPageSlug\(name\) \{[\s\S]*?\n\}/)[0];
const { products, slug } = vm.runInNewContext(`${source.slice(dataStart, dataEnd)}\n${slugSource}\n({products, slug: productPageSlug})`);
const template = home.match(/<!-- Product Modal -->\s*<div[^>]+>\s*<div class="modal-content">([\s\S]*?)\s*<\/div>\s*<\/div>\s*<script/)[1];
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function fill(html, id, value) {
    const pattern = new RegExp(`(<([a-z0-9]+)[^>]* id="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`);
    if (!pattern.test(html)) throw new Error(`Missing template field: ${id}`);
    return html.replace(pattern, (_, start, tag, end) => start + value + end);
}
const list = items => (items || []).map(item => typeof item === 'object'
    ? `<li><span class="detail-primary">${esc(item.en)}</span>${item.hi ? `<span class="detail-hindi" lang="hi">${esc(item.hi)}</span>` : ''}</li>`
    : `<li>${esc(item)}</li>`).join('');
const image = (src, name, lazy = true) => `<img src="../${esc(src)}" alt="${esc(name)}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`;
function renderProduct(product) {
    const name = product.name;
    const enquiry = `../contact.html?product=${encodeURIComponent(name)}`;
    let html = template.replace(/<button class="modal-close"[\s\S]*?<\/button>/,
        '<a class="product-back-link" href="../#products"><i class="fas fa-arrow-left"></i> All products</a>');
    html = html.replace('<h2 id="modalProductName"></h2>', '<h1 id="modalProductName"></h1>');
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
    fs.writeFileSync(filename, page.replace(/[\t ]+$/gm, ''));
}
// The homepage keeps exactly the same cards, now present in HTML before JavaScript runs.
const cards = products.map(product => `<article class="product-card visible" id="product-${slug(product.name)}" data-product-url="products/${slug(product.name)}.html">
    <div class="product-image">${product.images?.[0] ? `<img src="${esc(product.images[0])}" alt="${esc(product.name)} by Quality Pharmaceuticals" loading="lazy" decoding="async">` : `<i class="${esc(product.icon)}"></i>`}</div>
    <div class="product-info"><span class="product-category">${esc(product.category)}</span><h4>${esc(product.name)}</h4><p class="product-description">${esc(product.desc)}</p>
    <div class="product-card-footer"><div><span class="product-price-label">${product.quantities?.length > 1 ? 'MRP from' : 'MRP'}</span><div class="product-price">${esc(product.price)}</div></div><a class="view-details-cue" href="products/${slug(product.name)}.html" aria-label="View the full ${esc(product.name)} product page">View product <i class="fas fa-arrow-right"></i></a></div></div>
</article>`).join('\n');
home = home.replace(/(<div class="products-grid" id="productsGrid">)[\s\S]*?(<\/div>\s*<div class="product-empty")/, (_, start, end) => start + '\n' + cards + '\n        ' + end);
fs.writeFileSync(homePath, home);
const sitemapPath = path.join(root, 'sitemap.xml');
const today = new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'});
const sitemap = fs.readFileSync(sitemapPath, 'utf8').replace(/(<url><loc>https:\/\/qualitypharmaceuticals\.co\.in\/(?:products\/[^<]+)?<\/loc><lastmod>)[^<]+/g, (_, prefix) => prefix + today);
fs.writeFileSync(sitemapPath, sitemap);
console.log(`Updated ${products.length} product pages and homepage cards using the existing popup layout.`);
