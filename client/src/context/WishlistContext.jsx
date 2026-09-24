import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, info } = useToast();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('velora_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with user's backend wishlist upon login
  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      setWishlist(user.wishlist);
    }
  }, [isAuthenticated, user]);

  // Persist locally
  useEffect(() => {
    localStorage.setItem('velora_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === (productId._id || productId));
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product;
    const exists = isInWishlist(productId);

    if (exists) {
      setWishlist(prev => prev.filter(item => (item._id || item) !== productId));
      info(`Removed "${product.title || 'Piece'}" from wishlist`);
    } else {
      setWishlist(prev => [...prev, product]);
      success(`Saved "${product.title || 'Piece'}" to wishlist`);
    }

    if (isAuthenticated) {
      try {
        await api.post(`/auth/wishlist/${productId}`);
      } catch (err) {
        console.error('Failed to sync wishlist with server:', err);
      }
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
