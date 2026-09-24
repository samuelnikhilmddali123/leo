import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read seeder.js content and extract products
const seederPath = path.join(__dirname, '..', 'seeder.js');
const seederContent = fs.readFileSync(seederPath, 'utf8');

// Mock maps for IDs
const catMap = {
  'outerwear': { _id: 'cat-001', name: 'Outerwear', slug: 'outerwear' },
  'tailored-shirts': { _id: 'cat-002', name: 'Tailored Shirts', slug: 'tailored-shirts' },
  'trousers': { _id: 'cat-003', name: 'Trousers', slug: 'trousers' },
  'knitwear': { _id: 'cat-004', name: 'Knitwear', slug: 'knitwear' },
  'eveningwear-tuxedos': { _id: 'cat-005', name: 'Eveningwear & Tuxedos', slug: 'eveningwear-tuxedos' },
  't-shirts-polos': { _id: 'cat-006', name: 'T-Shirts & Polos', slug: 't-shirts-polos' },
  'accessories': { _id: 'cat-007', name: 'Accessories', slug: 'accessories' },
  'tailored-suits': { _id: 'cat-008', name: 'Tailored Suits', slug: 'tailored-suits' },
};

const colMap = {
  'monolith-aw26': { _id: 'col-001', name: 'Autumn / Winter 2026 — Monolith', slug: 'monolith-aw26' },
  'aura-ss26': { _id: 'col-002', name: 'Spring / Summer 2026 — Aura', slug: 'aura-ss26' },
  'minimalist-noir': { _id: 'col-003', name: 'Minimalist Noir', slug: 'minimalist-noir' },
  'the-silk-edit': { _id: 'col-004', name: 'The Silk Edit', slug: 'the-silk-edit' },
  'cashmere-atelier': { _id: 'col-005', name: 'Cashmere Atelier', slug: 'cashmere-atelier' },
};

// Extract productsData array block from seeder.js
const startMarker = 'const productsData = [';
const endMarker = 'const products = await Product.insertMany(';

const startIndex = seederContent.indexOf(startMarker);
const endIndex = seederContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find productsData block');
  process.exit(1);
}

const productsCode = seederContent.substring(startIndex + startMarker.length - 1, endIndex).trim().replace(/;$/, '');

// Evaluate with mock catMap and colMap
const fn = new Function('catMap', 'colMap', `return ${productsCode}`);
const rawProducts = fn(catMap, colMap);

const cleanProducts = rawProducts.map((p, idx) => {
  const catKey = Object.keys(catMap).find(k => catMap[k].name === p.categoryName || catMap[k]._id === p.category);
  const colKey = Object.keys(colMap).find(k => colMap[k].name === p.collectionName || colMap[k]._id === p.collectionRef);

  return {
    _id: `prod-${String(idx + 1).padStart(3, '0')}`,
    title: p.title,
    slug: p.slug,
    sku: p.sku,
    shortDescription: p.shortDescription || '',
    description: p.description || '',
    price: p.price,
    compareAtPrice: p.compareAtPrice || 0,
    category: p.category || (catKey ? catMap[catKey]._id : 'cat-001'),
    categoryName: p.categoryName || (catKey ? catMap[catKey].name : 'Outerwear'),
    categorySlug: catKey || 'outerwear',
    collectionRef: p.collectionRef || (colKey ? colMap[colKey]._id : null),
    collectionName: p.collectionName || (colKey ? colMap[colKey].name : ''),
    collectionSlug: colKey || '',
    gender: p.gender || 'Unisex',
    images: p.images || [],
    sizes: p.sizes || ['S', 'M', 'L', 'XL'],
    colors: p.colors || [{ name: 'Noir Black', hex: '#0A0A0A' }],
    variants: p.variants || [],
    material: p.material || '100% Luxury Fabric',
    careInstructions: p.careInstructions || 'Dry clean only',
    features: p.features || [],
    tags: p.tags || [],
    isFeatured: Boolean(p.isFeatured),
    isBestSeller: Boolean(p.isBestSeller),
    isNewArrival: Boolean(p.isNewArrival),
    inStock: true,
    rating: p.rating || 4.9,
    numReviews: p.numReviews || 12,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

const outPath = path.join(__dirname, '..', 'data', 'products.json');
fs.writeFileSync(outPath, JSON.stringify(cleanProducts, null, 2), 'utf8');
console.log(`[SUCCESS] Extracted ${cleanProducts.length} luxury products to ${outPath}`);
