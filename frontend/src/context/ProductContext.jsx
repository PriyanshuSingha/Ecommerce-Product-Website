import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAllProducts } from '../api/productApi';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('novamarket_recent')) || [];
    } catch {
      return [];
    }
  });

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      setError('We couldn\u2019t load products right now. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  const addRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p._id !== product._id);
      const next = [product, ...filtered].slice(0, 6);
      localStorage.setItem('novamarket_recent', JSON.stringify(next));
      return next;
    });
  };

  const getProductById = (id) => products.find((p) => String(p._id) === String(id));

  const bestSellers = useMemo(
    () => [...products].sort((a, b) => b.rating?.count - a.rating?.count).slice(0, 4),
    [products]
  );

  const featured = useMemo(
    () => [...products].sort((a, b) => b.rating?.rate - a.rating?.rate).slice(0, 8),
    [products]
  );

  const value = {
    products,
    loading,
    error,
    categories,
    retry: loadProducts,
    getProductById,
    recentlyViewed,
    addRecentlyViewed,
    bestSellers,
    featured,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
};
