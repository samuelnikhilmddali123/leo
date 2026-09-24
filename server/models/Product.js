import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  sku: { type: String },
  stock: { type: Number, default: 0, min: 0 },
});

const productImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
});

const productColorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  image: { type: String, default: '' },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  shortDescription: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  compareAtPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  categoryName: {
    type: String,
    default: '',
  },
  subcategory: {
    type: String,
    default: '',
  },
  collectionRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
  },
  collectionName: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    default: 'Unisex',
  },
  images: [productImageSchema],
  sizes: [{
    type: String,
  }],
  colors: [productColorSchema],
  variants: [variantSchema],
  totalStock: {
    type: Number,
    default: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  material: {
    type: String,
    default: '100% Premium Organic Cotton',
  },
  careInstructions: {
    type: String,
    default: 'Dry clean only or delicate machine wash cold. Do not tumble dry.',
  },
  features: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  isNewArrival: {
    type: Boolean,
    default: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Auto compute totalStock and discountPercentage
productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
    this.inStock = this.totalStock > 0;
  }
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    this.discountPercentage = Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  } else {
    this.discountPercentage = 0;
  }
  next();
});

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
