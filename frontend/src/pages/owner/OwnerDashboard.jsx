import { useEffect, useState, useMemo } from 'react';
import {
  Briefcase,
  Star,
  MapPin,
  Users,
  Download,
  Inbox,
  Clock,
} from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';
import { CardSkeleton } from '../../components/Skeleton';
import { exportToCSV } from '../../utils/csvExport';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('submittedAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    setLoading(true);
    api
      .get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  function handleSort(key) {
    if (sortBy === key) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setOrder('asc');
    }
  }

  function handleExport() {
    if (!data?.raters) return;
    exportToCSV(`store-reviews-${data.store.name.replace(/\s+/g, '-').toLowerCase()}`, data.raters, [
      { key: 'name', label: 'Customer Name', csvValue: (r) => r.user?.name || '' },
      { key: 'email', label: 'Customer Email', csvValue: (r) => r.user?.email || '' },
      { key: 'rating', label: 'Score (Stars)' },
      { key: 'submittedAt', label: 'Date Submitted', csvValue: (r) => new Date(r.submittedAt).toISOString() },
    ]);
  }

  const columns = [
    { key: 'name', label: 'Customer Name', sortable: true, render: (r) => r.user?.name },
    { key: 'email', label: 'Email', sortable: true, render: (r) => r.user?.email },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (r) => (
        <span className="inline-flex items-center gap-1.5">
          <StarRating value={r.rating} size="w-3.5 h-3.5" />
          <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{r.rating}</span>
        </span>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Date',
      sortable: true,
      render: (r) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(r.submittedAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const sortedRaters = useMemo(() => {
    if (!data?.raters) return [];
    return [...data.raters].sort((a, b) => {
      let av = a[sortBy];
      let bv = b[sortBy];
      if (sortBy === 'name') {
        av = a.user?.name || '';
        bv = b.user?.name || '';
      } else if (sortBy === 'email') {
        av = a.user?.email || '';
        bv = b.user?.email || '';
      } else if (sortBy === 'submittedAt') {
        av = new Date(a.submittedAt).getTime();
        bv = new Date(b.submittedAt).getTime();
      }
      if (av < bv) return order === 'asc' ? -1 : 1;
      if (av > bv) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data?.raters, sortBy, order]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Store Owner Analytics
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Monitor store performance, customer satisfaction ratings, and reviewer feedback.
            </p>
          </div>
          {data?.raters?.length > 0 && (
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Export Reviews CSV</span>
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {loading ? (
          <CardSkeleton count={2} />
        ) : data ? (
          <>
            {/* Store Banner & Metrics */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-owner-700 dark:text-owner-300 bg-owner-50 dark:bg-owner-950/60 px-2.5 py-0.5 rounded-full border border-owner-200 dark:border-owner-800/60">
                  Verified Store Profile
                </span>
                <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white pt-1">
                  {data.store.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{data.store.address}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shrink-0">
                {data.averageRating ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
                        {data.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/ 5.0</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={data.averageRating} size="w-4 h-4" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        ({data.totalRatings} review{data.totalRatings === 1 ? '' : 's'})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No ratings yet</p>
                    <p>Customer feedback will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Raters Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                  Customer Ratings & Reviews ({data.raters ? data.raters.length : 0})
                </h3>
              </div>

              <SortableTable
                columns={columns}
                rows={sortedRaters}
                sortBy={sortBy}
                order={order}
                onSort={handleSort}
                emptyText="No customer reviews have been submitted for your store yet."
              />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
