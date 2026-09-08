import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    api
      .get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard.'));
  }, []);

  function handleSort(key) {
    if (sortBy === key) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setOrder('asc');
    }
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (r) => r.user?.name },
    { key: 'email', label: 'Email', sortable: true, render: (r) => r.user?.email },
    { key: 'rating', label: 'Rating', sortable: true, render: (r) => <StarRating value={r.rating} size="text-sm" /> },
    { key: 'submittedAt', label: 'Submitted', sortable: true, render: (r) => new Date(r.submittedAt).toLocaleDateString() },
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
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Store Owner Dashboard</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {data && (
          <>
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
              <p className="text-slate-500 text-sm">{data.store.name}</p>
              <p className="text-slate-400 text-xs mb-3">{data.store.address}</p>
              <div className="flex items-center gap-3">
                {data.averageRating ? (
                  <>
                    <StarRating value={data.averageRating} />
                    <span className="text-2xl font-bold text-brand-700">{data.averageRating}</span>
                    <span className="text-slate-400 text-sm">
                      ({data.totalRatings} rating{data.totalRatings === 1 ? '' : 's'})
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400 text-sm">No ratings submitted yet</span>
                )}
              </div>
            </div>

            <h2 className="text-sm font-semibold text-slate-700 mb-2">Users who rated your store</h2>
            <SortableTable
              columns={columns}
              rows={sortedRaters}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
              emptyText="No ratings yet"
            />
          </>
        )}
      </div>
    </div>
  );
}
