import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { success, error, info } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('velora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('velora_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('velora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('velora_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('velora_coupon');
    }
  }, [coupon]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (product, size = 'M', color = '', quantity = 1) => {
    const selectedColor = color || (product.colors?.[0]?.name || 'Noir');
    const selectedSize = size || (product.sizes?.[0] || 'M');
    const itemKey = `${product._id}_${selectedSize}_${selectedColor}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.key === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            key: itemKey,
            productId: product._id,
            title: product.title,
            slug: product.slug,
            image: product.images?.[0]?.url || '',
            price: product.price,
            compareAtPrice: product.compareAtPrice || 0,
            size: selectedSize,
            color: selectedColor,
            quantity,
            totalStock: product.totalStock || 10,
          },
        ];
      }
    });

    success(`Added ${product.title} (${selectedSize} / ${selectedColor}) to bag`);
    openCart();
  };

  const updateQuantity = (itemKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.key === itemKey ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemKey) => {
    setCartItems(prev => {
      const item = prev.find(i => i.key === itemKey);
      if (item) {
        info(`Removed "${item.title}" from bag`);
      }
      return prev.filter(i => i.key !== itemKey);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const freeShippingThreshold = 2999;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const isFreeShipping = subtotal >= freeShippingThreshold || cartItems.length === 0;
  const shipping = cartItems.length === 0 ? 0 : (isFreeShipping ? 0 : 250);

  // Recalculate coupon discount if subtotal changes
  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.discountType === 'percentage') {
      return Math.round((subtotal * coupon.discountValue) / 100);
    }
    return Math.min(subtotal, coupon.discountAmount || coupon.discountValue);
  }, [subtotal, coupon]);

  const tax = useMemo(() => {
    return Math.round((subtotal - discount) * 0.12); // 12% GST
  }, [subtotal, discount]);

  const total = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return Math.max(0, subtotal - discount + shipping + tax);
  }, [subtotal, discount, shipping, tax, cartItems]);

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      error('Please enter a coupon code');
      return { success: false };
    }

    try {
      const res = await api.post('/coupons/validate', {
        code: code.trim(),
        subtotal,
      });

      if (res.data.success) {
        setCoupon(res.data.data);
        success(res.data.message);
        return { success: true, coupon: res.data.data };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      error(msg);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    info('Coupon removed');
  };

  const totalItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shipping,
        tax,
        total,
        freeShippingThreshold,
        freeShippingRemaining,
        isFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
