import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, ChevronDown, ShieldCheck, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = ({ isSearchOpen, setIsSearchOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Tailoring', href: '/shop?category=tailored-suits' },
    { name: 'Outerwear', href: '/shop?category=outerwear' },
    { name: 'Shirts', href: '/shop?category=tailored-shirts' },
    { name: 'Knitwear', href: '/shop?category=knitwear' },
    { name: 'Trousers', href: '/shop?category=trousers' },
    { name: 'Collections', href: '/collections' },
    { name: 'Archive', href: '/shop?collection=minimalist-noir' },
  ];

  const isLightHero = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#FAF9F5]/95 backdrop-blur-md border-b border-velora-border/70 py-4 shadow-sm'
            : isHomePage
            ? 'bg-gradient-to-b from-black/70 via-black/30 to-transparent text-white py-5'
            : 'bg-[#FAF9F5] border-b border-velora-border py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className={`w-6 h-6 ${isLightHero ? 'text-white' : 'text-velora-black'}`} />
            </button>
          </div>

          {/* Logo (Left Zone) */}
          <div className="flex items-center shrink-0 min-w-[140px]">
            <Link to="/" className="group flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="LEO Crest"
                className={`w-8 h-8 md:w-9 md:h-9 object-contain rounded-full transition-all duration-300 ${
                  isLightHero ? 'ring-1 ring-white/40' : 'ring-1 ring-black/10'
                }`}
              />
              <div className="flex flex-col">
                <span className={`font-editorial text-2xl md:text-3xl font-normal tracking-[0.22em] uppercase transition-colors duration-300 ${
                  isLightHero ? 'text-white' : 'text-velora-black'
                }`}>
                  LEO
                </span>
                <span className={`text-[8px] md:text-[9px] tracking-[0.38em] uppercase font-light -mt-1 transition-opacity duration-300 ${
                  isLightHero ? 'text-white/70' : 'text-velora-muted'
                }`}>
                  Atelier
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center space-x-5 xl:space-x-8 px-4 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-[11px] xl:text-[12px] font-medium tracking-[0.2em] uppercase transition-all duration-300 luxury-underline whitespace-nowrap ${
                  isLightHero
                    ? 'text-white/90 hover:text-white'
                    : 'text-stone-700 hover:text-velora-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons (Right Zone) */}
          <div className="flex items-center justify-end shrink-0 min-w-[140px] space-x-4 md:space-x-6">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1.5 transition-colors duration-300 ${
                isLightHero ? 'text-white/90 hover:text-white' : 'text-velora-dark hover:text-velora-black'
              }`}
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative p-1.5 transition-colors duration-300 ${
                isLightHero ? 'text-white/90 hover:text-white' : 'text-velora-dark hover:text-velora-black'
              }`}
              aria-label="Saved items"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-velora-champagne text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  className={`flex items-center space-x-1.5 p-1.5 transition-colors duration-300 ${
                    isLightHero ? 'text-white/90 hover:text-white' : 'text-velora-dark hover:text-velora-black'
                  }`}
                  aria-label="User profile"
                >
                  <UserIcon className="w-5 h-5 stroke-[1.5]" />
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`p-1.5 transition-colors duration-300 ${
                    isLightHero ? 'text-white/90 hover:text-white' : 'text-velora-dark hover:text-velora-black'
                  }`}
                  aria-label="Sign in"
                >
                  <UserIcon className="w-5 h-5 stroke-[1.5]" />
                </Link>
              )}

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-60 bg-[#0A0A0A] text-[#F7F5F0] border border-velora-borderDark shadow-2xl py-3 z-50 text-xs font-light"
                  >
                    <div className="px-4 py-2 border-b border-velora-borderDark/60">
                      <p className="text-[10px] text-velora-muted uppercase tracking-widest">Signed In As</p>
                      <p className="font-medium text-white truncate">{user?.name}</p>
                      <p className="text-velora-muted text-[11px] truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-white/5 text-velora-champagne transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="tracking-wider uppercase font-semibold text-[11px]">LEO Admin Atelier</span>
                      </Link>
                    )}

                    <Link
                      to="/account/orders"
                      className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors"
                    >
                      <Package className="w-4 h-4 text-velora-muted" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/account/profile"
                      className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-velora-muted" />
                      <span>Account Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 hover:bg-red-500/10 text-red-400 border-t border-velora-borderDark/60 mt-1 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Bag */}
            <button
              onClick={openCart}
              className={`relative p-1.5 flex items-center transition-colors duration-300 ${
                isLightHero ? 'text-white hover:text-white' : 'text-velora-black hover:opacity-80'
              }`}
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItemCount > 0 && (
                <motion.span
                  key={totalItemCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-velora-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white/40"
                >
                  {totalItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-sm h-full bg-[#0A0A0A] text-[#F7F5F0] p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-8 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <img src="/logo.png" alt="LEO Crest" className="w-8 h-8 object-contain rounded-full border border-white/30" />
                    <div className="flex flex-col">
                      <span className="font-editorial text-2xl tracking-[0.25em] text-white">LEO</span>
                      <span className="text-[8px] tracking-[0.35em] uppercase text-white/50 -mt-1">ATELIER</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-white/70 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-8 flex flex-col space-y-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-lg font-editorial tracking-wider text-white/90 hover:text-velora-champagne transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-white/10 flex flex-col space-y-4">
                    <Link to="/track-order" className="text-sm font-light text-white/70 tracking-widest uppercase">
                      Track Order
                    </Link>
                    <Link to="/about" className="text-sm font-light text-white/70 tracking-widest uppercase">
                      Brand Philosophy
                    </Link>
                    <Link to="/contact" className="text-sm font-light text-white/70 tracking-widest uppercase">
                      Concierge
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 text-xs font-light text-white/50">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <span>Signed in as {user?.name}</span>
                    <button onClick={logout} className="text-red-400">Logout</button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="text-velora-champagne uppercase tracking-widest font-medium">Sign In</Link>
                    <span>/</span>
                    <Link to="/register" className="text-white uppercase tracking-widest font-medium">Create Account</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
