import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  KeyRound,
  LogOut,
  Menu,
  X,
  Shield,
  Briefcase,
  User as UserIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ROLE_CONFIG = {
  admin: {
    label: 'Administrator',
    icon: Shield,
    badgeClass: 'bg-admin-50 text-admin-700 border-admin-200',
    activeLinkClass: 'text-admin-700 bg-admin-50 font-semibold',
  },
  owner: {
    label: 'Store Owner',
    icon: Briefcase,
    badgeClass: 'bg-owner-50 text-owner-700 border-owner-200',
    activeLinkClass: 'text-owner-700 bg-owner-50 font-semibold',
  },
  user: {
    label: 'Reviewer',
    icon: UserIcon,
    badgeClass: 'bg-user-50 text-user-700 border-user-200',
    activeLinkClass: 'text-user-700 bg-user-50 font-semibold',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
  const RoleIcon = roleConfig.icon;
  const homeLink = user.role === 'admin' ? '/admin' : user.role === 'owner' ? '/owner' : '/stores';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navLinks = [
    ...(user.role === 'admin'
      ? [
          { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/users', label: 'Users', icon: Users },
          { to: '/admin/stores', label: 'Stores', icon: Store },
        ]
      : []),
    ...(user.role === 'user'
      ? [{ to: '/stores', label: 'Browse Stores', icon: Store }]
      : []),
    ...(user.role === 'owner'
      ? [{ to: '/owner', label: 'Store Analytics', icon: LayoutDashboard }]
      : []),
    { to: '/change-password', label: 'Security', icon: KeyRound },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to={homeLink} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-heading font-bold text-lg shadow-sm group-hover:bg-brand-700 transition-colors">
                S
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-slate-900">
                Store<span className="text-brand-600">Rate</span>
              </span>
            </Link>

            {/* Role Badge */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${roleConfig.badgeClass}`}
            >
              <RoleIcon className="w-3.5 h-3.5" />
              <span>{roleConfig.label}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? roleConfig.activeLinkClass
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-70" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[180px]">
                {user.name}
              </p>
              <p className="text-xs text-slate-400 font-normal truncate max-w-[180px]">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3"
          >
            {/* User Details in Mobile Drawer */}
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleConfig.badgeClass}`}
              >
                <RoleIcon className="w-3 h-3" />
                {roleConfig.label}
              </span>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? roleConfig.activeLinkClass
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-75" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
