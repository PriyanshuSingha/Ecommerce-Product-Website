import { FiTag, FiUsers, FiGlobe, FiHeart } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';

const VALUES = [
  { icon: FiTag, title: 'Honest pricing', desc: 'The price you see is the price you pay \u2014 coupons just make it better.' },
  { icon: FiUsers, title: 'Built for shoppers', desc: 'Every feature starts with "would this actually help someone buy?"' },
  { icon: FiGlobe, title: 'Curated catalog', desc: 'A tight assortment across electronics, jewelry, and apparel.' },
  { icon: FiHeart, title: 'Made with care', desc: 'A small team obsessing over the details most stores skip.' },
];

const About = () => (
  <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

    <div className="mb-12 text-center">
      <h1 className="font-display text-4xl font-bold text-ink-900 dark:text-white">About NovaMarket</h1>
      <p className="mx-auto mt-4 max-w-2xl text-ink-600 dark:text-ink-300">
        NovaMarket started as a simple idea: shopping online should feel like finding a
        genuinely good deal, not hunting through fine print for one. We built a storefront
        where every product carries its own coupon, in plain sight, no loyalty program required.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {VALUES.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="card-surface flex gap-4 p-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-marigold-100 text-marigold-600 dark:bg-marigold-400/10 dark:text-marigold-300">
            <Icon size={18} />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{desc}</p>
          </div>
        </div>
      ))}
    </div>

    <section className="mt-14 rounded-2xl bg-ink-700 p-8 text-center text-white dark:bg-ink-800">
      <h2 className="font-display text-2xl font-bold">Shipping &amp; returns</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-ink-200">
        Free shipping on orders over $75, flat $6.99 otherwise. Not the right fit? Every
        order qualifies for a 30-day, no-questions-asked return.
      </p>
    </section>
  </div>
);

export default About;
