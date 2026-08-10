import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiCreditCard, FiSmartphone, FiTruck, FiCheck } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit Card', icon: FiCreditCard },
  { id: 'upi', label: 'UPI', icon: FiSmartphone },
  { id: 'cod', label: 'Cash on Delivery', icon: FiTruck },
];

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

const Checkout = () => {
  const { items, cartSummary, placeOrder } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [payment, setPayment] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!/^[0-9+\-\s]{7,15}$/.test(form.phone)) next.phone = 'Enter a valid phone number';
    if (!form.address.trim()) next.address = 'Address is required';
    if (!form.city.trim()) next.city = 'City is required';
    if (!form.state.trim()) next.state = 'State is required';
    if (!form.zip.trim()) next.zip = 'ZIP / postal code is required';
    if (!form.country.trim()) next.country = 'Country is required';
    if (payment === 'card') {
      if (!/^\d{13,19}$/.test(cardDetails.number.replace(/\s/g, ''))) next.number = 'Enter a valid card number';
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) next.expiry = 'Use MM/YY format';
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) next.cvv = 'Enter a valid CVV';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the highlighted fields');
      return;
    }
    setSubmitting(true);
    // Simulate a network round-trip for placing the order.
    setTimeout(() => {
      const order = placeOrder({
        customer: form,
        paymentMethod: payment,
      });
      setSubmitting(false);
      toast.success('Order placed successfully!');
      navigate('/orders', { state: { justPlaced: order.id } });
    }, 700);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Customer info */}
          <fieldset className="card-surface space-y-4 p-6">
            <legend className="mb-1 font-display text-lg font-bold text-ink-900 dark:text-white">Your information</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName}>
                <input className="input-field" value={form.fullName} onChange={handleChange('fullName')} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" className="input-field" value={form.email} onChange={handleChange('email')} />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input className="input-field" value={form.phone} onChange={handleChange('phone')} />
              </Field>
            </div>
          </fieldset>

          {/* Shipping address */}
          <fieldset className="card-surface space-y-4 p-6">
            <legend className="mb-1 font-display text-lg font-bold text-ink-900 dark:text-white">Shipping address</legend>
            <Field label="Street address" error={errors.address}>
              <input className="input-field" value={form.address} onChange={handleChange('address')} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City" error={errors.city}>
                <input className="input-field" value={form.city} onChange={handleChange('city')} />
              </Field>
              <Field label="State" error={errors.state}>
                <input className="input-field" value={form.state} onChange={handleChange('state')} />
              </Field>
              <Field label="ZIP code" error={errors.zip}>
                <input className="input-field" value={form.zip} onChange={handleChange('zip')} />
              </Field>
            </div>
            <Field label="Country" error={errors.country}>
              <input className="input-field" value={form.country} onChange={handleChange('country')} />
            </Field>
          </fieldset>

          {/* Payment method */}
          <fieldset className="card-surface space-y-4 p-6">
            <legend className="mb-1 font-display text-lg font-bold text-ink-900 dark:text-white">Payment method</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setPayment(id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors ${
                    payment === id
                      ? 'border-ink-700 bg-ink-50 text-ink-900 dark:border-marigold-400 dark:bg-marigold-400/10 dark:text-white'
                      : 'border-ink-200 text-ink-500 hover:border-ink-400 dark:border-ink-700 dark:text-ink-400'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            {payment === 'card' && (
              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <Field label="Card number" error={errors.number} className="sm:col-span-3">
                  <input
                    className="input-field"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails((p) => ({ ...p, number: e.target.value }))}
                  />
                </Field>
                <Field label="Expiry (MM/YY)" error={errors.expiry}>
                  <input
                    className="input-field"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails((p) => ({ ...p, expiry: e.target.value }))}
                  />
                </Field>
                <Field label="CVV" error={errors.cvv}>
                  <input
                    className="input-field"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails((p) => ({ ...p, cvv: e.target.value }))}
                  />
                </Field>
              </div>
            )}

            {payment === 'upi' && (
              <p className="text-sm text-ink-500 dark:text-ink-400">
                You\u2019ll receive a UPI payment request at checkout confirmation.
              </p>
            )}
            {payment === 'cod' && (
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Pay with cash when your order arrives.
              </p>
            )}
          </fieldset>
        </div>

        {/* Order summary */}
        <div className="card-surface h-fit space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Order Summary</h2>
          <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <img src={item.image} alt="" className="h-10 w-10 rounded-md bg-white object-contain p-1 dark:bg-white/10" />
                <div className="flex-1">
                  <p className="line-clamp-1 text-ink-800 dark:text-ink-100">{item.title}</p>
                  <p className="text-xs text-ink-400">Qty {item.quantity}</p>
                </div>
                <span className="price-tag text-ink-700 dark:text-ink-200">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="perforation" />
          <dl className="space-y-2 pt-3 text-sm">
            <div className="flex justify-between text-ink-600 dark:text-ink-300">
              <dt>Subtotal</dt>
              <dd className="price-tag">{formatPrice(cartSummary.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <dt>Savings</dt>
              <dd className="price-tag">-{formatPrice(cartSummary.discountTotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-600 dark:text-ink-300">
              <dt>Shipping</dt>
              <dd className="price-tag">{cartSummary.shipping === 0 ? 'Free' : formatPrice(cartSummary.shipping)}</dd>
            </div>
            <div className="flex justify-between text-base font-bold text-ink-900 dark:text-white">
              <dt>Total</dt>
              <dd className="price-tag">{formatPrice(cartSummary.total)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Placing order\u2026' : (
              <>
                <FiCheck /> Place Order
              </>
            )}
          </button>
          <Link to="/cart" className="block text-center text-xs font-medium text-ink-500 hover:text-marigold-600 dark:text-ink-400">
            Back to cart
          </Link>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, error, children, className = '' }) => (
  <label className={`block text-sm ${className}`}>
    <span className="mb-1 block font-medium text-ink-700 dark:text-ink-200">{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
  </label>
);

export default Checkout;
