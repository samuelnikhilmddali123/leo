import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Users, BarChart3, ShieldCheck, Settings as SettingsIcon, Save } from 'lucide-react';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/reviews');
      if (res.data.success) setReviews(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (review) => {
    try {
      const res = await api.put(`/admin/reviews/${review._id}/status`, {
        isApproved: !review.isApproved,
      });
      if (res.data.success) {
        success(`Review ${review.isApproved ? 'hidden' : 'approved'}`);
        fetchReviews();
      }
    } catch (err) {
      error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client review permanently?')) return;
    try {
      const res = await api.delete(`/admin/reviews/${id}`);
      if (res.data.success) {
        success('Review deleted');
        fetchReviews();
      }
    } catch (err) {
      error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Client Reviews Moderation" subtitle="Approve or remove client feedback and rating submissions.">
      <div className="space-y-4 font-sans text-xs">
        {isLoading ? (
          <div className="p-12 text-center text-white/40">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-white/40 bg-[#181818] border border-velora-borderDark">No reviews submitted yet.</div>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="bg-[#181818] border border-velora-borderDark p-6 flex flex-col md:flex-row items-start justify-between gap-4 shadow-xl">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-white">{r.userName}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-stone-600'}`} />
                    ))}
                  </div>
                  <span className="text-stone-400 text-[11px]">
                    Garment: <strong className="text-white font-medium">{r.product?.title || 'Piece'}</strong>
                  </span>
                </div>

                <h4 className="font-editorial text-base text-white font-normal">{r.title}</h4>
                <p className="text-stone-300 font-light leading-relaxed">{r.comment}</p>
                <div className="text-[11px] text-stone-500">
                  <span>Fit: <strong>{r.fitFeedback}</strong></span> | <span>Date: {new Date(r.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-auto">
                <button
                  onClick={() => handleToggleStatus(r)}
                  className={`px-3 py-1.5 uppercase tracking-wider text-[11px] font-semibold transition-colors ${
                    r.isApproved ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                  }`}
                >
                  {r.isApproved ? 'Approved (Visible)' : 'Pending (Hidden)'}
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { success, error } = useToast();

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      let url = '/admin/customers?limit=50';
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      if (res.data.success) setCustomers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <AdminLayout title="VIP Client Registry" subtitle="View customer accounts, lifetime consignment volume, and addresses.">
      <div className="space-y-6 font-sans text-xs">
        <div className="bg-[#181818] border border-velora-borderDark overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E0E0E] text-white/50 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Consignments</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light text-white/80">
                {isLoading ? (
                  <tr><td colSpan={7} className="py-12 text-center text-white/40">Loading clients...</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center text-white/40">No registered clients found.</td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="hover:bg-white/5">
                      <td className="py-3.5 px-4 font-semibold text-white">{c.name}</td>
                      <td className="py-3.5 px-4 font-mono text-white/60">{c.email}</td>
                      <td className="py-3.5 px-4">{c.phone || '—'}</td>
                      <td className="py-3.5 px-4">{c.orderCount || 0} orders</td>
                      <td className="py-3.5 px-4 font-semibold text-velora-champagne">
                        ₹{(c.lifetimeSpent || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 uppercase text-[10px] font-semibold ${
                          c.role === 'admin' ? 'bg-velora-champagne text-black' : 'bg-white/10 text-white'
                        }`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString('en-GB')}
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

export const AdminAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) setAnalytics(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <AdminLayout title="Commerce Analytics & Insights" subtitle="Fulfillment pipeline, payment method breakdowns, and top revenue drivers.">
      {isLoading ? (
        <div className="py-12 text-center text-white/40 text-xs">Loading analytics...</div>
      ) : analytics ? (
        <div className="space-y-6 font-sans text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Breakdown */}
            <div className="bg-[#181818] border border-velora-borderDark p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Consignments by Status</h3>
              <div className="space-y-3 pt-2">
                {analytics.ordersByStatus?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-white/5">
                    <span className="font-semibold text-white">{item._id}</span>
                    <div className="text-right">
                      <span className="font-semibold text-velora-champagne">{item.count} orders</span>
                      <span className="text-[10px] text-stone-400 block">₹{item.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-[#181818] border border-velora-borderDark p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Payment Channels</h3>
              <div className="space-y-3 pt-2">
                {analytics.paymentMethods?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-white/5">
                    <span className="font-semibold text-white">{item._id || 'Standard'}</span>
                    <span className="font-semibold text-velora-champagne">{item.count} transactions</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-[#181818] border border-velora-borderDark p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Top Revenue Driving Garments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E0E0E] text-white/50 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Garment Title</th>
                    <th className="p-3">Units Sold</th>
                    <th className="p-3 text-right">Gross Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {analytics.topSellingProducts?.map((p, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-medium text-white">{p._id}</td>
                      <td className="p-3 font-semibold text-velora-champagne">{p.quantity} units</td>
                      <td className="p-3 text-right font-semibold text-white">₹{p.totalSales?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
};

export const AdminSettingsPage = () => {
  const { success } = useToast();
  const [settings, setSettings] = useState({
    brandName: 'LEO Atelier',
    tagline: 'Defined by Power & Precision.',
    currency: 'INR (₹)',
    freeShippingThreshold: 2999,
    supportEmail: 'concierge@leo-atelier.com',
    supportPhone: '+91 98765 43210',
    gstPercentage: 12,
  });

  const handleSave = (e) => {
    e.preventDefault();
    success('Store settings saved successfully');
  };

  return (
    <AdminLayout title="Atelier Configurations" subtitle="Manage storefront currency formatting, free delivery threshold, and concierge contacts.">
      <form onSubmit={handleSave} className="bg-[#181818] border border-velora-borderDark p-6 md:p-8 space-y-6 max-w-2xl font-sans text-xs shadow-xl">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Storefront Parameters</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-white/60 mb-1">Brand Name</label>
            <input
              type="text"
              value={settings.brandName}
              onChange={(e) => setSettings(prev => ({ ...prev, brandName: e.target.value }))}
              className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white/60 mb-1">Brand Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
              className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Statutory GST (%)</label>
              <input
                type="number"
                value={settings.gstPercentage}
                onChange={(e) => setSettings(prev => ({ ...prev, gstPercentage: Number(e.target.value) }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/60 mb-1">Concierge Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/60 mb-1">Concierge Hotline</label>
              <input
                type="tel"
                value={settings.supportPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-velora-champagne text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>
    </AdminLayout>
  );
};
