import axios from 'axios';

const BASE_URL = 'https://fakestoreapi.com';

// Single shared axios instance so timeouts / headers stay consistent
// across every call the app makes to the Fake Store API.
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Fetch every product in the catalog.
 * @returns {Promise<Array>} raw product list from the API
 */
export const fetchAllProducts = async () => {
  const { data } = await client.get('/products');
  return data;
};

/**
 * Fetch a single product by id.
 * @param {string|number} id
 */
export const fetchProductById = async (id) => {
  const { data } = await client.get(`/products/${id}`);
  return data;
};

/**
 * Fetch the list of available categories.
 */
export const fetchCategories = async () => {
  const { data } = await client.get('/products/categories');
  return data;
};

/**
 * Fetch products belonging to a single category.
 * @param {string} category
 */
export const fetchProductsByCategory = async (category) => {
  const { data } = await client.get(`/products/category/${category}`);
  return data;
};

export default client;
