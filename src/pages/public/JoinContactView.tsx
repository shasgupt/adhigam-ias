import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Search, HelpCircle, MessageSquare, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';
import { INSTITUTE_CONFIG } from '../../data/instituteConfig';

export const JoinContactView: React.FC = () => {
  // Mode: Submit or Track
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Submit Query Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [category, setCategory] = useState('RISE 2.0 Enrolment');
  const [message, setMessage] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Track Query State
  const [trackQueryInput, setTrackQueryInput] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackResults, setTrackResults] = useState<any[] | null>(null);
  const [trackError, setTrackError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res: any = await api.post('/api/enquiries', {
        name,
        email,
        phone,
        telegram,
        category,
        courseKeyOrTitle: 'RISE 2.0 – Sociology Optional Test Series',
        preferredMode: 'online',
        message,
      });
      setSubmittedRef(res?.referenceId || `ADHIGAM-Q-${Math.floor(1000 + Math.random() * 9000)}`);
      setName('');
      setEmail('');
      setPhone('');
      setTelegram('');
      setMessage('');
    } catch {
      alert('Failed to send inquiry. Please email adhigamias@gmail.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQueryInput.trim()) return;
    setTrackingLoading(true);
    setTrackError('');
    setTrackResults(null);

    try {
      const res: any = await api.get(`/api/enquiries/track?q=${encodeURIComponent(trackQueryInput.trim())}`);
      if (res && Array.isArray(res.results) && res.results.length > 0) {
        setTrackResults(res.results);
      } else {
        setTrackError('No query found matching that reference ID or email.');
      }
    } catch (err: any) {
      setTrackError(err.message || 'Error looking up query status.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[#0F2C59] text-xs font-bold uppercase tracking-widest bg-amber-100 border border-amber-300 px-3 py-1 rounded-md">
          Official Student Query & Contact Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-serif-heading text-[#0F2C59]">
          Connect with {INSTITUTE_CONFIG.name}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Inquiries regarding RISE 2.0 Sociology Optional Test Series, schedule, evaluation, early bird offer, or payment assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Query Form & Query Tracker (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {/* Sub tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold font-serif-heading text-[#0F2C59]">
              {activeTab === 'submit' ? 'Submit an Academic Query' : 'Track Your Query Status'}
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'submit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Query
              </button>
              <button
                onClick={() => setActiveTab('track')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'track' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Track Status
              </button>
            </div>
          </div>

          {/* TAB 1: SUBMIT NEW QUERY */}
          {activeTab === 'submit' && (
            <div>
              {submittedRef ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Query Registered
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">
                      Reference: <span className="font-mono text-[#0F2C59]">{submittedRef}</span>
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you for contacting ADHIGAM IAS. Our team will review your query and reply via email and Telegram. Keep this reference ID to track progress anytime.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => setSubmittedRef(null)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
                    >
                      Submit Another Query
                    </button>
                    <a
                      href={INSTITUTE_CONFIG.contact.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Telegram @adhigamias1
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Mukherjee"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="aspirant@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Telegram Handle</label>
                      <input
                        type="text"
                        placeholder="@username"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Inquiry Topic *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59] bg-white font-medium"
                      >
                        <option value="RISE 2.0 Enrolment">Enrolment in RISE 2.0 (₹8,900)</option>
                        <option value="Early Bird Offer (₹7,650)">Early Bird Offer (₹7,650 - Till 9 Oct)</option>
                        <option value="Existing Student Discount (₹6,675)">Existing Student Privilege (₹6,675)</option>
                        <option value="Schedule & Syllabus Clarification">Schedule & Syllabus Clarification (49 Tests)</option>
                        <option value="Test Submission Process">Answer PDF Submission (by 9:00 PM)</option>
                        <option value="Evaluation & Turnaround">Faculty Evaluation within 3 Days</option>
                        <option value="Payment / Bank Transfer">Payment / UPI Transfer</option>
                        <option value="General Academic Query">General Academic Query</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">How can we assist you? *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please mention your question regarding RISE 2.0 Sociology Optional Test Series..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#0F2C59] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 border border-amber-400/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? 'Submitting to Academy...' : 'Send Inquiry to ADHIGAM IAS'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: TRACK STATUS */}
          {activeTab === 'track' && (
            <div className="space-y-4">
              <form onSubmit={handleTrack} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter your email or reference code (e.g. ADHIGAM-Q-7341)..."
                  value={trackQueryInput}
                  onChange={(e) => setTrackQueryInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0F2C59]"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-5 py-2 bg-[#0F2C59] text-amber-300 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Search className="w-3.5 h-3.5" />
                  {trackingLoading ? 'Checking...' : 'Check Status'}
                </button>
              </form>

              {trackError && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg">
                  {trackError}
                </div>
              )}

              {trackResults && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Found {trackResults.length} Inquir{trackResults.length === 1 ? 'y' : 'ies'}:
                  </h4>
                  {trackResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.referenceId || item.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            item.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'contacted'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Status: {item.status}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Your Question</span>
                        <p className="text-slate-800">{item.message}</p>
                      </div>

                      {item.adminReply ? (
                        <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-200">
                          <span className="text-[10px] text-emerald-800 font-bold uppercase block mb-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Faculty Response
                          </span>
                          <p className="text-emerald-950 font-medium">{item.adminReply}</p>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-slate-100 rounded-lg text-slate-500 text-[11px] italic">
                          Our team is currently reviewing your query. A response will be posted here.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Official Channels & FAQ (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official Communication Desk Box */}
          <div className="bg-[#0F2C59] text-white p-6 sm:p-8 rounded-2xl border border-amber-400/30 shadow-md space-y-5">
            <h3 className="text-base font-bold font-serif-heading text-amber-200">
              Official Communication Channels
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans-ui">
              ADHIGAM IAS communicates exclusively through our official email and Telegram channels.
            </p>

            <div className="space-y-3 pt-1">
              <a
                href={`mailto:${INSTITUTE_CONFIG.contact.email}`}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Email</span>
                  <span className="text-xs font-semibold text-white">{INSTITUTE_CONFIG.contact.email}</span>
                </div>
              </a>

              <a
                href={INSTITUTE_CONFIG.contact.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Telegram</span>
                  <span className="text-xs font-semibold text-white">{INSTITUTE_CONFIG.contact.telegram}</span>
                </div>
              </a>

              <a
                href={INSTITUTE_CONFIG.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Website</span>
                  <span className="text-xs font-semibold text-white">{INSTITUTE_CONFIG.contact.website}</span>
                </div>
              </a>
            </div>

            <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl text-center">
              <span className="text-[11px] font-bold text-amber-200">
                "{INSTITUTE_CONFIG.tagline}"
              </span>
            </div>
          </div>

          {/* Quick FAQ Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#D97706]" /> RISE 2.0 Quick FAQs
            </h4>

            <div className="space-y-2 text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-800">Q: When are test papers released?</p>
                <p className="text-[11px] text-slate-600 mt-0.5">At 6:00 PM on test days (Mon • Wed • Fri).</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-800">Q: When is the answer submission deadline?</p>
                <p className="text-[11px] text-slate-600 mt-0.5">By 9:00 PM on test day via Telegram or email as a single combined PDF.</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg">
                <p className="font-bold text-slate-800">Q: When is the evaluated copy returned?</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Within 3 days of submission with detailed faculty annotations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
