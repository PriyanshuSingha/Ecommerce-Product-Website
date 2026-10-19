// Each product in the catalog is deterministically assigned exactly one
// coupon code. The Fake Store API has 20 products (ids 1-20); discounts
// rotate through the four tiers from the spec so every product still maps
// to a SAVE10 / SAVE15 / SAVE20 / SAVE25-style code, just scoped to itself
// via a product-id suffix (e.g. "SAVE10-1").

const DISCOUNT_TIERS = [10, 20, 15, 25];

/**
 * Get the discount percentage assigned to a given product id.
 * @param {number|string} productId
 * @returns {number} whole-number percentage, e.g. 15 for 15%
 */
export const getDiscountForProduct = (productId) => {
  const id = Number(productId) || 0;
  return DISCOUNT_TIERS[id % DISCOUNT_TIERS.length];
};

/**
 * Get the coupon code assigned to a given product id.
 * @param {number|string} productId
 * @returns {string} e.g. "SAVE10-1"
 */
export const getCouponCodeForProduct = (productId) => {
  const discount = getDiscountForProduct(productId);
  return `SAVE${discount}-${productId}`;
};

/**
 * Validate a user-entered coupon code against a specific product.
 * @param {number|string} productId
 * @param {string} code
 * @returns {{ valid: boolean, discount: number, message: string }}
 */
export const validateCoupon = (productId, code) => {
  const trimmed = (code || '').trim().toUpperCase();
  const expected = getCouponCodeForProduct(productId);

  if (!trimmed) {
    return { valid: false, discount: 0, message: 'Enter a coupon code to apply a discount.' };
  }

  if (trimmed === expected) {
    const discount = getDiscountForProduct(productId);
    return { valid: true, discount, message: `Coupon applied — ${discount}% off this item.` };
  }

  return { valid: false, discount: 0, message: 'That code isn\u2019t valid for this product.' };
};

/**
 * Calculate the final price after a percentage discount.
 * @param {number} price
 * @param {number} discountPercent
 */
export const applyDiscount = (price, discountPercent) => {
  const amount = (price * discountPercent) / 100;
  return {
    discountAmount: Number(amount.toFixed(2)),
    finalPrice: Number((price - amount).toFixed(2)),
  };
};
