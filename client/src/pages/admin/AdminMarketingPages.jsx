import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Tag, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 4999,
    maxDiscountAmount: 3000,
    usageLimit: 1000,
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const { success, error } = useToast();

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/coupons');
      if (res.data.success) setCoupons(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/coupons', {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue),
        maxDiscountAmount: Number(formData.maxDiscountAmount),
        usageLimit: Number(formData.usageLimit),
      });
      if (res.data.success) {
        success(`Privilege Code "${formData.code}" created`);
        setIsModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await api.delete(`/admin/coupons/${id}`);
      if (res.data.success) {
        success(`Coupon "${code}" deleted`);
        fetchCoupons();
      }
    } catch (err) {
      error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Privilege & Promotion Codes" subtitle="Generate percentage & fixed value discounts for client checkout.">
      <div className="space-y-6 font-sans text-xs">
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Promo Code</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c._id} className="bg-[#181818] border border-velora-borderDark p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-velora-champagne" />
                  <span className="font-mono text-base font-bold text-white uppercase">{c.code}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] uppercase">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                </span>
              </div>

              <p className="text-stone-400 font-light text-[11px]">{c.description || 'General store privilege'}</p>

              <div className="space-y-1 text-stone-500 text-[11px]">
                <p>Min Order Value: <strong className="text-stone-300">₹{c.minOrderValue?.toLocaleString('en-IN')}</strong></p>
                {c.maxDiscountAmount > 0 && <p>Max Discount Cap: <strong className="text-stone-300">₹{c.maxDiscountAmount?.toLocaleString('en-IN')}</strong></p>}
                <p>Usage: <strong className="text-stone-300">{c.usageCount} / {c.usageLimit}</strong> redemptions</p>
                <p>Expires: <strong className="text-stone-300">{new Date(c.endDate).toLocaleDateString('en-GB')}</strong></p>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={() => handleDelete(c._id, c.code)}
                  className="text-red-400 hover:text-red-300 text-[11px] uppercase tracking-wider"
                >
                  Delete Code
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-[#181818] border border-velora-borderDark p-6 md:p-8 max-w-md w-full z-10 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-editorial text-xl text-white">Create Privilege Code</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-white/40" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/60 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="LEO15"
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white uppercase font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1">Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                      className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Flat Amount (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Value *</label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                      className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1">Min. Order Spend (₹)</label>
                    <input
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                      className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
                      className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Description / Campaign</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="15% off Autumn / Winter orders"
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Publish Coupon
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tag: 'EDITORIAL CAMPAIGN',
    image: '',
    ctaText: 'EXPLORE COLLECTION',
    ctaLink: '/shop',
    position: 'hero',
    order: 1,
  });
  const { success, error } = useToast();

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/banners');
      if (res.data.success) setBanners(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/banners', formData);
      if (res.data.success) {
        success('Banner added successfully');
        setIsModalOpen(false);
        fetchBanners();
      }
    } catch (err) {
      error('Failed to create banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      const res = await api.delete(`/admin/banners/${id}`);
      if (res.data.success) {
        success('Banner deleted');
        fetchBanners();
      }
    } catch (err) {
      error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Campaign Banners & Visuals" subtitle="Configure hero showcases, editorial headers, and call-to-action destinations.">
      <div className="space-y-6 font-sans text-xs">
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign Banner</span>
          </button>
        </div>

        <div className="space-y-4">
          {banners.map((b) => (
            <div key={b._id} className="bg-[#181818] border border-velora-borderDark p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <img src={b.image} alt={b.title} className="w-32 h-20 object-cover bg-black shrink-0" />
                <div>
                  <span className="text-[10px] text-velora-champagne uppercase font-semibold">{b.tag}</span>
                  <h4 className="font-editorial text-xl text-white font-normal">{b.title}</h4>
                  <p className="text-[11px] text-stone-400">{b.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-white/5 text-stone-300 text-[11px]">
                  CTA: {b.ctaText} ({b.ctaLink})
                </span>
                <button
                  onClick={() => handleDelete(b._id)}
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
                <h3 className="font-editorial text-xl text-white">New Campaign Banner</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-white/40" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/60 mb-1">Headline Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="THE NEW STANDARD"
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">Supporting Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Autumn / Winter 2026 Collection"
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1">High-Res Photography URL *</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white font-mono text-[11px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-1">CTA Label</label>
                    <input
                      type="text"
                      value={formData.ctaText}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                      className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">CTA URL Link</label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                      className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-velora-champagne text-black font-bold uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Save Banner
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
