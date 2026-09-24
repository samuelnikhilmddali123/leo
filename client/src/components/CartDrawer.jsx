import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    freeShippingRemaining,
    isFreeShipping,
    freeShippingThreshold,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponCode);
    setIsApplying(false);
    setCouponCode('');
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const progressPercent = Math.min(100, Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="w-screen max-w-md bg-[#FAF9F5] text-velora-dark shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-6 border-b border-velora-border flex items-center justify-between">
                <div>
                  <h2 className="font-editorial text-2xl tracking-wide uppercase font-normal">Shopping Bag</h2>
                  <p className="text-xs text-velora-muted uppercase tracking-widest font-light">
                    {cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'}
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 text-velora-dark hover:text-velora-black transition-colors"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="px-6 py-3 bg-[#F0EDE6] border-b border-velora-border text-xs">
                {isFreeShipping ? (
                  <div className="flex items-center text-velora-black font-medium space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-velora-champagne" />
                    <span>Complimentary express insured delivery unlocked</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-velora-dark font-light">
                      Add <span className="font-semibold text-velora-black">₹{freeShippingRemaining.toLocaleString('en-IN')}</span> more for complimentary delivery.
                    </p>
                    <div className="w-full bg-stone-300 h-1 mt-2 overflow-hidden">
                      <div
                        className="bg-velora-black h-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                    <p className="font-editorial text-xl text-velora-muted">Your shopping bag is currently empty.</p>
                    <p className="text-xs text-velora-muted font-light max-w-xs">
                      Explore our curated collection of architectural tailoring, cashmere, and Mulberry silk.
                    </p>
                    <button
                      onClick={() => {
                        closeCart();
                        navigate('/shop');
                      }}
                      className="mt-4 px-6 py-3 bg-velora-black text-white text-xs tracking-widest uppercase hover:bg-black/80 transition-colors"
                    >
                      Discover Collection
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.key} className="flex space-x-4 pb-6 border-b border-velora-border/80">
                      {/* Thumbnail */}
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeCart}
                        className="w-20 h-28 shrink-0 bg-stone-200 overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              to={`/product/${item.slug}`}
                              onClick={closeCart}
                              className="font-editorial text-base font-normal hover:text-velora-champagne transition-colors line-clamp-1"
                            >
                              {item.title}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.key)}
                              className="text-velora-muted hover:text-red-500 transition-colors ml-2 p-0.5"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-[11px] text-velora-muted mt-1 space-x-2">
                            <span>Size: {item.size}</span>
                            <span>•</span>
                            <span>Color: {item.color}</span>
                          </div>
                          <div className="text-xs font-semibold text-velora-black mt-2">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-velora-muted font-normal ml-1">
                                (₹{item.price.toLocaleString('en-IN')} each)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="w-6 h-6 border border-velora-border flex items-center justify-center hover:bg-stone-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="w-6 h-6 border border-velora-border flex items-center justify-center hover:bg-stone-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-[#FAF9F5] border-t border-velora-border space-y-4">
                  {/* Coupon Code Input */}
                  {coupon ? (
                    <div className="flex items-center justify-between bg-velora-champagne/10 border border-velora-champagne/30 px-3 py-2 text-xs text-velora-dark">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-3.5 h-3.5 text-velora-champagne" />
                        <span className="font-semibold uppercase tracking-wider">{coupon.code}</span>
                        <span className="text-stone-600">(-₹{discount.toLocaleString('en-IN')})</span>
                      </div>
                      <button onClick={removeCoupon} className="text-red-500 hover:text-red-700 text-xs font-medium">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="PROMO CODE (e.g. LEO10)"
                        className="bg-white border border-r-0 border-velora-border px-3 py-2 text-xs w-full focus:outline-none uppercase tracking-wider placeholder:text-stone-400"
                      />
                      <button
                        type="submit"
                        disabled={isApplying}
                        className="bg-velora-black text-white text-xs px-4 py-2 uppercase tracking-widest hover:bg-black/80 transition-colors disabled:opacity-50 font-medium"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-stone-600 pt-2 font-light">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-velora-dark font-normal">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Privilege Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Insured Shipping</span>
                      <span className="text-velora-dark font-normal">
                        {shipping === 0 ? <span className="text-emerald-600 uppercase text-[11px] font-medium">Free</span> : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (12% included)</span>
                      <span className="text-velora-dark font-normal">₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-velora-border text-sm font-semibold text-velora-black">
                      <span>Estimated Total</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-velora-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="w-full block text-center py-2.5 text-xs uppercase tracking-widest text-velora-muted hover:text-velora-black transition-colors"
                    >
                      View Full Bag
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
