import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Store, UserCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    title: 'System Administrator',
    description: 'Manage users, verify registered stores, and monitor platform metrics.',
    email: 'admin@storerating.com',
    password: 'Admin@1234',
    icon: ShieldCheck,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    hoverBorder: 'hover:border-indigo-400 dark:hover:border-indigo-600',
  },
  {
    role: 'owner',
    title: "Store Owner (Nair's Delicacies)",
    description: 'Monitor customer ratings, view average scores, and inspect reviewer details.',
    email: 'lakshmi.subramaniam@gmail.com',
    password: 'Owner@1234',
    icon: Store,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-600',
  },
  {
    role: 'user',
    title: 'Normal User (Sourav Dutta)',
    description: 'Explore local stores, search locations, and submit/modify 1-5 star ratings.',
    email: 'sourav.dutta@gmail.com',
    password: 'User@1234',
    icon: UserCheck,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-600',
  },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const showDemoLogin =
    import.meta.env.MODE !== 'production' || import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';

  async function performLogin(loginEmail, loginPassword, demoRole = null) {
    setError('');
    if (demoRole) setActiveDemoRole(demoRole);
    else setLoading(true);

    try {
      const res = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      login(res.data.token, res.data.user);
      const role = res.data.user.role;
      navigate(role === 'admin' ? '/admin' : role === 'owner' ? '/owner' : '/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
      setActiveDemoRole(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await performLogin(email, password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-heading font-bold text-sm">
              S
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Store<span className="text-brand-600 dark:text-brand-400">Rate</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Log in to your account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs px-3.5 py-2.5 border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || activeDemoRole !== null}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-5 text-center">
          New here?{' '}
          <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
            Create a Normal User account
          </Link>
        </p>

        {showDemoLogin && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Try a Demo Account
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                One-click login
              </span>
            </div>
            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map((demo) => {
                const Icon = demo.icon;
                const isLoggingIn = activeDemoRole === demo.role;
                return (
                  <motion.button
                    key={demo.role}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading || activeDemoRole !== null}
                    onClick={() => performLogin(demo.email, demo.password, demo.role)}
                    className={`w-full text-left p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 ${demo.hoverBorder} transition-all shadow-xs flex items-start gap-3 group disabled:opacity-50`}
                  >
                    <div className={`p-2 rounded-xl border ${demo.badgeColor} mt-0.5 shrink-0`}>
                      {isLoggingIn ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-600 dark:text-brand-400" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {demo.title}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {isLoggingIn ? 'Authenticating...' : demo.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                        {demo.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
