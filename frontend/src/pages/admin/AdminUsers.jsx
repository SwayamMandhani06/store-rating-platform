import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Download,
  Search,
  Filter,
  Eye,
  Shield,
  Briefcase,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import { TableSkeleton } from '../../components/Skeleton';
import { exportToCSV } from '../../utils/csvExport';

const ROLE_CONFIG = {
  admin: { label: 'Admin', icon: Shield, badge: 'bg-admin-50 text-admin-700 border-admin-200' },
  owner: { label: 'Store Owner', icon: Briefcase, badge: 'bg-owner-50 text-owner-700 border-owner-200' },
  user: { label: 'Normal User', icon: User, badge: 'bg-user-50 text-user-700 border-user-200' },
};

const ITEMS_PER_PAGE = 8;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
      setPage(1); // Reset page on filter/sort change
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function handleSort(key) {
    if (sortBy === key) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(key);
      setOrder('asc');
    }
  }

  function handleExport() {
    exportToCSV('storerate-users', users, [
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email Address' },
      { key: 'role', label: 'Assigned Role' },
      { key: 'address', label: 'Mailing Address' },
      { key: 'createdAt', label: 'Registered On', csvValue: (r) => new Date(r.createdAt).toISOString() },
    ]);
  }

  // Pagination slice
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = users.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (r) => {
        const role = ROLE_CONFIG[r.role] || ROLE_CONFIG.user;
        const Icon = role.icon;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${role.badge}`}
          >
            <Icon className="w-3 h-3" />
            {role.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <button
          onClick={() => navigate(`/admin/users/${r.id}`)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect</span>
        </button>
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
              User Directory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Browse, filter, and inspect registered system accounts ({users.length} total).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={loading || users.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors"
              title="Export as CSV"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <Link
              to="/admin/users/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              placeholder="Filter by name..."
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
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={filters.role}
              onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            >
              <option value="">All Roles</option>
              <option value="admin">System Administrator</option>
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
            </select>
          </div>
        </div>

        {/* Content Table & Pagination */}
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : (
          <div className="space-y-4">
            <SortableTable
              columns={columns}
              rows={paginatedUsers}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
              emptyText="No users match the search criteria."
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-2 text-xs text-slate-500">
                <span>
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{' '}
                  {Math.min(page * ITEMS_PER_PAGE, users.length)} of {users.length} accounts
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
