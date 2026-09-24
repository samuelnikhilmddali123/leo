import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, ArrowRight, Truck, MapPin, Printer, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    // Trigger celebratory luxury gold/champagne confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A880', '#0A0A0A', '#EAE6DF', '#D4AF37'],
      });
    } catch (e) {}

    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data.success) {
            setOrder(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load order:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center font-sans">
        <div className="animate-spin w-8 h-8 border-2 border-velora-black border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Success Card */}
        <div className="bg-white border border-velora-border p-8 md:p-12 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-semibold block">
            Payment & Consignment Confirmed
          </span>
          <h1 className="font-editorial text-3xl sm:text-5xl font-normal text-velora-black">
            Thank You for Your Order
          </h1>
          <p className="text-xs font-light text-stone-600 max-w-lg mx-auto leading-relaxed">
            Your consignment has been received by LEO Atelier. We are preparing your pieces with bespoke care in our signature gift box.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <div className="bg-[#FAF9F5] px-4 py-2 border border-velora-border">
              <span className="text-stone-500 font-light mr-1">Order Ref:</span>
              <strong className="text-velora-black tracking-wider uppercase">{order?.orderNumber || 'LEO-XXXXXX'}</strong>
            </div>
            <div className="bg-[#FAF9F5] px-4 py-2 border border-velora-border">
              <span className="text-stone-500 font-light mr-1">Estimated Delivery:</span>
              <strong className="text-velora-black">
                {order?.estimatedDeliveryDate
                  ? new Date(order.estimatedDeliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '3–4 Business Days'}
              </strong>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="mt-8 bg-white border border-velora-border p-6 md:p-8 space-y-6 shadow-sm text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-velora-border">
              <h3 className="font-editorial text-xl font-normal text-velora-black">Consignment Details</h3>
              <span className="text-stone-500 font-light">
                {new Date(order.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-stone-200">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.title} className="w-14 h-18 bg-stone-200 object-cover shrink-0" />
                    <div>
                      <p className="font-editorial text-base text-velora-black">{item.title}</p>
                      <p className="text-stone-500 text-[11px] font-light">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-velora-black">₹{item.total.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Address & Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-velora-border">
              <div className="space-y-2">
                <span className="uppercase tracking-widest text-[10px] text-velora-muted font-medium block">Shipping Address</span>
                <p className="font-semibold text-velora-black">{order.shippingAddress?.fullName}</p>
                <p className="text-stone-600 font-light leading-relaxed">
                  {order.shippingAddress?.street}
                  {order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                  Phone: {order.customerPhone}
                </p>
              </div>

              <div className="space-y-2">
                <span className="uppercase tracking-widest text-[10px] text-velora-muted font-medium block">Payment Summary</span>
                <div className="space-y-1.5 text-stone-600 font-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  {order.pricing?.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Privilege Discount</span>
                      <span>-₹{order.pricing?.discount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.pricing?.shipping === 0 ? 'Complimentary' : `₹${order.pricing?.shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (12%)</span>
                    <span>₹{order.pricing?.tax?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-300 font-semibold text-velora-black text-sm">
                    <span>Total Paid</span>
                    <span>₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={`/track-order?orderNumber=${order?.orderNumber || ''}`}
            className="w-full sm:w-auto px-8 py-4 bg-velora-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors shadow-md flex items-center justify-center space-x-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Consignment</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-4 border border-velora-border bg-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-100 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Return to Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
