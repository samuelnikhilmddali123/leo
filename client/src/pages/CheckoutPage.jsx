import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, subtotal, discount, shipping, tax, total, coupon, clearCart } = useCart();
  const { success, error } = useToast();

  const [currentStep, setCurrentStep] = useState(1); // 1: Contact & Address, 2: Payment
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [contactInfo, setContactInfo] = useState({
    email: user?.email || '',
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    apartment: user?.addresses?.[0]?.apartment || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay', 'Cash on Delivery'
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (user) {
      setContactInfo({
        email: user.email || '',
        name: user.name || '',
        phone: user.phone || '',
      });
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
        setShippingAddress({
          fullName: defaultAddr.fullName || user.name,
          phone: defaultAddr.phone || user.phone,
          street: defaultAddr.street || '',
          apartment: defaultAddr.apartment || '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          postalCode: defaultAddr.postalCode || '',
          country: defaultAddr.country || 'India',
        });
      }
    }
  }, [user]);

  const handleSelectSavedAddress = (addr) => {
    setShippingAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      apartment: addr.apartment || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
    });
  };

  const validateAddress = () => {
    if (!contactInfo.email || !contactInfo.name || !contactInfo.phone) {
      error('Please complete all contact information.');
      return false;
    }
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
      error('Please complete all delivery address fields.');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    setIsSubmitting(true);
    try {
      let paymentInfo = {
        method: paymentMethod,
        status: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Completed',
      };

      if (paymentMethod === 'Razorpay') {
        // Step 1: Create Razorpay Order on server
        const orderRes = await api.post('/payment/create-order', {
          amount: total,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
        });

        if (orderRes.data.success) {
          const { orderId, isMock } = orderRes.data;

          if (isMock || !window.Razorpay) {
            // Mock checkout verification for instant seamless sandbox testing
            paymentInfo = {
              method: 'Razorpay',
              razorpayOrderId: orderId,
              razorpayPaymentId: `pay_mock_${Date.now()}`,
              status: 'Completed',
            };
          } else {
            // Trigger Live Razorpay Modal
            const keyRes = await api.get('/payment/key');
            const razorpayKey = keyRes.data.key;

            await new Promise((resolve, reject) => {
              const options = {
                key: razorpayKey,
                amount: total * 100,
                currency: 'INR',
                name: 'VELORA Atelier',
                description: 'Luxury Garment Consignment',
                order_id: orderId,
                handler: async (response) => {
                  paymentInfo = {
                    method: 'Razorpay',
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    status: 'Completed',
                  };
                  resolve();
                },
                prefill: {
                  name: contactInfo.name,
                  email: contactInfo.email,
                  contact: contactInfo.phone,
                },
                theme: {
                  color: '#0A0A0A',
                },
                modal: {
                  ondismiss: () => reject(new Error('Payment window closed.')),
                },
              };
              const rzp = new window.Razorpay(options);
              rzp.open();
            });
          }
        }
      }

      // Step 2: Create Final Order Record in MongoDB
      const finalOrderPayload = {
        orderItems: cartItems.map(item => ({
          product: item.productId,
          title: item.title,
          slug: item.slug,
          image: item.image,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        customerEmail: contactInfo.email,
        customerName: contactInfo.name,
        customerPhone: contactInfo.phone,
        shippingAddress,
        deliveryMethod: {
          name: 'Express Luxury Courier',
          price: shipping,
          estimatedDays: '2-4 business days',
        },
        paymentInfo,
        coupon,
        notes,
      };

      const createRes = await api.post('/orders', finalOrderPayload);

      if (createRes.data.success) {
        const createdOrder = createRes.data.data;

        if (paymentMethod === 'Razorpay') {
          const orderRes = await api.post('/payment/create-order', {
            amount: total,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
          });

          if (orderRes.data.success) {
            const { orderId, isMock } = orderRes.data;

            if (isMock || !window.Razorpay) {
              clearCart();
              navigate(`/order-success/${createdOrder._id}`);
            } else {
              const keyRes = await api.get('/payment/key');
              const razorpayKey = keyRes.data.key;

              const options = {
                key: razorpayKey,
                amount: total * 100,
                currency: 'INR',
                name: 'LEO Atelier',
                description: 'Luxury Sartorial Consignment',
                image: '/logo.png',
                order_id: orderId,
                handler: async (response) => {
                  try {
                    const verifyRes = await api.post('/payments/razorpay-verify', {
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                      orderId: createdOrder._id,
                    });

                    if (verifyRes.data.success) {
                      clearCart();
                      navigate(`/order-success/${createdOrder._id}`);
                    }
                  } catch (err) {
                    error(err.response?.data?.message || 'Payment verification failed.');
                  }
                },
                prefill: {
                  name: contactInfo.name,
                  email: contactInfo.email,
                  contact: contactInfo.phone,
                },
                theme: {
                  color: '#0A0A0A',
                },
              };

              const rzp = new window.Razorpay(options);
              rzp.open();
            }
          }
        } else {
          // Cash on Delivery
          clearCart();
          success('Your order has been placed with LEO Atelier.');
          navigate(`/order-success/${createdOrder._id}`);
        }
      }
    } catch (err) {
      error(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-24 pb-24 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Simple Checkout Header */}
        <div className="py-6 border-b border-velora-border flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="LEO Crest" className="w-7 h-7 object-contain rounded-full" />
            <span className="font-editorial text-2xl tracking-[0.25em] uppercase">LEO</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs text-velora-muted font-light">
            <Lock className="w-3.5 h-3.5 text-velora-champagne" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Progress Step Badges */}
        <div className="py-6 flex items-center justify-center space-x-4 text-xs font-medium uppercase tracking-widest">
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center space-x-2 ${currentStep === 1 ? 'text-velora-black' : 'text-velora-muted'}`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              currentStep === 1 ? 'bg-velora-black text-white' : 'bg-stone-300 text-stone-700'
            }`}>1</span>
            <span>Delivery Information</span>
          </button>
          <ChevronRight className="w-4 h-4 text-stone-300" />
          <div className={`flex items-center space-x-2 ${currentStep === 2 ? 'text-velora-black' : 'text-velora-muted'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              currentStep === 2 ? 'bg-velora-black text-white' : 'bg-stone-300 text-stone-700'
            }`}>2</span>
            <span>Payment & Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            {currentStep === 1 ? (
              <form onSubmit={handleProceedToPayment} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-white p-6 md:p-8 border border-velora-border space-y-4 shadow-sm">
                  <h3 className="font-editorial text-xl font-normal text-velora-black">1. Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-stone-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={contactInfo.name}
                        onChange={(e) => {
                          setContactInfo(prev => ({ ...prev, name: e.target.value }));
                          setShippingAddress(prev => ({ ...prev, fullName: e.target.value }));
                        }}
                        placeholder="Elena Rostova"
                        className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">Phone Number (For Delivery SMS) *</label>
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => {
                          setContactInfo(prev => ({ ...prev, phone: e.target.value }));
                          setShippingAddress(prev => ({ ...prev, phone: e.target.value }));
                        }}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-stone-600 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="elena.rostova@atelier.com"
                        className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 md:p-8 border border-velora-border space-y-4 shadow-sm">
                  <h3 className="font-editorial text-xl font-normal text-velora-black">2. Delivery Address</h3>

                  {/* Saved Addresses for Authenticated User */}
                  {user?.addresses && user.addresses.length > 0 && (
                    <div className="mb-4">
                      <label className="text-xs uppercase tracking-widest text-velora-muted block mb-2">Saved Addresses</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {user.addresses.map((addr, i) => (
                          <div
                            key={addr._id || i}
                            onClick={() => handleSelectSavedAddress(addr)}
                            className="p-3 border border-velora-border hover:border-velora-black cursor-pointer bg-[#FAF9F5] space-y-1"
                          >
                            <p className="font-semibold text-velora-black">{addr.fullName}</p>
                            <p className="text-stone-600 text-[11px] truncate">{addr.street}, {addr.city}</p>
                            <p className="text-stone-500 text-[11px]">{addr.postalCode}, {addr.state}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-600 mb-1">Street Address *</label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                        placeholder="42 Haute Couture Boulevard, Bandra West"
                        className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1">Apartment, Suite, Unit (Optional)</label>
                      <input
                        type="text"
                        value={shippingAddress.apartment}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, apartment: e.target.value }))}
                        placeholder="Penthouse Suite 14A"
                        className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-stone-600 mb-1">City *</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Mumbai"
                          className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">State *</label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="Maharashtra"
                          className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1">Postal Code (PIN) *</label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                          placeholder="400050"
                          className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Courier Speed */}
                <div className="bg-white p-6 md:p-8 border border-velora-border space-y-4 shadow-sm">
                  <h3 className="font-editorial text-xl font-normal text-velora-black">3. Delivery Speed</h3>
                  <div className="p-4 border border-velora-black bg-[#FAF9F5] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-velora-champagne" />
                      <div>
                        <p className="font-semibold text-velora-black">Express Luxury Courier (Air Dispatch)</p>
                        <p className="text-stone-500 text-[11px] font-light">Estimated 2–4 business days with signature delivery</p>
                      </div>
                    </div>
                    <span className="font-semibold text-velora-black">
                      {shipping === 0 ? <span className="text-emerald-600 uppercase font-medium">Free</span> : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-black/85 transition-colors shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 2: Payment Selection */
              <div className="space-y-8">
                {/* Review Address Summary */}
                <div className="bg-white p-6 border border-velora-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-velora-muted uppercase tracking-widest text-[10px]">Delivering To</span>
                    <p className="font-semibold text-velora-black mt-0.5">{contactInfo.name} ({contactInfo.phone})</p>
                    <p className="text-stone-600 font-light">{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs uppercase tracking-wider text-velora-champagne font-semibold hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Payment Options */}
                <div className="bg-white p-6 md:p-8 border border-velora-border space-y-6 shadow-sm">
                  <h3 className="font-editorial text-xl font-normal text-velora-black">Select Payment Method</h3>

                  <div className="space-y-3">
                    {/* Razorpay Online */}
                    <label
                      onClick={() => setPaymentMethod('Razorpay')}
                      className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                        paymentMethod === 'Razorpay'
                          ? 'border-velora-black bg-[#FAF9F5] shadow-sm'
                          : 'border-velora-border bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'Razorpay'}
                          onChange={() => setPaymentMethod('Razorpay')}
                          className="mt-0.5 text-velora-black focus:ring-0"
                        />
                        <div>
                          <p className="font-semibold text-xs text-velora-black">Razorpay Secure Online Checkout</p>
                          <p className="text-stone-500 text-[11px] font-light mt-0.5">
                            UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, EMI
                          </p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-stone-600" />
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      onClick={() => setPaymentMethod('Cash on Delivery')}
                      className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                        paymentMethod === 'Cash on Delivery'
                          ? 'border-velora-black bg-[#FAF9F5] shadow-sm'
                          : 'border-velora-border bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'Cash on Delivery'}
                          onChange={() => setPaymentMethod('Cash on Delivery')}
                          className="mt-0.5 text-velora-black focus:ring-0"
                        />
                        <div>
                          <p className="font-semibold text-xs text-velora-black">Cash on Delivery (Doorstep Payment)</p>
                          <p className="text-stone-500 text-[11px] font-light mt-0.5">
                            Pay via Cash or UPI QR upon courier arrival at your residence
                          </p>
                        </div>
                      </div>
                      <DollarSign className="w-5 h-5 text-stone-600" />
                    </label>
                  </div>

                  {/* Special Delivery Instructions */}
                  <div>
                    <label className="block text-stone-600 text-xs mb-1">Order Notes / Concierge Instructions (Optional)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Leave with building security if unattended..."
                      className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="w-1/3 py-4 border border-velora-border bg-white text-xs uppercase tracking-widest font-medium hover:bg-stone-100 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-2/3 bg-velora-black text-white py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-black/85 transition-colors shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Complete Order — ₹{total.toLocaleString('en-IN')}</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Items & Pricing Breakdown */}
          <div className="lg:col-span-5">
            <div className="p-6 md:p-8 bg-[#F0EDE6] border border-velora-border space-y-6 sticky top-28">
              <h3 className="font-editorial text-2xl font-normal text-velora-black">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2 divide-y divide-stone-300">
                {cartItems.map((item) => (
                  <div key={item.key} className="flex space-x-3 pt-3 first:pt-0">
                    <img src={item.image} alt={item.title} className="w-14 h-18 bg-stone-200 object-cover shrink-0" />
                    <div className="flex-1 text-xs">
                      <p className="font-editorial text-base text-velora-black line-clamp-1">{item.title}</p>
                      <p className="text-stone-500 text-[11px]">Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="font-medium text-velora-dark mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 text-xs text-stone-600 font-light border-t border-stone-300 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-velora-dark font-normal">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Privilege Discount ({coupon?.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier Delivery</span>
                  <span className="text-velora-dark font-normal">
                    {shipping === 0 ? <span className="text-emerald-600 uppercase font-medium">Free</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (12% included)</span>
                  <span className="text-velora-dark font-normal">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-stone-300 text-base font-semibold text-velora-black">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
