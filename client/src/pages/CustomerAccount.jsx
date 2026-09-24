import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  MapPin,
  User,
  Heart,
  LogOut,
  ChevronRight,
  Truck,
  Plus,
  Trash2,
  Check,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const AccountLayout = ({ children, activeTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { name: 'My Orders', href: '/account/orders', icon: Package },
    { name: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Profile Settings', href: '/account/profile', icon: User },
    { name: 'Saved Wishlist', href: '/wishlist', icon: Heart },
  ];

  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Account Header */}
        <div className="pb-8 border-b border-velora-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Client Dashboard</span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
              Welcome, {user?.name || 'Client'}
            </h1>
            <p className="text-xs font-light text-velora-muted">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-xs uppercase tracking-widest text-red-500 hover:underline flex items-center space-x-1.5 self-start sm:self-auto font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Side Nav */}
          <aside className="lg:col-span-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;

              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={`flex items-center justify-between p-3.5 text-xs tracking-wider transition-all ${
                    isActive
                      ? 'bg-velora-black text-white font-medium shadow-sm'
                      : 'bg-white border border-velora-border text-stone-700 hover:border-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              );
            })}
          </aside>

          {/* Tab Content */}
          <main className="lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <AccountLayout activeTab="My Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-velora-border">
          <h2 className="font-editorial text-2xl font-normal text-velora-black">Consignment History</h2>
          <span className="text-xs text-velora-muted">{orders.length} Consignments</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-velora-muted">Loading consignments...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-velora-border p-12 text-center space-y-3">
            <Package className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-editorial text-xl text-velora-black">No consignments placed yet</p>
            <p className="text-xs font-light text-stone-500">Discover our collection and make your first luxury purchase.</p>
            <Link to="/shop" className="inline-block mt-2 px-6 py-2.5 bg-velora-black text-white text-xs uppercase tracking-widest font-medium">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-velora-border p-6 shadow-sm space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-velora-champagne font-semibold block">Order Reference</span>
                    <strong className="text-velora-black text-sm tracking-wider uppercase">{order.orderNumber}</strong>
                    <span className="text-stone-400 text-[11px] block mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-stone-900 text-velora-champagne text-[11px] uppercase tracking-wider font-semibold">
                      {order.orderStatus}
                    </span>
                    <Link
                      to={`/account/orders/${order._id}`}
                      className="px-4 py-2 border border-velora-border hover:border-black transition-colors font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex flex-wrap gap-4">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-12 h-16 bg-stone-200 object-cover shrink-0" />
                      <div>
                        <p className="font-editorial text-sm text-velora-black line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-stone-500">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-xs">
                  <span className="text-stone-500">Payment: <strong>{order.paymentInfo?.method}</strong> ({order.paymentInfo?.status})</span>
                  <span className="text-sm font-semibold text-velora-black">Total: ₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, [id]);

  if (isLoading) {
    return (
      <AccountLayout activeTab="My Orders">
        <div className="p-12 text-center text-xs text-velora-muted">Loading order details...</div>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout activeTab="My Orders">
        <div className="bg-white p-12 text-center text-xs">Order not found.</div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout activeTab="My Orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-velora-border">
          <div>
            <Link to="/account/orders" className="text-xs text-stone-500 hover:text-black underline block mb-1">
              ← Back to All Orders
            </Link>
            <h2 className="font-editorial text-2xl font-normal text-velora-black">Order #{order.orderNumber}</h2>
          </div>
          <span className="px-3.5 py-1.5 bg-stone-900 text-velora-champagne text-xs uppercase tracking-widest font-semibold">
            {order.orderStatus}
          </span>
        </div>

        {/* Status Timeline */}
        <div className="bg-white border border-velora-border p-6 shadow-sm space-y-4 text-xs">
          <h4 className="font-editorial text-lg text-velora-black">Tracking Timeline</h4>
          <div className="space-y-3">
            {order.statusTimeline?.map((t, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-2 h-2 rounded-full bg-velora-champagne mt-1.5 shrink-0" />
                <div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-velora-black">{t.status}</strong>
                    <span className="text-[11px] text-stone-400">
                      {new Date(t.timestamp).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <p className="text-stone-600 font-light mt-0.5">{t.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-velora-border p-6 shadow-sm space-y-4 text-xs">
          <h4 className="font-editorial text-lg text-velora-black">Garments</h4>
          <div className="divide-y divide-stone-200">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between first:pt-0">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.title} className="w-14 h-18 bg-stone-200 object-cover shrink-0" />
                  <div>
                    <p className="font-editorial text-base text-velora-black">{item.title}</p>
                    <p className="text-[11px] text-stone-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-velora-black">₹{item.total?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white border border-velora-border p-6 space-y-2">
            <h4 className="font-editorial text-lg text-velora-black">Delivery Destination</h4>
            <p className="font-semibold text-velora-black">{order.shippingAddress?.fullName}</p>
            <p className="text-stone-600 font-light leading-relaxed">
              {order.shippingAddress?.street}
              {order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
              Phone: {order.customerPhone}
            </p>
          </div>

          <div className="bg-white border border-velora-border p-6 space-y-2">
            <h4 className="font-editorial text-lg text-velora-black">Payment Breakdown</h4>
            <div className="space-y-1.5 text-stone-600 font-light">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.pricing?.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
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
                <span>Total Amount</span>
                <span>₹{order.pricing?.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export const AddressesPage = () => {
  const { user, addAddress, deleteAddress } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    await addAddress(formData);
    setIsAdding(false);
    setFormData({ fullName: user?.name || '', phone: user?.phone || '', street: '', apartment: '', city: '', state: '', postalCode: '', isDefault: false });
  };

  return (
    <AccountLayout activeTab="Saved Addresses">
      <div className="space-y-6 text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-velora-border">
          <h2 className="font-editorial text-2xl font-normal text-velora-black">Address Book</h2>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-velora-black text-white uppercase tracking-widest text-[11px] font-medium flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleSave} className="bg-white border border-velora-border p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="font-editorial text-xl font-normal text-velora-black">New Delivery Address</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-[#FAF9F5] border border-velora-border p-2.5 text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-[#FAF9F5] border border-velora-border p-2.5 text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Street Address *</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                className="w-full bg-[#FAF9F5] border border-velora-border p-2.5 text-xs focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-600 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-[#FAF9F5] border border-velora-border p-2.5 text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full bg-[#FAF9F5] border border-velora-border p-2.5 text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Postal PIN Code *</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-full bg-[#FAF9F5] border border-velora-border p-2.5 text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="defaultAddr"
                checked={formData.isDefault}
                onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              />
              <label htmlFor="defaultAddr" className="text-stone-700">Set as primary default address</label>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-velora-black text-white uppercase tracking-widest text-[11px] font-medium"
              >
                Save Address
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 border border-velora-border uppercase tracking-widest text-[11px]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user?.addresses?.map((addr) => (
            <div key={addr._id} className="bg-white border border-velora-border p-6 space-y-3 relative shadow-sm">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-velora-black">{addr.fullName}</span>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 bg-stone-200 text-stone-800 text-[10px] uppercase tracking-wider font-semibold">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-stone-600 font-light leading-relaxed">
                {addr.street}{addr.apartment && `, ${addr.apartment}`}<br />
                {addr.city}, {addr.state} - {addr.postalCode}<br />
                Phone: {addr.phone}
              </p>
              <button
                onClick={() => deleteAddress(addr._id)}
                className="text-stone-400 hover:text-red-500 text-[11px] flex items-center space-x-1 pt-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
};

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await updateProfile(formData);
    setIsLoading(false);
  };

  return (
    <AccountLayout activeTab="Profile Settings">
      <div className="bg-white border border-velora-border p-6 md:p-8 space-y-6 shadow-sm text-xs">
        <h2 className="font-editorial text-2xl font-normal text-velora-black">Account Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-stone-600 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-stone-600 mb-1">Email Address</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full bg-stone-100 border border-velora-border p-3 text-xs text-stone-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-stone-600 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-600 mb-1">New Password (Leave blank to keep current)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3.5 bg-velora-black text-white uppercase tracking-widest text-xs font-medium hover:bg-black/85 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Update Settings'}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
};
