import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ExternalLink, Filter, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let url = '/products?limit=50';
      if (search) url += `&keyword=${encodeURIComponent(search)}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;

      const [prodRes, catRes] = await Promise.all([
        api.get(url),
        api.get('/categories'),
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you certain you wish to archive "${title}" from the atelier catalog?`)) return;

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        success(`Archived "${title}"`);
        setProducts(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to archive piece');
    }
  };

  return (
    <AdminLayout title="Garment Catalog Management" subtitle="Manage pricing, editorial images, variants, and stock status.">
      <div className="space-y-6 font-sans">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search garments, SKU, tags..."
                className="bg-[#181818] border border-velora-borderDark py-2 px-3 pl-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-velora-champagne w-64"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#181818] border border-velora-borderDark py-2 px-3 text-xs text-white focus:outline-none uppercase tracking-wider font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 bg-velora-champagne text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Piece</span>
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-[#181818] border border-velora-borderDark overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E0E0E] text-white/50 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light text-white/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/40">Loading catalog...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/40">No garments found matching criteria.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <img src={p.images?.[0]?.url} alt={p.title} className="w-10 h-13 object-cover bg-black shrink-0" />
                        <div>
                          <p className="font-medium text-white line-clamp-1">{p.title}</p>
                          <span className="text-[10px] text-velora-champagne uppercase">{p.gender}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-white/60">{p.sku}</td>
                      <td className="py-3 px-4">{p.categoryName || 'Apparel'}</td>
                      <td className="py-3 px-4 font-medium text-white">₹{p.price.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold ${
                          p.totalStock > 10 ? 'bg-emerald-500/20 text-emerald-300' : p.totalStock > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {p.totalStock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.isPublished ? (
                          <span className="text-emerald-400 flex items-center space-x-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Live</span>
                          </span>
                        ) : (
                          <span className="text-stone-500 flex items-center space-x-1 text-[11px]">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Draft</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 inline-block text-white/40 hover:text-white transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="p-1.5 inline-block text-velora-champagne hover:text-white transition-colors"
                          title="Edit Piece"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="p-1.5 inline-block text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Piece"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
