import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';

export const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const COLORS = ['#C5A880', '#8E8E93', '#4A5568', '#718096', '#2D3748', '#CBD5E0'];

  return (
    <AdminLayout title="Atelier Executive Overview" subtitle="Real-time commerce metrics, revenue charts, and stock warnings.">
      {isLoading ? (
        <div className="py-20 text-center text-xs text-white/50">Loading Atelier metrics...</div>
      ) : data ? (
        <div className="space-y-8 font-sans">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#181818] border border-velora-borderDark p-5 space-y-3">
              <div className="flex items-center justify-between text-white/50 text-xs">
                <span className="uppercase tracking-widest text-[10px]">Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-velora-champagne" />
              </div>
              <p className="text-2xl font-semibold text-white">₹{data.kpis?.totalRevenue?.toLocaleString('en-IN')}</p>
              <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% this cycle</span>
              </div>
            </div>

            <div className="bg-[#181818] border border-velora-borderDark p-5 space-y-3">
              <div className="flex items-center justify-between text-white/50 text-xs">
                <span className="uppercase tracking-widest text-[10px]">Total Consignments</span>
                <ShoppingBag className="w-4 h-4 text-velora-champagne" />
              </div>
              <p className="text-2xl font-semibold text-white">{data.kpis?.totalOrders}</p>
              <div className="flex items-center space-x-1.5 text-emerald-400 text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Active fulfillment</span>
              </div>
            </div>

            <div className="bg-[#181818] border border-velora-borderDark p-5 space-y-3">
              <div className="flex items-center justify-between text-white/50 text-xs">
                <span className="uppercase tracking-widest text-[10px]">Average Order Value</span>
                <TrendingUp className="w-4 h-4 text-velora-champagne" />
              </div>
              <p className="text-2xl font-semibold text-white">₹{data.kpis?.avgOrderValue?.toLocaleString('en-IN')}</p>
              <span className="text-white/40 text-[11px]">Consistent luxury basket</span>
            </div>

            <div className="bg-[#181818] border border-velora-borderDark p-5 space-y-3">
              <div className="flex items-center justify-between text-white/50 text-xs">
                <span className="uppercase tracking-widest text-[10px]">Client Roster</span>
                <Users className="w-4 h-4 text-velora-champagne" />
              </div>
              <p className="text-2xl font-semibold text-white">{data.kpis?.totalCustomers}</p>
              <span className="text-white/40 text-[11px]">Registered VIP Clients</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Trend Area Chart */}
            <div className="lg:col-span-8 bg-[#181818] border border-velora-borderDark p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Revenue Trajectory</h3>
                  <p className="text-[11px] text-white/40">Monthly sales volume in Indian Rupees</p>
                </div>
                <span className="text-xs text-velora-champagne font-medium">FY 2025–2026</span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueChart}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C5A880" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#C5A880" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="name" stroke="#666" fontSize={11} tickLine={false} />
                    <YAxis stroke="#666" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', color: '#fff', fontSize: '12px' }}
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#C5A880" strokeWidth={2} fillOpacity={1} fill="url(#revenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="lg:col-span-4 bg-[#181818] border border-velora-borderDark p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Category Proportions</h3>
              <p className="text-[11px] text-white/40">Active garments across departments</p>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.categoryChart?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', color: '#fff', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-white/60 pt-2 border-t border-white/10">
                {data.categoryChart?.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center space-x-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables Row: Recent Orders & Low Stock Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-7 bg-[#181818] border border-velora-borderDark p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Recent Consignments</h3>
                <Link to="/admin/orders" className="text-xs text-velora-champagne hover:underline flex items-center space-x-1">
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-white/40 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="pb-3">Order Ref</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-light text-white/80">
                    {data.recentOrders?.map((order) => (
                      <tr key={order._id} className="hover:bg-white/5">
                        <td className="py-3 font-medium text-velora-champagne uppercase">{order.orderNumber}</td>
                        <td className="py-3">{order.customerName}</td>
                        <td className="py-3 font-semibold text-white">₹{order.pricing?.total?.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] uppercase tracking-wider font-medium">
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Warnings */}
            <div className="lg:col-span-5 bg-[#181818] border border-velora-borderDark p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Low Stock Matrix</h3>
                </div>
                <Link to="/admin/inventory" className="text-xs text-velora-champagne hover:underline">
                  Manage Matrix
                </Link>
              </div>

              <div className="space-y-3">
                {data.lowStockProducts?.map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 text-xs">
                    <div className="flex items-center space-x-3">
                      <img src={p.images?.[0]?.url} alt={p.title} className="w-10 h-12 object-cover bg-black" />
                      <div>
                        <p className="font-medium text-white line-clamp-1">{p.title}</p>
                        <p className="text-[10px] text-white/40">{p.sku}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-semibold text-xs">
                      {p.totalStock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
};
