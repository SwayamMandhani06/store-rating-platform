import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  MapPin,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Inbox,
  Store as StoreIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import StoreDetailModal from '../../components/StoreDetailModal';
import { CardSkeleton } from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const { showToast } = useToast();

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/stores', { params });
      setStores(res.data);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  async function handleRate(storeId, rating) {
    setSavingId(storeId);
    try {
      await api.post(`/stores/${storeId}/ratings`, { rating });
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, userRating: rating } : s))
      );
      showToast(`Submitted ${rating}-star rating!`, 'success');
    } catch {
      showToast('Could not submit rating. Please try again.', 'error');
    } finally {
      setSavingId(null);
    }
  }

  function toggleSort(field) {
    if (sortBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(field);
      setOrder('asc');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6 flex-1">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Browse Stores
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search local venues, explore community feedback, and submit your personal 1 to 5 star rating.
            </p>
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                placeholder="Search by store name..."
                value={filters.name}
                onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              />
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                placeholder="Search by street or address..."
                value={filters.address}
                onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs border-t border-slate-100 flex-wrap">
            <span className="font-semibold uppercase tracking-wider text-slate-400 mr-1">
              Sort by:
            </span>
            {[
              { key: 'name', label: 'Store Name' },
              { key: 'address', label: 'Address' },
              { key: 'overallRating', label: 'Community Rating' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => toggleSort(f.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  sortBy === f.key
                    ? 'bg-brand-50 text-brand-700 border border-brand-200/80'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <span>{f.label}</span>
                {sortBy === f.key &&
                  (order === 'asc' ? (
                    <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
                  ))}
              </button>
            ))}
          </div>
        </div>

        {/* Store Grid */}
        {loading ? (
          <CardSkeleton count={6} />
        ) : stores.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto stroke-[1.5] mb-2" />
            <h3 className="font-heading font-semibold text-slate-800 text-base">No venues found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No registered stores match your search criteria. Try modifying your filter keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stores.map((store) => (
              <motion.div
                key={store.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-slate-900 text-lg leading-snug truncate">
                        {store.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5 line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{store.address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Overall Rating Section */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                        Community Score
                      </span>
                      {store.overallRating ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <StarRating value={store.overallRating} size="w-3.5 h-3.5" />
                          <span className="font-heading font-bold text-slate-800 text-sm">
                            {store.overallRating.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 mt-0.5 block">No ratings yet</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedStoreId(store.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
                      title="View detailed distribution"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>Breakdown</span>
                    </button>
                  </div>
                </div>

                {/* User Rating Action Area */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      {store.userRating ? 'Your Rating' : 'Submit Rating'}
                    </span>
                    <StarRating
                      value={store.userRating || 0}
                      interactive
                      onChange={(n) => handleRate(store.id, n)}
                      size="w-6 h-6"
                    />
                  </div>

                  {savingId === store.id && (
                    <span className="text-xs text-brand-600 font-medium">Saving...</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for Rating Distribution */}
      {selectedStoreId && (
        <StoreDetailModal
          storeId={selectedStoreId}
          onClose={() => setSelectedStoreId(null)}
          onRatingUpdated={(id, r) => {
            setStores((prev) => prev.map((s) => (s.id === id ? { ...s, userRating: r } : s)));
          }}
        />
      )}
    </div>
  );
}
