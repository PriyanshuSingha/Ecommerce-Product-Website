import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <FiHeart className="text-ink-300 dark:text-ink-600" size={48} />
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Your wishlist is empty</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Tap the heart on any product to save it here for later.
        </p>
        <Link to="/products" className="btn-primary mt-2">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">
        Your Wishlist <span className="text-ink-400">({wishlist.length})</span>
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
