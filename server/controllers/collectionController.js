import Collection from '../models/Collection.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { fallbackCollections, fallbackProducts } from '../data/fallbackData.js';

const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

export const getCollections = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: fallbackCollections });
    }
    const collections = await Collection.find({ isActive: true });
    if (!collections || collections.length === 0) {
      return res.json({ success: true, data: fallbackCollections });
    }
    res.json({ success: true, data: collections });
  } catch (error) {
    console.warn('[COLLECTION API] Using fallback collections:', error.message);
    res.json({ success: true, data: fallbackCollections });
  }
};

export const getCollectionBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    if (mongoose.connection.readyState !== 1) {
      const collection = fallbackCollections.find(c => c.slug === slug);
      if (!collection) return res.status(404).json({ success: false, message: 'Collection not found' });
      const products = fallbackProducts.filter(p => p.collectionSlug === slug);
      return res.json({ success: true, data: collection, products });
    }
    const collection = await Collection.findOne({ slug });
    if (!collection) {
      const fallbackCol = fallbackCollections.find(c => c.slug === slug);
      if (fallbackCol) {
        const products = fallbackProducts.filter(p => p.collectionSlug === slug);
        return res.json({ success: true, data: fallbackCol, products });
      }
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    const products = await Product.find({ collectionRef: collection._id, isPublished: true });
    res.json({ success: true, data: collection, products });
  } catch (error) {
    const fallbackCol = fallbackCollections.find(c => c.slug === req.params.slug.toLowerCase());
    if (fallbackCol) {
      const products = fallbackProducts.filter(p => p.collectionSlug === req.params.slug.toLowerCase());
      return res.json({ success: true, data: fallbackCol, products });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const { name, tagline, description, heroImage, lookbookImages, season, isFeatured } = req.body;
    const slug = slugify(name);

    const exists = await Collection.findOne({ slug });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Collection already exists' });
    }

    const collection = await Collection.create({
      name,
      slug,
      tagline: tagline || '',
      description: description || '',
      heroImage,
      lookbookImages: lookbookImages || [],
      season: season || 'Autumn / Winter 2026',
      isFeatured: isFeatured || false,
    });

    res.status(201).json({ success: true, message: 'Collection created', data: collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    if (req.body.name && req.body.name !== collection.name) {
      collection.name = req.body.name;
      collection.slug = slugify(req.body.name);
    }

    ['tagline', 'description', 'heroImage', 'lookbookImages', 'season', 'isFeatured', 'isActive'].forEach(field => {
      if (req.body[field] !== undefined) collection[field] = req.body[field];
    });

    const updated = await collection.save();
    res.json({ success: true, message: 'Collection updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Collection deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
