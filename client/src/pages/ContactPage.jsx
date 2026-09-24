import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Bespoke Sizing & Styling Advice',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      error('Please complete all form fields.');
      return;
    }
    setIsSent(true);
    success('Your inquiry has been relayed to the LEO Client Concierge.');
    setFormData({ name: '', email: '', subject: 'Bespoke Sizing & Styling Advice', message: '' });
  };

  return (
    <div className="bg-[#FAF9F5] pt-32 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-16">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Personal Assistance</span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-velora-black">
            LEO Concierge & Boutiques
          </h1>
          <p className="text-xs font-light text-velora-muted max-w-md mx-auto leading-relaxed">
            Our private stylists and concierge advisors are available to assist with private sizing, bespoke alterations, or private viewings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 border border-velora-border shadow-sm space-y-6">
            <h3 className="font-editorial text-2xl font-normal text-velora-black">Send a Message</h3>

            {isSent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-semibold text-sm">Thank You for Reaching Out</p>
                <p className="font-light">A private LEO concierge specialist will reply to your email within 4 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-600 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Elena Rostova"
                      className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="elena@example.com"
                      className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">Subject Matter</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                  >
                    <option value="Bespoke Sizing & Styling Advice">Bespoke Sizing & Styling Advice</option>
                    <option value="Consignment & Delivery Tracking">Consignment & Delivery Tracking</option>
                    <option value="Private Trunk Show Inquiries">Private Trunk Show Inquiries</option>
                    <option value="Corporate & VIP Gifting">Corporate & VIP Gifting</option>
                    <option value="Returns & Alterations">Returns & Alterations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">Your Message *</label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Provide details about your query or garment reference..."
                    className="w-full bg-[#FAF9F5] border border-velora-border p-3 text-xs focus:outline-none focus:border-velora-black"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-velora-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Boutiques & Atelier Details */}
          <div className="lg:col-span-5 space-y-6 text-xs font-light text-stone-600">
            <div className="bg-white p-6 md:p-8 border border-velora-border space-y-4">
              <h4 className="font-editorial text-xl text-velora-black font-normal">LEO Central Atelier</h4>
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-velora-champagne shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-velora-black font-medium block">Mumbai Showroom & HQ</strong>
                    <span>42 Haute Couture Boulevard, Bandra West, Mumbai 400050</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-velora-champagne shrink-0" />
                  <span>+91 98765 43210 (Mon–Sat 10:00 - 19:00 IST)</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-velora-champagne shrink-0" />
                  <span>concierge@leo-atelier.com</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-velora-champagne shrink-0" />
                  <span>Doorstep appointments by prior booking only</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F0EDE6] p-6 border border-velora-border space-y-2">
              <p className="font-editorial text-lg text-velora-black font-normal">Private Appointments</p>
              <p className="leading-relaxed">
                Experience personalized garment fittings and private lookbook curations with our Master Tailors in Mumbai and New Delhi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
