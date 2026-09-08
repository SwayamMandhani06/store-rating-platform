import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';

const ROLE_LABELS = { admin: 'System Administrator', user: 'Normal User', owner: 'Store Owner' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
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

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (r) => ROLE_LABELS[r.role] || r.role },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <button onClick={() => navigate(`/admin/users/${r.id}`)} className="text-brand-700 text-sm hover:underline">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-800">Users</h1>
          <Link to="/admin/users/new" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-md">
            + Add User
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
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
          <select
            value={filters.role}
            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All roles</option>
            <option value="admin">System Administrator</option>
            <option value="user">Normal User</option>
            <option value="owner">Store Owner</option>
          </select>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : (
          <SortableTable columns={columns} rows={users} sortBy={sortBy} order={order} onSort={handleSort} />
        )}
      </div>
    </div>
  );
}
