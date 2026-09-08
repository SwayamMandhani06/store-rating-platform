import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/admin/stores', { params });
      setStores(res.data);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  function handleSort(key) {
    if (sortBy === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(key);
      setOrder('asc');
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (r) =>
        r.rating ? (
          <span className="flex items-center gap-2">
            <StarRating value={r.rating} size="text-sm" /> {r.rating}
          </span>
        ) : (
          <span className="text-slate-400">No ratings</span>
        ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Stores</h1>
          <Link to="/admin/stores/new" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-md">
            + Add Store
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <input
            placeholder="Filter by name"
            value={filters.name}
            onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Filter by email"
            value={filters.email}
            onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Filter by address"
            value={filters.address}
            onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : (
          <SortableTable columns={columns} rows={stores} sortBy={sortBy} order={order} onSort={handleSort} />
        )}
      </div>
    </div>
  );
}
