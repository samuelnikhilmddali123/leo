import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, fitFeedback, qualityRating, images } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this piece' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      title,
      comment,
      fitFeedback: fitFeedback || 'True to Size',
      qualityRating: qualityRating || 5,
      images: images || [],
      verifiedPurchase: true,
      isApproved: true,
    });

    // Update Product average rating & numReviews
    const allReviews = await Review.find({ product: productId, isApproved: true });
    product.numReviews = allReviews.length;
    product.rating = Number((allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1));
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Thank you. Your review has been published.',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('product', 'title slug images').sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle review approval status (Admin)
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : !review.isApproved;
    await review.save();

    res.json({ success: true, message: 'Review status updated', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate product rating
    const remaining = await Review.find({ product: productId, isApproved: true });
    const product = await Product.findById(productId);
    if (product) {
      product.numReviews = remaining.length;
      product.rating = remaining.length > 0
        ? Number((remaining.reduce((acc, r) => acc + r.rating, 0) / remaining.length).toFixed(1))
        : 5;
      await product.save();
    }

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
