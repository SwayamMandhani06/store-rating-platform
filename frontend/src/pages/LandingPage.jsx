import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Star,
  Shield,
  Building2,
  Users,
  Search,
  Sparkles,
  BarChart3,
  CheckCircle,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [sampleRating, setSampleRating] = useState(5);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'owner') return <Navigate to="/owner" replace />;
    return <Navigate to="/stores" replace />;
  }

  const roleFeatures = [
    {
      role: 'Normal Users',
      title: 'Discover & Review',
      description:
        'Search registered Indian venues by name or locality, browse community feedback, and submit your personal 1 to 5 star ratings with single-click updates.',
      icon: Users,
      badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
      accent: 'border-blue-500/20 hover:border-blue-500/50 dark:border-blue-500/20 dark:hover:border-blue-500/40',
    },
    {
      role: 'Store Owners',
      title: 'Customer Sentiment',
      description:
        'Monitor store performance in real-time, view your aggregate customer rating score, and inspect full customer reviews with submission timestamps.',
      icon: Building2,
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
      accent: 'border-emerald-500/20 hover:border-emerald-500/50 dark:border-emerald-500/20 dark:hover:border-emerald-500/40',
    },
    {
      role: 'Administrators',
      title: 'Platform Governance',
      description:
        'Centralized administration with role management, automated store verification, full sorting/filtering metrics, and instant CSV export capabilities.',
      icon: Shield,
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
      accent: 'border-indigo-500/20 hover:border-indigo-500/50 dark:border-indigo-500/20 dark:hover:border-indigo-500/40',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Public Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-heading font-bold text-lg shadow-xs">
              S
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Store<span className="text-brand-600 dark:text-brand-400">Rate</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl shadow-xs transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Store Rating & Reviews Platform</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Transparent store reviews,{' '}
              <span className="text-brand-600 dark:text-brand-400">actionable insights</span>.
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A modern rating platform connecting customers, store owners, and administrators. Rate
              local businesses 1 to 5 stars, track real customer sentiments, and govern records with
              enterprise security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm transition-all text-sm"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold shadow-xs transition-colors text-sm"
              >
                <span>Try Demo Account</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Supabase PostgreSQL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Role-Based Auth (JWT)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Live Rating Analytics</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Rating Preview Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-7 border border-slate-200/90 dark:border-slate-800 shadow-xl max-w-md mx-auto space-y-6 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full border border-brand-200/70 dark:border-brand-800">
                    Live Preview
                  </span>
                  <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mt-3">
                    Nair's South Indian Delicacies
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    100 Feet Road, Indiranagar, Bengaluru, Karnataka
                  </p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200/60 dark:border-amber-800/60 text-center shrink-0">
                  <span className="text-2xl font-heading font-bold text-amber-600 dark:text-amber-400">
                    4.8
                  </span>
                  <p className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                    Overall Score
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4.5 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span>Interactive Rating Test</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {sampleRating} of 5 Stars
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <StarRating
                    value={sampleRating}
                    interactive
                    onChange={(r) => setSampleRating(r)}
                    size="w-7 h-7"
                  />
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-1 rounded-lg">
                    Click to test!
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span>Total Verified Reviews</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">128 reviews</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span>Store Owner Verification</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Verified Owner
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 py-1.5">
                  <span>Average Customer Score</span>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>4.8 / 5.0</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Three Roles */}
      <section className="py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Role Architecture
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for three distinct user roles
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Every workflow is tailored with precise role permissions, customized dashboards, and
              tailored analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roleFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.role}
                  className={`bg-slate-50 dark:bg-slate-900 rounded-2xl p-7 border ${item.accent} transition-all hover:shadow-md flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl border ${item.badge}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.badge}`}>
                        {item.role}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    >
                      <span>Explore workflow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Platform Capabilities
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Engineered for reliability & clarity
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Instant Search & Filter
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Find venues across localities, districts, and rating scores with sub-millisecond PostgreSQL indexes.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Live Metric Aggregation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time rating computation calculated via SQL AVG aggregation — never redundant or stale.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Strict Validation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Rigorous password complexity and format validation guaranteed consistently across client and server.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              One-Vote Authenticity
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unique compound DB constraints prevent ballot stuffing: each user maintains exactly one rating per store.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-800 dark:text-slate-200">
              StoreRate Platform
            </span>
            <span>&middot;</span>
            <span>Built with React, Express, and PostgreSQL</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-800 dark:hover:text-white transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="hover:text-slate-800 dark:hover:text-white transition-colors">
              Sign Up
            </Link>
            <span className="text-slate-400 dark:text-slate-500">FullStack Challenge Demo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
