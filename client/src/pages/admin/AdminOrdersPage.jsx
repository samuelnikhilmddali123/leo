import React, { useState, useEffect } from 'react';
import { Search, Edit, Eye, Truck, CheckCircle2, AlertCircle, X, ChevronRight, Filter } from 'lucide-react';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const { success, error } = useToast();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let url = `/admin/orders?limit=50&status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleOpenStatusModal = (order) => {
    setActiveOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setStatusNote('');
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!activeOrder) return;

    try {
      const res = await api.put(`/admin/orders/${activeOrder._id}/status`, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus} by Master Atelier.`,
        trackingNumber: trackingNumber.trim(),
      });

      if (res.data.success) {
        success(`Consignment ${activeOrder.orderNumber} marked as ${newStatus}`);
        setIsUpdateModalOpen(false);
        fetchOrders();
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update consignment status');
    }
  };

  const statuses = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <AdminLayout title="Consignment Fulfillment" subtitle="Monitor customer orders, assign tracking identifiers, and update delivery progression.">
      <div className="space-y-6 font-sans">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order #, client, email..."
                className="bg-[#181818] border border-velora-borderDark py-2 px-3 pl-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-velora-champagne w-64"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#181818] border border-velora-borderDark py-2 px-3 text-xs text-white focus:outline-none uppercase tracking-wider font-medium"
            >
              <option value="all">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#181818] border border-velora-borderDark overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E0E0E] text-white/50 uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light text-white/80">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-white/40">Loading consignments...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-white/40">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-velora-champagne uppercase">{o.orderNumber}</td>
                      <td className="py-3.5 px-4 text-white/60">
                        {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-white">{o.customerName}</p>
                        <p className="text-[10px] text-white/40 truncate max-w-xs">{o.customerEmail}</p>
                      </td>
                      <td className="py-3.5 px-4">{o.orderItems?.length || 1} pieces</td>
                      <td className="py-3.5 px-4 font-semibold text-white">₹{o.pricing?.total?.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[11px] ${o.paymentInfo?.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {o.paymentInfo?.method} ({o.paymentInfo?.status})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-white/10 text-velora-champagne'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenStatusModal(o)}
                          className="px-3 py-1 bg-white/10 text-velora-champagne hover:bg-white/20 text-[11px] font-medium transition-colors"
                        >
                          Update Status
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

      {/* Update Status Modal */}
      {isUpdateModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsUpdateModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative bg-[#181818] border border-velora-borderDark p-6 md:p-8 max-w-md w-full text-xs shadow-2xl z-10 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-editorial text-xl text-white">Update #{activeOrder.orderNumber}</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-white/60 mb-1">Select Consignment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/60 mb-1">Courier Tracking ID</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="VEL-TRK-9820471"
                  className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">Timeline Event Note (Optional)</label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Dispatched from Mumbai atelier via air express."
                  className="w-full bg-[#0E0E0E] border border-velora-borderDark p-3 text-white focus:outline-none focus:border-velora-champagne"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-velora-champagne text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
              >
                Apply Status & Update Client Timeline
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
