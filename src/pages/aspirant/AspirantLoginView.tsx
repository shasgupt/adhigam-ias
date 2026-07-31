import React, { useState } from 'react';
import { useAspirantAuth } from '../../context/AspirantAuthContext';
import { UserCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AspirantLoginView: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { login, register } = useAspirantAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('aspirant@adhigam.com');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetYear, setTargetYear] = useState('UPSC CSE 2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(email);
      } else {
        await register({ name, email, phone, targetYear });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <UserCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-serif-heading text-slate-900">
          Aspirant Portal Access
        </h2>
        <p className="text-xs text-slate-600">
          Track quiz attempts, submit Mains answer scripts, and request Gemini AI evaluations.
        </p>
      </div>

      {/* Demo Credentials Alert */}
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1">
        <p className="font-bold text-amber-900 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Demo Aspirant Account:
        </p>
        <p className="text-amber-800 font-mono text-[11px]">
          Email: <span className="font-bold">aspirant@adhigam.com</span>
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {mode === 'register' && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Siddharth Mukherjee"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="aspirant@adhigam.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
          />
        </div>

        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+91..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Year</label>
              <select
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
              >
                <option value="UPSC CSE 2026">CSE 2026</option>
                <option value="UPSC CSE 2027">CSE 2027</option>
              </select>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Accessing...' : mode === 'login' ? 'Sign In to Portal' : 'Register Aspirant Account'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
        {mode === 'login' ? (
          <p>
            Don't have an aspirant profile?{' '}
            <button
              onClick={() => setMode('register')}
              className="text-indigo-600 font-bold underline"
            >
              Register Now
            </button>
          </p>
        ) : (
          <p>
            Already registered?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-indigo-600 font-bold underline"
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
