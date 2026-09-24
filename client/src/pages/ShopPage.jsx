import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ChevronDown, Check, Grid3X3, Grid2X2, LayoutGrid } from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4); // 2, 3, or 4

  // Filter states derived from URL query parameters
  const selectedCategory = searchParams.get('category') || '';
  const selectedCollection = searchParams.get('collection') || '';
  const selectedGender = searchParams.get('gender') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';
  const isFeatured = searchParams.get('isFeatured') || '';
  const isBestSeller = searchParams.get('isBestSeller') || '';
  const inStock = searchParams.get('inStock') || '';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = searchParams.get('page') || '1';

  // Fetch taxonomies once
  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          api.get('/categories'),
          api.get('/collections'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (colRes.data.success) setCollections(colRes.data.data);
      } catch (err) {
        console.error('Failed to load taxonomies:', err);
      }
    };
    fetchTaxonomies();
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set('limit', '12');
        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (keyword) newParams.set('keyword', keyword);
    setSearchParams(newParams);
  };

  const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];
  const colorsList = ['Noir Black', 'Bone White', 'Camel Tan', 'Charcoal', 'Champagne', 'Indigo'];

  const activeFiltersCount = [
    selectedCategory, selectedCollection, selectedGender, selectedSize,
    selectedColor, minPrice, maxPrice, isNewArrival, isFeatured, isBestSeller, inStock
  ].filter(Boolean).length;

  return (
    <div className="bg-[#FAF9F5] pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Title */}
        <div className="text-center py-8 border-b border-velora-border space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">
            Atelier Discovery
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-velora-black">
            {keyword
              ? `Results for "${keyword}"`
              : selectedCategory
              ? categories.find(c => c.slug === selectedCategory)?.name || 'Category'
              : selectedCollection
              ? collections.find(c => c.slug === selectedCollection)?.name || 'Collection'
              : selectedGender
              ? `${selectedGender}'s Atelier`
              : 'The Complete Collection'}
          </h1>
          <p className="text-xs font-light text-velora-muted max-w-md mx-auto">
            Curated essentials for modern high-altitude elegance. Double-faced cashmere, silk, and architectural tailoring.
          </p>
        </div>

        {/* Action Bar (Filters trigger, sorting, layout switcher) */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-velora-border text-xs">
          <div className="flex items-center space-x-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-velora-border bg-white text-velora-dark hover:border-velora-black transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-velora-champagne" />
              <span className="uppercase tracking-widest font-medium">Filters ({activeFiltersCount})</span>
            </button>

            <span className="hidden lg:inline text-velora-muted uppercase tracking-widest">
              Showing <strong className="text-velora-black font-semibold">{pagination.totalItems}</strong> Pieces
            </span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-velora-muted uppercase tracking-widest hidden sm:inline">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-transparent border border-velora-border px-3 py-1.5 text-xs text-velora-dark focus:outline-none focus:border-velora-black uppercase tracking-wider font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="featured">Featured Selections</option>
                <option value="bestselling">Best Selling</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Client Rating</option>
              </select>
            </div>

            {/* Grid Layout Switcher */}
            <div className="hidden md:flex items-center space-x-1 border border-velora-border p-0.5 bg-white">
              <button
                onClick={() => setGridCols(2)}
                className={`p-1.5 transition-colors ${gridCols === 2 ? 'bg-stone-200 text-black' : 'text-stone-400 hover:text-black'}`}
                aria-label="2 columns grid"
              >
                <Grid2X2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 transition-colors ${gridCols === 3 ? 'bg-stone-200 text-black' : 'text-stone-400 hover:text-black'}`}
                aria-label="3 columns grid"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 transition-colors ${gridCols === 4 ? 'bg-stone-200 text-black' : 'text-stone-400 hover:text-black'}`}
                aria-label="4 columns grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Badges */}
        {activeFiltersCount > 0 && (
          <div className="py-4 flex flex-wrap items-center gap-2 border-b border-velora-border text-xs">
            <span className="text-velora-muted uppercase tracking-widest text-[11px] mr-1">Active:</span>
            {selectedCategory && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-stone-200 text-stone-800">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => updateFilter('category', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGender && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-stone-200 text-stone-800">
                <span>Gender: {selectedGender}</span>
                <button onClick={() => updateFilter('gender', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCollection && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-stone-200 text-stone-800">
                <span>Collection: {selectedCollection}</span>
                <button onClick={() => updateFilter('collection', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-stone-200 text-stone-800">
                <span>Size: {selectedSize}</span>
                <button onClick={() => updateFilter('size', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-stone-200 text-stone-800">
                <span>Color: {selectedColor}</span>
                <button onClick={() => updateFilter('color', '')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-stone-200 text-stone-800">
                <span>₹{minPrice || 0} - ₹{maxPrice || 'Any'}</span>
                <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-velora-champagne hover:underline text-[11px] uppercase tracking-widest font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 text-xs font-light pr-4 border-r border-velora-border">
            {/* Gender Facet */}
            <div className="space-y-3">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-velora-black text-[11px]">Department</h3>
              <div className="space-y-2">
                {['Men', 'Unisex'].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateFilter('gender', selectedGender === g ? '' : g)}
                    className={`flex items-center justify-between w-full text-left py-1 hover:text-velora-black transition-colors ${
                      selectedGender === g ? 'text-velora-black font-semibold' : 'text-stone-600'
                    }`}
                  >
                    <span>{g === 'Men' ? "Gentlemen's Menswear" : 'Unisex Couture'}</span>
                    {selectedGender === g && <Check className="w-3.5 h-3.5 text-velora-champagne" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Facet */}
            <div className="space-y-3 pt-6 border-t border-velora-border">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-velora-black text-[11px]">Categories</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => updateFilter('category', selectedCategory === c.slug ? '' : c.slug)}
                    className={`flex items-center justify-between w-full text-left py-1 hover:text-velora-black transition-colors ${
                      selectedCategory === c.slug ? 'text-velora-black font-semibold' : 'text-stone-600'
                    }`}
                  >
                    <span>{c.name}</span>
                    {selectedCategory === c.slug && <Check className="w-3.5 h-3.5 text-velora-champagne" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Facet */}
            <div className="space-y-3 pt-6 border-t border-velora-border">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-velora-black text-[11px]">Collections</h3>
              <div className="space-y-2">
                {collections.map((col) => (
                  <button
                    key={col.slug}
                    onClick={() => updateFilter('collection', selectedCollection === col.slug ? '' : col.slug)}
                    className={`flex items-center justify-between w-full text-left py-1 hover:text-velora-black transition-colors ${
                      selectedCollection === col.slug ? 'text-velora-black font-semibold' : 'text-stone-600'
                    }`}
                  >
                    <span className="line-clamp-1">{col.name}</span>
                    {selectedCollection === col.slug && <Check className="w-3.5 h-3.5 text-velora-champagne shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Facet */}
            <div className="space-y-3 pt-6 border-t border-velora-border">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-velora-black text-[11px]">Size</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {sizesList.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                    className={`py-1.5 border text-center uppercase font-medium transition-all ${
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

            {/* Price Presets */}
            <div className="space-y-3 pt-6 border-t border-velora-border">
              <h3 className="uppercase tracking-[0.2em] font-semibold text-velora-black text-[11px]">Price Range</h3>
              <div className="space-y-2">
                {[
                  { label: 'Under ₹5,000', min: '', max: '5000' },
                  { label: '₹5,000 — ₹10,000', min: '5000', max: '10000' },
                  { label: '₹10,000 — ₹20,000', min: '10000', max: '20000' },
                  { label: 'Above ₹20,000', min: '20000', max: '' },
                ].map((tier, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      updateFilter('minPrice', tier.min);
                      updateFilter('maxPrice', tier.max);
                    }}
                    className="block w-full text-left py-1 text-stone-600 hover:text-velora-black transition-colors"
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Checkbox */}
            <div className="pt-6 border-t border-velora-border">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock === 'true'}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                  className="rounded-none text-velora-black focus:ring-0"
                />
                <span className="text-xs text-velora-dark font-medium">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid grid-cols-2 md:grid-cols-3 ${
                gridCols === 4 ? 'lg:grid-cols-4' : gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
              } gap-6 md:gap-8`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white border border-velora-border p-8 space-y-4">
                <p className="font-editorial text-2xl text-velora-black">No pieces match your current criteria</p>
                <p className="text-xs text-velora-muted font-light max-w-sm mx-auto">
                  Try adjusting or clearing your filters to discover other garments from the LEO collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-velora-black text-white text-xs uppercase tracking-widest font-medium hover:bg-black/85 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-16 pt-8 border-t border-velora-border flex items-center justify-center space-x-2 text-xs">
                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = Number(page) === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateFilter('page', pNum.toString())}
                      className={`w-9 h-9 flex items-center justify-center border transition-all ${
                        isCurrent
                          ? 'border-velora-black bg-velora-black text-white font-semibold'
                          : 'border-velora-border bg-white text-velora-dark hover:border-velora-black'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xs h-full bg-[#FAF9F5] shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-velora-border">
                <h2 className="font-editorial text-xl font-normal">Filters</h2>
                <button onClick={() => setIsFilterDrawerOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="py-6 space-y-6 text-xs font-light">
                {/* Department */}
                <div>
                  <h4 className="font-semibold text-velora-black uppercase tracking-wider mb-2">Department</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Men', 'Unisex'].map((g) => (
                      <button
                        key={g}
                        onClick={() => updateFilter('gender', selectedGender === g ? '' : g)}
                        className={`px-3 py-1.5 border ${selectedGender === g ? 'bg-velora-black text-white' : 'bg-white'}`}
                      >
                        {g === 'Men' ? "Gentlemen's Menswear" : 'Unisex'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-velora-black uppercase tracking-wider mb-2">Categories</h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {categories.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => updateFilter('category', selectedCategory === c.slug ? '' : c.slug)}
                        className={`block w-full text-left py-1 ${selectedCategory === c.slug ? 'font-bold' : ''}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="font-semibold text-velora-black uppercase tracking-wider mb-2">Sizes</h4>
                  <div className="grid grid-cols-4 gap-1">
                    {sizesList.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                        className={`py-1.5 border text-center ${selectedSize === s ? 'bg-velora-black text-white' : 'bg-white'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full py-3.5 bg-velora-black text-white uppercase tracking-widest text-xs font-medium"
            >
              Apply Filters ({pagination.totalItems} Pieces)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
