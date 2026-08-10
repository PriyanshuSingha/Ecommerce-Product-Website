import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { readStorage, writeStorage } from '../utils/format';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'novamarket_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => readStorage(STORAGE_KEY, []));

  useEffect(() => {
    writeStorage(STORAGE_KEY, wishlist);
  }, [wishlist]);

  const isWishlisted = (productId) => wishlist.some((item) => item.id === productId);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        toast.info('Removed from wishlist');
        return prev.filter((item) => item.id !== product.id);
      }
      toast.success('Added to wishlist');
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const value = { wishlist, isWishlisted, toggleWishlist, removeFromWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
