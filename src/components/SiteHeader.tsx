import React, { useState } from 'react';
import {
  BookOpen,
  UserCheck,
  ShieldCheck,
  Menu,
  X,
  Mail,
  Send,
  Calendar,
  CreditCard,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAspirantAuth } from '../context/AspirantAuthContext';
import { INSTITUTE_CONFIG } from '../data/instituteConfig';
import { AdhigamLogo } from './AdhigamLogo';

interface HeaderProps {
  activeTab: 'public' | 'aspirant' | 'admin';
  currentPath: string;
  onNavigate: (path: string, tab?: 'public' | 'aspirant' | 'admin') => void;
  onOpenEnquire: () => void;
}

export const SiteHeader: React.FC<HeaderProps> = ({
  activeTab,
  currentPath,
  onNavigate,
  onOpenEnquire,
}) => {
  const { user: staffUser, logout: staffLogout } = useAuth();
  const { user: aspirantUser, logout: aspirantLogout } = useAspirantAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Top Utility Portal Switcher Bar */}
      <div className="bg-[#0F2C59] text-slate-200 px-4 py-1.5 text-xs border-b border-[#0c2347]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Official Academy Contact Info */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href={`mailto:${INSTITUTE_CONFIG.contact.email}`}
              className="flex items-center gap-1.5 text-amber-200 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{INSTITUTE_CONFIG.contact.email}</span>
            </a>
            <span className="text-slate-500">|</span>
            <a
              href={INSTITUTE_CONFIG.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors font-medium"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span>Telegram: {INSTITUTE_CONFIG.contact.telegram}</span>
            </a>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-300 hidden md:inline font-serif italic text-[11px]">
              "{INSTITUTE_CONFIG.tagline}"
            </span>
          </div>

          {/* Aspirant Portal Entry (Zero Public Admin Buttons) */}
          <div className="flex items-center gap-2 ml-auto text-xs">
            <button
              onClick={() => onNavigate(aspirantUser ? '/me' : '/login', 'aspirant')}
              className={`px-3 py-1 rounded-md transition-all font-semibold text-xs flex items-center gap-1.5 ${
                activeTab === 'aspirant'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                  : 'bg-white/10 text-slate-200 hover:text-white hover:bg-white/20'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{aspirantUser ? 'My Aspirant Workbench' : 'Aspirant Portal'}</span>
              {aspirantUser && (
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse ml-0.5" />
              )}
            </button>

            {/* Staff CMS link only if staff is actively authenticated */}
            {staffUser && (
              <button
                onClick={() => onNavigate('/admin', 'admin')}
                className="px-2.5 py-1 rounded-md transition-all font-semibold text-xs flex items-center gap-1 text-slate-300 hover:text-white hover:bg-white/10"
                title="Staff Session Active"
              >
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                <span>Faculty CMS</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Brand Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('/', 'public')}
          className="cursor-pointer group flex items-center gap-3"
        >
          <AdhigamLogo size="md" showText={true} showMotto={false} />
          <div className="hidden sm:block pl-3 border-l border-slate-200">
            <span className="text-[11px] font-bold text-[#0F2C59] uppercase tracking-wider block">
              ADHIGAM IAS
            </span>
            <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Home of RISE 2.0 (Flagship)
            </span>
          </div>
        </div>

        {/* Desktop Links (When in Public Mode) */}
        {activeTab === 'public' && (
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-[#0F2C59] transition-colors py-1 cursor-pointer ${
                currentPath === '/' ? 'text-[#0F2C59] border-b-2 border-[#0F2C59] font-bold' : 'text-slate-600'
              }`}
            >
              Adhigam Ecosystem
            </button>

            <button
              onClick={() => onNavigate('/courses')}
              className={`hover:text-[#0F2C59] transition-colors py-1 cursor-pointer ${
                currentPath.startsWith('/courses') ? 'text-[#0F2C59] border-b-2 border-[#0F2C59] font-bold' : 'text-slate-600'
              }`}
            >
              Academic Offerings
            </button>

            <button
              onClick={() => onNavigate('/test-series')}
              className={`hover:text-[#0F2C59] transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                currentPath.startsWith('/test-series') ? 'text-[#0F2C59] border-b-2 border-[#0F2C59] font-bold' : 'text-slate-600'
              }`}
            >
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded text-[9px] font-black uppercase">
                Flagship
              </span>
              RISE 2.0 (49 Tests)
            </button>

            <button
              onClick={() => {
                onNavigate('/test-series');
                setTimeout(() => {
                  const el = document.getElementById('test-schedule');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-slate-600 hover:text-[#0F2C59] transition-colors py-1 cursor-pointer"
            >
              Schedule
            </button>

            <button
              onClick={() => onNavigate('/free')}
              className={`hover:text-[#0F2C59] transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                currentPath.startsWith('/free') ? 'text-[#0F2C59] border-b-2 border-[#0F2C59] font-bold' : 'text-slate-600'
              }`}
            >
              Knowledge Hub
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className={`hover:text-[#0F2C59] transition-colors py-1 cursor-pointer flex items-center gap-1 ${
                currentPath === '/contact' ? 'text-[#0F2C59] border-b-2 border-[#0F2C59] font-bold' : 'text-slate-600'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              Queries Desk
            </button>
          </nav>
        )}

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenEnquire}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer border border-amber-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Enquire / Enrol Now
          </button>

          {/* User status badge / Login shortcut */}
          {activeTab === 'aspirant' && aspirantUser ? (
            <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-900">{aspirantUser.name}</span>
              <button
                onClick={aspirantLogout}
                className="text-slate-500 hover:text-rose-600 ml-1 underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : activeTab === 'admin' && staffUser ? (
            <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-900">{staffUser.name}</span>
              <button
                onClick={staffLogout}
                className="text-slate-500 hover:text-rose-600 ml-1 underline cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : null}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 text-sm shadow-md animate-in slide-in-from-top duration-150">
          <div className="p-3 bg-slate-900 text-white rounded-lg border border-slate-800 text-xs mb-2">
            <span className="font-bold text-amber-300">ADHIGAM IAS ACADEMY</span>
            <p className="text-[11px] text-slate-300 mt-0.5">Premier UPSC Civil Services Ecosystem • Home of RISE 2.0</p>
          </div>

          <button
            onClick={() => {
              onNavigate('/');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-semibold text-slate-800 py-1.5"
          >
            Adhigam Ecosystem
          </button>

          <button
            onClick={() => {
              onNavigate('/courses');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-semibold text-slate-800 py-1.5"
          >
            Academic Offerings
          </button>

          <button
            onClick={() => {
              onNavigate('/test-series');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-semibold text-slate-800 py-1.5 flex items-center justify-between"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">Flagship</span>
              RISE 2.0 Test Series
            </span>
            <span className="text-[10px] bg-[#0F2C59] text-amber-300 font-bold px-2 py-0.5 rounded">49 Tests</span>
          </button>

          <button
            onClick={() => {
              onNavigate('/free');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-semibold text-slate-800 py-1.5"
          >
            Knowledge Hub & Resources
          </button>

          <button
            onClick={() => {
              onNavigate('/contact');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-semibold text-slate-800 py-1.5"
          >
            Student Query Desk & Status Track
          </button>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenEnquire();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#0F2C59] text-amber-300 rounded-md font-bold text-center text-xs uppercase tracking-wider"
            >
              Submit Query / Enrol Now
            </button>
            <a
              href={INSTITUTE_CONFIG.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-sky-50 text-sky-800 border border-sky-200 rounded-md font-bold text-center text-xs flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" /> Connect on Telegram (@adhigamias1)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
