import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';
import QuantitySelector from '../components/QuantitySelector';
import CouponBox from '../components/CouponBox';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { applyDiscount } from '../utils/coupons';

const Cart = () => {
  const { items, removeFromCart, increaseQty, decreaseQty, cartSummary } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <FiShoppingBag className="text-ink-300 dark:text-ink-600" size={48} />
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Your cart is empty</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Browse the catalog and add something worth clipping a coupon for.
        </p>
        <Link to="/products" className="btn-primary mt-2">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;
            const lineSubtotal = product.price * item.quantity;
            const breakdown = product.discount
              ? { finalPrice: lineSubtotal - (lineSubtotal * product.discount / 100) }
              : null;

            return (
              <div key={item._id} className="card-surface flex flex-col gap-4 p-4 sm:flex-row">
                <Link to={`/products/${product._id}`} className="h-24 w-24 flex-shrink-0 rounded-lg bg-white p-2 dark:bg-white/5">
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                </Link>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/products/${product._id}`} className="font-display text-sm font-semibold text-ink-900 hover:text-marigold-600 dark:text-white">
                      {product.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(product._id)}
                      aria-label="Remove item"
                      className="text-ink-400 hover:text-red-500"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() => increaseQty(product._id)}
                      onDecrease={() => decreaseQty(product._id)}
                      size="sm"
                    />
                    <div className="text-right">
                      {breakdown ? (
                        <>
                          <p className="price-tag text-xs text-ink-400 line-through">{formatPrice(lineSubtotal)}</p>
                          <p className="price-tag text-base font-semibold text-ink-900 dark:text-white">
                            {formatPrice(breakdown.finalPrice)}
                          </p>
                        </>
                      ) : (
                        <p className="price-tag text-base font-semibold text-ink-900 dark:text-white">
                          {formatPrice(lineSubtotal)}
                        </p>
                      )}
                    </div>
                  </div>

                  <CouponBox
                    productId={product._id}
                    price={product.price}
                    appliedCoupon={item.couponCode ? { code: item.couponCode, discountPercent: product.discount } : null}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="card-surface h-fit space-y-4 p-6">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">Order Summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-ink-600 dark:text-ink-300">
              <dt>Subtotal</dt>
              <dd className="price-tag">{formatPrice(cartSummary.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <dt>Coupon savings</dt>
              <dd className="price-tag">-{formatPrice(cartSummary.discountTotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-600 dark:text-ink-300">
              <dt>Shipping</dt>
              <dd className="price-tag">{cartSummary.shipping === 0 ? 'Free' : formatPrice(cartSummary.shipping)}</dd>
            </div>
            <div className="perforation" />
            <div className="flex justify-between pt-3 text-base font-bold text-ink-900 dark:text-white">
              <dt>Total</dt>
              <dd className="price-tag">{formatPrice(cartSummary.total)}</dd>
            </div>
          </dl>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full">
            Checkout <FiArrowRight />
          </button>
          <Link to="/products" className="block text-center text-xs font-medium text-ink-500 hover:text-marigold-600 dark:text-ink-400">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
