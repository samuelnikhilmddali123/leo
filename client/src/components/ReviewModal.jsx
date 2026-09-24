import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Upload, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const ReviewModal = ({ product, isOpen, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [fitFeedback, setFitFeedback] = useState('True to Size');
  const [qualityRating, setQualityRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      error('Please fill in both a review title and comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        productId: product._id,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        fitFeedback,
        qualityRating,
      });

      if (res.data.success) {
        success('Your review has been submitted for LEO Atelier.');
        onReviewSubmitted && onReviewSubmitted(res.data.data);
        onClose();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-[#FAF9F5] text-velora-dark w-full max-w-lg shadow-2xl p-6 md:p-8 z-10 border border-velora-border max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-velora-dark hover:text-velora-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[11px] text-velora-muted uppercase tracking-widest">Client Feedback</span>
          <h2 className="font-editorial text-2xl font-normal text-velora-black mt-1">
            Review: {product.title}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-xs">
            {/* Star Rating */}
            <div>
              <label className="block text-velora-muted uppercase tracking-wider mb-2">Overall Rating</label>
              <div className="flex items-center space-x-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-medium text-velora-black">
                  {rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : 'Below Standard'}
                </span>
              </div>
            </div>

            {/* Fit Feedback */}
            <div>
              <label className="block text-velora-muted uppercase tracking-wider mb-2">Fit Evaluation</label>
              <div className="grid grid-cols-3 gap-2">
                {['Runs Small', 'True to Size', 'Runs Large'].map((fit) => (
                  <button
                    type="button"
                    key={fit}
                    onClick={() => setFitFeedback(fit)}
                    className={`py-2 px-3 border text-center font-medium transition-all ${
                      fitFeedback === fit
                        ? 'border-velora-black bg-velora-black text-white'
                        : 'border-velora-border bg-white text-velora-dark hover:border-velora-black'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-velora-muted uppercase tracking-wider mb-1.5">Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Heirloom cashmere with flawless drape"
                className="w-full bg-white border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                required
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-velora-muted uppercase tracking-wider mb-1.5">Review Details</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe fabric texture, weight, silhouette, and craftsmanship..."
                className="w-full bg-white border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-velora-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Publish Review</span>}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
