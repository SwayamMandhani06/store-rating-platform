import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Download,
  Search,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';
import { TableSkeleton } from '../../components/Skeleton';
import { exportToCSV } from '../../utils/csvExport';

const ITEMS_PER_PAGE = 8;

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/admin/stores', { params });
      setStores(res.data);
      setPage(1);
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

  function handleExport() {
    exportToCSV('storerate-venues', stores, [
      { key: 'name', label: 'Store Name' },
      { key: 'email', label: 'Contact Email' },
      { key: 'address', label: 'Location Address' },
      {
        key: 'rating',
        label: 'Overall Rating',
        csvValue: (r) => (r.rating ? r.rating.toFixed(2) : 'Unrated'),
      },
    ]);
  }

  const totalPages = Math.ceil(stores.length / ITEMS_PER_PAGE) || 1;
  const paginatedStores = stores.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Contact Email', sortable: true },
    { key: 'address', label: 'Location Address', sortable: true },
    {
      key: 'rating',
      label: 'Rating Score',
      sortable: true,
      render: (r) =>
        r.rating ? (
          <span className="inline-flex items-center gap-2">
            <StarRating value={r.rating} size="w-3.5 h-3.5" />
            <span className="font-heading font-bold text-slate-800 text-sm">
              {r.rating.toFixed(1)}
            </span>
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-normal">Unrated</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Registered Stores
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Inspect venues, verify contacts, and track average scores ({stores.length} total).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={loading || stores.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors"
              title="Export as CSV"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <Link
              to="/admin/stores/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Store</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              placeholder="Filter by store name..."
              value={filters.name}
              onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              placeholder="Filter by email..."
              value={filters.email}
              onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              placeholder="Filter by address..."
              value={filters.address}
              onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Content Table & Pagination */}
        {loading ? (
          <TableSkeleton rows={6} cols={4} />
        ) : (
          <div className="space-y-4">
            <SortableTable
              columns={columns}
              rows={paginatedStores}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
              emptyText="No stores found matching your criteria."
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
                <span>
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(page * ITEMS_PER_PAGE, stores.length)} of {stores.length} venues
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-slate-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
