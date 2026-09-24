import Category from '../models/Category.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { fallbackCategories, fallbackProducts } from '../data/fallbackData.js';

const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const getCategories = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: fallbackCategories });
    }
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    if (!categories || categories.length === 0) {
      return res.json({ success: true, data: fallbackCategories });
    }
    res.json({ success: true, data: categories });
  } catch (error) {
    console.warn('[CATEGORY API] Using fallback categories:', error.message);
    res.json({ success: true, data: fallbackCategories });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    if (mongoose.connection.readyState !== 1) {
      const category = fallbackCategories.find(c => c.slug === slug);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      const products = fallbackProducts.filter(p => p.categorySlug === slug);
      return res.json({ success: true, data: category, products });
    }
    const category = await Category.findOne({ slug });
    if (!category) {
      const fallbackCat = fallbackCategories.find(c => c.slug === slug);
      if (fallbackCat) {
        const products = fallbackProducts.filter(p => p.categorySlug === slug);
        return res.json({ success: true, data: fallbackCat, products });
      }
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    const products = await Product.find({ category: category._id, isPublished: true });
    res.json({ success: true, data: category, products });
  } catch (error) {
    const fallbackCat = fallbackCategories.find(c => c.slug === req.params.slug.toLowerCase());
    if (fallbackCat) {
      const products = fallbackProducts.filter(p => p.categorySlug === req.params.slug.toLowerCase());
      return res.json({ success: true, data: fallbackCat, products });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image, bannerImage, displayOrder } = req.body;
    const slug = slugify(name);

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image,
      bannerImage: bannerImage || image,
      displayOrder: displayOrder || 0,
    });

    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (req.body.name && req.body.name !== category.name) {
      category.name = req.body.name;
      category.slug = slugify(req.body.name);
    }

    ['description', 'image', 'bannerImage', 'displayOrder', 'isActive'].forEach(field => {
      if (req.body[field] !== undefined) category[field] = req.body[field];
    });

    const updated = await category.save();
    res.json({ success: true, message: 'Category updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
