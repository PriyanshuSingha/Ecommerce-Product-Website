import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from '../api/cartApi';

const CartContext = createContext(null);

const validCartItems = (items = []) => items.filter((item) => item?.product?._id);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]); // This could also be fetched from backend if needed
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [currentUser]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      if (data && data.data && data.data.items) {
        setItems(data.data.items.filter((item) => item.product));
      }
    } catch (error) {
      console.error('Error loading cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, couponCode = null) => {
    if (!currentUser) {
      toast.error('Please login to add to cart');
      return;
    }
    if (!product?._id) {
      toast.error('This product is no longer available');
      return;
    }
    try {
      const data = await apiAddToCart(product._id, quantity, couponCode);
      if (data && data.data && data.data.items) {
        setItems(validCartItems(data.data.items));
        toast.success(`${product.name} added to cart`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return;
    try {
      const data = await apiRemoveFromCart(productId);
      if (data && data.data && data.data.items) {
        setItems(validCartItems(data.data.items));
        toast.info('Removed from cart');
      }
    } catch (error) {
      toast.error('Failed to remove from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!currentUser || quantity < 1) return;
    try {
      const data = await updateCartItem(productId, quantity);
      if (data && data.data && data.data.items) {
        setItems(validCartItems(data.data.items));
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const increaseQty = (productId) => {
    const item = items.find(i => i?.product?._id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const decreaseQty = (productId) => {
    const item = items.find(i => i?.product?._id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;
    try {
      await apiClearCart();
      setItems([]);
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const placeOrder = (orderDetails) => {
    // For now we simulate placeOrder, but usually it calls backend /api/orders
    // and clears cart. We'll handle placeOrder in Checkout component properly
    clearCart();
    return orderDetails;
  };

  const cartSummary = useMemo(() => {
    let subtotal = 0;
    let discountTotal = 0;

    items.forEach((item) => {
      const product = item.product;
      if (!product) return;
      const lineSubtotal = product.price * item.quantity;
      subtotal += lineSubtotal;
      
      // Calculate discount from product.discount or applied coupon
      if (product.discount) {
         discountTotal += (product.price * (product.discount / 100)) * item.quantity;
      }
      // If there's an applied coupon code stored in item.couponCode we would ideally
      // have validated it in the backend and apply it here or backend provides total.
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
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQty,
    decreaseQty,
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
