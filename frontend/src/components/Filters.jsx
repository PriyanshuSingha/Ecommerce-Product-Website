import { titleCase } from '../utils/format';

export const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

const Filters = ({ categories, activeCategory, onCategoryChange, sortBy, onSortChange }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
            activeCategory === cat
              ? 'border-ink-700 bg-ink-700 text-white dark:border-marigold-400 dark:bg-marigold-400 dark:text-ink-900'
              : 'border-ink-200 text-ink-600 hover:border-ink-400 dark:border-ink-700 dark:text-ink-300 dark:hover:border-ink-500'
          }`}
        >
          {cat === 'all' ? 'All Categories' : titleCase(cat)}
        </button>
      ))}
    </div>

    <label className="flex items-center gap-2 text-sm">
      <span className="text-ink-500 dark:text-ink-400">Sort by</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="input-field w-auto py-1.5"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  </div>
);

export default Filters;
