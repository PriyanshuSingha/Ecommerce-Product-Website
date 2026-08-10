import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import Breadcrumb from '../components/Breadcrumb';
import StarRating from '../components/StarRating';
import QuantitySelector from '../components/QuantitySelector';
import CouponBox from '../components/CouponBox';
import ProductCard from '../components/ProductCard';
import { Spinner } from '../components/Loader';
import ErrorState from '../components/ErrorState';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchProductById } from '../api/productApi';
import { formatPrice, getOriginalPrice, titleCase } from '../utils/format';
import { applyDiscount } from '../utils/coupons';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, getProductById, addRecentlyViewed } = useProducts();
  const { addToCart, applyCouponToItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(() => getProductById(id));
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [coupon, setCoupon] = useState(null);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let cancelled = false;
    setCoupon(null);
    setQuantity(1);

    const load = async () => {
      const cached = getProductById(id);
      if (cached) {
        setProduct(cached);
        setLoading(false);
        addRecentlyViewed(cached);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id);
        if (!cancelled) {
          setProduct(data);
          addRecentlyViewed(data);
        }
      } catch (err) {
        if (!axios.isCancel(err) && !cancelled) {
          setError('We couldn\u2019t load this product. It may no longer exist.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Spinner label="Loading product" />;
  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message={error || 'Product not found.'} />
        <div className="mt-4 text-center">
          <Link to="/products" className="btn-secondary">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const original = getOriginalPrice(product.price);
  const priceAfterCoupon = coupon ? applyDiscount(product.price, coupon.discountPercent).finalPrice : product.price;

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleZoomMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Carry a coupon already validated on this page straight into the cart line.
    if (coupon) applyCouponToItem(product.id, coupon);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        trail={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/products' },
          { label: titleCase(product.category), to: `/products?category=${product.category}` },
          { label: product.title.slice(0, 40) },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div
            className="card-surface relative aspect-square cursor-zoom-in overflow-hidden bg-white p-10 dark:bg-white/5"
            onMouseEnter={() => setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
            onMouseMove={handleZoomMove}
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain transition-transform duration-150"
              style={
                zoomActive
                  ? { transform: 'scale(1.8)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
            />
            {!zoomActive && (
              <span className="absolute bottom-3 right-3 rounded-full bg-ink-900/70 px-2.5 py-1 text-[11px] font-medium text-white">
                Hover to zoom
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-surface aspect-square bg-white p-3 dark:bg-white/5">
                <img src={product.image} alt="" className="h-full w-full object-contain opacity-80" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full bg-marigold-100 px-3 py-1 text-xs font-semibold text-marigold-700 dark:bg-marigold-400/10 dark:text-marigold-300">
            {titleCase(product.category)}
          </span>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white sm:text-3xl">
            {product.title}
          </h1>
          <StarRating rate={product.rating?.rate} count={product.rating?.count} />

          <div className="flex items-end gap-3">
            <span className="price-tag text-3xl font-bold text-ink-900 dark:text-white">
              {formatPrice(coupon ? priceAfterCoupon : product.price)}
            </span>
            <span className="price-tag text-lg text-ink-400 line-through">{formatPrice(original)}</span>
            {coupon && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-400/10 dark:text-green-400">
                Coupon applied
              </span>
            )}
          </div>

          <p className="leading-relaxed text-ink-600 dark:text-ink-300">{product.description}</p>

          <CouponBox
            productId={product.id}
            price={product.price}
            appliedCoupon={coupon}
            onApply={setCoupon}
          />

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <span className="text-sm font-medium text-ink-600 dark:text-ink-300">Quantity</span>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => setQuantity((q) => q + 1)}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={handleAddToCart} className="btn-primary flex-1 sm:flex-none sm:px-8">
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`btn-secondary ${wishlisted ? 'border-red-300 text-red-500' : ''}`}
            >
              <FiHeart className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
              {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-ink-100 pt-4 dark:border-ink-800 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
              <FiTruck className="text-marigold-500" /> Ships in 2-4 days
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
              <FiRefreshCw className="text-marigold-500" /> 30-day returns
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
              <FiShield className="text-marigold-500" /> Secure checkout
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <section className="mt-14">
        <h2 className="mb-4 font-display text-xl font-bold text-ink-900 dark:text-white">Specifications</h2>
        <dl className="card-surface grid grid-cols-1 divide-y divide-ink-100 dark:divide-ink-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {[
            ['Category', titleCase(product.category)],
            ['Rating', `${product.rating?.rate ?? '\u2013'} / 5`],
            ['Reviews', product.rating?.count ?? '\u2013'],
            ['SKU', `NM-${product.id.toString().padStart(4, '0')}`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between px-5 py-3 text-sm">
              <span className="text-ink-500 dark:text-ink-400">{label}</span>
              <span className="font-medium text-ink-900 dark:text-white">{value}</span>
            </div>
          ))}
        </dl>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-display text-xl font-bold text-ink-900 dark:text-white">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
