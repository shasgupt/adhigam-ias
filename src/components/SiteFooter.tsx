import React from 'react';
import { Mail, Send, ExternalLink, Calendar, CheckCircle2, Shield, MessageSquare, ArrowRight, Code } from 'lucide-react';
import { INSTITUTE_CONFIG } from '../data/instituteConfig';
import { AdhigamLogo } from './AdhigamLogo';

export const SiteFooter: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Col 1: About & Motto */}
        <div className="space-y-4">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 inline-block">
            <AdhigamLogo size="md" showText={true} showMotto={false} />
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            {INSTITUTE_CONFIG.aboutText}
          </p>
          <div className="space-y-1">
            <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider italic">
              "{INSTITUTE_CONFIG.tagline}"
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {INSTITUTE_CONFIG.motto}
            </p>
          </div>
        </div>

        {/* Col 2: Academy Programmes & Offerings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Academy Programmes & Offerings
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => onNavigate('/courses')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Sociology Optional Division</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('/test-series')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left text-amber-300 font-semibold cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>RISE 2.0 (New Flagship Launch)</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('/courses')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>GS Mains Mentorship & Ethics</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('/free')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>Free Resources & Answer Lab</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('/contact')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>Admissions Counselling Desk</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: RISE 2.0 Flagship & Fee */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            RISE 2.0 Flagship Series
          </h4>
          <div className="space-y-2 text-slate-400">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-slate-300 font-semibold">
                <span>Standard 49 Tests</span>
                <span className="text-white font-bold">₹8,900</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Paper I & II + Comprehensives</p>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex justify-between items-center text-amber-300 font-bold">
                <span>Early Bird Offer</span>
                <span>₹7,650</span>
              </div>
              <p className="text-[10px] text-amber-200/80 mt-0.5">Valid through 9 October 2026</p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-indigo-300 font-semibold">
                <span>Adhigam Students</span>
                <span className="text-indigo-200 font-bold">₹6,675</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">25% discount privilege</p>
            </div>
          </div>
        </div>

        {/* Col 4: Official Communication */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Official Desk
          </h4>
          <div className="space-y-3 text-slate-300">
            <a
              href={`mailto:${INSTITUTE_CONFIG.contact.email}`}
              className="flex items-start gap-2 hover:text-amber-300 transition-colors"
            >
              <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-slate-400">Official Email</span>
                <span className="font-semibold text-white">{INSTITUTE_CONFIG.contact.email}</span>
              </div>
            </a>

            <a
              href={INSTITUTE_CONFIG.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:text-sky-300 transition-colors"
            >
              <Send className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[11px] text-slate-400">Telegram Channel & Query</span>
                <span className="font-semibold text-white">{INSTITUTE_CONFIG.contact.telegram}</span>
              </div>
            </a>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => onNavigate('/contact')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-400/20"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Student Query Desk & Status Track
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <p>
          © {new Date().getFullYear()} ADHIGAM IAS — Academy for Civil Services. All rights reserved. • RISE 2.0 is the official flagship Sociology Optional test series under Adhigam IAS.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-amber-300/90 font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {INSTITUTE_CONFIG.version || 'v2.4.0'} • Release
          </span>
          <span className="text-slate-700">|</span>
          <a
            href={INSTITUTE_CONFIG.contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            {INSTITUTE_CONFIG.contact.website.replace('https://', '').replace('/', '')}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
