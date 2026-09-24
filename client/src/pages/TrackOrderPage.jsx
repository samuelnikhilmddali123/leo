import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, MapPin, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    try {
      const query = email ? `?email=${encodeURIComponent(email.trim())}` : '';
      const res = await api.get(`/orders/track/${orderNumber.trim()}${query}`);
      if (res.data.success) {
        setOrderData(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Unable to locate order tracking data. Please verify your order number.');
      setOrderData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      handleTrack();
    }
  }, []);

  const stages = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStageIndex = (status) => {
    const idx = stages.indexOf(status);
    return idx > -1 ? idx : 0;
  };

  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Consignment Logistics</span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-velora-black">
            Track Your Consignment
          </h1>
          <p className="text-xs font-light text-velora-muted max-w-md mx-auto leading-relaxed">
            Enter your bespoke LEO order number (e.g. LEO-91000) to view real-time atelier dispatch and delivery updates.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleTrack} className="bg-white p-6 md:p-8 border border-velora-border shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1">Order Reference *</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="LEO-91000"
                className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs uppercase font-medium focus:outline-none focus:border-velora-black"
                required
              />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@velora.com"
                className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-velora-black text-white py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Searching Atelier Logistics...' : 'Locate Consignment'}
          </button>
        </form>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Order Tracking Timeline & Details */}
        {orderData && (
          <div className="mt-10 bg-white border border-velora-border p-6 md:p-10 shadow-sm space-y-8 text-xs">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-velora-border gap-4">
              <div>
                <span className="text-[10px] text-velora-champagne uppercase tracking-widest font-semibold">Active Consignment</span>
                <h3 className="font-editorial text-2xl font-normal text-velora-black">{orderData.orderNumber}</h3>
                <p className="text-stone-500 font-light text-[11px] mt-0.5">
                  Courier: <strong>{orderData.courierName}</strong> | Tracking ID: <strong>{orderData.trackingNumber}</strong>
                </p>
              </div>
              <div className="sm:text-right">
                <span className="px-3 py-1.5 bg-stone-900 text-velora-champagne text-xs uppercase tracking-widest font-semibold">
                  Status: {orderData.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-6">
              <div className="grid grid-cols-6 text-center text-[10px] font-medium uppercase tracking-wider relative">
                {/* Background Connecting Line */}
                <div className="absolute top-3.5 left-8 right-8 h-0.5 bg-stone-200 -z-0" />
                <div
                  className="absolute top-3.5 left-8 h-0.5 bg-velora-black transition-all duration-700 -z-0"
                  style={{
                    width: `${(getStageIndex(orderData.orderStatus) / (stages.length - 1)) * 100}%`,
                  }}
                />

                {stages.map((stage, idx) => {
                  const isCurrent = orderData.orderStatus === stage;
                  const isPassed = getStageIndex(orderData.orderStatus) >= idx;

                  return (
                    <div key={stage} className="flex flex-col items-center space-y-2 relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] transition-all ${
                          isPassed
                            ? 'bg-velora-black text-white shadow-md'
                            : 'bg-stone-200 text-stone-500 border border-stone-300'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`${isPassed ? 'text-velora-black font-semibold' : 'text-stone-400 font-light'}`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status Timeline Events */}
            <div className="space-y-4 pt-4 border-t border-velora-border">
              <h4 className="font-editorial text-lg text-velora-black">Activity Log</h4>
              <div className="space-y-3">
                {orderData.statusTimeline?.map((item, i) => (
                  <div key={i} className="flex space-x-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-velora-champagne mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-velora-black">{item.status}</span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(item.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-stone-600 font-light mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consignment Items */}
            <div className="pt-6 border-t border-velora-border space-y-3">
              <h4 className="font-editorial text-lg text-velora-black">Items in Consignment</h4>
              <div className="divide-y divide-stone-200">
                {orderData.orderItems?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between first:pt-0">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-12 h-16 bg-stone-200 object-cover shrink-0" />
                      <div>
                        <p className="font-editorial text-base text-velora-black">{item.title}</p>
                        <p className="text-stone-500 text-[11px]">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-velora-dark">₹{item.total.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
