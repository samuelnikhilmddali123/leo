import Banner from '../models/Banner.js';
import mongoose from 'mongoose';
import { fallbackBanners } from '../data/fallbackData.js';

export const getBanners = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: fallbackBanners });
    }
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: banners && banners.length > 0 ? banners : fallbackBanners });
  } catch (error) {
    console.warn('[BANNER API] Using fallback banners:', error.message);
    res.json({ success: true, data: fallbackBanners });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, message: 'Banner created successfully', data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, message: 'Banner updated', data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
