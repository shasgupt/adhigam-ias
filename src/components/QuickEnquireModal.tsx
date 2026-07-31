import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building2, PhoneCall, Mail } from 'lucide-react';
import { api } from '../lib/api';
import { INSTITUTE_CONFIG } from '../data/instituteConfig';

interface QuickEnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseTitle?: string;
}

export const QuickEnquireModal: React.FC<QuickEnquireModalProps> = ({
  isOpen,
  onClose,
  defaultCourseTitle,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(defaultCourseTitle || 'GS Foundation 2026');
  const [preferredMode, setPreferredMode] = useState<'online' | 'offline' | 'hybrid'>('hybrid');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.post('/api/enquiries', {
        name,
        email,
        phone,
        courseKeyOrTitle: course,
        preferredMode,
        message: message || `Enquiry for ${course} (${preferredMode} mode)`,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
            <Building2 className="w-4 h-4" /> Admissions Desk
          </div>
          <h2 className="text-xl font-bold font-sans-ui text-white">
            Adhigam IAS Counselling & Enquiry
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Connect with senior academic counselors for batch schedules, offline demo classes, and fee structure.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Enquiry Received Successfully!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto mb-6">
                Our academic counseling team will reach out to you on <span className="font-semibold text-slate-800">{phone || email}</span> within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="aspirant@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Program of Interest</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="GS Integrated Foundation 2026">GS Integrated Foundation 2026</option>
                    <option value="Mains Answer Writing (MAWP)">Mains Answer Writing (MAWP)</option>
                    <option value="Prelims Mock Test Series (AIPMTS)">Prelims Mock Test Series (AIPMTS)</option>
                    <option value="Public Administration Optional">Public Administration Optional</option>
                    <option value="General Guidance & Counselling">General Guidance & Counselling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mode Preference</label>
                  <select
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white"
                  >
                    <option value="hybrid">Hybrid (Offline + Live Online)</option>
                    <option value="offline">Offline (Old Rajinder Nagar, Delhi)</option>
                    <option value="online">Live Interactive Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Query / Target Year</label>
                <textarea
                  rows={2}
                  placeholder="Mention your target CSE year or specific questions regarding syllabus coverage..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Submitting Request...' : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit Enquiry
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-indigo-600" /> Helpline: {INSTITUTE_CONFIG.contact.primaryHelpline}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-indigo-600" /> {INSTITUTE_CONFIG.contact.admissionsEmail}
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
