import React from 'react';
import { MapPin, PhoneCall, Mail, GraduationCap, Award, Shield, Compass } from 'lucide-react';
import { INSTITUTE_CONFIG } from '../data/instituteConfig';
import { AdhigamLogo } from './AdhigamLogo';

export const SiteFooter: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Col 1: About */}
        <div className="space-y-4">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 inline-block">
            <AdhigamLogo size="md" showText={true} showMotto={false} />
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            {INSTITUTE_CONFIG.aboutText}
          </p>
          <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider italic">
            "Driven by Discipline, Fueled by Knowledge"
          </p>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
            <GraduationCap className="w-4 h-4" /> {INSTITUTE_CONFIG.stats.topSelectionsCount} Selections in UPSC CSE
          </div>
        </div>

        {/* Col 2: Programs */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Academic Programmes
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => onNavigate('/courses/gs-foundation-2026')} className="hover:text-indigo-400 transition-colors">
                GS Integrated Foundation 2026
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/courses/mains-masterclass-2026')} className="hover:text-indigo-400 transition-colors">
                Mains Answer Writing (MAWP)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/test-series/prelims-aipmts-2026')} className="hover:text-indigo-400 transition-colors">
                All India Prelims Test Series
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/courses/pub-ad-optional-2026')} className="hover:text-indigo-400 transition-colors">
                Public Administration Optional
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Free Student Zone */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Free Aspirant Zone
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => onNavigate('/free/current-affairs')} className="hover:text-indigo-400 transition-colors">
                The Hindu & PIB Editorial Gists
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/free/quizzes')} className="hover:text-indigo-400 transition-colors">
                Daily Prelims MCQ Practice
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/free/answer-writing')} className="hover:text-indigo-400 transition-colors">
                Daily Mains Question of the Day
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('/me')} className="hover:text-indigo-300 transition-colors font-medium text-indigo-400">
                Aspirant Self-Study Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Regional Centres */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Academy Campuses
          </h4>
          <div className="space-y-2 text-slate-400">
            {INSTITUTE_CONFIG.campuses.map((campus) => (
              <p key={campus.id} className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">{campus.shortName}:</strong> {campus.address}
                </span>
              </p>
            ))}
            <p className="flex items-center gap-2 text-slate-300 pt-1">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-500" /> {INSTITUTE_CONFIG.contact.primaryHelpline} / {INSTITUTE_CONFIG.contact.alternateHelpline}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} {INSTITUTE_CONFIG.name} Academy. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Admission</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Syllabus Disclaimer</span>
        </div>
      </div>
    </footer>
  );
};
