import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating between 1 and 5 is required'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
  },
  verifiedPurchase: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: true, // Auto-approved or moderated
  },
  fitFeedback: {
    type: String,
    enum: ['Runs Small', 'True to Size', 'Runs Large'],
    default: 'True to Size',
  },
  qualityRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  images: [{
    type: String,
  }],
}, {
  timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
