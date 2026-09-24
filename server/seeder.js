import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Collection from './models/Collection.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Review from './models/Review.js';
import Coupon from './models/Coupon.js';
import Banner from './models/Banner.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[SEEDER] Clearing existing collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Collection.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await Banner.deleteMany();

    console.log('[SEEDER] Seeding Users...');
    // Demo accounts
    const hashedPasswordAdmin = await bcrypt.hash('Admin@12345', 10);
    const hashedPasswordCust = await bcrypt.hash('Customer@12345', 10);

    const users = await User.insertMany([
      {
        name: 'Alexander Vance',
        email: 'admin@leo.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        phone: '+91 98765 43210',
        addresses: [
          {
            fullName: 'Alexander Vance (LEO HQ)',
            phone: '+91 98765 43210',
            street: '42 Haute Couture Boulevard, Bandra West',
            apartment: 'Penthouse Suite 14A',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400050',
            country: 'India',
            isDefault: true,
          }
        ],
      },
      {
        name: 'Elena Rostova',
        email: 'customer@leo.com',
        password: hashedPasswordCust,
        role: 'customer',
        phone: '+91 98111 22334',
        addresses: [
          {
            fullName: 'Elena Rostova',
            phone: '+91 98111 22334',
            street: '18 Chanakyapuri Diplomatic Enclave',
            apartment: 'Villa 7',
            city: 'New Delhi',
            state: 'Delhi',
            postalCode: '110021',
            country: 'India',
            isDefault: true,
          },
          {
            fullName: 'Elena Rostova (Studio)',
            phone: '+91 98111 22334',
            street: '102 Indiranagar 100 Feet Road',
            apartment: 'Studio 402',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560038',
            country: 'India',
            isDefault: false,
          }
        ],
      },
      {
        name: 'Julian Sterling',
        email: 'julian.sterling@gmail.com',
        password: hashedPasswordCust,
        role: 'customer',
        phone: '+91 97234 56789',
        addresses: [{
          fullName: 'Julian Sterling',
          phone: '+91 97234 56789',
          street: '55 Koregaon Park North Main Road',
          apartment: 'Apartment 9B',
          city: 'Pune',
          state: 'Maharashtra',
          postalCode: '411001',
          country: 'India',
          isDefault: true,
        }],
      },
      {
        name: 'Sophia Laurent',
        email: 'sophia.laurent@gmail.com',
        password: hashedPasswordCust,
        role: 'customer',
        phone: '+91 98450 11223',
        addresses: [{
          fullName: 'Sophia Laurent',
          phone: '+91 98450 11223',
          street: '14 Jubilee Hills Road No. 36',
          apartment: 'Villa Royale',
          city: 'Hyderabad',
          state: 'Telangana',
          postalCode: '500033',
          country: 'India',
          isDefault: true,
        }],
      },
      {
        name: 'Marcus Chen',
        email: 'marcus.chen@gmail.com',
        password: hashedPasswordCust,
        role: 'customer',
        phone: '+91 99000 88776',
        addresses: [{
          fullName: 'Marcus Chen',
          phone: '+91 99000 88776',
          street: '88 Boat Club Road',
          apartment: 'Floor 3',
          city: 'Chennai',
          state: 'Tamil Nadu',
          postalCode: '600028',
          country: 'India',
          isDefault: true,
        }],
      },
    ]);

    const adminUser = users[0];
    const customerUser = users[1];

    console.log('[SEEDER] Seeding Categories...');
    const categoriesData = [
      {
        name: 'Outerwear',
        slug: 'outerwear',
        description: 'Architectural coats, tailored wool overcoats, and structured leather jackets.',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=95',
        bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95',
        displayOrder: 1,
      },
      {
        name: 'Tailored Shirts',
        slug: 'tailored-shirts',
        description: 'Crisp poplin, breathable Italian linen, and silk-blend formal shirts.',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=95',
        bannerImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1600&q=95',
        displayOrder: 2,
      },
      {
        name: 'Trousers',
        slug: 'trousers',
        description: 'Pleated wide-leg trousers, relaxed wool slacks, and structured chinos.',
        image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1600&q=95',
        bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95',
        displayOrder: 3,
      },
      {
        name: 'Knitwear',
        slug: 'knitwear',
        description: 'Mongolian cashmere, merino wool rollnecks, and textured heavy knits.',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=95',
        bannerImage: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1600&q=95',
        displayOrder: 4,
      },
      {
        name: 'Eveningwear & Tuxedos',
        slug: 'eveningwear-tuxedos',
        description: 'Sovereign velvet dinner jackets, black-tie peak lapel tuxedos, and tailored smoking robes.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95',
        bannerImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=95',
        displayOrder: 5,
      },
      {
        name: 'T-Shirts & Polos',
        slug: 't-shirts-polos',
        description: 'Heavyweight organic cotton tees, mercerized knit polos, and raw-cut basics.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=95',
        bannerImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=95',
        displayOrder: 6,
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Full-grain calfskin belts, cashmere scarves, minimalist leather totes, and eyewear.',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=95',
        bannerImage: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1600&q=95',
        displayOrder: 7,
      },
      {
        name: 'Tailored Suits',
        slug: 'tailored-suits',
        description: 'Double-breasted Italian wool blazers, unstructured jackets, and matching trousers.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=95',
        bannerImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95',
        displayOrder: 8,
      },
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c; });

    console.log('[SEEDER] Seeding Collections...');
    const collectionsData = [
      {
        name: 'Autumn / Winter 2026 — Monolith',
        slug: 'monolith-aw26',
        tagline: 'Architectural silhouettes inspired by brutalist geometry and quiet luxury.',
        description: 'The Monolith collection explores heavy wools, razor-sharp shoulder lines, and monolithic monochrome layering tailored for modern gentlemen.',
        heroImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=95',
        season: 'Autumn / Winter 2026',
        isFeatured: true,
      },
      {
        name: 'Spring / Summer 2026 — Aura',
        slug: 'aura-ss26',
        tagline: 'Weightless silhouettes in unbleached silk and breathable Mediterranean linen.',
        description: 'Fluidity meets restraint. The Aura collection embraces airy drape, neutral sand tones, and relaxed daytime elegance for men.',
        heroImage: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1600&q=95',
        season: 'Spring / Summer 2026',
        isFeatured: true,
      },
      {
        name: 'Minimalist Noir',
        slug: 'minimalist-noir',
        tagline: 'Pure black textures, matte wool, and polished obsidian accents.',
        description: 'An exploration of depth through varying textures of pure midnight black: leather, cashmere, silk satin, and heavy gabardine.',
        heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95',
        season: 'Permanent Archive',
        isFeatured: true,
      },
      {
        name: 'The Silk Edit',
        slug: 'the-silk-edit',
        tagline: '100% Mulberry silk shirts, neckwear foulards, and draped evening layers.',
        description: 'Handcrafted with grade 6A pure Mulberry silk for an incomparable tactile sheen and effortless movement.',
        heroImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=95',
        season: 'Permanent Archive',
        isFeatured: false,
      },
      {
        name: 'Cashmere Atelier',
        slug: 'cashmere-atelier',
        tagline: 'Grade-A Inner Mongolian cashmere knitwear of supreme softness.',
        description: 'Ultra-fine 2-ply and 4-ply cashmere sweaters, cardigans, and beanies ethically harvested and finished in Italy.',
        heroImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1600&q=95',
        season: 'Permanent Archive',
        isFeatured: true,
      },
    ];

    const collections = await Collection.insertMany(collectionsData);
    const colMap = {};
    collections.forEach(c => { colMap[c.slug] = c; });

    console.log('[SEEDER] Seeding 32 Luxury Products...');
    const productsData = [
      // 1. Outerwear
      {
        title: 'LEO Double-Breasted Cashmere Overcoat',
        slug: 'leo-double-breasted-cashmere-overcoat',
        sku: 'LEO-COAT-001',
        shortDescription: 'Substantial 100% double-faced cashmere overcoat with peak lapels and horn buttons.',
        description: 'Tailored from heavy 650gsm Italian double-faced cashmere, this coat features an imposing drop shoulder, hand-stitched pick detailing along the peak lapels, and genuine horn buttons. Designed to be worn over tailoring or fluid knitwear for an effortless statement.',
        price: 18999,
        compareAtPrice: 24999,
        category: catMap['outerwear']._id,
        categoryName: 'Outerwear',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=95' },
          { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Obsidian Black', hex: '#0A0A0A' },
          { name: 'Camel Tan', hex: '#C19A6B' },
          { name: 'Charcoal Grey', hex: '#36454F' },
        ],
        variants: [
          { size: 'S', color: 'Obsidian Black', stock: 8 },
          { size: 'M', color: 'Obsidian Black', stock: 15 },
          { size: 'L', color: 'Obsidian Black', stock: 12 },
          { size: 'XL', color: 'Obsidian Black', stock: 6 },
          { size: 'M', color: 'Camel Tan', stock: 10 },
          { size: 'L', color: 'Camel Tan', stock: 8 },
        ],
        material: '100% Italian Double-Faced Cashmere',
        careInstructions: 'Specialist dry clean only. Store on wide wooden hanger.',
        features: ['Hand-finished pick stitching', 'Real buffalo horn buttons', 'Silk cupro interior lining', 'Deep welt hand pockets'],
        tags: ['Overcoat', 'Cashmere', 'AW26', 'Luxury Outerwear'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 18,
      },
      {
        title: 'LEO Minimalist Lambskin Leather Bomber',
        slug: 'leo-minimalist-lambskin-leather-bomber',
        sku: 'LEO-LTHR-002',
        shortDescription: 'Buttery full-grain lambskin bomber with brushed palladium two-way zipper.',
        description: 'Crafted from supple French lambskin that develops a bespoke patina over time. Cut with a relaxed boxy drape, ribbed cashmere trims, and a clean concealed placket.',
        price: 22499,
        compareAtPrice: 28999,
        category: catMap['outerwear']._id,
        categoryName: 'Outerwear',
        collectionRef: colMap['minimalist-noir']._id,
        collectionName: 'Minimalist Noir',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Noir Black', hex: '#0A0A0A' },
          { name: 'Espresso Brown', hex: '#3D2817' },
        ],
        variants: [
          { size: 'S', color: 'Noir Black', stock: 5 },
          { size: 'M', color: 'Noir Black', stock: 9 },
          { size: 'L', color: 'Noir Black', stock: 14 },
          { size: 'XL', color: 'Noir Black', stock: 4 },
        ],
        material: '100% French Full-Grain Lambskin Leather',
        careInstructions: 'Specialist leather clean only.',
        features: ['Two-way brushed palladium zipper', 'Interior welt passport pocket', 'Ribbed cashmere cuff & hem'],
        tags: ['Leather Jacket', 'Bomber', 'Noir', 'Luxury'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 5.0,
        numReviews: 24,
      },
      {
        title: 'LEO Structured Wool Trench Coat',
        slug: 'leo-structured-wool-trench-coat',
        sku: 'LEO-TRNCH-003',
        shortDescription: 'Modern reimagining of the classic military trench in water-resistant wool gabardine.',
        description: 'Featuring storm flaps, an adjustable waist sash with matte gold D-rings, and an ankle-grazing silhouette that lends theatrical elegance to any stride.',
        price: 16999,
        compareAtPrice: 21999,
        category: catMap['outerwear']._id,
        categoryName: 'Outerwear',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Camel Sand', hex: '#C19A6B' },
          { name: 'Midnight Black', hex: '#0A0A0A' },
        ],
        variants: [
          { size: 'S', color: 'Camel Sand', stock: 6 },
          { size: 'M', color: 'Camel Sand', stock: 12 },
          { size: 'L', color: 'Camel Sand', stock: 10 },
          { size: 'XL', color: 'Camel Sand', stock: 5 },
        ],
        material: '100% Virgin Wool Gabardine',
        careInstructions: 'Dry clean only.',
        features: ['Water-repellent finish', 'Detachable waist belt', 'Deep rear storm flap'],
        tags: ['Trench', 'Wool', 'Editorial', 'Menswear Outerwear'],
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 12,
      },
      {
        title: 'LEO Oversized Quilted Down Parka',
        slug: 'leo-oversized-quilted-down-parka',
        sku: 'LEO-DOWN-004',
        shortDescription: 'Cocoon silhouette insulated with 800-fill goose down for extreme warmth.',
        description: 'Constructed with a matte micro-ripstop shell and lined in thermal satin. Magnetic front closure with an exaggerated stand collar that completely blocks chilly winds.',
        price: 14999,
        compareAtPrice: 19999,
        category: catMap['outerwear']._id,
        categoryName: 'Outerwear',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Onyx Black', hex: '#0A0A0A' },
          { name: 'Slate Grey', hex: '#708090' },
        ],
        variants: [
          { size: 'S', color: 'Onyx Black', stock: 7 },
          { size: 'M', color: 'Onyx Black', stock: 11 },
          { size: 'L', color: 'Onyx Black', stock: 8 },
        ],
        material: '800-Fill Ethically Sourced Goose Down, Japanese Micro-Ripstop',
        careInstructions: 'Machine wash delicate, tumble dry with tennis balls.',
        features: ['Thermal fleece-lined pockets', 'Concealed magnetic placket', 'Drawcord hem'],
        tags: ['Down Parka', 'Winter Jacket', 'Warmth'],
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 15,
      },

      // 2. Tailored Shirts
      {
        title: 'LEO Pure Mulberry Silk Fluid Shirt',
        slug: 'leo-pure-mulberry-silk-fluid-shirt',
        sku: 'LEO-SHRT-005',
        shortDescription: '100% 22-momme Mulberry silk draped shirt with mother-of-pearl buttons.',
        description: 'Cut with a flowing relaxed silhouette, this silk shirt cascades effortlessly across the body. Features a clean Cuban collar, French seams, and genuine Australian mother-of-pearl buttons.',
        price: 8999,
        compareAtPrice: 11999,
        category: catMap['tailored-shirts']._id,
        categoryName: 'Tailored Shirts',
        collectionRef: colMap['the-silk-edit']._id,
        collectionName: 'The Silk Edit',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Champagne Ivory', hex: '#F7F5F0' },
          { name: 'Midnight Obsidian', hex: '#0A0A0A' },
          { name: 'Olive Bronze', hex: '#556B2F' },
        ],
        variants: [
          { size: 'S', color: 'Champagne Ivory', stock: 10 },
          { size: 'M', color: 'Champagne Ivory', stock: 18 },
          { size: 'L', color: 'Champagne Ivory', stock: 14 },
          { size: 'M', color: 'Midnight Obsidian', stock: 12 },
        ],
        material: '100% Grade 6A 22-Momme Mulberry Silk',
        careInstructions: 'Hand wash cold with silk detergent or dry clean.',
        features: ['Natural mother-of-pearl buttons', 'French interior seams', 'Curved high-low hemline'],
        tags: ['Silk Shirt', 'Luxury Essentials', 'Silk Edit'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 5.0,
        numReviews: 31,
      },
      {
        title: 'LEO Structured Poplin Formal Shirt',
        slug: 'leo-structured-poplin-formal-shirt',
        sku: 'LEO-SHRT-006',
        shortDescription: '120s two-ply organic Egyptian cotton poplin with crisp architectural cuffs.',
        description: 'Engineered for a razor-sharp profile. Features extended cuffs designed to be worn loose or turned back, an elongated back yoke, and high side slits.',
        price: 5499,
        compareAtPrice: 6999,
        category: catMap['tailored-shirts']._id,
        categoryName: 'Tailored Shirts',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Optic White', hex: '#FFFFFF' },
          { name: 'Pale Sky Blue', hex: '#E0E8F0' },
        ],
        variants: [
          { size: 'S', color: 'Optic White', stock: 15 },
          { size: 'M', color: 'Optic White', stock: 16 },
          { size: 'L', color: 'Optic White', stock: 9 },
          { size: 'XL', color: 'Optic White', stock: 5 },
        ],
        material: '100% GOTS Certified Organic Egyptian Cotton Poplin',
        careInstructions: 'Machine wash cold delicate. Warm iron while damp.',
        features: ['120s 2-ply high-density weave', 'Extended barrel cuffs', 'Side split hem with reinforcement gussets'],
        tags: ['Poplin Shirt', 'White Shirt', 'Architectural'],
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 14,
      },
      {
        title: 'LEO Relaxed Mediterranean Linen Shirt',
        slug: 'leo-relaxed-mediterranean-linen-shirt',
        sku: 'LEO-SHRT-007',
        shortDescription: 'Pre-washed French flax linen with relaxed band collar and casual drape.',
        description: 'Spun from artisanal Normandy flax linen that breathes effortlessly in heat. Garment-dyed for subtle tonal variation and washed for lived-in softness from the very first wear.',
        price: 4999,
        compareAtPrice: 5999,
        category: catMap['tailored-shirts']._id,
        categoryName: 'Tailored Shirts',
        collectionRef: colMap['aura-ss26']._id,
        collectionName: 'Spring / Summer 2026 — Aura',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Sand Beige', hex: '#D2B48C' },
          { name: 'Sage Green', hex: '#8A9A86' },
          { name: 'Crisp White', hex: '#FFFFFF' },
        ],
        variants: [
          { size: 'S', color: 'Sand Beige', stock: 12 },
          { size: 'M', color: 'Sand Beige', stock: 20 },
          { size: 'L', color: 'Sand Beige', stock: 18 },
          { size: 'XL', color: 'Sand Beige', stock: 10 },
        ],
        material: '100% Normandy Pre-Washed Flax Linen',
        careInstructions: 'Machine wash gentle. Line dry in shade.',
        features: ['Mandarin band collar', 'Breathable open weave', 'Natural coconut buttons'],
        tags: ['Linen Shirt', 'Summer', 'Relaxed', 'Aura'],
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.7,
        numReviews: 22,
      },
      {
        title: 'LEO Tailored Evening Tuxedo Shirt',
        slug: 'leo-tailored-evening-tuxedo-shirt',
        sku: 'LEO-SHRT-008',
        shortDescription: 'Marcella bib front evening shirt with concealed placket and double French cuffs.',
        description: 'The pinnacle of black-tie craftsmanship. Hand-woven pique bib front, structured wing collar, and seamless double cuffs designed for cufflinks.',
        price: 7499,
        compareAtPrice: 9499,
        category: catMap['tailored-shirts']._id,
        categoryName: 'Tailored Shirts',
        collectionRef: colMap['minimalist-noir']._id,
        collectionName: 'Minimalist Noir',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Pure White', hex: '#FFFFFF' },
        ],
        variants: [
          { size: 'S', color: 'Pure White', stock: 6 },
          { size: 'M', color: 'Pure White', stock: 14 },
          { size: 'L', color: 'Pure White', stock: 12 },
          { size: 'XL', color: 'Pure White', stock: 5 },
        ],
        material: '100% Sea Island Long-Staple Cotton',
        careInstructions: 'Professional dry clean & press.',
        features: ['Waffle Marcella bib', 'Double French cuffs', 'Removable collar stays'],
        tags: ['Tuxedo', 'Black Tie', 'Formal Shirt'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 9,
      },

      // 3. Trousers
      {
        title: 'LEO Double-Pleated Wide-Leg Trousers',
        slug: 'leo-double-pleated-wide-leg-trousers',
        sku: 'LEO-TRSR-009',
        shortDescription: 'High-waisted wide-leg tailored trousers in lightweight tropical wool.',
        description: 'Cut with deep double forward pleats that create an effortless, dramatic sweep when walking. Featuring side adjusters for a bespoke fit without belt loops, and an unfinished hem for customized tailoring.',
        price: 7999,
        compareAtPrice: 9999,
        category: catMap['trousers']._id,
        categoryName: 'Trousers',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['28', '30', '32', '34', '36'],
        colors: [
          { name: 'Charcoal Wool', hex: '#2A2A2A' },
          { name: 'Oatmeal Taupe', hex: '#C2B69D' },
          { name: 'Deep Navy', hex: '#0B132B' },
        ],
        variants: [
          { size: '30', color: 'Charcoal Wool', stock: 14 },
          { size: '32', color: 'Charcoal Wool', stock: 18 },
          { size: '34', color: 'Charcoal Wool', stock: 12 },
          { size: '32', color: 'Oatmeal Taupe', stock: 10 },
        ],
        material: '100% Super 130s Italian Tropical Wool',
        careInstructions: 'Dry clean only. Press with a damp cloth.',
        features: ['Brass side adjusters', 'Deep dual forward pleats', 'Half-lined in viscose satin', 'Corozo button fly'],
        tags: ['Wide Leg', 'Pleated Trousers', 'Tailoring', 'High Waist'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 27,
      },
      {
        title: 'LEO Relaxed Drawstring Wool Slacks',
        slug: 'leo-relaxed-drawstring-wool-slacks',
        sku: 'LEO-TRSR-010',
        shortDescription: 'Elevated casual trousers blending fine wool drape with an elasticated waistband.',
        description: 'Bridging the divide between formal tailoring and luxury leisure. Cut with a tapered hem, internal silk-tipped drawstring, and subtle front crease.',
        price: 6499,
        compareAtPrice: 7999,
        category: catMap['trousers']._id,
        categoryName: 'Trousers',
        collectionRef: colMap['minimalist-noir']._id,
        collectionName: 'Minimalist Noir',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Midnight Noir', hex: '#0A0A0A' },
          { name: 'Heather Smoke', hex: '#5A5A5A' },
        ],
        variants: [
          { size: 'S', color: 'Midnight Noir', stock: 9 },
          { size: 'M', color: 'Midnight Noir', stock: 16 },
          { size: 'L', color: 'Midnight Noir', stock: 14 },
          { size: 'XL', color: 'Midnight Noir', stock: 8 },
        ],
        material: '98% Virgin Wool, 2% Elastane',
        careInstructions: 'Dry clean or gentle wool hand wash.',
        features: ['Elasticated waistband with silk drawstring', 'Concealed zip pockets', 'Tapered leg profile'],
        tags: ['Slacks', 'Casual Wool', 'Comfort Tailoring'],
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.8,
        numReviews: 19,
      },
      {
        title: 'LEO Tailored Slim Sartorial Wool Slacks',
        slug: 'leo-tailored-slim-sartorial-wool-slacks',
        sku: 'LEO-TRSR-011',
        shortDescription: 'Ankle-length slim tailored trousers with immaculate pressed front creases.',
        description: 'Sculpted to elongate the legs, these trousers feature a seamless waistband, extended tab closure, and discreet cuff finish in fine Biella wool.',
        price: 6999,
        compareAtPrice: 8499,
        category: catMap['trousers']._id,
        categoryName: 'Trousers',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['30', '32', '34', '36'],
        colors: [
          { name: 'Obsidian Black', hex: '#0A0A0A' },
          { name: 'Charcoal Grey', hex: '#36454F' },
        ],
        variants: [
          { size: '30', color: 'Obsidian Black', stock: 6 },
          { size: '32', color: 'Obsidian Black', stock: 11 },
          { size: '34', color: 'Obsidian Black', stock: 10 },
          { size: '36', color: 'Obsidian Black', stock: 5 },
        ],
        material: '70% Wool, 28% Viscose, 2% Elastane',
        careInstructions: 'Dry clean only.',
        features: ['Extended tab front closure', 'Pressed center pleat', 'Discreet heel tape protection'],
        tags: ['Sartorial Slacks', 'Men Tailoring', 'Slim Pants'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 8,
      },

      // 4. Knitwear
      {
        title: 'LEO Pure Mongolian Cashmere Rollneck',
        slug: 'leo-pure-mongolian-cashmere-rollneck',
        sku: 'LEO-KNIT-012',
        shortDescription: 'Plush 4-ply cashmere turtleneck sweater of unparalleled warmth and lightness.',
        description: 'Spun from the underfleece of Capra Hircus goats from the steppes of Inner Mongolia. Seamlessly knitted with a generous rollneck collar that stands without slouching.',
        price: 11999,
        compareAtPrice: 14999,
        category: catMap['knitwear']._id,
        categoryName: 'Knitwear',
        collectionRef: colMap['cashmere-atelier']._id,
        collectionName: 'Cashmere Atelier',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Ecru Melange', hex: '#EAE6DF' },
          { name: 'Raven Black', hex: '#0A0A0A' },
          { name: 'Espresso', hex: '#3B2F2F' },
        ],
        variants: [
          { size: 'S', color: 'Ecru Melange', stock: 7 },
          { size: 'M', color: 'Ecru Melange', stock: 12 },
          { size: 'L', color: 'Ecru Melange', stock: 10 },
          { size: 'XL', color: 'Ecru Melange', stock: 4 },
          { size: 'M', color: 'Raven Black', stock: 15 },
        ],
        material: '100% Grade-A 4-Ply Mongolian Cashmere (14.8 Micron)',
        careInstructions: 'Hand wash in lukewarm water with cashmere shampoo. Dry flat on towel.',
        features: ['Ribbed rollneck and cuffs', 'Zero-waste fully fashioned knit', 'Anti-pilling treatment'],
        tags: ['Cashmere', 'Turtleneck', 'Rollneck', 'Winter Luxury'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 5.0,
        numReviews: 38,
      },
      {
        title: 'LEO Heavy Ribbed Cashmere Shawl Cardigan',
        slug: 'leo-heavy-ribbed-cashmere-shawl-cardigan',
        sku: 'LEO-KNIT-013',
        shortDescription: 'Chunky 7-gauge fisherman ribbed cardigan with genuine horn anchor buttons.',
        description: 'A cocoon of warmth for the discerning gentleman. Heavily textured with a shawl collar, dropped shoulders, and patch hand pockets.',
        price: 13499,
        compareAtPrice: 16999,
        category: catMap['knitwear']._id,
        categoryName: 'Knitwear',
        collectionRef: colMap['cashmere-atelier']._id,
        collectionName: 'Cashmere Atelier',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Oatmeal', hex: '#D7C4B7' },
          { name: 'Charcoal Black', hex: '#1C1C1C' },
        ],
        variants: [
          { size: 'S', color: 'Oatmeal', stock: 5 },
          { size: 'M', color: 'Oatmeal', stock: 9 },
          { size: 'L', color: 'Oatmeal', stock: 11 },
          { size: 'XL', color: 'Oatmeal', stock: 4 },
        ],
        material: '100% 6-Ply Pure Cashmere',
        careInstructions: 'Dry clean or hand wash flat.',
        features: ['Real horn buttons', 'Oversized deep patch pockets', 'Chunky 7-gauge fisherman rib'],
        tags: ['Cardigan', 'Knitwear', 'Cashmere', 'Menswear'],
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 16,
      },
      {
        title: 'LEO Ultra-Fine Merino Wool Crewneck',
        slug: 'leo-ultra-fine-merino-wool-crewneck',
        sku: 'LEO-KNIT-014',
        shortDescription: '16-gauge Extra Fine Australian Merino wool knitted for trans-seasonal layering.',
        description: 'Smooth as silk against bare skin. Temperature-regulating, naturally odor resistant, and tailored with a clean tubular collar.',
        price: 4999,
        compareAtPrice: 6499,
        category: catMap['knitwear']._id,
        categoryName: 'Knitwear',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Deep Forest', hex: '#1E3326' },
          { name: 'Midnight Black', hex: '#0A0A0A' },
          { name: 'Bordeaux', hex: '#4C1C24' },
        ],
        variants: [
          { size: 'S', color: 'Deep Forest', stock: 8 },
          { size: 'M', color: 'Deep Forest', stock: 15 },
          { size: 'L', color: 'Deep Forest', stock: 14 },
          { size: 'XL', color: 'Deep Forest', stock: 7 },
        ],
        material: '100% Extra Fine Australian Merino Wool (19.5 Micron)',
        careInstructions: 'Wool cycle machine wash cold, dry flat.',
        features: ['Seamless body construction', 'Ribbed collar and cuffs', 'Naturally breathable'],
        tags: ['Merino Wool', 'Crewneck', 'Layering'],
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.8,
        numReviews: 21,
      },

      // 5. Eveningwear & Tuxedos
      {
        title: 'LEO Velvet Peak Lapel Evening Tuxedo',
        slug: 'leo-velvet-peak-lapel-evening-tuxedo',
        sku: 'LEO-TUX-015',
        shortDescription: 'Black-tie tailored smoking jacket in deep Italian cotton velvet with silk grosgrain lapels.',
        description: 'The pinnacle of sovereign evening presence. Tailored from lustrous Italian cotton velvet with structured rope shoulders, hand-padded peak lapels, and silk-covered buttons.',
        price: 24999,
        compareAtPrice: 29999,
        category: catMap['eveningwear-tuxedos']._id,
        categoryName: 'Eveningwear & Tuxedos',
        collectionRef: colMap['minimalist-noir']._id,
        collectionName: 'Minimalist Noir',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['38R', '40R', '42R', '44R'],
        colors: [
          { name: 'Midnight Velvet', hex: '#0A0A0A' },
          { name: 'Imperial Emerald', hex: '#0B3B24' },
          { name: 'Deep Burgundy', hex: '#4A0E17' },
        ],
        variants: [
          { size: '38R', color: 'Midnight Velvet', stock: 5 },
          { size: '40R', color: 'Midnight Velvet', stock: 8 },
          { size: '42R', color: 'Midnight Velvet', stock: 6 },
          { size: '44R', color: 'Midnight Velvet', stock: 4 },
          { size: '40R', color: 'Imperial Emerald', stock: 5 },
          { size: '42R', color: 'Imperial Emerald', stock: 3 },
        ],
        material: '100% Italian Cotton Velvet, Pure Silk Lapels',
        careInstructions: 'Specialist dry clean only. Store in garment bag on broad cedar hanger.',
        features: ['Hand-padded peak lapels', 'Silk-covered buttons', 'Full canvas construction', 'Bespoke silk cupro lining'],
        tags: ['Tuxedo', 'Velvet Blazer', 'Black Tie', 'Gala Evening'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 5.0,
        numReviews: 29,
      },
      {
        title: 'LEO Double-Breasted Wool-Silk Dinner Jacket',
        slug: 'leo-double-breasted-wool-silk-dinner-jacket',
        sku: 'LEO-TUX-016',
        shortDescription: 'Six-button double-breasted formal dinner jacket with satin shawl lapels.',
        description: 'A tribute to Golden Age high-society dressing. Cut with a tapered waist, broad sweep, and dual rear vents for timeless elegance at galas and premier galas.',
        price: 21499,
        compareAtPrice: 26999,
        category: catMap['eveningwear-tuxedos']._id,
        categoryName: 'Eveningwear & Tuxedos',
        collectionRef: colMap['the-silk-edit']._id,
        collectionName: 'The Silk Edit',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['38R', '40R', '42R', '44R'],
        colors: [
          { name: 'Obsidian Black', hex: '#0A0A0A' },
          { name: 'Alabaster Ivory', hex: '#F7F5F0' },
        ],
        variants: [
          { size: '38R', color: 'Obsidian Black', stock: 4 },
          { size: '40R', color: 'Obsidian Black', stock: 8 },
          { size: '42R', color: 'Obsidian Black', stock: 6 },
          { size: '44R', color: 'Obsidian Black', stock: 3 },
        ],
        material: '80% Super 150s Virgin Wool, 20% Mulberry Silk',
        careInstructions: 'Professional dry clean only.',
        features: ['Six-button double-breasted closure', 'Silk satin shawl collar', 'Working cuff buttonholes'],
        tags: ['Dinner Jacket', 'Formal Wear', 'Double-Breasted', 'Silk Blend'],
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 11,
      },
      {
        title: 'LEO Silk Jacquard Evening Smoking Robe',
        slug: 'leo-silk-jacquard-evening-smoking-robe',
        sku: 'LEO-TUX-017',
        shortDescription: 'Lounge smoking coat in heavyweight silk jacquard with quilted shawl collar and tassel belt.',
        description: 'Designed for sovereign evening retreats. Features rich tone-on-tone baroque jacquard weaving, piped cuffs, and a self-tie sash with silk fringe tassels.',
        price: 18999,
        compareAtPrice: 22999,
        category: catMap['eveningwear-tuxedos']._id,
        categoryName: 'Eveningwear & Tuxedos',
        collectionRef: colMap['the-silk-edit']._id,
        collectionName: 'The Silk Edit',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Imperial Onyx', hex: '#0A0A0A' },
          { name: 'Deep Crimson', hex: '#58111A' },
        ],
        variants: [
          { size: 'S', color: 'Imperial Onyx', stock: 6 },
          { size: 'M', color: 'Imperial Onyx', stock: 10 },
          { size: 'L', color: 'Imperial Onyx', stock: 8 },
          { size: 'XL', color: 'Imperial Onyx', stock: 4 },
        ],
        material: '100% Heavy Mulberry Silk Jacquard',
        careInstructions: 'Specialist dry clean only.',
        features: ['Quilted silk satin collar', 'Deep welt pockets', 'Handmade fringe sash'],
        tags: ['Smoking Robe', 'Silk Jacquard', 'Evening Wear', 'Lounge Couture'],
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.8,
        numReviews: 17,
      },

      // 6. T-Shirts & Polos
      {
        title: 'LEO Heavyweight 280GSM Oversized Tee',
        slug: 'leo-heavyweight-280gsm-oversized-tee',
        sku: 'LEO-TEE-018',
        shortDescription: 'Dense 280gsm organic combed cotton with dropped shoulders and ribbed neckband.',
        description: 'The definitive luxury t-shirt. Dense yet soft to the touch, retaining its boxy silhouette without sagging or losing shape through countless washes.',
        price: 2499,
        compareAtPrice: 3299,
        category: catMap['t-shirts-polos']._id,
        categoryName: 'T-Shirts & Polos',
        collectionRef: colMap['minimalist-noir']._id,
        collectionName: 'Minimalist Noir',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: [
          { name: 'Pitch Black', hex: '#0A0A0A' },
          { name: 'Chalk White', hex: '#F7F5F0' },
          { name: 'Vintage Olive', hex: '#4B5320' },
        ],
        variants: [
          { size: 'S', color: 'Pitch Black', stock: 25 },
          { size: 'M', color: 'Pitch Black', stock: 40 },
          { size: 'L', color: 'Pitch Black', stock: 35 },
          { size: 'XL', color: 'Pitch Black', stock: 18 },
          { size: 'M', color: 'Chalk White', stock: 30 },
          { size: 'L', color: 'Chalk White', stock: 28 },
        ],
        material: '100% Organic GOTS Combed Cotton (280 GSM)',
        careInstructions: 'Machine wash cold inside out. Do not tumble dry.',
        features: ['Thick 1.25" bound collar', 'Reinforced twin-needle stitching', 'Pre-shrunk organic yarn'],
        tags: ['Oversized Tee', 'Heavyweight Cotton', 'Essential', 'Streetwear'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 64,
      },
      {
        title: 'LEO Mercerized Cotton Open-Collar Knit Polo',
        slug: 'leo-mercerized-cotton-open-collar-knit-polo',
        sku: 'LEO-POLO-019',
        shortDescription: 'Silky mercerized cotton fine knit polo with Johnny collar and ribbed trims.',
        description: 'Featuring a lustrous silky sheen and refined open Johnny collar. Perfect for styling under a tailored suit jacket or with pleated wide trousers.',
        price: 3999,
        compareAtPrice: 4999,
        category: catMap['t-shirts-polos']._id,
        categoryName: 'T-Shirts & Polos',
        collectionRef: colMap['aura-ss26']._id,
        collectionName: 'Spring / Summer 2026 — Aura',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Alabaster Beige', hex: '#E6E0D4' },
          { name: 'Navy Blue', hex: '#0B132B' },
          { name: 'Noir', hex: '#0A0A0A' },
        ],
        variants: [
          { size: 'S', color: 'Alabaster Beige', stock: 10 },
          { size: 'M', color: 'Alabaster Beige', stock: 18 },
          { size: 'L', color: 'Alabaster Beige', stock: 14 },
          { size: 'XL', color: 'Alabaster Beige', stock: 6 },
        ],
        material: '100% Double-Mercerized Egyptian Giza Cotton',
        careInstructions: 'Delicate cold wash, flat dry.',
        features: ['Johnny buttonless collar', 'Subtle fine knit ribbing', 'High-luster silky finish'],
        tags: ['Polo', 'Knit Polo', 'Luxury Basic', 'Summer'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 23,
      },
      {
        title: 'LEO Raw Edge Modal Long-Sleeve Tee',
        slug: 'leo-raw-edge-modal-long-sleeve-tee',
        sku: 'LEO-TEE-020',
        shortDescription: 'Featherlight micro-modal blended long sleeve with subtle raw laser-cut hems.',
        description: 'Incredible softness and fluid drape. Features elongated sleeves that bunch gracefully around the wrists.',
        price: 3299,
        compareAtPrice: 4199,
        category: catMap['t-shirts-polos']._id,
        categoryName: 'T-Shirts & Polos',
        collectionRef: colMap['minimalist-noir']._id,
        collectionName: 'Minimalist Noir',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Smoke Grey', hex: '#4A4A4A' },
          { name: 'Charcoal Black', hex: '#0A0A0A' },
        ],
        variants: [
          { size: 'S', color: 'Smoke Grey', stock: 8 },
          { size: 'M', color: 'Smoke Grey', stock: 14 },
          { size: 'L', color: 'Smoke Grey', stock: 12 },
        ],
        material: '90% Lenzing Micro-Modal, 10% Elastane',
        careInstructions: 'Machine wash delicate cold.',
        features: ['Laser-cut raw hem', 'Extended sleeve length', 'Fluid silhouette'],
        tags: ['Long Sleeve', 'Modal Tee', 'Minimalist'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 10,
      },

      // 7. Accessories
      {
        title: 'LEO Full-Grain Calfskin Minimalist Tote',
        slug: 'leo-full-grain-calfskin-minimalist-tote',
        sku: 'LEO-ACC-021',
        shortDescription: 'Unstructured full-grain Italian calfskin leather tote with magnetic closure.',
        description: 'Handcrafted in Florence using vegetable-tanned calfskin. Spacious enough for a 16-inch laptop and daily essentials, lined in plush suede with an interior zipped pouch.',
        price: 14999,
        compareAtPrice: 18999,
        category: catMap['accessories']._id,
        categoryName: 'Accessories',
        collectionRef: colMap['minimalist-noir']._id,
        collectionName: 'Minimalist Noir',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['One Size'],
        colors: [
          { name: 'Onyx Black', hex: '#0A0A0A' },
          { name: 'Cognac Saddle', hex: '#9E4714' },
        ],
        variants: [
          { size: 'One Size', color: 'Onyx Black', stock: 12 },
          { size: 'One Size', color: 'Cognac Saddle', stock: 8 },
        ],
        material: '100% Italian Vegetable-Tanned Calfskin Leather, Suede Lining',
        careInstructions: 'Condition annually with leather balm.',
        features: ['Concealed magnetic snap', 'Removable internal zippered clutch', 'Reinforced shoulder drop handles'],
        tags: ['Leather Bag', 'Tote', 'Handmade', 'Luxury Accessory'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 5.0,
        numReviews: 42,
      },
      {
        title: 'LEO Reversible Cashmere Scarf with Fringed Hem',
        slug: 'leo-reversible-cashmere-scarf-fringed-hem',
        sku: 'LEO-ACC-022',
        shortDescription: 'Two-tone 100% Mongolian cashmere woven scarf with hand-twisted tassels.',
        description: 'Generously proportioned at 200cm x 70cm, this scarf wraps you in featherweight warmth. Woven with dual tonal hues for versatile styling.',
        price: 4999,
        compareAtPrice: 6499,
        category: catMap['accessories']._id,
        categoryName: 'Accessories',
        collectionRef: colMap['cashmere-atelier']._id,
        collectionName: 'Cashmere Atelier',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['One Size'],
        colors: [
          { name: 'Charcoal / Camel', hex: '#3E3E3E' },
          { name: 'Ivory / Grey', hex: '#DCDCDC' },
        ],
        variants: [
          { size: 'One Size', color: 'Charcoal / Camel', stock: 20 },
          { size: 'One Size', color: 'Ivory / Grey', stock: 15 },
        ],
        material: '100% Grade-A Mongolian Cashmere',
        careInstructions: 'Dry clean or delicate cold hand wash.',
        features: ['Two-tone reversible weave', 'Hand-twisted 3-inch fringes', 'Oversized wrap dimensions'],
        tags: ['Scarf', 'Cashmere Scarf', 'Winter Accessory'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 28,
      },
      {
        title: 'LEO Polished Brass Buckle Leather Dress Belt',
        slug: 'leo-polished-brass-buckle-leather-dress-belt',
        sku: 'LEO-ACC-023',
        shortDescription: '30mm vegetable-tanned bridle leather belt with champagne gold solid brass hardware.',
        description: 'Beveled and burnished by hand. The minimalist buckle has a soft champagne satin finish that complements both gold and silver jewelry.',
        price: 2999,
        compareAtPrice: 3999,
        category: catMap['accessories']._id,
        categoryName: 'Accessories',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['30', '32', '34', '36'],
        colors: [
          { name: 'Noir Black', hex: '#0A0A0A' },
          { name: 'Dark Chestnut', hex: '#4A2E18' },
        ],
        variants: [
          { size: '32', color: 'Noir Black', stock: 14 },
          { size: '34', color: 'Noir Black', stock: 12 },
          { size: '32', color: 'Dark Chestnut', stock: 8 },
        ],
        material: '100% Full-Grain English Bridle Leather, Solid Brass',
        careInstructions: 'Wipe with soft damp cloth.',
        features: ['Solid brass buckle with satin finish', 'Hand-burnished wax edges', '30mm classic width'],
        tags: ['Belt', 'Leather Belt', 'Accessories'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: false,
        rating: 4.8,
        numReviews: 15,
      },

      // 8. Tailored Suits
      {
        title: 'LEO Double-Breasted Wool Atelier Blazer',
        slug: 'leo-double-breasted-wool-atelier-blazer',
        sku: 'LEO-SUIT-024',
        shortDescription: 'Peak lapel 6x2 double-breasted structured jacket tailored in English hopsack wool.',
        description: 'A monument to modern tailoring. Features sharp roped shoulders, a cinched waistline, dual side vents, and half-canvas chest construction that conforms to the wearer’s body over time.',
        price: 16999,
        compareAtPrice: 21999,
        category: catMap['tailored-suits']._id,
        categoryName: 'Tailored Suits',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Unisex',
        images: [
          { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=95', isDefault: true },
          { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95' },
        ],
        sizes: ['38R', '40R', '42R', '44R'],
        colors: [
          { name: 'Obsidian Noir', hex: '#0A0A0A' },
          { name: 'Midnight Navy', hex: '#0F1A2C' },
        ],
        variants: [
          { size: '38R', color: 'Obsidian Noir', stock: 6 },
          { size: '40R', color: 'Obsidian Noir', stock: 12 },
          { size: '42R', color: 'Obsidian Noir', stock: 10 },
          { size: '44R', color: 'Obsidian Noir', stock: 4 },
        ],
        material: '100% Super 150s English Worsted Wool, Cupro Silk Lining',
        careInstructions: 'Specialist dry clean only. Steam gently.',
        features: ['Half-canvas horsehair interlining', 'Real horn 6x2 buttons', 'Functional 4-button cuffs', 'Broad peak lapels'],
        tags: ['Blazer', 'Suit Jacket', 'Double Breasted', 'Formal'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        rating: 5.0,
        numReviews: 22,
      },
      {
        title: 'LEO Unstructured Relaxed Linen Blazer',
        slug: 'leo-unstructured-relaxed-linen-blazer',
        sku: 'LEO-SUIT-025',
        shortDescription: 'Unlined single-breasted two-button blazer in breathable Irish linen.',
        description: 'Effortless summer sophistication. Unconstructed shoulders and zero lining allow absolute airflow, delivering sharp looks without feeling restrictive.',
        price: 11999,
        compareAtPrice: 14999,
        category: catMap['tailored-suits']._id,
        categoryName: 'Tailored Suits',
        collectionRef: colMap['aura-ss26']._id,
        collectionName: 'Spring / Summer 2026 — Aura',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['38R', '40R', '42R'],
        colors: [
          { name: 'Ecru Sand', hex: '#D6CEBE' },
          { name: 'Sage Green', hex: '#778877' },
        ],
        variants: [
          { size: '38R', color: 'Ecru Sand', stock: 7 },
          { size: '40R', color: 'Ecru Sand', stock: 11 },
          { size: '42R', color: 'Ecru Sand', stock: 9 },
        ],
        material: '100% Irish Heavy-Woven Flax Linen',
        careInstructions: 'Dry clean only.',
        features: ['Completely unlined for maximum breathability', 'Patch pockets', 'Mother of pearl buttons'],
        tags: ['Linen Blazer', 'Summer Suit', 'Unstructured'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 13,
      },
      {
        title: 'LEO Tailored Single-Breasted Tuxedo Jacket',
        slug: 'leo-tailored-single-breasted-tuxedo-jacket',
        sku: 'LEO-SUIT-026',
        shortDescription: 'Shawl collar evening dinner jacket trimmed in midnight silk satin.',
        description: 'Impeccably tailored for galas and black-tie affairs. Features silk satin covered buttons, jetted pockets, and high-twist wool that resists creasing all evening.',
        price: 19999,
        compareAtPrice: 24999,
        category: catMap['tailored-suits']._id,
        categoryName: 'Tailored Suits',
        collectionRef: colMap['minimalist-noir']._id,
        collectionName: 'Minimalist Noir',
        gender: 'Men',
        images: [
          { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=95', isDefault: true },
        ],
        sizes: ['38R', '40R', '42R', '44R'],
        colors: [
          { name: 'Midnight Black', hex: '#0A0A0A' },
        ],
        variants: [
          { size: '38R', color: 'Midnight Black', stock: 5 },
          { size: '40R', color: 'Midnight Black', stock: 10 },
          { size: '42R', color: 'Midnight Black', stock: 8 },
        ],
        material: '100% Barathea Wool, Silk Satin Trim',
        careInstructions: 'Specialist evening wear dry clean.',
        features: ['Silk satin shawl collar', 'Single satin-covered button', 'Interior cigar and ticket pockets'],
        tags: ['Tuxedo', 'Dinner Jacket', 'Black Tie'],
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        rating: 5.0,
        numReviews: 18,
      },

      // Additional Luxury Pieces (Completing 32 total)
      {
        title: 'LEO Cashmere Travel Cloak & Shawl Scarf',
        slug: 'leo-cashmere-travel-cloak-shawl-scarf',
        sku: 'LEO-KNIT-027',
        shortDescription: 'Substantial 4-ply cashmere draped mantle scarf with hand-fringed edges.',
        description: 'An architectural outerwear layer for the international gentleman. Crafted in plush wool-cashmere with ribbed edge trims and subtle crest embroidery.',
        price: 8999,
        compareAtPrice: 11999,
        category: catMap['knitwear']._id,
        categoryName: 'Knitwear',
        collectionRef: colMap['cashmere-atelier']._id,
        collectionName: 'Cashmere Atelier',
        gender: 'Men',
        images: [{ url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=95', isDefault: true }],
        sizes: ['One Size'],
        colors: [{ name: 'Anthracite Grey', hex: '#292929' }],
        variants: [{ size: 'One Size', color: 'Anthracite Grey', stock: 14 }],
        material: '70% Wool, 30% Cashmere',
        careInstructions: 'Dry clean only.',
        features: ['Generous dimensions', 'Side slit drape', 'Hand-finished hem'],
        tags: ['Mantle', 'Cape', 'Cashmere', 'Gentleman'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 9,
      },
      {
        title: 'LEO Tailored Pleated Bermuda Shorts',
        slug: 'leo-tailored-pleated-bermuda-shorts',
        sku: 'LEO-TRSR-028',
        shortDescription: 'High-rise knee-length tailored shorts in crisp structured cotton twill.',
        description: 'Sharp sartorial shorts featuring deep front pleats, cuffed hems, and side slant pockets.',
        price: 4499,
        compareAtPrice: 5499,
        category: catMap['trousers']._id,
        categoryName: 'Trousers',
        collectionRef: colMap['aura-ss26']._id,
        collectionName: 'Spring / Summer 2026 — Aura',
        gender: 'Men',
        images: [{ url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1600&q=95', isDefault: true }],
        sizes: ['S', 'M', 'L'],
        colors: [{ name: 'Stone Beige', hex: '#E2DBD2' }],
        variants: [
          { size: 'S', color: 'Stone Beige', stock: 10 },
          { size: 'M', color: 'Stone Beige', stock: 15 },
          { size: 'L', color: 'Stone Beige', stock: 8 },
        ],
        material: '100% Organic Heavy Cotton Twill',
        careInstructions: 'Machine wash cold.',
        features: ['Pleated front', 'Turned-up cuffs', 'Slanted pockets'],
        tags: ['Shorts', 'Bermuda', 'Summer Tailoring'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.7,
        numReviews: 7,
      },
      {
        title: 'LEO Tailored Silk Habotai Band-Collar Shirt',
        slug: 'leo-tailored-silk-habotai-band-collar-shirt',
        sku: 'LEO-SHRT-029',
        shortDescription: 'Lustrous lightweight pure silk evening shirt with band collar and concealed placket.',
        description: 'Understated elegance for black-tie gatherings. Cut from 100% pure silk Habotai with clean French cuffs, mother-of-pearl stud closures, and an elongated rounded hem.',
        price: 7999,
        compareAtPrice: 9999,
        category: catMap['tailored-shirts']._id,
        categoryName: 'Tailored Shirts',
        collectionRef: colMap['the-silk-edit']._id,
        collectionName: 'The Silk Edit',
        gender: 'Men',
        images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1600&q=95', isDefault: true }],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Smoky Obsidian', hex: '#1C1C1C' }],
        variants: [
          { size: 'S', color: 'Smoky Obsidian', stock: 5 },
          { size: 'M', color: 'Smoky Obsidian', stock: 9 },
          { size: 'L', color: 'Smoky Obsidian', stock: 7 },
          { size: 'XL', color: 'Smoky Obsidian', stock: 4 },
        ],
        material: '100% Pure Silk Habotai',
        careInstructions: 'Gentle dry clean only.',
        features: ['Band mandarin collar', 'French seams', 'Concealed mother-of-pearl placket'],
        tags: ['Silk Shirt', 'Evening Shirt', 'Habotai'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 12,
      },
      {
        title: 'LEO Raw Japanese Denim Wide-Leg Jean',
        slug: 'leo-raw-japanese-denim-wide-leg-jean',
        sku: 'LEO-TRSR-030',
        shortDescription: '14.5oz unsanforized Japanese selvedge denim in deep indigo with silver hardware.',
        description: 'Crafted on vintage shuttle looms in Okayama. Pure indigo dyed, designed to mold to your body and fade uniquely with each wear.',
        price: 8499,
        compareAtPrice: 10999,
        category: catMap['trousers']._id,
        categoryName: 'Trousers',
        collectionRef: colMap['monolith-aw26']._id,
        collectionName: 'Autumn / Winter 2026 — Monolith',
        gender: 'Unisex',
        images: [{ url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1600&q=95', isDefault: true }],
        sizes: ['30', '32', '34', '36'],
        colors: [{ name: 'Deep Indigo', hex: '#1A2A44' }],
        variants: [
          { size: '30', color: 'Deep Indigo', stock: 12 },
          { size: '32', color: 'Deep Indigo', stock: 20 },
          { size: '34', color: 'Deep Indigo', stock: 15 },
        ],
        material: '100% Okayama Selvedge Cotton Denim (14.5 oz)',
        careInstructions: 'Wash inside out in cold water after 6 months of wear.',
        features: ['Pink selvedge ID line', 'Custom engraved silver rivets', 'Hidden back pocket rivets'],
        tags: ['Selvedge Denim', 'Japanese Denim', 'Raw Jeans'],
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 33,
      },
      {
        title: 'LEO Handwoven Panama Straw Fedora',
        slug: 'leo-handwoven-panama-straw-fedora',
        sku: 'LEO-ACC-031',
        shortDescription: 'Grade 8 Ecuadorian Toquilla straw fedora with grossgrain ribbon trim.',
        description: 'Handwoven in Montecristi, Ecuador. Featherlight, breathable, and finished with a black grosgrain ribbon with gold metallic branding.',
        price: 5499,
        compareAtPrice: 6999,
        category: catMap['accessories']._id,
        categoryName: 'Accessories',
        collectionRef: colMap['aura-ss26']._id,
        collectionName: 'Spring / Summer 2026 — Aura',
        gender: 'Unisex',
        images: [{ url: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1600&q=95', isDefault: true }],
        sizes: ['S/M', 'L/XL'],
        colors: [{ name: 'Natural Straw', hex: '#EBE0C8' }],
        variants: [
          { size: 'S/M', color: 'Natural Straw', stock: 10 },
          { size: 'L/XL', color: 'Natural Straw', stock: 12 },
        ],
        material: '100% Genuine Ecuadorian Toquilla Palm Straw',
        careInstructions: 'Spot clean only. Store in hat box.',
        features: ['Grade 8 handweave', 'Breathable cotton sweatband', 'UV protective'],
        tags: ['Hat', 'Panama Hat', 'Summer Straw'],
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        rating: 4.8,
        numReviews: 14,
      },
      {
        title: 'LEO Cashmere Knit Beanie',
        slug: 'leo-cashmere-knit-beanie',
        sku: 'LEO-ACC-032',
        shortDescription: '100% ribbed cashmere watch cap beanie with adjustable fold-over cuff.',
        description: 'Snug, supremely soft, and lightweight. Delivers gentle warmth without itchiness.',
        price: 2499,
        compareAtPrice: 3299,
        category: catMap['accessories']._id,
        categoryName: 'Accessories',
        collectionRef: colMap['cashmere-atelier']._id,
        collectionName: 'Cashmere Atelier',
        gender: 'Unisex',
        images: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1600&q=95', isDefault: true }],
        sizes: ['One Size'],
        colors: [
          { name: 'Obsidian Black', hex: '#0A0A0A' },
          { name: 'Heather Grey', hex: '#9E9E9E' },
          { name: 'Camel Tan', hex: '#C19A6B' },
        ],
        variants: [
          { size: 'One Size', color: 'Obsidian Black', stock: 25 },
          { size: 'One Size', color: 'Heather Grey', stock: 18 },
        ],
        material: '100% Mongolian Cashmere',
        careInstructions: 'Hand wash cold, dry flat.',
        features: ['2x2 stretch rib knit', 'Adjustable turn-up cuff', 'Zero scratch'],
        tags: ['Beanie', 'Cashmere Hat', 'Winter Essentials'],
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        rating: 4.9,
        numReviews: 39,
      },
    ];

    const products = await Product.insertMany(productsData);

    // Update category item counts
    for (const cat of categories) {
      const count = await Product.countDocuments({ category: cat._id });
      cat.itemCount = count;
      await cat.save();
    }

    console.log('[SEEDER] Seeding Coupons...');
    const couponsData = [
      {
        code: 'LEO10',
        description: '10% privilege discount on all orders above ₹4,999',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 4999,
        maxDiscountAmount: 3000,
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        isActive: true,
      },
      {
        code: 'LUXE20',
        description: '20% exclusive editorial release discount on orders above ₹9,999',
        discountType: 'percentage',
        discountValue: 20,
        minOrderValue: 9999,
        maxDiscountAmount: 6000,
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        isActive: true,
      },
      {
        code: 'FIRST500',
        description: 'Flat ₹500 welcome gift on your first purchase above ₹2,999',
        discountType: 'fixed',
        discountValue: 500,
        minOrderValue: 2999,
        maxDiscountAmount: 500,
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: 2000,
        isActive: true,
      },
      {
        code: 'VIP25',
        description: '25% VIP Atelier member discount on orders above ₹15,000',
        discountType: 'percentage',
        discountValue: 25,
        minOrderValue: 15000,
        maxDiscountAmount: 10000,
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        usageLimit: 100,
        isActive: true,
      },
    ];
    await Coupon.insertMany(couponsData);

    console.log('[SEEDER] Seeding Banners...');
    const bannersData = [
      {
        title: 'THE NEW STANDARD',
        subtitle: 'Autumn / Winter 2026 Collection',
        tag: 'EDITORIAL RELEASE',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=95',
        mobileImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=95',
        ctaText: 'EXPLORE COLLECTION',
        ctaLink: '/shop?collection=monolith-aw26',
        position: 'hero',
        order: 1,
        isActive: true,
      },
      {
        title: 'CRAFTED FOR THE MOMENT',
        subtitle: 'Uncompromising Italian tailoring and pure Mongolian cashmere.',
        tag: 'ATELIER ESSENTIALS',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=95',
        mobileImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=95',
        ctaText: 'DISCOVER ATELIER',
        ctaLink: '/shop?category=tailored-suits',
        position: 'editorial',
        order: 2,
        isActive: true,
      },
      {
        title: 'THE SILK EDIT',
        subtitle: 'Fluid draping, 22-momme Mulberry silk, and bespoke craftsmanship.',
        tag: 'PERMANENT ARCHIVE',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=95',
        mobileImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=95',
        ctaText: 'VIEW LOOKBOOK',
        ctaLink: '/shop?collection=the-silk-edit',
        position: 'promo',
        order: 3,
        isActive: true,
      },
    ];
    await Banner.insertMany(bannersData);

    console.log('[SEEDER] Seeding Customer Orders...');
    const orderStatuses = ['Delivered', 'Delivered', 'Out for Delivery', 'Shipped', 'Packed', 'Confirmed', 'Placed'];
    const ordersData = [];

    for (let i = 0; i < 20; i++) {
      const selectedProduct1 = products[i % products.length];
      const selectedProduct2 = products[(i + 3) % products.length];
      const status = orderStatuses[i % orderStatuses.length];
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - (i * 2 + 1));

      const qty1 = 1;
      const qty2 = i % 2 === 0 ? 1 : 0;
      const subtotal = (selectedProduct1.price * qty1) + (qty2 > 0 ? selectedProduct2.price * qty2 : 0);
      const discount = subtotal > 10000 ? 1000 : 0;
      const shipping = subtotal >= 2999 ? 0 : 250;
      const tax = Math.round((subtotal - discount) * 0.12);
      const total = subtotal - discount + shipping + tax;

      const orderNumber = `LEO-9${1000 + i}`;
      const isDelivered = status === 'Delivered';

      const items = [
        {
          product: selectedProduct1._id,
          title: selectedProduct1.title,
          slug: selectedProduct1.slug,
          image: selectedProduct1.images[0].url,
          price: selectedProduct1.price,
          size: selectedProduct1.sizes[0] || 'M',
          color: selectedProduct1.colors[0]?.name || 'Noir',
          quantity: qty1,
          total: selectedProduct1.price * qty1,
        }
      ];

      if (qty2 > 0) {
        items.push({
          product: selectedProduct2._id,
          title: selectedProduct2.title,
          slug: selectedProduct2.slug,
          image: selectedProduct2.images[0].url,
          price: selectedProduct2.price,
          size: selectedProduct2.sizes[1] || 'L',
          color: selectedProduct2.colors[0]?.name || 'Noir',
          quantity: qty2,
          total: selectedProduct2.price * qty2,
        });
      }

      const timeline = [
        { status: 'Placed', timestamp: new Date(orderDate), note: 'Order placed on LEO Atelier.' },
      ];

      if (['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
        const cDate = new Date(orderDate);
        cDate.setHours(cDate.getHours() + 4);
        timeline.push({ status: 'Confirmed', timestamp: cDate, note: 'Payment verified & order confirmed.' });
      }
      if (['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
        const pDate = new Date(orderDate);
        pDate.setDate(pDate.getDate() + 1);
        timeline.push({ status: 'Packed', timestamp: pDate, note: 'Handcrafted garments boxed in bespoke gift packaging.' });
      }
      if (['Shipped', 'Out for Delivery', 'Delivered'].includes(status)) {
        const sDate = new Date(orderDate);
        sDate.setDate(sDate.getDate() + 2);
        timeline.push({ status: 'Shipped', timestamp: sDate, note: 'Dispatched via BlueDart Express Luxury (Tracking #LEO-TRK-77889).' });
      }
      if (['Out for Delivery', 'Delivered'].includes(status)) {
        const oDate = new Date(orderDate);
        oDate.setDate(oDate.getDate() + 3);
        timeline.push({ status: 'Out for Delivery', timestamp: oDate, note: 'Courier out for delivery to destination.' });
      }
      if (status === 'Delivered') {
        const dDate = new Date(orderDate);
        dDate.setDate(dDate.getDate() + 3);
        dDate.setHours(dDate.getHours() + 5);
        timeline.push({ status: 'Delivered', timestamp: dDate, note: 'Package handed directly to customer.' });
      }

      ordersData.push({
        user: i % 3 === 0 ? customerUser._id : users[2 + (i % 3)]._id,
        customerEmail: i % 3 === 0 ? customerUser.email : users[2 + (i % 3)].email,
        customerName: i % 3 === 0 ? customerUser.name : users[2 + (i % 3)].name,
        customerPhone: '+91 98111 22334',
        orderNumber,
        orderItems: items,
        shippingAddress: customerUser.addresses[0],
        deliveryMethod: {
          name: 'Express Luxury Courier',
          price: shipping,
          estimatedDays: '2-4 business days',
        },
        paymentInfo: {
          method: i % 2 === 0 ? 'Razorpay' : 'Cash on Delivery',
          razorpayPaymentId: i % 2 === 0 ? `pay_mock_${100000 + i}` : '',
          status: (i % 2 === 0 || isDelivered) ? 'Completed' : 'Pending',
          paidAt: (i % 2 === 0 || isDelivered) ? orderDate : null,
        },
        pricing: {
          subtotal,
          discount,
          shipping,
          tax,
          total,
        },
        coupon: discount > 0 ? { code: 'LEO10', discountAmount: discount } : null,
        orderStatus: status,
        statusTimeline: timeline,
        trackingNumber: `LEO-TRK-982${i}471`,
        courierName: 'BlueDart Express Luxury',
        createdAt: orderDate,
        updatedAt: isDelivered ? new Date() : orderDate,
        deliveredAt: isDelivered ? new Date() : null,
      });
    }

    await Order.insertMany(ordersData);

    console.log('[SEEDER] Seeding Reviews...');
    const reviewsData = [
      {
        product: products[0]._id,
        user: customerUser._id,
        userName: 'Elena Rostova',
        rating: 5,
        title: 'The pinnacle of overcoat craftsmanship',
        comment: 'The weight and softness of this double-faced cashmere is sensational. It drapes with an imposing silhouette without ever feeling bulky. Truly an heirloom piece.',
        fitFeedback: 'True to Size',
        qualityRating: 5,
        verifiedPurchase: true,
        isApproved: true,
      },
      {
        product: products[1]._id,
        user: users[2]._id,
        userName: 'Julian Sterling',
        rating: 5,
        title: 'Buttery French lambskin with unbeatable cut',
        comment: 'The leather feels incredible and smells authentic. The two-way palladium zipper glides effortlessly. Wore it to Paris Fashion Week and received compliments all day.',
        fitFeedback: 'True to Size',
        qualityRating: 5,
        verifiedPurchase: true,
        isApproved: true,
      },
      {
        product: products[4]._id,
        user: users[3]._id,
        userName: 'Sophia Laurent',
        rating: 5,
        title: 'Exquisite silk drape and sheen',
        comment: 'The 22-momme Mulberry silk has such a rich weight. The ivory shade has a subtle golden champagne undertone that is breathtaking in natural light.',
        fitFeedback: 'True to Size',
        qualityRating: 5,
        verifiedPurchase: true,
        isApproved: true,
      },
      {
        product: products[8]._id,
        user: users[4]._id,
        userName: 'Marcus Chen',
        rating: 5,
        title: 'Flawless wide leg drape',
        comment: 'The double forward pleats create an incredible movement. The side adjusters make belts unnecessary and give a super clean waistband.',
        fitFeedback: 'True to Size',
        qualityRating: 5,
        verifiedPurchase: true,
        isApproved: true,
      },
      {
        product: products[11]._id,
        user: customerUser._id,
        userName: 'Elena Rostova',
        rating: 5,
        title: 'Sublime Mongolian cashmere',
        comment: 'Zero itchiness, pure heavenly softness. The turtleneck collar stands structured without suffocating. Worth every single rupee.',
        fitFeedback: 'True to Size',
        qualityRating: 5,
        verifiedPurchase: true,
        isApproved: true,
      },
      {
        product: products[14]._id,
        user: users[3]._id,
        userName: 'Sophia Laurent',
        rating: 5,
        title: 'The ultimate slip dress',
        comment: 'Bias cut makes it hug every curve effortlessly. Received so many compliments at a black-tie gala. Sensational quality.',
        fitFeedback: 'True to Size',
        qualityRating: 5,
        verifiedPurchase: true,
        isApproved: true,
      },
      {
        product: products[17]._id,
        user: users[2]._id,
        userName: 'Julian Sterling',
        rating: 5,
        title: 'Best heavyweight tee on the market',
        comment: 'At 280 GSM, it has the perfect boxy structure. Holds its collar shape through dozens of washes. Ordered 3 more.',
        fitFeedback: 'True to Size',
        qualityRating: 5,
        verifiedPurchase: true,
        isApproved: true,
      },
    ];

    await Review.insertMany(reviewsData);

    console.log('====================================================');
    console.log('[SEEDER] LEO Atelier Database Seeded Successfully!');
    console.log('DEMO ACCOUNTS:');
    console.log('-> Admin:    admin@leo.com    / Admin@12345');
    console.log('-> Customer: customer@leo.com / Customer@12345');
    console.log('DATA SUMMARY:');
    console.log(`-> ${categories.length} Categories`);
    console.log(`-> ${collections.length} Collections`);
    console.log(`-> ${products.length} Products`);
    console.log(`-> ${ordersData.length} Orders`);
    console.log(`-> ${couponsData.length} Coupons`);
    console.log(`-> ${bannersData.length} Banners`);
    console.log('====================================================');

    return true;
  } catch (error) {
    console.error('[SEEDER ERROR]:', error);
    process.exit(1);
  }
};

if (process.argv && process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
