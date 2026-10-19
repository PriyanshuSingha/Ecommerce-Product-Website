import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from '../api/wishlistApi';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadWishlist();
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      if (data && data.data && data.data.products) {
        setWishlist(data.data.products);
      }
    } catch (error) {
      console.error('Error loading wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const isWishlisted = (productId) => wishlist.some((item) => item._id === productId);

  const toggleWishlist = async (product) => {
    if (!currentUser) {
      toast.error('Please login to use wishlist');
      return;
    }
    
    const exists = isWishlisted(product._id);
    
    try {
      if (exists) {
        const data = await apiRemoveFromWishlist(product._id);
        if (data && data.data && data.data.products) {
          setWishlist(data.data.products);
        }
        toast.info('Removed from wishlist');
      } else {
        const data = await apiAddToWishlist(product._id);
        if (data && data.data && data.data.products) {
           // Reload full objects or assume data.data.products is populated if backend populates it
           // Since backend might just return IDs if not populated after push, we'll reload it
           loadWishlist();
        }
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;
    try {
      await apiRemoveFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist');
    }
  };

  const value = { wishlist, loading, isWishlisted, toggleWishlist, removeFromWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
