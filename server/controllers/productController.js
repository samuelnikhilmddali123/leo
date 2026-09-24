import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fallbackProducts } from '../data/fallbackData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');

// Helper to safely read products from JSON file
export const readProductsFromJson = () => {
  try {
    if (fs.existsSync(productsFilePath)) {
      const data = fs.readFileSync(productsFilePath, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[PRODUCT JSON] Error reading products.json:', err.message);
  }
  return fallbackProducts;
};

// Helper to safely write products to JSON file
export const writeProductsToJson = (products) => {
  try {
    const dir = path.dirname(productsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[PRODUCT JSON] Error writing to products.json:', err.message);
    return false;
  }
};

// Helper to slugify
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = readProductsFromJson();
    const {
      keyword,
      category,
      collection,
      gender,
      minPrice,
      maxPrice,
      size,
      color,
      isFeatured,
      isBestSeller,
      isNewArrival,
      inStock,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    let filtered = products.filter(p => p.isPublished !== false);

    // Keyword Search
    if (keyword) {
      const kw = keyword.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.title && p.title.toLowerCase().includes(kw)) ||
        (p.description && p.description.toLowerCase().includes(kw)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(kw)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(kw)) ||
        (p.collectionName && p.collectionName.toLowerCase().includes(kw)) ||
        (p.material && p.material.toLowerCase().includes(kw)) ||
        (p.sku && p.sku.toLowerCase().includes(kw)) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(kw)))
      );
    }

    // Category Filter
    if (category) {
      const catVal = category.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.categorySlug && p.categorySlug.toLowerCase() === catVal) ||
        (p.categoryName && p.categoryName.toLowerCase() === catVal) ||
        p.category === category
      );
    }

    // Collection Filter
    if (collection) {
      const colVal = collection.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.collectionSlug && p.collectionSlug.toLowerCase() === colVal) ||
        (p.collectionName && p.collectionName.toLowerCase() === colVal) ||
        p.collectionRef === collection
      );
    }

    // Gender Filter
    if (gender && gender !== 'All') {
      filtered = filtered.filter(p => p.gender === gender || p.gender === 'Unisex');
    }

    // Price Range Filter
    if (minPrice !== undefined && minPrice !== '') {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }

    // Size Filter
    if (size) {
      const sizesArr = Array.isArray(size) ? size : size.split(',').map(s => s.trim());
      filtered = filtered.filter(p =>
        (Array.isArray(p.sizes) && p.sizes.some(s => sizesArr.includes(s))) ||
        (Array.isArray(p.variants) && p.variants.some(v => sizesArr.includes(v.size)))
      );
    }

    // Color Filter
    if (color) {
      const colorsArr = Array.isArray(color) ? color : color.split(',').map(c => c.trim().toLowerCase());
      filtered = filtered.filter(p =>
        (Array.isArray(p.colors) && p.colors.some(c => colorsArr.includes(c.name.toLowerCase()))) ||
        (Array.isArray(p.variants) && p.variants.some(v => colorsArr.includes(v.color?.toLowerCase())))
      );
    }

    // Status Flags
    if (isFeatured === 'true') {
      filtered = filtered.filter(p => Boolean(p.isFeatured));
    }
    if (isBestSeller === 'true') {
      filtered = filtered.filter(p => Boolean(p.isBestSeller));
    }
    if (isNewArrival === 'true') {
      filtered = filtered.filter(p => Boolean(p.isNewArrival));
    }
    if (inStock === 'true') {
      filtered = filtered.filter(p => p.inStock !== false);
    }

    // Sorting
    switch (sort) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      case 'bestselling':
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    // Pagination
    const totalItems = filtered.length;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 12);
    const totalPages = Math.ceil(totalItems / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = filtered.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      count: paginatedProducts.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        totalItems,
      },
      data: paginatedProducts,
    });
  } catch (error) {
    console.error('[PRODUCT JSON GET ERROR]:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by slug, id, or SKU
// @route   GET /api/products/:slugOrId
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const products = readProductsFromJson();
    const { slugOrId } = req.params;
    const target = slugOrId.toLowerCase().trim();

    const product = products.find(p =>
      (p.slug && p.slug.toLowerCase() === target) ||
      (p._id && p._id.toLowerCase() === target) ||
      (p.sku && p.sku.toLowerCase() === target)
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get related / recommended products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const products = readProductsFromJson();
    const current = products.find(p => p._id === req.params.id || p.slug === req.params.id);

    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = products
      .filter(p =>
        p._id !== current._id &&
        p.isPublished !== false &&
        (
          p.categorySlug === current.categorySlug ||
          p.category === current.category ||
          p.collectionSlug === current.collectionSlug ||
          p.gender === current.gender
        )
      )
      .slice(0, 4);

    res.json({
      success: true,
      data: related,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const products = readProductsFromJson();
    const {
      title,
      price,
      compareAtPrice,
      description,
      shortDescription,
      category,
      categoryName,
      categorySlug,
      collectionRef,
      collectionName,
      collectionSlug,
      gender,
      sizes,
      colors,
      images,
      variants,
      sku,
      material,
      careInstructions,
      features,
      tags,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isPublished,
    } = req.body;

    const baseSlug = slugify(title || 'luxury-piece');
    let slug = baseSlug;
    let counter = 1;
    while (products.some(p => p.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newProduct = {
      _id: `prod-${Date.now()}`,
      title: title || 'New Luxury Piece',
      slug,
      sku: sku || `LEO-${Date.now().toString().slice(-6)}`,
      price: Number(price) || 0,
      compareAtPrice: Number(compareAtPrice) || 0,
      description: description || '',
      shortDescription: shortDescription || '',
      category: category || 'cat-001',
      categoryName: categoryName || 'Outerwear',
      categorySlug: categorySlug || 'outerwear',
      collectionRef: collectionRef || null,
      collectionName: collectionName || '',
      collectionSlug: collectionSlug || '',
      gender: gender || 'Unisex',
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      colors: colors || [{ name: 'Noir Black', hex: '#0A0A0A' }],
      images: images || [],
      variants: variants || [],
      material: material || '100% Italian Luxury Fabric',
      careInstructions: careInstructions || 'Specialist dry clean only.',
      features: features || [],
      tags: tags || [],
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      inStock: true,
      rating: 5.0,
      numReviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProduct);
    writeProductsToJson(products);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const products = readProductsFromJson();
    const index = products.findIndex(p => p._id === req.params.id || p.slug === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const current = products[index];

    if (req.body.title && req.body.title !== current.title) {
      current.title = req.body.title;
      current.slug = slugify(req.body.title);
    }

    const fields = [
      'price', 'compareAtPrice', 'description', 'shortDescription',
      'category', 'categoryName', 'categorySlug',
      'collectionRef', 'collectionName', 'collectionSlug',
      'gender', 'sizes', 'colors', 'images', 'variants', 'sku',
      'material', 'careInstructions', 'features', 'tags',
      'isFeatured', 'isBestSeller', 'isNewArrival', 'isPublished', 'inStock'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        current[field] = req.body[field];
      }
    });

    current.updatedAt = new Date().toISOString();
    products[index] = current;
    writeProductsToJson(products);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: current,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    let products = readProductsFromJson();
    const initialLen = products.length;
    products = products.filter(p => p._id !== req.params.id && p.slug !== req.params.id);

    if (products.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    writeProductsToJson(products);

    res.json({
      success: true,
      message: 'Product removed from catalog',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update product variant inventory
// @route   PUT /api/products/:id/inventory
// @access  Private/Admin
export const updateInventory = async (req, res) => {
  try {
    const { variants } = req.body;
    const products = readProductsFromJson();
    const index = products.findIndex(p => p._id === req.params.id || p.slug === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = products[index];
    if (variants && Array.isArray(variants)) {
      product.variants = variants;
      const totalStock = variants.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
      product.totalStock = totalStock;
      product.inStock = totalStock > 0;
    }

    product.updatedAt = new Date().toISOString();
    products[index] = product;
    writeProductsToJson(products);

    res.json({
      success: true,
      message: 'Inventory updated successfully',
      data: {
        _id: product._id,
        title: product.title,
        totalStock: product.totalStock,
        inStock: product.inStock,
        variants: product.variants,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
