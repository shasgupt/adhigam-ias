import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  FileText,
  HelpCircle,
  PhoneCall,
  UserCheck,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Search,
  PenTool,
  CheckCircle,
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
  const [freeResourcesOpen, setFreeResourcesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Utility Portal Switcher Bar */}
      <div className="bg-slate-50 px-4 py-1.5 border-b border-slate-200 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Academy Contact Quick Info */}
          <div className="hidden md:flex items-center gap-4 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <PhoneCall className="w-3 h-3 text-indigo-600" />
              Delhi Campus: {INSTITUTE_CONFIG.contact.primaryHelpline}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">
              {INSTITUTE_CONFIG.campuses.map((c) => c.shortName).join(' & ')}
            </span>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="flex items-center gap-1.5 ml-auto text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-widest mr-1 text-[10px] hidden sm:inline">
              Workspace Mode:
            </span>

            <button
              onClick={() => onNavigate('/', 'public')}
              className={`px-3 py-1 rounded-md transition-all font-semibold text-xs flex items-center gap-1.5 ${
                activeTab === 'public'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              Public Portal
            </button>

            <button
              onClick={() => onNavigate(aspirantUser ? '/me' : '/login', 'aspirant')}
              className={`px-3 py-1 rounded-md transition-all font-semibold text-xs flex items-center gap-1.5 ${
                activeTab === 'aspirant'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              Aspirant Portal
              {aspirantUser && (
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-0.5" />
              )}
            </button>

            <button
              onClick={() => onNavigate(staffUser ? '/admin' : '/admin/login', 'admin')}
              className={`px-3 py-1 rounded-md transition-all font-semibold text-xs flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              Faculty CMS
              {staffUser && (
                <span className="w-2 h-2 bg-indigo-400 rounded-full ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Brand Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('/', 'public')}
          className="cursor-pointer group"
        >
          <AdhigamLogo size="md" showText={true} showMotto={false} />
        </div>

        {/* Desktop Links (When in Public Mode) */}
        {activeTab === 'public' && (
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-indigo-600 transition-colors ${
                currentPath === '/' ? 'text-indigo-600 border-b-2 border-indigo-600 py-1' : 'text-slate-600'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('/courses')}
              className={`hover:text-indigo-600 transition-colors ${
                currentPath.startsWith('/courses') ? 'text-indigo-600 border-b-2 border-indigo-600 py-1' : 'text-slate-600'
              }`}
            >
              Courses
            </button>

            <button
              onClick={() => onNavigate('/test-series')}
              className={`hover:text-indigo-600 transition-colors ${
                currentPath.startsWith('/test-series') ? 'text-indigo-600 border-b-2 border-indigo-600 py-1' : 'text-slate-600'
              }`}
            >
              Test Series
            </button>

            {/* Free Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFreeResourcesOpen(!freeResourcesOpen)}
                onMouseEnter={() => setFreeResourcesOpen(true)}
                className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${
                  currentPath.startsWith('/free') ? 'text-indigo-600 border-b-2 border-indigo-600 py-1' : 'text-slate-600'
                }`}
              >
                Free Resources
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {freeResourcesOpen && (
                <div
                  onMouseLeave={() => setFreeResourcesOpen(false)}
                  className="absolute top-full left-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 text-xs animate-in fade-in duration-150"
                >
                  <button
                    onClick={() => {
                      onNavigate('/free/current-affairs');
                      setFreeResourcesOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-indigo-600 flex items-center gap-2 font-medium"
                  >
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Current Affairs & Editorials
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('/free/quizzes');
                      setFreeResourcesOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-indigo-600 flex items-center gap-2 font-medium"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Daily Prelims Quizzes
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('/free/answer-writing');
                      setFreeResourcesOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-indigo-600 flex items-center gap-2 font-medium"
                  >
                    <PenTool className="w-4 h-4 text-indigo-600" />
                    Daily Mains Answer Writing
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('/contact')}
              className={`hover:text-indigo-600 transition-colors ${
                currentPath === '/contact' ? 'text-indigo-600 border-b-2 border-indigo-600 py-1' : 'text-slate-600'
              }`}
            >
              Contact & Centres
            </button>
          </nav>
        )}

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenEnquire}
            className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-md font-medium text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Enquire Now
          </button>

          {/* User status badge / Login shortcut */}
          {activeTab === 'aspirant' && aspirantUser ? (
            <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-900">{aspirantUser.name}</span>
              <button
                onClick={aspirantLogout}
                className="text-slate-500 hover:text-rose-600 ml-1 underline"
              >
                Logout
              </button>
            </div>
          ) : activeTab === 'admin' && staffUser ? (
            <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="font-semibold text-slate-900">{staffUser.name}</span>
              <button
                onClick={staffLogout}
                className="text-slate-500 hover:text-rose-600 ml-1 underline"
              >
                Logout
              </button>
            </div>
          ) : null}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3 text-sm animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onNavigate('/', 'public');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded hover:bg-slate-800 text-slate-200"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('/courses', 'public');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded hover:bg-slate-800 text-slate-200"
          >
            Courses
          </button>
          <button
            onClick={() => {
              onNavigate('/test-series', 'public');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded hover:bg-slate-800 text-slate-200"
          >
            Test Series
          </button>
          <button
            onClick={() => {
              onNavigate('/free', 'public');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded hover:bg-slate-800 text-slate-200"
          >
            Free Resources (Editorials, Quizzes, Writing)
          </button>
          <button
            onClick={() => {
              onNavigate('/contact', 'public');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 px-3 rounded hover:bg-slate-800 text-slate-200"
          >
            Contact & Centres
          </button>
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onOpenEnquire();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-center"
            >
              Quick Enquiry
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
