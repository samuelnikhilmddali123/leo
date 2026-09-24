import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] pt-36 pb-20 flex flex-col items-center justify-center text-center px-6 font-sans">
        <div className="w-16 h-16 bg-[#EAE6DF] rounded-full flex items-center justify-center mb-6">
          <Heart className="w-8 h-8 text-velora-dark stroke-[1.5]" />
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black">Your Wishlist is Empty</h1>
        <p className="text-xs font-light text-velora-muted max-w-sm mt-3 leading-relaxed">
          Save your favorite architectural coats, cashmere knits, and silk essentials to revisit at your leisure.
        </p>
        <Link
          to="/shop"
          className="mt-8 px-8 py-4 bg-velora-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors shadow-lg"
        >
          Discover Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-velora-border gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Curated Favorites</span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-velora-black mt-1">
              Your Wishlist ({wishlist.length})
            </h1>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs uppercase tracking-widest text-red-500 hover:underline text-left font-medium"
          >
            Clear Wishlist
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pt-10">
          {wishlist.map((product) => (
            <ProductCard key={product._id || product} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
