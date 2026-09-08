import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { validateEmail, validateAddress } from '../../utils/validators';

export default function AddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/owners').then((res) => setOwners(res.data)).catch(() => {});
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
      navigate('/admin/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create store.');
      if (err.response?.data?.errors) setErrors((e) => ({ ...e, ...err.response.data.errors }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-slate-800 mb-6">Add New Store</h1>

        {serverError && <div className="mb-4 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{serverError}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-slate-200" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Store Name <span className="text-slate-400 font-normal">(max 60 characters)</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Store Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address <span className="text-slate-400 font-normal">(max 400 characters)</span>
            </label>
            <textarea
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Store Owner <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <select
              value={form.ownerId}
              onChange={(e) => update('ownerId', e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">No owner assigned</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              Only users with the "Store Owner" role appear here. Create one via Add User first.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2 rounded-md text-sm"
          >
            {loading ? 'Creating...' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
