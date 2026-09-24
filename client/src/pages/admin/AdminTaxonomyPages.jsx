import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    bannerImage: '',
    displayOrder: 0,
  });
  const { success, error } = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', image: '', bannerImage: '', displayOrder: categories.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      name: c.name,
      description: c.description || '',
      image: c.image,
      bannerImage: c.bannerImage || '',
      displayOrder: c.displayOrder || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await api.put(`/categories/${editingId}`, formData);
      } else {
        res = await api.post('/categories', formData);
      }
      if (res.data.success) {
        success(editingId ? 'Category updated' : 'Category created');
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        success(`Category "${name}" removed`);
        fetchCategories();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout title="Category Taxonomy" subtitle="Manage department hierarchies, cover imagery, and storefront order.">
      <div className="space-y-6 font-sans text-xs">
        <div className="flex justify-end">
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div key={c._id} className="bg-[#181818] border border-velora-borderDark p-5 space-y-4 shadow-xl">
              <div className="aspect-[16/9] bg-stone-900 overflow-hidden relative">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 text-velora-champagne text-[10px] font-semibold">
                  Order: #{c.displayOrder}
                </span>
              </div>

              <div>
                <h3 className="font-editorial text-xl text-white font-normal">{c.name}</h3>
                <p className="text-[11px] text-white/50 font-light mt-1 line-clamp-2">{c.description}</p>
                <p className="text-[11px] text-velora-champagne mt-2">{c.itemCount || 0} Garments</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="px-3 py-1 bg-white/10 text-velora-champagne hover:bg-white/20 uppercase tracking-wider text-[11px]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id, c.name)}
                  className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 uppercase tracking-wider text-[11px]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-[#181818] border border-velora-borderDark p-6 md:p-8 max-w-lg w-full z-10 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-editorial text-xl text-white">{editingId ? 'Edit Category' : 'Create Category'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-white/40" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/60 mb-1">Category Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Cover Image URL *</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none font-mono text-[11px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: Number(e.target.value) }))}
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Save Category
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    heroImage: '',
    season: 'Autumn / Winter 2026',
    isFeatured: true,
  });
  const { success, error } = useToast();

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/collections');
      if (res.data.success) setCollections(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ name: '', tagline: '', description: '', heroImage: '', season: 'Autumn / Winter 2026', isFeatured: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col) => {
    setEditingId(col._id);
    setFormData({
      name: col.name,
      tagline: col.tagline || '',
      description: col.description || '',
      heroImage: col.heroImage,
      season: col.season || 'Autumn / Winter 2026',
      isFeatured: !!col.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingId) {
        res = await api.put(`/collections/${editingId}`, formData);
      } else {
        res = await api.post('/collections', formData);
      }
      if (res.data.success) {
        success(editingId ? 'Collection updated' : 'Collection created');
        setIsModalOpen(false);
        fetchCollections();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete lookbook collection "${name}"?`)) return;
    try {
      const res = await api.delete(`/collections/${id}`);
      if (res.data.success) {
        success(`Collection "${name}" removed`);
        fetchCollections();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout title="Lookbook Collections" subtitle="Curate seasonal lookbooks, campaign hero imagery, and editorial taglines.">
      <div className="space-y-6 font-sans text-xs">
        <div className="flex justify-end">
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Collection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <div key={col._id} className="bg-[#181818] border border-velora-borderDark p-6 space-y-4 shadow-xl">
              <div className="aspect-[16/9] bg-stone-900 overflow-hidden relative">
                <img src={col.heroImage} alt={col.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/80 text-velora-champagne text-[10px] uppercase font-semibold">
                  {col.season}
                </span>
              </div>

              <div>
                <h3 className="font-editorial text-2xl text-white font-normal">{col.name}</h3>
                <p className="font-editorial italic text-stone-300 mt-0.5">"{col.tagline}"</p>
                <p className="text-[11px] text-white/50 font-light mt-2 line-clamp-2">{col.description}</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleOpenEdit(col)}
                  className="px-3 py-1 bg-white/10 text-velora-champagne hover:bg-white/20 uppercase tracking-wider text-[11px]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(col._id, col.name)}
                  className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 uppercase tracking-wider text-[11px]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-[#181818] border border-velora-borderDark p-6 md:p-8 max-w-lg w-full z-10 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-editorial text-xl text-white">{editingId ? 'Edit Collection' : 'Create Collection'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-white/40" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/60 mb-1">Collection Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Autumn / Winter 2026 — Monolith"
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Architectural silhouettes inspired by brutalist geometry."
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Campaign Hero Image URL *</label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none font-mono text-[11px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Season Designation</label>
                  <input
                    type="text"
                    value={formData.season}
                    onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
                    placeholder="Autumn / Winter 2026"
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Narrative Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Save Collection
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
