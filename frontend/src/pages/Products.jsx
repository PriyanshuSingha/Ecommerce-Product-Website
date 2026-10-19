import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Loader';
import ErrorState from '../components/ErrorState';
import { useProducts } from '../context/ProductContext';

const PAGE_SIZE = 8;

const Products = () => {
  const { products, categories, loading, error, retry } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'default');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Keep the URL in sync so filters are shareable / back-button friendly.
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'all') params.category = category;
    if (sortBy !== 'default') params.sort = sortBy;
    setSearchParams(params, { replace: true });
    setVisibleCount(PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sortBy]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return list;
  }, [products, category, search, sortBy]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Shop all products</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {loading ? 'Loading catalog\u2026' : `${filtered.length} product${filtered.length === 1 ? '' : 's'} found`}
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      <div className="mb-8">
        <Filters
          categories={categories}
          activeCategory={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {loading && <ProductGridSkeleton count={8} />}
      {error && <ErrorState message={error} onRetry={retry} />}

      {!loading && !error && filtered.length === 0 && (
        <ErrorState message="No products match your search. Try a different keyword or category." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="btn-secondary">
                Load more products
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
