/**
 * Format the backend's product and order amounts as Indian Rupees.
 */
const USD_TO_INR_RATE = 83; // adjust if you want a different conversion rate

export const convertToINR = (usdValue, rate = USD_TO_INR_RATE) => Number((usdValue || 0) * rate);

export const formatPrice = (value, { convertFromUSD = false, rate = USD_TO_INR_RATE } = {}) => {
  const amount = convertFromUSD ? convertToINR(value, rate) : (value || 0);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

/**
 * Fake Store API prices are already "discounted-looking" floats. We derive
 * a synthetic "original" price by marking it up, so the UI always has a
 * strike-through original price and a lower everyday price to show, on top
 * of whatever coupon discount is applied.
 */
export const getOriginalPrice = (price) => Number((price * 1.25).toFixed(2));

/**
 * Read a JSON value from localStorage safely.
 */
export const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Could not read "${key}" from storage`, err);
    return fallback;
  }
};

/**
 * Write a JSON value to localStorage safely.
 */
export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not write "${key}" to storage`, err);
  }
};

/**
 * Truncate a string to a max length, appending an ellipsis when cut.
 */
export const truncate = (str, max = 80) =>
  str && str.length > max ? `${str.slice(0, max).trim()}\u2026` : str;

/**
 * Title-case a slug like "men's clothing" -> "Men's Clothing"
 */
export const titleCase = (str) =>
  (str || '')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
