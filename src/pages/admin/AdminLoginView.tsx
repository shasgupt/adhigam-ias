import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Sparkles, ArrowRight, Lock } from 'lucide-react';

export const AdminLoginView: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@adhigam.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Faculty authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('admin123');
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif-heading text-amber-100">
          Faculty & CMS Staff Portal
        </h2>
        <p className="text-xs text-slate-400">
          Manage courses, answer evaluations, student leads, and site content.
        </p>
      </div>

      {/* Demo Credentials Quick Switcher */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
        <span className="text-[10px] uppercase font-bold text-amber-400 block">
          One-Click Demo Staff Accounts:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDemoAccount('sharma@adhigam.com')}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-left cursor-pointer"
          >
            <p className="font-bold text-amber-200">Dr. R.K. Sharma</p>
            <p className="text-[10px] text-slate-400">Senior Faculty</p>
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount('admin@adhigam.com')}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-left cursor-pointer"
          >
            <p className="font-bold text-amber-200">System Admin</p>
            <p className="text-[10px] text-slate-400">Full CMS Control</p>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Staff Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-amber-500 text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-amber-500 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In to Faculty CMS'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
