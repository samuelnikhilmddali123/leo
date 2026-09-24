import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
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

  const progressPercent = Math.min(100, Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] pt-36 pb-20 flex flex-col items-center justify-center text-center px-6 font-sans">
        <div className="w-16 h-16 bg-[#EAE6DF] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-velora-dark stroke-[1.5]" />
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black">Your Shopping Bag is Empty</h1>
        <p className="text-xs font-light text-velora-muted max-w-sm mt-3 leading-relaxed">
          Explore our seasonal releases of architectural tailoring, Italian cashmere, and pure Mulberry silk.
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
        <div className="pb-8 border-b border-velora-border">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Checkout Preparation</span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-velora-black mt-1">
            Your Shopping Bag ({cartItems.length})
          </h1>
        </div>

        {/* Free Shipping Alert */}
        <div className="my-6 p-4 bg-[#F0EDE6] border border-velora-border text-xs">
          {isFreeShipping ? (
            <div className="flex items-center text-velora-black font-medium space-x-2">
              <ShieldCheck className="w-4 h-4 text-velora-champagne" />
              <span>You have unlocked complimentary express insured courier delivery.</span>
            </div>
          ) : (
            <div>
              <p className="text-velora-dark font-light">
                Add <span className="font-semibold text-velora-black">₹{freeShippingRemaining.toLocaleString('en-IN')}</span> more to your bag for complimentary express delivery.
              </p>
              <div className="w-full bg-stone-300 h-1.5 mt-2 overflow-hidden">
                <div className="bg-velora-black h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          {/* Cart Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="hidden sm:grid grid-cols-12 pb-3 border-b border-velora-border text-xs uppercase tracking-widest text-velora-muted">
              <span className="col-span-6">Garment</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-right">Subtotal</span>
            </div>

            {cartItems.map((item) => (
              <div key={item.key} className="flex flex-col sm:grid sm:grid-cols-12 gap-4 pb-6 border-b border-velora-border items-center">
                {/* Product Column */}
                <div className="col-span-6 flex space-x-4 w-full">
                  <Link to={`/product/${item.slug}`} className="w-24 h-32 bg-stone-200 shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-editorial text-lg text-velora-black hover:text-velora-champagne transition-colors">
                        {item.title}
                      </Link>
                      <div className="text-xs text-velora-muted space-x-2 mt-1">
                        <span>Size: <strong className="text-stone-800 font-medium">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-stone-800 font-medium">{item.color}</strong></span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-xs text-stone-500 hover:text-red-500 transition-colors flex items-center space-x-1 mt-2 text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-2 flex justify-center w-full sm:w-auto">
                  <div className="flex items-center border border-velora-border bg-white">
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="p-1.5 hover:bg-stone-200 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="p-1.5 hover:bg-stone-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 text-right hidden sm:block text-xs font-light text-stone-600">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>

                {/* Item Total */}
                <div className="col-span-2 text-right w-full sm:w-auto text-sm font-semibold text-velora-black">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <Link to="/shop" className="text-xs uppercase tracking-widest text-velora-dark hover:underline font-medium">
                ← Continue Browsing
              </Link>
              <button onClick={clearCart} className="text-xs uppercase tracking-widest text-red-500 hover:underline">
                Clear Bag
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4">
            <div className="p-6 md:p-8 bg-[#F0EDE6] border border-velora-border space-y-6 sticky top-28">
              <h3 className="font-editorial text-2xl font-normal text-velora-black">Summary</h3>

              {/* Coupon Section */}
              {coupon ? (
                <div className="flex items-center justify-between bg-velora-champagne/15 border border-velora-champagne/40 p-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-velora-champagne" />
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
                    className="bg-white border border-r-0 border-velora-border px-3 py-2.5 text-xs w-full focus:outline-none uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="bg-velora-black text-white text-xs px-5 py-2.5 uppercase tracking-widest hover:bg-black/85 transition-colors disabled:opacity-50 font-medium"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Details */}
              <div className="space-y-2.5 text-xs text-stone-600 font-light pt-2">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
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
                <div className="flex justify-between pt-4 border-t border-stone-300 text-base font-semibold text-velora-black">
                  <span>Total Due</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-black/85 transition-colors shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
