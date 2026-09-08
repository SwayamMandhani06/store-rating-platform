import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = { admin: 'System Administrator', user: 'Normal User', owner: 'Store Owner' };

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  const homeLink = user.role === 'admin' ? '/admin' : user.role === 'owner' ? '/owner' : '/stores';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={homeLink} className="font-bold text-brand-700 text-lg">
          StoreRate
        </Link>
        <div className="flex items-center gap-4">
          {user.role === 'admin' && (
            <>
              <Link to="/admin" className="text-sm text-slate-600 hover:text-brand-700">Dashboard</Link>
              <Link to="/admin/users" className="text-sm text-slate-600 hover:text-brand-700">Users</Link>
              <Link to="/admin/stores" className="text-sm text-slate-600 hover:text-brand-700">Stores</Link>
            </>
          )}
          {user.role === 'user' && (
            <Link to="/stores" className="text-sm text-slate-600 hover:text-brand-700">Stores</Link>
          )}
          {user.role === 'owner' && (
            <Link to="/owner" className="text-sm text-slate-600 hover:text-brand-700">Dashboard</Link>
          )}
          <Link to="/change-password" className="text-sm text-slate-600 hover:text-brand-700">
            Change Password
          </Link>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {user.name} &middot; {ROLE_LABELS[user.role]}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
