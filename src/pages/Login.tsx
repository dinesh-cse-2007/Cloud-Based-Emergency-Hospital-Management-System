import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Cloud } from 'lucide-react';
import supabase from '../lib/supabase';
import { signInWithGoogle } from '../lib/googleAuth';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('demo@medcloud.io');
  const [password, setPassword] = useState('password123');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isSignUp) {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="absolute inset-0 hero-bg opacity-80" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 shadow-lg shadow-yellow-400/30">
            <Plus className="h-8 w-8 text-slate-900" strokeWidth={3} />
          </div>
          <h1 className="logo-font text-4xl font-semibold tracking-tighter text-white">MedCloud</h1>
          <p className="mt-2 text-sm text-slate-400">Emergency Hospital Command Center</p>
          <div className="mt-3 flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-[10px] text-emerald-400">
            <Cloud className="h-3 w-3" />
            CLOUD OPERATIONS • LIVE
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
          <h2 className="mb-6 text-center text-lg font-semibold text-white">
            {isSignUp ? 'Create staff account' : 'Sign in to continue'}
          </h2>

          {error && (
            <div className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-3xl border border-slate-600 bg-slate-800 px-5 text-white outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-slate-400">PASSWORD</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-3xl border border-slate-600 bg-slate-800 px-5 text-white outline-none focus:border-yellow-400"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-3xl bg-yellow-400 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300 disabled:opacity-60"
            >
              {busy ? 'Please wait…' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="my-5 text-center text-sm text-slate-500">or</div>

          <button
            type="button"
            onClick={() => signInWithGoogle('MedCloud')}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-3xl border border-slate-600 bg-slate-800 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63l3.6 2.8c2.11-1.95 3.32-4.82 3.32-8.67z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09L2.18 7.07C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.6-2.8c-.98.66-2.23 1.06-3.68 1.06-2.86 0-5.29-1.93-6.16-4.53L2.18 16.93C3.99 20.53 7.7 23 12 23z" />
            </svg>
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-xs text-slate-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="font-medium text-yellow-400 hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          <div className="mt-6 rounded-2xl bg-slate-800/60 p-3 text-center text-[11px] text-slate-400">
            Demo: <span className="font-mono text-emerald-400">demo@medcloud.io</span> /{' '}
            <span className="font-mono text-emerald-400">password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
