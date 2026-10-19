import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiTag } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import { ProductGridSkeleton } from '../components/Loader';
import ErrorState from '../components/ErrorState';
import { useProducts } from '../context/ProductContext';

const PERKS = [
  { icon: FiTruck, title: 'Free shipping over $75', desc: 'Flat-rate elsewhere' },
  { icon: FiTag, title: 'Coupon on every item', desc: 'Codes on each product page' },
  { icon: FiRefreshCw, title: '30-day returns', desc: 'No questions asked' },
  { icon: FiShield, title: 'Secure checkout', desc: 'Your data stays yours' },
];

const Home = () => {
  const { featured, bestSellers, loading, error, retry, recentlyViewed } = useProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-700 dark:bg-ink-900">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,_#F2A93B_0,_transparent_35%),radial-gradient(circle_at_80%_60%,_#F2A93B_0,_transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
          <div className="flex flex-col justify-center gap-5 animate-slideUp">
            <span className="w-fit rounded-full border border-marigold-400/40 bg-marigold-400/10 px-3 py-1 text-xs font-semibold text-marigold-300">
              New season, new coupons
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Shop smarter. <br className="hidden sm:block" />
              <span className="text-marigold-300">Clip the discount.</span>
            </h1>
            <p className="max-w-md text-ink-200">
              Every product on NovaMarket comes with its own coupon code hiding on the
              product page. Find it, apply it, keep the difference.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/products" className="btn-primary bg-marigold-400 text-ink-900 hover:bg-marigold-300">
                Shop all products <FiArrowRight />
              </Link>
              <Link to="/products?sort=rating" className="btn-secondary border-white/20 bg-transparent text-white hover:bg-white/10">
                Top rated picks
              </Link>
            </div>
          </div>
          <div className="hidden items-center justify-center md:flex">
            <div className="grid grid-cols-2 gap-4">
              {(featured.slice(0, 4)).map((p, i) => (
                <div
                  key={p._id}
                  className={`animate-fadeIn rounded-2xl bg-white/95 p-4 shadow-xl ${i % 2 === 1 ? 'mt-8' : ''}`}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <img src={p.image} alt={p.name} className="h-20 w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-surface flex flex-col items-start gap-2 p-4">
              <Icon className="text-marigold-500" size={20} />
              <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">{title}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Featured picks</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400">Top-rated finds across every category</p>
          </div>
          <Link to="/products" className="hidden items-center gap-1 text-sm font-medium text-marigold-600 hover:underline sm:flex">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {loading && <ProductGridSkeleton count={8} />}
        {error && <ErrorState message={error} onRetry={retry} />}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Discount banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-marigold-400 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-display text-2xl font-bold text-ink-900">Up to 25% off, per item</p>
            <p className="text-sm text-ink-800/80">Every product page has its own unique coupon code waiting to be applied.</p>
          </div>
          <Link to="/products" className="btn-primary bg-ink-900 text-white hover:bg-ink-800">
            Start shopping
          </Link>
        </div>
      </section>

      {/* Best sellers */}
      {!loading && !error && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-white">Best sellers</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-white">Recently viewed</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recentlyViewed.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Newsletter />
      </section>
    </div>
  );
};

export default Home;
