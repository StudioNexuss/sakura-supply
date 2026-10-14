import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BUSINESS_INFO } from '../../data/business';
import { CherryBlossomTreeIcon } from '../Header';
import { 
  Mail, 
  Building2, 
  CreditCard, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export default function ContactPage() {
  const { businessInfo } = useStore();
  const activeBusiness = { ...BUSINESS_INFO, ...businessInfo };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Stock Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sakura-400 mb-1">
            <CherryBlossomTreeIcon className="w-3.5 h-3.5" />
            Direct Communication & Support
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Contact & Business Information
          </h1>
          <p className="text-sakura-300/70 text-xs sm:text-sm mt-1">
            Reach out directly for pre-order updates, packaging requests, or order inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: About Sakura Supply intro & Credentials */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* About this business intro */}
            <div className="bg-[#101018] rounded-3xl border border-sakura-900/40 p-6 sm:p-7 shadow-xs space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sakura-400" />
                About Sakura Supply
              </h2>
              <p className="text-xs sm:text-sm text-sakura-200/80 leading-relaxed">
                {BUSINESS_INFO.shortIntro}
              </p>
              <p className="text-xs sm:text-sm text-sakura-200/80 leading-relaxed">
                Based in Melbourne, VIC, we are committed to delivering authentic sealed collector items with verified protection and official Australian registration.
              </p>
            </div>

            {/* MANDATORY CREDENTIALS CARD */}
            <div className="bg-[#12121c] text-white rounded-3xl p-6 sm:p-7 shadow-md space-y-5 border border-sakura-900/50">
              <div className="border-b border-sakura-900/40 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-white">Official Credentials</h3>
                  <p className="text-[10px] text-sakura-400/70">Verified Australian Registered Information</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-sakura-400" />
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* 1. Business ABN */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sakura-950 border border-sakura-700/40 flex items-center justify-center text-sakura-300 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-sakura-400/80 uppercase tracking-wider">Australian Business Number (ABN)</div>
                    <div className="text-white font-extrabold text-sm sm:text-base mt-0.5">{activeBusiness.abn}</div>
                  </div>
                </div>

                {/* 2. Business PAYPAL */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sakura-950 border border-sakura-700/40 flex items-center justify-center text-sakura-300 shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-sakura-400/80 uppercase tracking-wider">Official PayPal Merchant</div>
                    <div className="text-sakura-300 font-extrabold text-sm sm:text-base mt-0.5 break-all">{activeBusiness.paypalEmail}</div>
                  </div>
                </div>

                {/* 3. Business EMAIL */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sakura-950 border border-sakura-700/40 flex items-center justify-center text-sakura-300 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-sakura-400/80 uppercase tracking-wider">Direct Contact & Inquiries</div>
                    <div className="text-sakura-200 font-extrabold text-sm sm:text-base mt-0.5 break-all">{activeBusiness.email}</div>
                  </div>
                </div>

              </div>

              {/* Location details */}
              <div className="pt-3 border-t border-sakura-900/40 text-[11px] text-sakura-400/80">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sakura-400" />
                  <span>Melbourne, Victoria, Australia</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#111118] rounded-3xl border border-sakura-900/40 p-6 sm:p-8 shadow-xs">
              
              <div className="border-b border-sakura-900/40 pb-4 mb-6">
                <h2 className="text-base font-black text-white">Send an Inquiry</h2>
                <p className="text-xs text-sakura-300/70 mt-0.5">
                  We respond directly via email regarding item allocations, packaging options, or general questions.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Received</h3>
                  <p className="text-xs sm:text-sm text-sakura-200 max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Your message has been routed to <strong>{activeBusiness.email}</strong>. We will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'General Stock Inquiry', message: '' });
                    }}
                    className="px-5 py-2.5 bg-sakura-600 text-white rounded-xl text-xs font-bold hover:bg-sakura-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-sakura-200 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Jack Micic"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-sakura-200 mb-1">Your Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="collector@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-sakura-200 mb-1">Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm cursor-pointer"
                    >
                      <option value="General Stock Inquiry" className="bg-[#161622] text-white">General Stock & Availability</option>
                      <option value="Pre-Order Allocation Status" className="bg-[#161622] text-white">Pre-Order Allocation Status</option>
                      <option value="Custom Packaging / Acrylic Case Request" className="bg-[#161622] text-white">Custom Packaging / Acrylic Case Request</option>
                      <option value="PayPal Payment or Order Support" className="bg-[#161622] text-white">PayPal Payment or Order Support</option>
                      <option value="Policies / Legal Question" className="bg-[#161622] text-white">Policies / Terms Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-sakura-200 mb-1">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please let us know how we can assist you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#161622] border border-sakura-800/40 text-white focus:outline-none focus:ring-2 focus:ring-sakura-500/30 text-xs sm:text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-sakura-600 hover:bg-sakura-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Submit Inquiry
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
