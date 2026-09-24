import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    shortDescription: '',
    description: '',
    category: '',
    collectionRef: '',
    gender: 'Unisex',
    material: '100% Italian Double-Faced Cashmere',
    careInstructions: 'Specialist dry clean only.',
    featuresText: 'Hand-finished pick stitching\nUnbleached cupro lining\nNatural horn buttons',
    tagsText: 'Luxury, Outerwear, AW26',
    images: [{ url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85' }],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Obsidian Black', hex: '#0A0A0A' }],
    variants: [
      { size: 'S', color: 'Obsidian Black', stock: 10 },
      { size: 'M', color: 'Obsidian Black', stock: 15 },
      { size: 'L', color: 'Obsidian Black', stock: 12 },
      { size: 'XL', color: 'Obsidian Black', stock: 6 },
    ],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isPublished: true,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          api.get('/categories'),
          api.get('/collections'),
        ]);
        if (catRes.data.success) {
          setCategories(catRes.data.data);
          if (!isEdit && catRes.data.data.length > 0) {
            setFormData(prev => ({ ...prev, category: catRes.data.data[0]._id }));
          }
        }
        if (colRes.data.success) {
          setCollections(colRes.data.data);
        }

        if (isEdit) {
          setIsLoading(true);
          const prodRes = await api.get(`/products/${id}`);
          if (prodRes.data.success) {
            const p = prodRes.data.data;
            setFormData({
              title: p.title || '',
              sku: p.sku || '',
              price: p.price || '',
              compareAtPrice: p.compareAtPrice || '',
              shortDescription: p.shortDescription || '',
              description: p.description || '',
              category: p.category?._id || p.category || '',
              collectionRef: p.collectionRef?._id || p.collectionRef || '',
              gender: p.gender || 'Unisex',
              material: p.material || '',
              careInstructions: p.careInstructions || '',
              featuresText: p.features?.join('\n') || '',
              tagsText: p.tags?.join(', ') || '',
              images: p.images && p.images.length > 0 ? p.images : [{ url: '' }],
              sizes: p.sizes || [],
              colors: p.colors || [],
              variants: p.variants || [],
              isFeatured: !!p.isFeatured,
              isBestSeller: !!p.isBestSeller,
              isNewArrival: !!p.isNewArrival,
              isPublished: p.isPublished !== undefined ? p.isPublished : true,
            });
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Init error:', err);
      }
    };
    init();
  }, [id, isEdit]);

  const handleAddImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '' }],
    }));
  };

  const handleUpdateImageUrl = (idx, val) => {
    setFormData(prev => {
      const updated = [...prev.images];
      updated[idx].url = val;
      return { ...prev, images: updated };
    });
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: 'Ivory Bone', hex: '#F7F5F0' }],
    }));
  };

  const handleRemoveColor = (idx) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  const handleUpdateVariantStock = (idx, stockVal) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      updated[idx].stock = Number(stockVal) || 0;
      return { ...prev, variants: updated };
    });
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: 'M', color: prev.colors[0]?.name || 'Noir', stock: 10 }],
    }));
  };

  const handleRemoveVariant = (idx) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) {
      error('Please fill in title, price, and category.');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice) || 0,
        features: formData.featuresText.split('\n').map(s => s.trim()).filter(Boolean),
        tags: formData.tagsText.split(',').map(s => s.trim()).filter(Boolean),
        images: formData.images.filter(img => img.url.trim() !== ''),
      };

      let res;
      if (isEdit) {
        res = await api.put(`/products/${id}`, payload);
      } else {
        res = await api.post('/products', payload);
      }

      if (res.data.success) {
        success(isEdit ? 'Garment updated successfully' : 'New garment published to Atelier');
        navigate('/admin/products');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save garment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout
      title={isEdit ? `Edit: ${formData.title}` : 'Create Atelier Garment'}
      subtitle="Configure luxury specifications, high-res photography, and size-color variant matrix."
    >
      <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-5xl text-xs">
        <div className="flex items-center justify-between">
          <Link to="/admin/products" className="text-white/50 hover:text-white flex items-center space-x-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving Garment...' : isEdit ? 'Save Changes' : 'Publish Garment'}
          </button>
        </div>

        {/* Basic Info Box */}
        <div className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Garment Identity</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="LEO Double-Breasted Cashmere Overcoat"
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
                required
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">SKU (Inventory Identifier)</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                placeholder="VEL-COAT-001"
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Collection (Optional)</label>
              <select
                value={formData.collectionRef}
                onChange={(e) => setFormData(prev => ({ ...prev, collectionRef: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
              >
                <option value="">No Collection</option>
                {collections.map((col) => (
                  <option key={col._id} value={col._id}>{col.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/60 mb-1">Price (INR ₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="18999"
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
                required
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Compare-At / Original Price (INR ₹)</label>
              <input
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value }))}
                placeholder="24999"
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Department</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
              >
                <option value="Men">Men (Gentlemen's Menswear)</option>
                <option value="Unisex">Unisex Couture</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/60 mb-1">Short Editorial Tagline</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              placeholder="Substantial 100% double-faced cashmere overcoat with peak lapels."
              className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
            />
          </div>

          <div>
            <label className="block text-white/60 mb-1">Full Description & Tailoring Notes *</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tailored from heavy 650gsm Italian double-faced cashmere..."
              className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
              required
            />
          </div>
        </div>

        {/* High-Resolution Photography */}
        <div className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Editorial Photography URLs</h3>
            <button
              type="button"
              onClick={handleAddImage}
              className="px-3 py-1 bg-white/10 text-velora-champagne hover:bg-white/20 uppercase tracking-wider text-[11px] font-medium"
            >
              + Add Image URL
            </button>
          </div>

          <div className="space-y-3">
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <img src={img.url || 'https://via.placeholder.com/100'} alt={`Preview ${idx + 1}`} className="w-12 h-16 object-cover bg-black shrink-0" />
                <input
                  type="text"
                  value={img.url}
                  onChange={(e) => handleUpdateImageUrl(idx, e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-3 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Color & Size Variant Matrix */}
        <div className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Variant & Stock Matrix</h3>
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-3 py-1 bg-white/10 text-velora-champagne hover:bg-white/20 uppercase tracking-wider text-[11px] font-medium"
            >
              + Add Variant Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E0E0E] text-white/50 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Colorway</th>
                  <th className="p-3">Inventory Units</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {formData.variants.map((v, idx) => (
                  <tr key={idx}>
                    <td className="p-3">
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].size = e.target.value.toUpperCase();
                          setFormData(prev => ({ ...prev, variants: updated }));
                        }}
                        className="w-20 bg-[#0E0E0E] border border-velora-borderDark p-1.5 text-white"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => {
                          const updated = [...formData.variants];
                          updated[idx].color = e.target.value;
                          setFormData(prev => ({ ...prev, variants: updated }));
                        }}
                        className="w-36 bg-[#0E0E0E] border border-velora-borderDark p-1.5 text-white"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        value={v.stock}
                        onChange={(e) => handleUpdateVariantStock(idx, e.target.value)}
                        className="w-24 bg-[#0E0E0E] border border-velora-borderDark p-1.5 text-white"
                      />
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Material, Care, Tags */}
        <div className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Specifications & Features</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Fabric Composition</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Care & Maintenance</label>
              <input
                type="text"
                value={formData.careInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Key Features (One per line)</label>
              <textarea
                rows={3}
                value={formData.featuresText}
                onChange={(e) => setFormData(prev => ({ ...prev, featuresText: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={formData.tagsText}
                onChange={(e) => setFormData(prev => ({ ...prev, tagsText: e.target.value }))}
                placeholder="Cashmere, Overcoat, AW26"
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Visibility Flags */}
        <div className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 flex flex-wrap gap-6 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
            />
            <span>Published on Storefront</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
            />
            <span>Featured Selection</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isBestSeller}
              onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
            />
            <span>Best Seller</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNewArrival}
              onChange={(e) => setFormData(prev => ({ ...prev, isNewArrival: e.target.checked }))}
            />
            <span>New Arrival</span>
          </label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-velora-champagne text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isEdit ? 'Save Garment' : 'Create & Publish Garment'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};
