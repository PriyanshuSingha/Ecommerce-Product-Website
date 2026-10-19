import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import StarRating from './StarRating';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, getOriginalPrice, truncate, titleCase } from '../utils/format';
import { getDiscountForProduct } from '../utils/coupons';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const discount = product.discount || 0;
  const original = product.price + (product.price * discount / 100);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product?._id) {
      console.error('Invalid product:', product);
      return;
    }
    addToCart(product, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="card-surface group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden bg-white p-6 dark:bg-white/5">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-marigold-400 px-2.5 py-1 text-xs font-bold text-ink-900 shadow">
          {discount}% OFF
        </span>
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-500 shadow transition-colors hover:text-red-500 dark:bg-ink-900/80 dark:text-ink-300"
        >
          <FiHeart className={wishlisted ? 'fill-red-500 text-red-500' : ''} size={15} />
        </button>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-marigold-600 dark:text-marigold-300">
          {titleCase(product.category)}
        </span>
        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink-800 dark:text-ink-50">
          {truncate(product.name, 60)}
        </h3>
        <StarRating rate={product.rating?.rate} count={product.rating?.count} size="text-xs" />

        <div className="perforation mt-auto pt-3">
          <div className="flex items-end justify-between pt-3">
            <div className="flex flex-col">
              <span className="price-tag text-xs text-ink-400 line-through">{formatPrice(original)}</span>
              <span className="price-tag text-lg font-semibold text-ink-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
            </div>
            <button
              onClick={handleAdd}
              aria-label="Add to cart"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-700 text-white transition-transform hover:scale-105 active:scale-95 dark:bg-marigold-400 dark:text-ink-900"
            >
              <FiShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
