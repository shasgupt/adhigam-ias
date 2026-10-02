import React from 'react';
import { Calendar, Sparkles, CheckCircle2, ArrowRight, Send, Mail } from 'lucide-react';
import { INSTITUTE_CONFIG } from '../../data/instituteConfig';

export const CoursesView: React.FC<{ onOpenEnquire: (title?: string) => void }> = ({ onOpenEnquire }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Page Heading */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[#0F2C59] text-xs font-bold uppercase tracking-widest bg-amber-100 border border-amber-300 px-3 py-1 rounded-md">
          Academic Offerings & Programmes
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-serif-heading text-[#0F2C59]">
          UPSC Civil Services Programmes
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          ADHIGAM IAS is currently enrolling for our flagship <strong className="text-slate-900">RISE 2.0 Sociology Optional Test Series</strong> for UPSC CSE Mains 2027.
        </p>
      </div>

      {/* Flagship Test Series Showcase Card */}
      <div className="bg-white rounded-2xl border border-amber-300 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#0F2C59] text-amber-300 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
              Flagship Programme
            </span>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded text-[11px] font-bold">
              Admissions Open • 49 Tests
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif-heading text-[#0F2C59]">
              RISE 2.0 – Sociology Optional Test Series
            </h2>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mt-1">
              {INSTITUTE_CONFIG.subtitle}
            </p>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              A structured answer-writing programme for UPSC Civil Services Mains 2027. 49 Tests, 50 Marks/Test, 4 Questions Each (10- and 20-mark mix) on Monday, Wednesday, and Friday. Complete Paper I & Paper II coverage with model answers and evaluated copies returned within 3 days.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {INSTITUTE_CONFIG.risePracticePromise.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{p}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenEnquire('RISE 2.0 - Early Bird (₹7,650)')}
              className="bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs border border-amber-400/40"
            >
              Enrol Now (Early Bird: ₹7,650)
            </button>
            <a
              href="/test-series"
              className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-[#0F2C59] rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#D97706]" /> View 49-Test Schedule
            </a>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 bg-[#0F2C59] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 block w-fit">
              Fee Structure
            </span>

            <div>
              <span className="text-xs text-slate-400 uppercase font-medium block">Standard Fee</span>
              <span className="text-2xl font-bold text-white">₹8,900</span>
            </div>

            <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl">
              <span className="text-[10px] text-amber-300 uppercase font-bold block">Early Bird Offer</span>
              <span className="text-2xl font-black text-amber-300">₹7,650</span>
              <span className="text-[10px] text-amber-200 block mt-0.5">Valid through 9 October 2026</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase font-medium block">Existing Adhigam Students</span>
              <span className="text-xl font-bold text-slate-200">₹6,675</span>
              <span className="text-[10px] text-slate-400 block">25% Discount (-₹2,225)</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{INSTITUTE_CONFIG.contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram: {INSTITUTE_CONFIG.contact.telegram}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
