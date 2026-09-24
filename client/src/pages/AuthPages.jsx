import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);
    if (res?.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirectUrl);
      }
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@leo.com');
      setPassword('Admin@12345');
    } else {
      setEmail('customer@leo.com');
      setPassword('Customer@12345');
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-36 pb-24 font-sans min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white border border-velora-border p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full border border-black/10 p-1 flex items-center justify-center mx-auto shadow-sm">
              <img src="/logo.png" alt="LEO Crest" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Welcome Back</span>
            <h1 className="font-editorial text-3xl font-normal text-velora-black">Sign In to LEO</h1>
            <p className="text-xs font-light text-velora-muted">Access your order history and bespoke preferences.</p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="p-3 bg-[#F0EDE6] border border-velora-border text-xs space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-velora-muted font-semibold block">Quick Demo Logins:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('customer')}
                className="flex-1 py-1.5 bg-white border border-stone-300 text-[11px] font-medium hover:border-black transition-colors"
              >
                Client Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="flex-1 py-1.5 bg-stone-900 text-velora-champagne text-[11px] font-medium hover:bg-black transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@leo.com"
                  className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                  required
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-stone-600">Password *</label>
                <Link to="/forgot-password" className="text-stone-500 hover:text-black underline text-[11px]">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>

          <div className="pt-4 border-t border-velora-border text-center text-xs font-light text-stone-600">
            <span>New to LEO? </span>
            <Link to="/register" className="text-velora-black font-semibold underline hover:text-velora-champagne">
              Create Client Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await register(formData.name, formData.email, formData.password, formData.phone);
    setIsLoading(false);
    if (res?.success) {
      navigate('/');
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-36 pb-24 font-sans min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white border border-velora-border p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Join the House</span>
            <h1 className="font-editorial text-3xl font-normal text-velora-black">Create Account</h1>
            <p className="text-xs font-light text-velora-muted">Unlock exclusive releases and saved measurements.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Elena Rostova"
                  className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                  required
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="elena@example.com"
                  className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                  required
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Create Password * (Min. 6 chars)</label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-md"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Account</span>}
            </button>
          </form>

          <div className="pt-4 border-t border-velora-border text-center text-xs font-light text-stone-600">
            <span>Already registered? </span>
            <Link to="/login" className="text-velora-black font-semibold underline hover:text-velora-champagne">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoToken, setDemoToken] = useState('');
  const { success, error } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        success(res.data.message);
        setDemoToken(res.data.demoToken || 'demo_token');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Failed to dispatch reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-36 pb-24 font-sans min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white border border-velora-border p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Security</span>
            <h1 className="font-editorial text-3xl font-normal text-velora-black">Password Recovery</h1>
            <p className="text-xs font-light text-velora-muted">Enter your registered email to receive recovery instructions.</p>
          </div>

          {demoToken ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-3">
              <p className="font-semibold">Reset Link Generated</p>
              <p className="font-light">In live production this is sent via email. For instant preview testing, proceed below:</p>
              <Link
                to={`/reset-password/${demoToken}`}
                className="block text-center py-2 bg-emerald-700 text-white font-medium uppercase tracking-wider text-[11px]"
              >
                Reset Password Now →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@leo.com"
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 pl-10 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Transmit Instructions</span>}
              </button>
            </form>
          )}

          <div className="text-center text-xs">
            <Link to="/login" className="text-stone-500 hover:text-black underline font-light">
              ← Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        success('Password updated successfully. Please sign in.');
        navigate('/login');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Invalid or expired password reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] pt-36 pb-24 font-sans min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white border border-velora-border p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">New Credentials</span>
            <h1 className="font-editorial text-3xl font-normal text-velora-black">Reset Password</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-600 mb-1">New Password (Min. 6 chars) *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 mb-1">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
