import api from './axios';

export const fetchAllProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data.data.products; // Returns the array of products from the new API
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};

export const fetchCategories = async () => {
  // We can derive categories from products in context or just have a static list
  // since our backend doesn't have a specific /categories endpoint currently.
  // Alternatively we can add one. Let's return a static list or fetch from products.
  return ["Electronics", "Clothing", "Footwear", "Accessories", "Home", "Sports"];
};

export const fetchProductsByCategory = async (category) => {
  const { data } = await api.get(`/products/category/${category}`);
  return data.data;
};

export const applyCoupon = async (id, couponCode) => {
  const { data } = await api.post(`/products/${id}/apply-coupon`, { couponCode });
  return data;
};

// Admin
export const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};
