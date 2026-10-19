import { Link } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi';

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
    <FiCompass className="text-marigold-400" size={48} />
    <h1 className="font-display text-6xl font-bold text-ink-900 dark:text-white">404</h1>
    <p className="font-display text-xl font-semibold text-ink-800 dark:text-ink-100">Page not found</p>
    <p className="text-sm text-ink-500 dark:text-ink-400">
      The page you\u2019re looking for doesn\u2019t exist, or the coupon on it expired a long time ago.
    </p>
    <Link to="/" className="btn-primary mt-2">
      Back to home
    </Link>
  </div>
);

export default NotFound;
