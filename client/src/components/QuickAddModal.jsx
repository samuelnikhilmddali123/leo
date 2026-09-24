import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const QuickAddModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || 'Noir');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-[#FAF9F5] text-velora-dark w-full max-w-lg shadow-2xl p-6 md:p-8 z-10 border border-velora-border"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-velora-dark hover:text-velora-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex space-x-6">
            <div className="w-28 h-36 shrink-0 bg-stone-200 overflow-hidden">
              <img
                src={product.images?.[0]?.url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-[11px] text-velora-muted uppercase tracking-widest">{product.categoryName}</p>
              <h3 className="font-editorial text-xl font-normal text-velora-black">{product.title}</h3>
              <p className="text-sm font-semibold text-velora-dark mt-1">₹{product.price.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <label className="text-xs uppercase tracking-widest text-velora-muted block mb-2">
                Color: <span className="text-velora-black font-medium">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center space-x-2 px-3 py-1.5 border text-xs transition-all ${
                      selectedColor === c.name
                        ? 'border-velora-black bg-velora-black text-white font-medium'
                        : 'border-velora-border bg-white text-velora-dark hover:border-velora-black'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <label className="text-xs uppercase tracking-widest text-velora-muted block mb-2">
                Select Size
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs uppercase font-medium border text-center transition-all ${
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

          {/* Add to Bag Action */}
          <button
            onClick={handleAdd}
            className="w-full mt-8 bg-velora-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors shadow-lg"
          >
            Add to Bag — ₹{(product.price * quantity).toLocaleString('en-IN')}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
