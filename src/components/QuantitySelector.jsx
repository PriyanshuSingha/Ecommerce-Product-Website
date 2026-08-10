import { FiMinus, FiPlus } from 'react-icons/fi';

const QuantitySelector = ({ quantity, onIncrease, onDecrease, min = 1, size = 'md' }) => {
  const pad = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';

  return (
    <div className="flex items-center gap-2 rounded-lg border border-ink-200 dark:border-ink-700">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={`${pad} flex items-center justify-center rounded-l-lg text-ink-600 transition-colors hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-ink-300 dark:hover:bg-ink-800`}
      >
        <FiMinus size={13} />
      </button>
      <span className="w-6 text-center text-sm font-semibold text-ink-900 dark:text-white">{quantity}</span>
      <button
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={`${pad} flex items-center justify-center rounded-r-lg text-ink-600 transition-colors hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800`}
      >
        <FiPlus size={13} />
      </button>
    </div>
  );
};

export default QuantitySelector;
