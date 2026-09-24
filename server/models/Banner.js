import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
  mobileImage: {
    type: String,
    default: '',
  },
  ctaText: {
    type: String,
    default: 'DISCOVER COLLECTION',
  },
  ctaLink: {
    type: String,
    default: '/shop',
  },
  position: {
    type: String,
    enum: ['hero', 'editorial', 'promo', 'middle'],
    default: 'hero',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
