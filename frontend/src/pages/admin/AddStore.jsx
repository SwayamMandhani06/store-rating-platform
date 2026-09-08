import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Building2, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useToast } from '../../context/ToastContext';
import { validateEmail, validateAddress } from '../../utils/validators';

export default function AddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/admin/owners')
      .then((res) => setOwners(res.data))
      .catch(() => {});
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validateAll() {
    const next = {
      name: !form.name || form.name.length > 60 ? 'Store name is required (max 60 characters)' : '',
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validateAll()) return;

    setLoading(true);
    try {
      await api.post('/admin/stores', { ...form, ownerId: form.ownerId || null });
      showToast(`Store "${form.name}" registered successfully`, 'success');
      navigate('/admin/stores');
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not register store.';
      setServerError(msg);
      showToast(msg, 'error');
      if (err.response?.data?.errors) setErrors((e) => ({ ...e, ...err.response.data.errors }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-10 w-full space-y-6 flex-1">
        <div>
          <Link
            to="/admin/stores"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Stores Directory</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-slate-900 mt-2">
            Register New Store
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add a physical or digital venue and optionally assign a verified store owner.
          </p>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-4"
          noValidate
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Store Name <span className="text-slate-400 font-normal lowercase">(max 60 characters)</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. The Roasted Bean Artisan Cafe"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Store Contact Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="store@example.com"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Physical / Location Address <span className="text-slate-400 font-normal lowercase">(max 400 characters)</span>
            </label>
            <textarea
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              rows={3}
              placeholder="Suite, Street Address, District"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Assign Store Owner <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <select
              value={form.ownerId}
              onChange={(e) => update('ownerId', e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            >
              <option value="">No owner assigned (unclaimed)</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Only accounts with the "Store Owner" role appear here. Provision owner accounts via Add User first.
            </p>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm shadow-xs transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Venue...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Store</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
