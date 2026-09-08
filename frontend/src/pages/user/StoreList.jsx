import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

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
      setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, userRating: rating } : s)));
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
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Browse Stores</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input
            placeholder="Search by store name"
            value={filters.name}
            onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Search by address"
            value={filters.address}
            onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-2 mb-4 text-sm">
          <span className="text-slate-500">Sort by:</span>
          {['name', 'address', 'overallRating'].map((f) => (
            <button
              key={f}
              onClick={() => toggleSort(f)}
              className={`px-2 py-0.5 rounded ${sortBy === f ? 'bg-brand-100 text-brand-700' : 'text-slate-500 hover:text-brand-700'}`}
            >
              {f === 'overallRating' ? 'Rating' : f.charAt(0).toUpperCase() + f.slice(1)}
              {sortBy === f ? (order === 'asc' ? ' ▲' : ' ▼') : ''}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : stores.length === 0 ? (
          <p className="text-slate-400 text-sm">No stores found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => (
              <div key={store.id} className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="font-semibold text-slate-800">{store.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{store.address}</p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-400">Overall</span>
                  {store.overallRating ? (
                    <>
                      <StarRating value={store.overallRating} size="text-sm" />
                      <span className="text-sm text-slate-600">{store.overallRating}</span>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400">No ratings yet</span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                    {store.userRating ? 'Your rating' : 'Rate this store'}
                  </p>
                  <StarRating
                    value={store.userRating || 0}
                    interactive
                    onChange={(n) => handleRate(store.id, n)}
                    size="text-2xl"
                  />
                  {savingId === store.id && <span className="text-xs text-slate-400 ml-2">Saving...</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
