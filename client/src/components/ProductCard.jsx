import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Plus } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { QuickAddModal } from './QuickAddModal';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isSaved = isInWishlist(product._id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  return (
    <>
      <div
        className="group relative flex flex-col font-sans"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Frame */}
        <div className="relative aspect-[3/4] bg-[#EAE6DF] overflow-hidden">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            {/* Primary Image */}
            <img
              src={primaryImage}
              alt={product.title}
              className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                isHovered && secondaryImage !== primaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
              loading="lazy"
            />
            {/* Secondary Image on Hover */}
            {secondaryImage !== primaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.title} alternate view`}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                loading="lazy"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10 pointer-events-none">
            {product.isNewArrival && (
              <span className="bg-velora-black text-white text-[9px] uppercase tracking-widest px-2 py-1 font-medium">
                New Arrival
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="bg-stone-900/90 text-velora-champagne text-[9px] uppercase tracking-widest px-2 py-1 font-medium">
                -{product.discountPercentage}%
              </span>
            )}
            {!product.inStock && (
              <span className="bg-stone-600 text-white text-[9px] uppercase tracking-widest px-2 py-1 font-medium">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-velora-dark shadow-sm transition-all duration-300 z-10"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-red-500 text-red-500' : 'text-velora-dark hover:text-velora-black'
              }`}
            />
          </button>

          {/* Quick Add Overlay Bar */}
          <div
            className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 transform ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="w-full bg-[#FAF9F5] text-velora-black hover:bg-white text-[11px] font-medium tracking-[0.18em] uppercase py-2.5 shadow-lg flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="pt-4 flex flex-col space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-velora-muted uppercase tracking-widest">
            <span>{product.categoryName || 'Apparel'}</span>
            {product.rating > 0 && (
              <div className="flex items-center space-x-1 text-stone-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-editorial text-lg text-velora-black font-normal hover:text-velora-champagne transition-colors line-clamp-1"
          >
            {product.title}
          </Link>

          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5 py-0.5">
              {product.colors.slice(0, 4).map((c, idx) => (
                <span
                  key={idx}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-velora-muted font-light">+{product.colors.length - 4}</span>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center space-x-2 pt-0.5">
            <span className="text-sm font-semibold text-velora-dark">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-velora-muted line-through font-light">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
};
