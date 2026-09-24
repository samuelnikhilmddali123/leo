import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export const SearchModal = ({ isOpen, onClose }) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const popularSearches = [
    'Cashmere Overcoat',
    'Mulberry Silk Shirt',
    'Wide-Leg Trousers',
    'Lambskin Leather Bomber',
    'Slip Dress',
    'Tuxedo Suit',
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setKeyword('');
      setResults([]);
    }
  }, [isOpen]);

  // Live search debouncing
  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products?keyword=${encodeURIComponent(keyword.trim())}&limit=6`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    onClose();
    navigate(`/shop?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  const handleSelectKeyword = (term) => {
    setKeyword(term);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md text-[#F7F5F0] flex flex-col justify-start overflow-y-auto"
        >
          {/* Header */}
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-8 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="LEO Crest" className="w-8 h-8 object-contain rounded-full border border-white/30" />
              <span className="font-editorial text-2xl tracking-[0.25em] uppercase">LEO Atelier Search</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white transition-colors"
              aria-label="Close search overlay"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="max-w-4xl mx-auto w-full px-6 pt-12 pb-8">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search the collection, cashmere, silk, outerwear..."
                className="w-full bg-transparent border-b-2 border-white/30 text-xl md:text-3xl font-editorial pb-4 pr-12 focus:outline-none focus:border-velora-champagne transition-colors placeholder:text-white/30 text-white"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-4 text-white/70 hover:text-velora-champagne transition-colors"
              >
                {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Search className="w-7 h-7" />}
              </button>
            </form>

            {/* Popular Searches */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-white/40 mr-2">Trending:</span>
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectKeyword(term)}
                  className="text-xs font-light tracking-wider px-3 py-1.5 border border-white/15 hover:border-velora-champagne hover:text-velora-champagne transition-colors bg-white/5"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Live Search Results */}
            <div className="mt-12">
              {results.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                    <span className="text-xs uppercase tracking-widest text-white/60">
                      Found {results.length} Pieces
                    </span>
                    <button
                      onClick={handleSubmit}
                      className="text-xs uppercase tracking-widest text-velora-champagne hover:underline flex items-center space-x-1"
                    >
                      <span>View all results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {results.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          onClose();
                          navigate(`/product/${product.slug}`);
                        }}
                        className="group cursor-pointer space-y-3"
                      >
                        <div className="aspect-[3/4] bg-stone-900 overflow-hidden relative">
                          <img
                            src={product.images[0]?.url}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-velora-champagne uppercase tracking-widest font-light">
                            {product.categoryName}
                          </p>
                          <h4 className="font-editorial text-base text-white group-hover:text-velora-champagne transition-colors line-clamp-1">
                            {product.title}
                          </h4>
                          <p className="text-xs font-medium text-white/80 mt-1">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : keyword.trim() && !isLoading ? (
                <div className="text-center py-12 text-white/50 space-y-2">
                  <p className="font-editorial text-xl">No garments found matching "{keyword}"</p>
                  <p className="text-xs font-light">Try searching for keywords like "cashmere", "wool", "shirt", or "jacket".</p>
                </div>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
