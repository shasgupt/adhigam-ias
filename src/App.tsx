import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AspirantAuthProvider, useAspirantAuth } from './context/AspirantAuthContext';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { QuickEnquireModal } from './components/QuickEnquireModal';

import { HomeView } from './pages/public/HomeView';
import { CoursesView } from './pages/public/CoursesView';
import { TestSeriesView } from './pages/public/TestSeriesView';
import { FreeResourcesView } from './pages/public/FreeResourcesView';
import { JoinContactView } from './pages/public/JoinContactView';

import { AspirantLoginView } from './pages/aspirant/AspirantLoginView';
import { AspirantWorkbench } from './pages/aspirant/AspirantWorkbench';

import { AdminLoginView } from './pages/admin/AdminLoginView';
import { FacultyCMSDashboard } from './pages/admin/FacultyCMSDashboard';

function MainAppContent() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [activeTab, setActiveTab] = useState<'public' | 'aspirant' | 'admin'>('public');

  // Enquire Modal State
  const [enquireModalOpen, setEnquireModalOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('');

  const { user: staffUser } = useAuth();
  const { user: aspirantUser } = useAspirantAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string, tab?: 'public' | 'aspirant' | 'admin') => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);

    if (tab) {
      setActiveTab(tab);
    } else if (path.startsWith('/admin')) {
      setActiveTab('admin');
    } else if (path.startsWith('/me') || path.startsWith('/login')) {
      setActiveTab('aspirant');
    } else {
      setActiveTab('public');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquire = (courseTitle?: string) => {
    setSelectedCourseTitle(courseTitle || 'RISE 2.0 – Sociology Optional Test Series');
    setEnquireModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans-ui selection:bg-amber-500 selection:text-slate-950">
      {/* Top Urgent Announcement Banner */}
      <AnnouncementBanner onNavigate={(p) => handleNavigate(p)} />

      {/* Main Site Header with Portal Switcher */}
      <SiteHeader
        activeTab={activeTab}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenEnquire={() => handleOpenEnquire()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {/* PUBLIC AREA */}
        {activeTab === 'public' && (
          <>
            {currentPath === '/' && (
              <HomeView onNavigate={handleNavigate} onOpenEnquire={handleOpenEnquire} />
            )}
            {currentPath.startsWith('/courses') && (
              <CoursesView onOpenEnquire={handleOpenEnquire} />
            )}
            {currentPath.startsWith('/test-series') && (
              <TestSeriesView onOpenEnquire={handleOpenEnquire} />
            )}
            {currentPath.startsWith('/free') && (
              <FreeResourcesView
                initialSubTab={
                  currentPath.includes('quizzes')
                    ? 'quizzes'
                    : currentPath.includes('answer-writing')
                    ? 'answer-writing'
                    : 'current-affairs'
                }
                onNavigate={handleNavigate}
              />
            )}
            {currentPath === '/contact' && <JoinContactView />}
          </>
        )}

        {/* ASPIRANT PORTAL AREA */}
        {activeTab === 'aspirant' && (
          <div>
            {aspirantUser ? (
              <AspirantWorkbench onNavigate={handleNavigate} />
            ) : (
              <AspirantLoginView onSuccess={() => handleNavigate('/me', 'aspirant')} />
            )}
          </div>
        )}

        {/* FACULTY / ADMIN CMS AREA */}
        {activeTab === 'admin' && (
          <div>
            {staffUser ? (
              <FacultyCMSDashboard onNavigate={handleNavigate} />
            ) : (
              <AdminLoginView onSuccess={() => handleNavigate('/admin', 'admin')} />
            )}
          </div>
        )}
      </main>

      {/* Site Footer */}
      <SiteFooter onNavigate={(p) => handleNavigate(p, 'public')} />

      {/* Quick Admissions Lead Modal */}
      <QuickEnquireModal
        isOpen={enquireModalOpen}
        onClose={() => setEnquireModalOpen(false)}
        defaultCourseTitle={selectedCourseTitle}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AspirantAuthProvider>
        <MainAppContent />
      </AspirantAuthProvider>
    </AuthProvider>
  );
}
