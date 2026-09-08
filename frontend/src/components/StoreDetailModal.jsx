import { useEffect, useState } from 'react';
import { X, Star, MapPin, Mail, BarChart2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import StarRating from './StarRating';

export default function StoreDetailModal({ storeId, onClose, onRatingUpdated }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingRating, setSavingRating] = useState(false);

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    api
      .get(`/stores/${storeId}`)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [storeId]);

  async function handleRate(newRating) {
    setSavingRating(true);
    try {
      await api.post(`/stores/${storeId}/ratings`, { rating: newRating });
      // Refresh modal data
      const res = await api.get(`/stores/${storeId}`);
      setData(res.data);
      if (onRatingUpdated) onRatingUpdated(storeId, newRating);
    } finally {
      setSavingRating(false);
    }
  }

  if (!storeId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-full border border-brand-200/70 dark:border-brand-800/60">
                Store Analytics
              </span>
              <h2 className="font-heading font-bold text-xl text-slate-900 dark:text-white mt-2">
                {data ? data.store.name : 'Loading Store Details...'}
              </h2>
              {data && (
                <div className="flex flex-col gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{data.store.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{data.store.email}</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-brand-600 dark:text-brand-400" />
                <span className="text-sm">Fetching rating breakdown...</span>
              </div>
            ) : data ? (
              <>
                {/* Score Summary */}
                <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
                        {data.overallRating ? data.overallRating.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/ 5.0</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <StarRating value={data.overallRating || 0} size="w-4 h-4" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        ({data.totalRatings} review{data.totalRatings === 1 ? '' : 's'})
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-1">Your review</span>
                    <StarRating
                      value={data.userRating || 0}
                      interactive
                      onChange={handleRate}
                      size="w-5 h-5"
                    />
                    {savingRating && <p className="text-[10px] text-brand-600 dark:text-brand-400 mt-1">Updating...</p>}
                  </div>
                </div>

                {/* Rating Breakdown Bar Chart */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Rating Distribution
                    </span>
                    <span>Count</span>
                  </div>

                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = data.distribution[star] || 0;
                    const percentage = data.totalRatings > 0 ? (count / data.totalRatings) * 100 : 0;

                    return (
                      <div key={star} className="flex items-center gap-3 text-xs">
                        <span className="w-6 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-0.5">
                          {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              star >= 4
                                ? 'bg-emerald-500'
                                : star === 3
                                ? 'bg-amber-400'
                                : 'bg-red-400'
                            }`}
                          />
                        </div>
                        <span className="w-12 text-right font-mono text-slate-500 dark:text-slate-400">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
