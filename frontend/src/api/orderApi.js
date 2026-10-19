import api from './axios';

export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

export const createPaymentOrder = async (amount) => {
  const { data } = await api.post('/orders/payment/create', { amount });
  return data;
};

export const verifyPayment = async (paymentData) => {
  const { data } = await api.post('/orders/payment/verify', paymentData);
  return data;
};

export const getMyOrders = async () => {
  const { data } = await api.get('/orders');
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

// Admin
export const getAllOrders = async () => {
  const { data } = await api.get('/orders/admin');
  return data;
};

export const updateOrderStatus = async (id, orderStatus) => {
  const { data } = await api.put(`/orders/${id}/status`, { orderStatus });
  return data;
};
