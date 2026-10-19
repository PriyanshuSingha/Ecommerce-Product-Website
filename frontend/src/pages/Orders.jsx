import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPackage, FiCheckCircle } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';
import { formatPrice } from '../utils/format';
import { getMyOrders } from '../api/orderApi';
import { Spinner } from '../components/Loader';

const PAYMENT_LABELS = { 'Credit Card': 'Credit Card', 'UPI': 'UPI', 'Cash on Delivery': 'Cash on Delivery', card: 'Credit Card', upi: 'UPI', cod: 'Cash on Delivery' };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.data || []);
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Spinner label="Loading orders" />;

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <FiPackage className="text-ink-300 dark:text-ink-600" size={48} />
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">No orders yet</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Orders you place at checkout will show up here.
        </p>
        <Link to="/products" className="btn-primary mt-2">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Orders' }]} />
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">Your Orders</h1>

      {justPlaced && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
          <FiCheckCircle size={18} />
          Order {justPlaced} was placed successfully. A confirmation has been \u201csent\u201d to your email.
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order) => (
          <div key={order._id} className="card-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 pb-4 dark:border-ink-800">
              <div>
                <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">Order {order._id}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  {new Date(order.createdAt).toLocaleString()} &middot; {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                'bg-marigold-100 text-marigold-700'
              }`}>
                {order.orderStatus || 'Confirmed'}
              </span>
            </div>

            <ul className="space-y-3">
              {order.products.map((item) => (
                <li key={item._id} className="flex items-center gap-3 text-sm">
                  <img src={item.product?.image} alt="" className="h-10 w-10 rounded-md bg-white object-contain p-1 dark:bg-white/10" />
                  <span className="flex-1 text-ink-700 dark:text-ink-200">
                    {item.product?.name} <span className="text-ink-400">&times;{item.quantity}</span>
                  </span>
                  <span className="price-tag text-ink-600 dark:text-ink-300">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between border-t border-ink-100 pt-4 text-sm font-semibold text-ink-900 dark:border-ink-800 dark:text-white">
              <span>Total paid</span>
              <span className="price-tag">{formatPrice(order.totalAmount)}</span>
            </div>

            {order.shippingAddress && (
              <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
                Shipping to {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
