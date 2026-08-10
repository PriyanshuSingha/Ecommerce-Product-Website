import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/products' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Cart', to: '/cart' },
      { label: 'Orders', to: '/orders' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping Info', to: '/about' },
      { label: 'Returns', to: '/about' },
      { label: 'FAQ', to: '/contact' },
    ],
  },
];

const SOCIALS = [
  { icon: FiInstagram, label: 'Instagram' },
  { icon: FiTwitter, label: 'Twitter' },
  { icon: FiFacebook, label: 'Facebook' },
  { icon: FiYoutube, label: 'YouTube' },
];

const Footer = () => (
  <footer className="mt-20 border-t border-ink-100 bg-white dark:border-ink-800 dark:bg-surface-dark">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/" className="font-display text-lg font-bold text-ink-900 dark:text-white">
            Nova<span className="text-marigold-500">Market</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-ink-500 dark:text-ink-400">
            Everyday finds, honest prices, and coupons worth clipping.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition-colors hover:bg-marigold-400 hover:text-ink-900 dark:bg-ink-800 dark:text-ink-300"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold text-ink-900 dark:text-white">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-500 transition-colors hover:text-marigold-500 dark:text-ink-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="perforation mt-10 pt-6 text-center text-xs text-ink-400 dark:text-ink-500">
        <p className="pt-4">© {new Date().getFullYear()} NovaMarket. Built as a demo storefront on the Fake Store API.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
