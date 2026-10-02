import React, { useState } from 'react';
import { X, Send, CheckCircle2, Mail, ExternalLink, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { INSTITUTE_CONFIG } from '../data/instituteConfig';

interface QuickEnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseTitle?: string;
  defaultCategory?: string;
}

export const QuickEnquireModal: React.FC<QuickEnquireModalProps> = ({
  isOpen,
  onClose,
  defaultCourseTitle,
  defaultCategory,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [category, setCategory] = useState(defaultCategory || 'RISE 2.0 Enrolment');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ referenceId: string } | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res: any = await api.post('/api/enquiries', {
        name,
        email,
        phone,
        telegram,
        category,
        courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
        preferredMode: 'online',
        message: message || `Enquiry regarding ${category} for RISE 2.0 Sociology Optional Test Series.`,
      });

      setSubmittedData({
        referenceId: res?.referenceId || `ADHIGAM-Q-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please email adhigamias@gmail.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedData(null);
    setName('');
    setEmail('');
    setPhone('');
    setTelegram('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-[#0F2C59] text-white p-6 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-300 text-[11px] font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Official Admissions & Student Query Desk
          </div>
          <h2 className="text-xl font-bold font-sans-ui text-white">
            RISE 2.0 Sociology Optional
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Enrolment assistance, Early Bird verification, schedule clarification, and test routine guidance.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submittedData ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Query Logged Successfully
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Reference: <span className="font-mono text-[#0F2C59]">{submittedData.referenceId}</span>
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-2 leading-relaxed">
                  Thank you, <strong className="text-slate-800">{name}</strong>. Our academic team has received your query and will reply via email (<span className="text-slate-800">{email}</span>) and Telegram.
                </p>
              </div>

              {/* Instant Next Action */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2.5">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Need Immediate Assistance?
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={INSTITUTE_CONFIG.contact.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Telegram: {INSTITUTE_CONFIG.contact.telegram}
                  </a>
                  <a
                    href={`mailto:${INSTITUTE_CONFIG.contact.email}?subject=RISE%202.0%20Query%20${submittedData.referenceId}`}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-amber-400/30"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email Academy
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Done & Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Query Topic / Subject *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59] bg-white font-medium"
                >
                  <option value="RISE 2.0 Enrolment">Enrolment in RISE 2.0 (Programme Fee: ₹8,900)</option>
                  <option value="Early Bird Offer (₹7,650)">Early Bird Offer (₹7,650 - Valid through 9 Oct 2026)</option>
                  <option value="Existing Student Discount (₹6,675)">Existing Adhigam Student (25% Discount: ₹6,675)</option>
                  <option value="Schedule & Syllabus Clarification">Schedule & Syllabus Clarification (49 Tests)</option>
                  <option value="Test Submission & Evaluation Routine">Answer Submission (Telegram/Email) & Evaluation</option>
                  <option value="Payment / Bank Transfer Details">Payment / UPI / QR Code Details</option>
                  <option value="General Academic Mentorship">General Academic / Optional Mentorship</option>
                </select>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siddharth Mukherjee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="aspirant@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                  />
                </div>
              </div>

              {/* Phone & Telegram */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telegram Handle <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="@your_username"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                  />
                </div>
              </div>

              {/* Specific Query / Question */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Question / Message *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ask about RISE 2.0 enrolment, schedule, test submission process, or early bird eligibility..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 border border-amber-400/30"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  {submitting ? 'Submitting to Academy...' : 'Send Query to ADHIGAM IAS'}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Official communication via Telegram (@adhigamias1) and adhigamias@gmail.com
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
