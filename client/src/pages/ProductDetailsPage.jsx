import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Ruler,
  Plus,
  Minus,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { ReviewModal } from '../components/ReviewModal';
import { ProductDetailSkeleton } from '../components/SkeletonLoader';

export const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Accordion Toggles
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    material: true,
    shipping: false,
  });

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          const prod = res.data.data;
          setProduct(prod);
          setSelectedSize(prod.sizes?.[0] || 'M');
          setSelectedColor(prod.colors?.[0]?.name || 'Noir');
          setSelectedImageIdx(0);

          // Record Recently Viewed
          try {
            const viewed = JSON.parse(localStorage.getItem('velora_recently_viewed') || '[]');
            const filtered = viewed.filter(p => p._id !== prod._id);
            localStorage.setItem('velora_recently_viewed', JSON.stringify([prod, ...filtered].slice(0, 6)));
          } catch (e) {}

          // Fetch related products & reviews
          const [relRes, revRes] = await Promise.all([
            api.get(`/products/${prod._id}/related`),
            api.get(`/reviews/product/${prod._id}`),
          ]);
          if (relRes.data.success) setRelatedProducts(relRes.data.data);
          if (revRes.data.success) setReviews(revRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-editorial text-3xl font-normal">Garment Not Found</h2>
        <p className="text-xs text-velora-muted mt-2">The requested piece may have been archived or removed.</p>
        <Link to="/shop" className="mt-6 px-6 py-3 bg-velora-black text-white text-xs uppercase tracking-widest">
          Explore Archive
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85' }];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#FAF9F5] pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumbs */}
        <div className="py-4 text-xs font-light text-velora-muted flex items-center space-x-2">
          <Link to="/" className="hover:text-velora-black">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-velora-black">Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-velora-black">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-velora-black truncate max-w-xs">{product.title}</span>
        </div>

        {/* Main Product Layout: Gallery + Purchasing Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 pt-6">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Vertical Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3 shrink-0 overflow-x-auto sm:overflow-visible">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 sm:w-20 aspect-[3/4] bg-stone-200 overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIdx === idx ? 'border-velora-black' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Active Image Viewport */}
            <div className="flex-1 aspect-[3/4] bg-[#EAE6DF] overflow-hidden shadow-sm relative group">
              <img
                src={images[selectedImageIdx]?.url}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-stone-900 text-velora-champagne text-[10px] uppercase tracking-widest px-2.5 py-1 font-semibold">
                  -{product.discountPercentage}% Atelier Privilege
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Purchasing Form & Attributes */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-velora-champagne uppercase tracking-widest font-medium">
                <span>{product.categoryName || 'Atelier Selection'}</span>
                <span className="text-velora-muted font-light">{product.sku}</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
                {product.title}
              </h1>

              {/* Rating & Review Jump */}
              <div className="flex items-center space-x-3 mt-3 text-xs">
                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span className="font-semibold text-velora-black ml-1.5">{product.rating || 5.0}</span>
                </div>
                <span className="text-stone-300">•</span>
                <a href="#reviews" className="text-velora-muted hover:text-velora-black underline font-light">
                  {reviews.length} {reviews.length === 1 ? 'Client Review' : 'Client Reviews'}
                </a>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mt-4">
                <span className="text-2xl sm:text-3xl font-semibold text-velora-black">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through font-light">
                    ₹{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-stone-500 font-light">
                  (Inclusive of all taxes)
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs font-light text-stone-600 leading-relaxed pt-1">
              {product.shortDescription || product.description}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="pt-2">
                <label className="text-xs uppercase tracking-widest text-velora-muted block mb-2.5">
                  Colorway: <span className="text-velora-black font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center space-x-2 px-3.5 py-2 border text-xs transition-all ${
                        selectedColor === c.name
                          ? 'border-velora-black bg-white shadow-sm font-semibold'
                          : 'border-velora-border bg-white text-stone-600 hover:border-velora-black'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector + Size Guide */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs uppercase tracking-widest text-velora-muted">
                    Size: <span className="text-velora-black font-semibold">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center space-x-1 text-xs text-velora-dark hover:text-velora-black underline font-light"
                  >
                    <Ruler className="w-3.5 h-3.5 text-velora-champagne" />
                    <span>Size Guide & Measurements</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-3 text-xs uppercase font-medium border text-center transition-all ${
                        selectedSize === s
                          ? 'border-velora-black bg-velora-black text-white'
                          : 'border-velora-border bg-white text-velora-dark hover:border-velora-black'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Counter */}
            <div className="flex items-center space-x-4 pt-2">
              <label className="text-xs uppercase tracking-widest text-velora-muted">Quantity</label>
              <div className="flex items-center border border-velora-border bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-500 hover:text-black transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold px-4 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-500 hover:text-black transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-velora-black text-white py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-black/85 transition-colors shadow-lg disabled:opacity-50"
                >
                  {product.inStock ? `Add to Bag — ₹${(product.price * quantity).toLocaleString('en-IN')}` : 'Sold Out'}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-4 border border-velora-border bg-white hover:border-velora-black transition-colors"
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-velora-black'}`} />
                </button>
              </div>

              {product.inStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-stone-900/90 text-velora-champagne border border-velora-champagne/40 py-3.5 text-xs uppercase tracking-[0.22em] font-medium hover:bg-black transition-colors"
                >
                  Express Checkout with Razorpay
                </button>
              )}
            </div>

            {/* Concierge Perks */}
            <div className="p-4 bg-[#F0EDE6] border border-velora-border space-y-2 text-xs text-stone-700 font-light">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-velora-champagne shrink-0" />
                <span>Complimentary insured express delivery on orders above ₹2,999</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-velora-champagne shrink-0" />
                <span>Doorstep concierge exchange within 14 business days</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-velora-champagne shrink-0" />
                <span>Delivered in signature LEO matte black presentation box</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-velora-border pt-4 space-y-3 text-xs">
              {/* Description Accordion */}
              <div className="border-b border-velora-border pb-3">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between py-2 text-left uppercase tracking-widest font-semibold text-velora-black"
                >
                  <span>Description & Silhouette</span>
                  {openAccordions.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.description && (
                  <div className="pt-2 text-stone-600 font-light space-y-2 leading-relaxed">
                    <p>{product.description}</p>
                    {product.features && product.features.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 pt-2">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Material & Care */}
              <div className="border-b border-velora-border pb-3">
                <button
                  onClick={() => toggleAccordion('material')}
                  className="w-full flex items-center justify-between py-2 text-left uppercase tracking-widest font-semibold text-velora-black"
                >
                  <span>Material & Care Instructions</span>
                  {openAccordions.material ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.material && (
                  <div className="pt-2 text-stone-600 font-light space-y-2 leading-relaxed">
                    <p><strong className="text-velora-black font-medium">Composition:</strong> {product.material}</p>
                    <p><strong className="text-velora-black font-medium">Care:</strong> {product.careInstructions}</p>
                  </div>
                )}
              </div>

              {/* Shipping & Delivery */}
              <div className="border-b border-velora-border pb-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between py-2 text-left uppercase tracking-widest font-semibold text-velora-black"
                >
                  <span>Complimentary Shipping & Returns</span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.shipping && (
                  <div className="pt-2 text-stone-600 font-light space-y-2 leading-relaxed">
                    <p>All garments are prepared and dispatched within 24 business hours from our central atelier.</p>
                    <p>Standard delivery arrives in 2–4 business days with end-to-end SMS & WhatsApp tracking.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-28 pt-16 border-t border-velora-border">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Client Impressions</span>
              <h2 className="font-editorial text-3xl font-normal text-velora-black mt-1">
                Verified Reviews ({reviews.length})
              </h2>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="mt-4 md:mt-0 px-6 py-3 border border-velora-black bg-white hover:bg-velora-black hover:text-white transition-colors text-xs uppercase tracking-widest font-medium"
            >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Rating Summary Box */}
            <div className="md:col-span-4 p-6 bg-[#F0EDE6] border border-velora-border space-y-4">
              <div className="flex items-center space-x-3">
                <span className="font-editorial text-5xl font-normal text-velora-black">{product.rating || 5.0}</span>
                <div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-velora-muted font-light mt-0.5 block">
                    Based on {reviews.length} authentic purchases
                  </span>
                </div>
              </div>
              <div className="border-t border-stone-300 pt-3 text-xs space-y-2 text-stone-600 font-light">
                <p>98% of clients recommend this piece for fit and tactile craftsmanship.</p>
              </div>
            </div>

            {/* Reviews Stream */}
            <div className="md:col-span-8 space-y-6">
              {reviews.length === 0 ? (
                <div className="py-8 text-center text-velora-muted text-xs font-light bg-white border border-velora-border p-6">
                  Be the first to share an evaluation of this garment.
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-6 bg-white border border-velora-border space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-velora-black">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 font-medium">
                            <Check className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-stone-400 text-[11px]">
                        {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                        />
                      ))}
                    </div>

                    <h4 className="font-editorial text-lg text-velora-black font-normal">{rev.title}</h4>
                    <p className="text-xs font-light text-stone-600 leading-relaxed">{rev.comment}</p>
                    <div className="text-[11px] text-velora-muted font-light pt-1">
                      <span>Fit: <strong className="text-stone-800 font-medium">{rev.fitFeedback}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-28 pt-16 border-t border-velora-border">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-1">
              <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Curated Pairings</span>
              <h2 className="font-editorial text-3xl font-normal text-velora-black">You May Also Admire</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <ReviewModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={(newRev) => setReviews(prev => [newRev, ...prev])}
      />
    </div>
  );
};
