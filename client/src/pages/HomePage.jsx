import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Shield, RefreshCw, Truck } from 'lucide-react';
import { InstagramIcon } from '../components/Icons';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 600], [0, 120]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, bestRes, catRes, banRes] = await Promise.all([
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/products?isBestSeller=true&limit=8'),
          api.get('/categories'),
          api.get('/banners'),
        ]);

        if (featuredRes.data.success) setFeaturedProducts(featuredRes.data.data);
        if (bestRes.data.success) setBestSellers(bestRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (banRes.data.success) setBanners(banRes.data.data);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const instagramShots = [
    { image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95', handle: '@leo.menswear' },
    { image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=95', handle: '@leo.menswear' },
    { image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=95', handle: '@leo.menswear' },
    { image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=95', handle: '@leo.menswear' },
    { image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1600&q=95', handle: '@leo.menswear' },
  ];

  return (
    <div className="bg-[#FAF9F5] text-[#141414] overflow-hidden font-sans">
      {/* ==================================================== */}
      {/* SECTION 1 — CINEMATIC FULL SCREEN HERO               */}
      {/* ==================================================== */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Parallax Hero Image */}
        <motion.div
          style={{ y: heroImageY }}
          className="absolute inset-0 w-full h-[115%] scale-105"
        >
          <img
            src="/hero-menswear.jpg"
            alt="LEO Sovereign Haute Couture Menswear Atelier"
            className="w-full h-full object-cover object-center brightness-90 contrast-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/60" />
        </motion.div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 p-1 flex items-center justify-center mb-5 backdrop-blur-sm shadow-2xl"
          >
            <img src="/logo.png" alt="LEO Crest" className="w-full h-full object-contain rounded-full" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs md:text-sm uppercase tracking-[0.35em] text-velora-champagne font-medium mb-4"
          >
            Gentlemen's Autumn / Winter 2026 Atelier Release
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-editorial text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-normal tracking-[0.08em] uppercase leading-none"
          >
            THE NEW STANDARD
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 text-sm md:text-base font-light text-white/80 max-w-xl mx-auto tracking-wide leading-relaxed"
          >
            Architectural tailoring, double-faced Italian cashmere, and pure Mulberry silk. Defined by power & precision.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <Link
              to="/shop"
              className="w-52 py-4 bg-white text-velora-black text-xs font-semibold tracking-[0.22em] uppercase hover:bg-velora-champagne hover:text-white transition-all duration-300 shadow-2xl"
            >
              Explore Collection
            </Link>
            <Link
              to="/shop?category=tailored-suits"
              className="w-52 py-4 bg-transparent border border-white text-white text-xs font-semibold tracking-[0.22em] uppercase hover:bg-white hover:text-velora-black transition-all duration-300 backdrop-blur-sm"
            >
              Bespoke Tailoring
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 text-white/60">
          <span className="text-[10px] uppercase tracking-[0.3em] font-light">Scroll Down</span>
          <div className="w-px h-8 bg-white/40 animate-pulse" />
        </div>
      </section>

      {/* Value Pillars Bar */}
      <section className="bg-[#FAF9F5] border-b border-velora-border py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs text-velora-dark font-light">
          <div className="flex flex-col items-center space-y-1">
            <Truck className="w-4 h-4 text-velora-champagne mb-1" />
            <span className="font-medium tracking-wider uppercase text-[11px]">Complimentary Delivery</span>
            <span className="text-velora-muted text-[10px]">On all orders above ₹2,999</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Sparkles className="w-4 h-4 text-velora-champagne mb-1" />
            <span className="font-medium tracking-wider uppercase text-[11px]">Italian & Mongolian Fabrics</span>
            <span className="text-velora-muted text-[10px]">Ethically sourced grade-A fibres</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <RefreshCw className="w-4 h-4 text-velora-champagne mb-1" />
            <span className="font-medium tracking-wider uppercase text-[11px]">Hassle-Free Returns</span>
            <span className="text-velora-muted text-[10px]">14-day doorstep concierge exchange</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Shield className="w-4 h-4 text-velora-champagne mb-1" />
            <span className="font-medium tracking-wider uppercase text-[11px]">Authentic Guarantee</span>
            <span className="text-velora-muted text-[10px]">Individually numbered atelier garments</span>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 2 — ASYMMETRIC NEW COLLECTION EDITORIAL     */}
      {/* ==================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Photo */}
          <div className="lg:col-span-7 relative">
            <div className="aspect-[4/5] bg-stone-200 overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2400&q=95"
                alt="Autumn Winter 2026 Menswear Atelier Lookbook"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-8 -right-8 w-48 h-64 bg-stone-300 overflow-hidden shadow-xl border-4 border-[#FAF9F5]">
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=95"
                alt="Bespoke Sartorial Detail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Story & CTA */}
          <div className="lg:col-span-5 space-y-6 lg:pl-6">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">
              Editorial Collection
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight text-velora-black">
              Autumn / Winter '26 — Monolith
            </h2>
            <p className="text-sm font-light text-stone-600 leading-relaxed">
              The Monolith collection explores brutalist restraint through heavy wools, razor-sharp shoulder lines, and monolithic monochrome layering designed for modern metropolitan life.
            </p>
            <p className="text-sm font-light text-stone-600 leading-relaxed">
              Each piece is individually tailored with hand-pick stitching, unbleached cupro linings, and natural horn fastenings.
            </p>
            <div className="pt-4">
              <Link
                to="/shop?collection=monolith-aw26"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-velora-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors shadow-lg"
              >
                <span>Explore Monolith Edit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 3 — SHOP BY CATEGORY                         */}
      {/* ==================================================== */}
      <section className="py-20 bg-[#F0EDE6] border-y border-velora-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Taxonomy</span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
                Explore by Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-4 md:mt-0 text-xs uppercase tracking-[0.2em] text-velora-dark hover:text-velora-black flex items-center space-x-1.5 luxury-underline font-medium"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="group relative aspect-[3/4] bg-stone-300 overflow-hidden shadow-md"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-editorial text-lg md:text-xl font-normal tracking-wide group-hover:text-velora-champagne transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-white/70 mt-0.5">
                    {cat.itemCount || 4} Pieces
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 4 — FEATURED PRODUCTS                       */}
      {/* ==================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Curated Pieces</span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
              Featured Atelier Selections
            </h2>
          </div>
          <Link
            to="/shop?isFeatured=true"
            className="mt-4 md:mt-0 text-xs uppercase tracking-[0.2em] text-velora-dark hover:text-velora-black flex items-center space-x-1.5 luxury-underline font-medium"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ==================================================== */}
      {/* SECTION 5 — FULL-WIDTH EDITORIAL BANNER             */}
      {/* ==================================================== */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=2560&q=95"
          alt="Crafted for the moment"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center text-white max-w-3xl px-6 space-y-6">
          <span className="text-xs uppercase tracking-[0.35em] text-velora-champagne font-medium">
            Atelier Philosophy
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal tracking-[0.06em] uppercase leading-tight">
            CRAFTED FOR THE MOMENT.
          </h2>
          <p className="text-sm md:text-base font-light text-white/80 max-w-lg mx-auto leading-relaxed">
            Quiet confidence woven from 22-momme Mulberry silk and 4-ply Inner Mongolian cashmere.
          </p>
          <div className="pt-4">
            <Link
              to="/shop?collection=the-silk-edit"
              className="inline-block px-10 py-4 bg-white text-velora-black text-xs font-semibold tracking-[0.25em] uppercase hover:bg-velora-champagne hover:text-white transition-all shadow-2xl"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 6 — BEST SELLERS CAROUSEL                   */}
      {/* ==================================================== */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Icons of the House</span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
              Best Sellers
            </h2>
          </div>
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-3 border border-velora-border hover:bg-stone-200 transition-colors"
              aria-label="Previous best sellers"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-3 border border-velora-border hover:bg-stone-200 transition-colors"
              aria-label="Next best sellers"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestSellers.map((product) => (
            <div key={product._id} className="w-72 sm:w-80 shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 7 — BRAND STORY EDITORIAL                   */}
      {/* ==================================================== */}
      <section className="py-24 bg-[#0A0A0A] text-[#F7F5F0] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">The Manifesto</span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight text-white">
              “WE BELIEVE CLOTHING SHOULD SAY SOMETHING BEFORE YOU DO.”
            </h2>
            <p className="text-sm font-light text-white/60 leading-relaxed">
              LEO was founded on the conviction that true luxury does not shout with gaudy logos. It manifests in the weight of double-faced Italian cashmere, the whisper of pure Mulberry silk across the collarbone, and the impeccable drape of tailored trousers.
            </p>
            <p className="text-sm font-light text-white/60 leading-relaxed">
              Every garment is created in limited atelier runs to eliminate excess and guarantee sovereign craftsmanship.
            </p>
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-velora-champagne hover:text-white transition-colors luxury-underline font-medium"
              >
                <span>Read Our Heritage Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 aspect-[4/5] bg-stone-900 overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=2400&q=95"
              alt="Artisanal tailoring"
              className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 8 — INSTAGRAM LOOKBOOK GALLERY              */}
      {/* ==================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">#LEOAtelier</span>
          <h2 className="font-editorial text-3xl font-normal text-velora-black">As Seen Around the Globe</h2>
          <p className="text-xs text-velora-muted font-light">
            Tag @leo.fashion on Instagram to be featured in our permanent digital editorial.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {instagramShots.map((item, idx) => (
            <div key={idx} className="group relative aspect-square bg-stone-200 overflow-hidden">
              <img
                src={item.image}
                alt="Instagram lookbook snapshot"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white space-y-2">
                <InstagramIcon className="w-6 h-6 text-velora-champagne" />
                <span className="text-[11px] tracking-widest font-light">{item.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
