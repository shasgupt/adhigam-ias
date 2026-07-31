import React, { useState } from 'react';
import { MapPin, PhoneCall, Mail, Clock, Send, CheckCircle2, Building2 } from 'lucide-react';
import { api } from '../../lib/api';
import { INSTITUTE_CONFIG } from '../../data/instituteConfig';

export const JoinContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/contact', { name, email, phone, message });
      setSubmitted(true);
    } catch {
      alert('Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-indigo-700 text-xs font-bold uppercase tracking-widest bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
          Admissions & Campus Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans-ui text-slate-900 tracking-tight">
          Visit {INSTITUTE_CONFIG.name} Centres or Get in Touch
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Offline Campuses in {INSTITUTE_CONFIG.campuses.map((c) => c.shortName).join(' and ')}, Delhi. Live Interactive Online Batches available worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold font-sans-ui text-slate-900 border-b border-slate-100 pb-3">
            Send Us an Academic Inquiry
          </h2>

          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for contacting {INSTITUTE_CONFIG.name}. Senior counselor will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Mukherjee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="aspirant@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">How can we assist you? *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask about batch timings, fee concessions, optional subjects, or campus demo classes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs uppercase tracking-wider rounded-md shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> Submit Inquiry
              </button>
            </form>
          )}
        </div>

        {/* Right Campus Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          {INSTITUTE_CONFIG.campuses.map((campus) => (
            <div key={campus.id} className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" /> {campus.name}
              </h3>
              <p className="text-xs text-slate-300 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{campus.address}</span>
              </p>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-400" /> {campus.phone}
              </p>
              {campus.operatingHours && (
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" /> {campus.operatingHours}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
