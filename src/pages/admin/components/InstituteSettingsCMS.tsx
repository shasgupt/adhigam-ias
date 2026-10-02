import React, { useState, useEffect } from 'react';
import { instituteConfig } from '../../../data/instituteConfig';
import { api } from '../../../lib/api';
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
  Database,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  FileCheck,
  Server,
  AlertCircle,
} from 'lucide-react';

interface DbStats {
  storageEngine: string;
  dbFilePath: string;
  dataDirectory: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  lastUpdated: string;
  counts: {
    users: number;
    testSeries: number;
    enquiries: number;
    announcements: number;
    articles: number;
    quizzes: number;
    prompts: number;
    writingAttempts: number;
    quizAttempts: number;
  };
}

export const InstituteSettingsCMS: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [dbStats, setDbStats] = useState<DbStats | null>(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchDbStats();
  }, []);

  const fetchDbStats = async () => {
    setLoadingDb(true);
    try {
      const stats = await api.get<DbStats>('/api/admin/db/stats');
      setDbStats(stats);
    } catch (err: any) {
      console.warn('Could not fetch DB stats:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  const copyStaticDataCode = () => {
    navigator.clipboard.writeText(JSON.stringify(instituteConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportBackup = () => {
    window.open('/api/admin/db/export', '_blank');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`Are you sure you want to restore the database from "${file.name}"? This will synchronize all records on disk.`)) {
      e.target.value = '';
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await api.post('/api/admin/db/import', parsed);
      setToast({ text: 'Database restored and synchronized successfully!', type: 'success' });
      fetchDbStats();
    } catch (err: any) {
      setToast({ text: err.message || 'Error restoring database backup', type: 'error' });
    } finally {
      setImporting(false);
      e.target.value = '';
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 font-bold">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-serif-heading text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0F2C59]" />
            Official Academy Configuration & Bluehost Settings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Verified official communication channels, persistent database health, and Bluehost deployment parameters.
          </p>
        </div>

        <button
          onClick={copyStaticDataCode}
          className="px-4 py-2 bg-[#0F2C59] hover:bg-[#0c2347] text-amber-300 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Config JSON' : 'Export Config JSON'}
        </button>
      </div>

      {/* Bluehost Database & Persistence Hub Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-serif-heading">
                Bluehost Database & Disk Persistence Hub
              </h4>
              <p className="text-xs text-slate-500">
                Guaranteed zero-loss data persistence for inquiries, test series CRUD, student enrollments, and evaluations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchDbStats}
              disabled={loadingDb}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Refresh DB status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingDb ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Status</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download Backup (.json)
            </button>

            <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>{importing ? 'Restoring...' : 'Restore Backup'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Database Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Storage Engine</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900">
                {dbStats?.storageEngine || 'Bluehost Persistent File Database'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block truncate">
              Path: {dbStats?.dbFilePath || 'data/adhigam_db.json'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Database Size & Status</span>
            <span className="font-bold text-slate-900 block text-sm">
              {dbStats?.fileSizeFormatted || 'Active'}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Last Synced: {dbStats?.lastUpdated ? new Date(dbStats.lastUpdated).toLocaleTimeString() : 'Live'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Record Summary</span>
            <span className="font-bold text-indigo-700 block text-sm">
              {dbStats ? `${dbStats.counts.enquiries} Inquiries • ${dbStats.counts.testSeries} Test Series` : 'Calculating...'}
            </span>
            <span className="text-[11px] text-slate-500 block">
              {dbStats ? `${dbStats.counts.users} Accounts • ${dbStats.counts.announcements} Alerts` : ''}
            </span>
          </div>
        </div>

        {/* Bluehost Server Operational Note */}
        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950">
            <Server className="w-4 h-4 text-indigo-600" />
            <span>Bluehost Deployment & File System Guarantee</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            The database writes atomically to the Bluehost local disk inside the <code className="bg-indigo-100/70 px-1.5 py-0.5 rounded font-mono text-indigo-900">./data</code> directory.
            When you deploy on Bluehost (Shared Hosting or Setup Node.js App with Passenger / PM2), all student inquiries, test series changes, and user accounts survive server restarts, deployments, and process recycles without requiring any external paid database subscriptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Official Channels Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
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
              <span className="text-[10px] font-bold text-amber-900 uppercase block tracking-wider">Official Tagline</span>
              <p className="text-xs font-serif italic text-amber-950 font-bold">
                "{instituteConfig.tagline}"
              </p>
              <p className="text-[11px] text-slate-600 font-sans">
                {instituteConfig.secondaryTagline}
              </p>
            </div>
          </div>
        </div>

        {/* RISE 2.0 Architectural Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 md:col-span-2">
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
