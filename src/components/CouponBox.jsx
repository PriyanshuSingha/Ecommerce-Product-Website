import { useState } from 'react';
import { FiTag, FiCheck, FiX } from 'react-icons/fi';
import { validateCoupon, applyDiscount } from '../utils/coupons';
import { formatPrice } from '../utils/format';

/**
 * Ticket-styled coupon input for a single product/cart line.
 * Renders success/error feedback and the resulting price breakdown.
 */
const CouponBox = ({ productId, price, appliedCoupon, onApply }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);

  const handleApply = (e) => {
    e.preventDefault();
    const outcome = validateCoupon(productId, code);
    setResult(outcome);
    if (outcome.valid) {
      onApply?.({ code: code.trim().toUpperCase(), discountPercent: outcome.discount });
    }
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
    onApply?.(null);
  };

  const breakdown = appliedCoupon ? applyDiscount(price, appliedCoupon.discountPercent) : null;

  return (
    <div className="rounded-xl border border-dashed border-marigold-400 bg-marigold-50 p-4 dark:border-marigold-400/50 dark:bg-marigold-400/10">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-marigold-700 dark:text-marigold-300">
        <FiTag /> Have a coupon for this item?
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <FiCheck className="text-green-600" />
            <span className="price-tag font-semibold text-ink-800 dark:text-ink-100">{appliedCoupon.code}</span>
            <span className="text-ink-500 dark:text-ink-400">applied ({appliedCoupon.discountPercent}% off)</span>
          </div>
          <button onClick={handleClear} className="text-xs font-medium text-ink-500 underline hover:text-red-500">
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="input-field price-tag flex-1 bg-white py-2 text-sm dark:bg-surface-dark"
          />
          <button type="submit" className="btn-primary py-2 text-sm">
            Apply
          </button>
        </form>
      )}

      {result && !result.valid && (
        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-500">
          <FiX /> {result.message}
        </p>
      )}

      {breakdown && (
        <dl className="mt-3 space-y-1 border-t border-marigold-400/30 pt-3 text-xs">
          <div className="flex justify-between text-ink-600 dark:text-ink-300">
            <dt>Original price</dt>
            <dd className="price-tag">{formatPrice(price)}</dd>
          </div>
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <dt>Discount ({appliedCoupon.discountPercent}%)</dt>
            <dd className="price-tag">-{formatPrice(breakdown.discountAmount)}</dd>
          </div>
          <div className="flex justify-between font-semibold text-ink-900 dark:text-white">
            <dt>Final price</dt>
            <dd className="price-tag">{formatPrice(breakdown.finalPrice)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
};

export default CouponBox;
