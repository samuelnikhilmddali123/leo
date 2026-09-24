import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';
import mongoose from 'mongoose';
import { fallbackProducts } from '../data/fallbackData.js';

// Helper to filter fallback products in memory
const filterFallbackProducts = (query) => {
  let list = [...fallbackProducts];
  if (query.keyword) {
    const kw = query.keyword.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw));
  }
  if (query.category) {
    list = list.filter(p => p.categorySlug === query.category.toLowerCase() || p.categoryName?.toLowerCase() === query.category.toLowerCase());
  }
  if (query.collection) {
    list = list.filter(p => p.collectionSlug === query.collection.toLowerCase());
  }
  if (query.gender && query.gender !== 'All') {
    list = list.filter(p => p.gender === query.gender || p.gender === 'Unisex');
  }
  if (query.isFeatured === 'true') {
    list = list.filter(p => p.isFeatured);
  }
  if (query.isBestSeller === 'true') {
    list = list.filter(p => p.isBestSeller);
  }
  if (query.isNewArrival === 'true') {
    list = list.filter(p => p.isNewArrival);
  }
  return list;
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
    if (mongoose.connection.readyState !== 1) {
      const data = filterFallbackProducts(req.query);
      return res.json({
        success: true,
        data,
        pagination: { page: 1, limit: data.length, totalPages: 1, totalItems: data.length }
      });
    }
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
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isPublished: true };

    // Keyword Search
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } },
        { categoryName: { $regex: keyword, $options: 'i' } },
        { collectionName: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Category Filter
    if (category) {
      const catDoc = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (catDoc) {
        query.category = catDoc._id;
      } else {
        query.categoryName = { $regex: category, $options: 'i' };
      }
    }

    // Collection Filter
    if (collection) {
      const colDoc = await Collection.findOne({
        $or: [{ slug: collection.toLowerCase() }, { _id: collection.match(/^[0-9a-fA-F]{24}$/) ? collection : null }],
      });
      if (colDoc) {
        query.collectionRef = colDoc._id;
      } else {
        query.collectionName = { $regex: collection, $options: 'i' };
      }
    }

    // Gender Filter
    if (gender && ['Men', 'Women', 'Unisex'].includes(gender)) {
      query.gender = { $in: [gender, 'Unisex'] };
    }

    // Price Range Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    // Size Filter
    if (size) {
      const sizesArr = Array.isArray(size) ? size : size.split(',');
      query.sizes = { $in: sizesArr };
    }

    // Color Filter
    if (color) {
      const colorsArr = Array.isArray(color) ? color : color.split(',');
      query['colors.name'] = { $in: colorsArr.map(c => new RegExp(c, 'i')) };
    }

    // Flags
    if (isFeatured === 'true') query.isFeatured = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (inStock === 'true') query.inStock = true;

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-low-high') sortOptions = { price: 1 };
    else if (sort === 'price-high-low') sortOptions = { price: -1 };
    else if (sort === 'bestselling') sortOptions = { isBestSeller: -1, rating: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('collectionRef', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: products && products.length > 0 ? products : filterFallbackProducts(req.query),
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        totalItems: total || fallbackProducts.length,
      },
    });
  } catch (error) {
    console.warn('[PRODUCT API] Using fallback products:', error.message);
    const data = filterFallbackProducts(req.query);
    res.json({
      success: true,
      data,
      pagination: { page: 1, limit: data.length, totalPages: 1, totalItems: data.length }
    });
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:slugOrId
// @access  Public
export const getProductBySlug = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const isId = slugOrId.match(/^[0-9a-fA-F]{24}$/);

    if (mongoose.connection.readyState !== 1) {
      const fallback = fallbackProducts.find(p => p.slug === slugOrId.toLowerCase() || p._id === slugOrId);
      if (!fallback) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, data: fallback });
    }

    const query = isId ? { _id: slugOrId } : { slug: slugOrId.toLowerCase() };
    const product = await Product.findOne(query)
      .populate('category', 'name slug bannerImage')
      .populate('collectionRef', 'name slug tagline heroImage');

    if (!product) {
      const fallback = fallbackProducts.find(p => p.slug === slugOrId.toLowerCase() || p._id === slugOrId);
      if (fallback) return res.json({ success: true, data: fallback });
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const fallback = fallbackProducts.find(p => p.slug === req.params.slugOrId?.toLowerCase() || p._id === req.params.slugOrId);
    if (fallback) return res.json({ success: true, data: fallback });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get related / recommended products
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      isPublished: true,
      $or: [
        { category: product.category },
        { collectionRef: product.collectionRef },
        { gender: product.gender },
      ],
    })
      .limit(4)
      .populate('category', 'name slug');

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
    const {
      title,
      price,
      compareAtPrice,
      description,
      shortDescription,
      category,
      collectionRef,
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

    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const categoryDoc = await Category.findById(category);
    const collectionDoc = collectionRef ? await Collection.findById(collectionRef) : null;

    const product = new Product({
      title,
      slug,
      sku: sku || `VEL-${Date.now().toString().slice(-6)}`,
      price,
      compareAtPrice: compareAtPrice || 0,
      description,
      shortDescription: shortDescription || '',
      category,
      categoryName: categoryDoc ? categoryDoc.name : '',
      collectionRef: collectionRef || null,
      collectionName: collectionDoc ? collectionDoc.name : '',
      gender: gender || 'Unisex',
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      colors: colors || [{ name: 'Noir Black', hex: '#0A0A0A' }],
      images: images || [],
      variants: variants || [],
      material: material || '100% Premium Organic Cotton',
      careInstructions: careInstructions || 'Delicate wash cold or dry clean',
      features: features || [],
      tags: tags || [],
      isFeatured: isFeatured || false,
      isBestSeller: isBestSeller || false,
      isNewArrival: isNewArrival !== undefined ? isNewArrival : true,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    const saved = await product.save();

    // Increment category itemCount
    if (categoryDoc) {
      categoryDoc.itemCount += 1;
      await categoryDoc.save();
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: saved,
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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.title && req.body.title !== product.title) {
      product.title = req.body.title;
      product.slug = slugify(req.body.title);
    }

    if (req.body.category && req.body.category !== product.category?.toString()) {
      const catDoc = await Category.findById(req.body.category);
      if (catDoc) {
        product.category = catDoc._id;
        product.categoryName = catDoc.name;
      }
    }

    if (req.body.collectionRef !== undefined) {
      if (req.body.collectionRef) {
        const colDoc = await Collection.findById(req.body.collectionRef);
        product.collectionRef = colDoc ? colDoc._id : null;
        product.collectionName = colDoc ? colDoc.name : '';
      } else {
        product.collectionRef = null;
        product.collectionName = '';
      }
    }

    const fields = [
      'price', 'compareAtPrice', 'description', 'shortDescription',
      'gender', 'sizes', 'colors', 'images', 'variants', 'sku',
      'material', 'careInstructions', 'features', 'tags',
      'isFeatured', 'isBestSeller', 'isNewArrival', 'isPublished'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updated = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
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
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Decrement category item count
    if (product.category) {
      await Category.findByIdAndUpdate(product.category, { $inc: { itemCount: -1 } });
    }

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
    const { variants } = req.body; // Array of { size, color, stock }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (variants && Array.isArray(variants)) {
      product.variants = variants;
      await product.save();
    }

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
