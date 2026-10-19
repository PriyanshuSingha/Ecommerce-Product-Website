import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiMail } from 'react-icons/fi';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    toast.success('You\u2019re subscribed \u2014 welcome to NovaMarket!');
    setEmail('');
  };

  return (
    <section className="rounded-2xl bg-ink-700 px-6 py-10 text-center text-white dark:bg-ink-800 sm:px-12">
      <FiMail className="mx-auto mb-3 text-marigold-300" size={28} />
      <h3 className="font-display text-2xl font-semibold">Get first dibs on new drops</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-200">
        One email a week. New arrivals, restocks, and coupon codes before anyone else sees them.
      </p>
      <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input-field flex-1 border-transparent bg-white/95 text-ink-900"
        />
        <button type="submit" className="btn-primary bg-marigold-400 text-ink-900 hover:bg-marigold-300">
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default Newsletter;
