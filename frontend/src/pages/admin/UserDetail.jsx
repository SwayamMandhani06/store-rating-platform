import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Briefcase, User, Star, MapPin, Mail, Calendar } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import { CardSkeleton } from '../../components/Skeleton';

const ROLE_CONFIG = {
  admin: { label: 'System Administrator', icon: Shield, badge: 'bg-admin-50 text-admin-700 border-admin-200' },
  owner: { label: 'Store Owner', icon: Briefcase, badge: 'bg-owner-50 text-owner-700 border-owner-200' },
  user: { label: 'Normal User', icon: User, badge: 'bg-user-50 text-user-700 border-user-200' },
};

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setError('Could not load user profile details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const roleInfo = user ? ROLE_CONFIG[user.role] || ROLE_CONFIG.user : null;
  const RoleIcon = roleInfo ? roleInfo.icon : User;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-10 w-full space-y-6 flex-1">
        <div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to User Directory</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-slate-900 mt-2">
            User Account Details
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            System record, security role, and associated venue profile.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="h-6 w-1/3 bg-slate-200 animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded" />
            <div className="h-24 bg-slate-100 animate-pulse rounded-xl" />
          </div>
        ) : user ? (
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roleInfo.badge}`}
              >
                <RoleIcon className="w-3.5 h-3.5" />
                {roleInfo.label}
              </span>
            </div>

            {/* Address */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Mailing Address
              </span>
              <p className="text-sm text-slate-700 font-medium flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{user.address}</span>
              </p>
            </div>

            {/* Registered date */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Account Created
              </span>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </p>
            </div>

            {/* Store Owner specific rating panel */}
            {user.role === 'owner' && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Store Performance
                </span>

                {user.store ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-heading font-bold text-slate-900 text-sm">{user.store.name}</p>
                      <span className="text-xs text-slate-400 font-mono">ID #{user.store.id}</span>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      {user.rating ? (
                        <>
                          <StarRating value={user.rating} size="w-4 h-4" />
                          <span className="font-heading font-bold text-slate-900 text-base">
                            {user.rating} / 5.0
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            ({user.ratingCount} review{user.ratingCount === 1 ? '' : 's'})
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">No ratings submitted yet</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No store currently linked to this owner account.</p>
                )}
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
