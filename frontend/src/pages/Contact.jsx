import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';

const initial = { name: '', email: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.message.trim().length < 10) next.message = 'Message should be at least 10 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    setSent(true);
    toast.success('Message sent \u2014 we\u2019ll reply within 1-2 business days');
    setForm(initial);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />
      <h1 className="mb-2 font-display text-3xl font-bold text-ink-900 dark:text-white">Get in touch</h1>
      <p className="mb-10 text-sm text-ink-500 dark:text-ink-400">
        Questions about an order, a coupon, or anything else \u2014 we read every message.
      </p>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          {[
            [FiMail, 'Email', 'support@novamarket.example'],
            [FiPhone, 'Phone', '+1 (555) 019-2834'],
            [FiMapPin, 'Address', '128 Market Street, Suite 4, Springfield'],
          ].map(([Icon, label, value]) => (
            <div key={label} className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-marigold-100 text-marigold-600 dark:bg-marigold-400/10 dark:text-marigold-300">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</p>
                <p className="text-sm text-ink-800 dark:text-ink-100">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6 lg:col-span-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink-700 dark:text-ink-200">Name</span>
            <input className="input-field" value={form.name} onChange={handleChange('name')} />
            {errors.name && <span className="mt-1 block text-xs text-red-500">{errors.name}</span>}
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink-700 dark:text-ink-200">Email</span>
            <input type="email" className="input-field" value={form.email} onChange={handleChange('email')} />
            {errors.email && <span className="mt-1 block text-xs text-red-500">{errors.email}</span>}
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-ink-700 dark:text-ink-200">Message</span>
            <textarea
              rows={5}
              className="input-field resize-none"
              value={form.message}
              onChange={handleChange('message')}
            />
            {errors.message && <span className="mt-1 block text-xs text-red-500">{errors.message}</span>}
          </label>
          <button type="submit" className="btn-primary">
            <FiSend /> Send message
          </button>
          {sent && <p className="text-xs text-green-600 dark:text-green-400">Thanks \u2014 your message is on its way.</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
