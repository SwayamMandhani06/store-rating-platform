import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

function StatCard({ label, value, to }) {
  return (
    <Link
      to={to}
      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
    >
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-3xl font-bold text-brand-700 mt-2">{value}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {!stats && !error && <p className="text-slate-400 text-sm">Loading...</p>}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Users" value={stats.totalUsers} to="/admin/users" />
            <StatCard label="Total Stores" value={stats.totalStores} to="/admin/stores" />
            <StatCard label="Total Ratings Submitted" value={stats.totalRatings} to="/admin/stores" />
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Link
            to="/admin/users/new"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            + Add User
          </Link>
          <Link
            to="/admin/stores/new"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-md"
          >
            + Add Store
          </Link>
        </div>
      </div>
    </div>
  );
}
