import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Announcement } from '../types';
import { api } from '../lib/api';

export const AnnouncementBanner: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    api.get<Announcement[]>('/api/announcements')
      .then((data) => {
        if (data && data.length > 0) setAnnouncements(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (!visible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 relative flex items-center justify-between border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 md:gap-3 text-center flex-1">
        <span className="inline-flex items-center gap-1 bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border border-indigo-500/30">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          {current.badgeText || 'Notice'}
        </span>
        <span className="font-medium text-slate-100 truncate max-w-xl">
          {current.title}
        </span>
        {current.link && (
          <button
            onClick={() => onNavigate?.(current.link!)}
            className="hidden sm:inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-xs ml-1 cursor-pointer transition-colors"
          >
            Explore <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        title="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
