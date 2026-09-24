import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  tagline: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  heroImage: {
    type: String,
    required: true,
  },
  lookbookImages: [{
    type: String,
  }],
  season: {
    type: String,
    default: 'Autumn / Winter 2026',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
