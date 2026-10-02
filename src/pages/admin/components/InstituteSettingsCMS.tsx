import React, { useState } from 'react';
import { instituteConfig } from '../../../data/instituteConfig';
import {
  Settings,
  Mail,
  Globe,
  Share2,
  Copy,
  Check,
  Send,
  Calendar,
  CreditCard,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export const InstituteSettingsCMS: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyStaticDataCode = () => {
    navigator.clipboard.writeText(JSON.stringify(instituteConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0F2C59]" />
            Official Academy Configuration & Launch Settings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Verified official communication channels, RISE 2.0 fee parameters, and test routine configurations.
          </p>
        </div>

        <button
          onClick={copyStaticDataCode}
          className="px-4 py-2 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Config JSON' : 'Export Config JSON'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Official Channels Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Mail className="w-4 h-4 text-[#D97706]" />
            Official Academy Communication Desks
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Official Contact Email</span>
              <a href={`mailto:${instituteConfig.contact.email}`} className="font-bold text-[#0F2C59] hover:underline">
                {instituteConfig.contact.email}
              </a>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Official Telegram Channel & ID</span>
              <a
                href={instituteConfig.contact.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-sky-700 hover:underline flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5 text-sky-600" />
                {instituteConfig.contact.telegram}
              </a>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Official Website</span>
              <a
                href={instituteConfig.contact.website}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#0F2C59] hover:underline"
              >
                adhigamiasacademy.com
              </a>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-amber-900 uppercase block tracking-wider">Official Motto</span>
              <p className="text-xs font-serif italic text-amber-950 font-bold">
                "{instituteConfig.tagline}"
              </p>
              <p className="text-[11px] text-slate-600 font-sans">
                {instituteConfig.motto}
              </p>
            </div>
          </div>
        </div>

        {/* RISE 2.0 Architectural Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            RISE 2.0 Programme Architecture
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Target Examination</span>
              <span className="font-bold text-slate-900">UPSC CSE Mains 2027</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Programme Duration</span>
              <span className="font-semibold text-slate-900">{instituteConfig.duration}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total Tests & Frequency</span>
              <span className="font-bold text-[#0F2C59]">49 Tests (Mon • Wed • Fri)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Test Value</span>
              <span className="font-semibold text-slate-900">50 marks | 4 questions (10 & 20-mark)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Question Paper Release</span>
              <span className="font-mono font-bold text-slate-800">6:00 PM on test days</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Submission Cutoff</span>
              <span className="font-mono font-bold text-[#D97706]">By 9:00 PM via Telegram / Email</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Model Answer Release</span>
              <span className="font-mono font-bold text-emerald-700">9:00 PM on test day</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Evaluation Turnaround</span>
              <span className="font-semibold text-indigo-700">Within 3 days of submission</span>
            </div>
          </div>
        </div>

        {/* Pricing Tiers Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <CreditCard className="w-4 h-4 text-[#D97706]" />
            Fee Configuration Tiers
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instituteConfig.pricingTiers.map((t) => (
              <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{t.title}</span>
                  {t.badge && (
                    <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                      {t.badge}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black text-[#0F2C59]">
                  {t.formattedAmount}
                </div>
                <p className="text-[11px] text-slate-600">{t.note}</p>
                {t.validityNote && (
                  <p className="text-[10px] text-amber-800 font-medium">{t.validityNote}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
