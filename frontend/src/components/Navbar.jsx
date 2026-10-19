import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMenu, FiX, FiSearch, FiPackage, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setQuery('');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-marigold-500 ${
      isActive ? 'text-marigold-500' : 'text-ink-600 dark:text-ink-200'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-canvas-light/90 backdrop-blur-md dark:border-ink-800 dark:bg-canvas-dark/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-ink-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-700 text-marigold-300 dark:bg-marigold-400 dark:text-ink-900">
            N
          </span>
          Nova<span className="text-marigold-500">Market</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Toggle search"
            className="btn-ghost hidden h-9 w-9 p-0 sm:flex"
          >
            <FiSearch size={17} />
          </button>

          <Link to="/wishlist" aria-label="Wishlist" className="btn-ghost relative hidden h-9 w-9 p-0 sm:flex">
            <FiHeart size={17} />
            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-marigold-400 text-[10px] font-bold text-ink-900">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/orders" aria-label="Orders" className="btn-ghost hidden h-9 w-9 p-0 sm:flex">
            <FiPackage size={17} />
          </Link>

          {currentUser ? (
            <>
              {currentUser.role === 'admin' && (
                <Link to="/admin" aria-label="Admin Dashboard" className="btn-ghost hidden h-9 w-9 p-0 sm:flex text-marigold-500">
                  <FiSettings size={17} />
                </Link>
              )}
              <Link to="/profile" aria-label="Profile" className="btn-ghost hidden h-9 w-9 p-0 sm:flex">
                <FiUser size={17} />
              </Link>
              <button onClick={logout} aria-label="Logout" className="btn-ghost hidden h-9 w-9 p-0 sm:flex">
                <FiLogOut size={17} />
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm font-medium hover:text-marigold-500 hidden sm:block mx-2">
              Login
            </Link>
          )}

          <Link to="/cart" aria-label="Cart" className="btn-ghost relative h-9 w-9 p-0">
            <FiShoppingCart size={17} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 animate-pop items-center justify-center rounded-full bg-marigold-400 text-[10px] font-bold text-ink-900">
                {cartCount}
              </span>
            )}
          </Link>

          <ThemeToggle />

          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Toggle menu"
            className="btn-ghost h-9 w-9 p-0 md:hidden"
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-ink-100 px-4 py-3 dark:border-ink-800 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-xl gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search NovaMarket\u2026"
              className="input-field"
            />
            <button type="submit" className="btn-primary">
              Go
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink-100 px-4 py-3 dark:border-ink-800 md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/wishlist" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800">
            Wishlist ({wishlist.length})
          </NavLink>
          <NavLink to="/orders" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800">
            Orders
          </NavLink>
          {currentUser ? (
            <>
              <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800">
                Profile
              </NavLink>
              {currentUser.role === 'admin' && (
                <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-marigold-500 hover:bg-ink-100 dark:hover:bg-ink-800">
                  Admin Dashboard
                </NavLink>
              )}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800">
              Login
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
