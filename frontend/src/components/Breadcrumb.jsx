import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

/**
 * @param {{ label: string, to?: string }[]} trail
 */
const Breadcrumb = ({ trail }) => (
  <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-ink-500 dark:text-ink-400">
    {trail.map((crumb, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <FiChevronRight size={12} />}
        {crumb.to ? (
          <Link to={crumb.to} className="hover:text-marigold-500 hover:underline">
            {crumb.label}
          </Link>
        ) : (
          <span className="font-medium text-ink-700 dark:text-ink-200">{crumb.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
