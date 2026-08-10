import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { readStorage, writeStorage } from '../utils/format';
import { applyDiscount } from '../utils/coupons';

const CartContext = createContext(null);
const STORAGE_KEY = 'novamarket_cart';
const ORDERS_KEY = 'novamarket_orders';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStorage(STORAGE_KEY, []));
  const [orders, setOrders] = useState(() => readStorage(ORDERS_KEY, []));

  useEffect(() => {
    writeStorage(STORAGE_KEY, items);
  }, [items]);

  useEffect(() => {
    writeStorage(ORDERS_KEY, orders);
  }, [orders]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          category: product.category,
          quantity,
          coupon: null, // { code, discountPercent } once applied for this line
        },
      ];
    });
    toast.success(`${product.title.slice(0, 32)}${product.title.length > 32 ? '\u2026' : ''} added to cart`);
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    toast.info('Removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const increaseQty = (productId) => {
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQty = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const applyCouponToItem = (productId, coupon) => {
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, coupon } : item))
    );
  };

  const clearCart = () => setItems([]);

  const placeOrder = (orderDetails) => {
    const order = {
      id: `NM-${Date.now()}`,
      date: new Date().toISOString(),
      items,
      total: cartSummary.total,
      ...orderDetails,
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const cartSummary = useMemo(() => {
    let subtotal = 0;
    let discountTotal = 0;

    items.forEach((item) => {
      const lineSubtotal = item.price * item.quantity;
      subtotal += lineSubtotal;
      if (item.coupon?.discountPercent) {
        const { discountAmount } = applyDiscount(lineSubtotal, item.coupon.discountPercent);
        discountTotal += discountAmount;
      }
    });

    const shipping = items.length === 0 ? 0 : subtotal - discountTotal > 75 ? 0 : 6.99;
    const total = Number((subtotal - discountTotal + shipping).toFixed(2));

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discountTotal: Number(discountTotal.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total,
    };
  }, [items]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQty,
    decreaseQty,
    applyCouponToItem,
    clearCart,
    cartSummary,
    cartCount,
    orders,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
