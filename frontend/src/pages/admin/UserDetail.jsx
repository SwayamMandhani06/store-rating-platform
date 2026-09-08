import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';

const ROLE_LABELS = { admin: 'System Administrator', user: 'Normal User', owner: 'Store Owner' };

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setError('Could not load user details.'));
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <Link to="/admin/users" className="text-sm text-brand-700 hover:underline">&larr; Back to users</Link>
        <h1 className="text-xl font-bold text-slate-800 mt-2 mb-6">User Details</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {user && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <Field label="Name" value={user.name} />
            <Field label="Email" value={user.email} />
            <Field label="Address" value={user.address} />
            <Field label="Role" value={ROLE_LABELS[user.role] || user.role} />
            {user.role === 'owner' && (
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Store Rating</p>
                {user.rating ? (
                  <div className="flex items-center gap-2">
                    <StarRating value={user.rating} />
                    <span className="text-slate-600 text-sm">
                      {user.rating} / 5 ({user.ratingCount} rating{user.ratingCount === 1 ? '' : 's'})
                    </span>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No ratings yet</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</p>
      <p className="text-slate-800">{value}</p>
    </div>
  );
}
