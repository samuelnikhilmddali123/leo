import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Boxes,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = ({ children, title, subtitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Collections', href: '/admin/collections', icon: FolderTree },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Inventory Matrix', href: '/admin/inventory', icon: Boxes },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
    { name: 'Homepage Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Reviews Moderation', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F7F5F0] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-velora-borderDark flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-velora-borderDark flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-3">
              <img src="/logo.png" alt="LEO Crest" className="w-8 h-8 object-contain rounded-full border border-white/20 shadow-md" />
              <div className="flex flex-col">
                <span className="font-editorial text-2xl tracking-[0.25em] uppercase text-white">LEO</span>
                <span className="text-[8px] uppercase tracking-[0.35em] text-velora-champagne font-medium">
                  Admin Atelier
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-velora-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs tracking-wider rounded-none transition-all ${
                    isActive
                      ? 'bg-white/10 text-velora-champagne font-medium border-l-2 border-velora-champagne'
                      : 'text-white/60 hover:text-white hover:bg-white/5 font-light'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-velora-champagne' : 'text-white/50'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-velora-champagne" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-velora-borderDark space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center space-x-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-velora-champagne" />
            <span>View Live Store</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#0E0E0E] border-b border-velora-borderDark flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-white/70 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-base font-medium text-white tracking-wide">{title || 'Atelier Management'}</h1>
              {subtitle && <p className="text-[11px] text-white/50 font-light">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-white">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-velora-champagne uppercase tracking-widest">Master Atelier</p>
            </div>
            <div className="w-8 h-8 bg-velora-champagne/20 text-velora-champagne border border-velora-champagne/40 rounded-full flex items-center justify-center font-bold text-xs">
              {(user?.name || 'A')[0]}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-10 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
