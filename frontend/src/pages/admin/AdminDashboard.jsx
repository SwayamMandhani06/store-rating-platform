import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  Star,
  UserPlus,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Clock,
  BarChart3,
  Shield,
  Briefcase,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import { CardSkeleton } from '../../components/Skeleton';

const ROLE_BADGES = {
  admin: { label: 'Admin', icon: Shield, class: 'bg-admin-50 dark:bg-admin-950/60 text-admin-700 dark:text-admin-300 border-admin-200 dark:border-admin-800/60' },
  owner: { label: 'Owner', icon: Briefcase, class: 'bg-owner-50 dark:bg-owner-950/60 text-owner-700 dark:text-owner-300 border-owner-200 dark:border-owner-800/60' },
  user: { label: 'Reviewer', icon: User, class: 'bg-user-50 dark:bg-user-950/60 text-user-700 dark:text-user-300 border-user-200 dark:border-user-800/60' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 flex-1">
        {/* Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Platform Administration
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live platform metrics, user access management, and store ratings analytics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/users/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </Link>
            <Link
              to="/admin/stores/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Add Store</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {loading ? (
          <CardSkeleton count={3} />
        ) : stats ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Link
                to="/admin/users"
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-500 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Total Users
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-3">
                  {stats.totalUsers}
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-medium mt-3">
                  <span>View directory</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                to="/admin/stores"
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-500 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Registered Stores
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Store className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-3">
                  {stats.totalStores}
                </p>
                <div className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-medium mt-3">
                  <span>Manage stores</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Ratings Submitted
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <p className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-3">
                  {stats.totalRatings}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-normal">
                  Aggregated across all registered venues
                </p>
              </div>
            </div>

            {/* Analytics Grids: Top Rated Stores & Rating Spread */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Top Rated Stores */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                      Highest-Rated Venues
                    </h2>
                  </div>
                  <Link to="/admin/stores" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    View all
                  </Link>
                </div>

                <div className="space-y-3">
                  {stats.topStores && stats.topStores.length > 0 ? (
                    stats.topStores.map((store, i) => (
                      <div
                        key={store.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {store.name}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{store.address}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex items-center gap-2 pl-3">
                          <StarRating value={store.rating} size="w-3.5 h-3.5" />
                          <span className="font-heading font-bold text-slate-800 dark:text-slate-200 text-sm">
                            {store.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">No rated stores yet.</p>
                  )}
                </div>
              </div>

              {/* Overall Ratings Spread */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <BarChart3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Rating Distribution
                  </h2>
                </div>

                <div className="space-y-3 pt-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.ratingsSpread ? stats.ratingsSpread[star] || 0 : 0;
                    const pct = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;

                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="w-7 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          {star} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${
                              star >= 4
                                ? 'bg-emerald-500'
                                : star === 3
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                        </div>
                        <span className="w-14 text-right font-mono text-slate-500 dark:text-slate-400">
                          {count} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recently Registered Users */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    Recently Registered Accounts
                  </h2>
                </div>
                <Link to="/admin/users" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  View all users
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.recentUsers && stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((u) => {
                    const badge = ROLE_BADGES[u.role] || ROLE_BADGES.user;
                    const Icon = badge.icon;
                    return (
                      <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{u.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.class}`}
                          >
                            <Icon className="w-3 h-3" />
                            {badge.label}
                          </span>
                          <Link
                            to={`/admin/users/${u.id}`}
                            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline hidden sm:inline"
                          >
                            Inspect
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">No users registered yet.</p>
                )}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
