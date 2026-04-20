import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetProductsQuery, useGetTopProductsQuery } from '../slices/productsApiSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { FaChevronLeft, FaChevronRight, FaFire, FaSlidersH, FaTimes } from 'react-icons/fa';
import Rating from '../components/Rating';

const CATEGORIES = ['All', 'Electronics', 'Computers', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Toys & Games', 'Beauty', 'Automotive', 'Health'];

const HomeScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';

  const { data, isLoading, error } = useGetProductsQuery({
    keyword, category, page, sort, minPrice, maxPrice, rating,
  });
  const { data: topProducts } = useGetTopProductsQuery();

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') {
      params.delete('page');
    }
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = keyword || category || sort || minPrice || maxPrice || rating;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero banner (only on homepage) */}
      {!keyword && !category && (
        <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-amazon-blue-dark via-amazon-blue to-amazon-blue-light h-52 sm:h-72 flex items-center px-8 sm:px-16">
          <div className="relative z-10">
            <p className="text-amazon font-semibold text-sm mb-1 uppercase tracking-widest">Welcome to</p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">Amazon Clone</h1>
            <p className="text-gray-300 text-sm sm:text-base mb-5 max-w-md">
              Discover millions of products with great deals, fast delivery, and trusted sellers.
            </p>
            <button 
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} 
              className="btn-primary inline-block text-sm px-6 py-2.5"
            >
              Shop Now →
            </button>
          </div>
          <div className="absolute right-0 bottom-0 text-[12rem] text-white opacity-5 font-extrabold select-none">A</div>
        </div>
      )}

      <div id="products-section" className="scroll-mt-20"></div>

      {/* Top Products Carousel */}
      {!keyword && !category && topProducts?.length > 0 && (
        <section className="mb-10">
          <h2 className="section-title">🔥 Best Sellers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {topProducts.slice(0, 6).map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="group card p-3 text-center hover:-translate-y-1 transition-transform">
                <img src={product.images[0]?.url} alt={product.name} className="w-full aspect-square object-cover rounded-md mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-xs font-medium line-clamp-2 dark:text-white">{product.name}</p>
                <p className="text-amazon font-bold text-sm mt-1">₹{product.price.toLocaleString('en-IN')}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-56 flex-shrink-0`}>
          <div className="card p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold dark:text-white">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-amazon hover:underline flex items-center gap-1">
                  <FaTimes size={10} /> Clear
                </button>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Category</h4>
              <ul className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                      className={`text-sm w-full text-left px-2 py-1 rounded transition-colors
                        ${(category === cat || (cat === 'All' && !category))
                          ? 'text-amazon font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:text-amazon'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Sort By</h4>
              {[['', 'Newest'], ['price_asc', 'Price: Low to High'], ['price_desc', 'Price: High to Low'], ['rating', 'Avg. Customer Review'], ['popular', 'Most Popular']].map(([val, label]) => (
                <button key={val} onClick={() => updateParam('sort', val)}
                  className={`block text-sm w-full text-left px-2 py-1 rounded transition-colors ${sort === val ? 'text-amazon font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-amazon'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Price range */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Price (₹)</h4>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="input-field text-xs py-1 px-2" />
                <input type="number" placeholder="Max" value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="input-field text-xs py-1 px-2" />
              </div>
            </div>

            {/* Minimum rating */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Min Rating</h4>
              {[4, 3, 2, 1].map((r) => (
                <button key={r} onClick={() => updateParam('rating', rating === r.toString() ? '' : r.toString())}
                  className={`flex items-center gap-1 text-sm w-full text-left px-2 py-1 rounded transition-colors ${rating === r.toString() ? 'bg-amazon/10 text-amazon font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-amazon hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <Rating value={r} /> <span className="text-xs">& above</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Controls bar */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div>
              {keyword && <h2 className="text-lg font-bold dark:text-white">Results for "{keyword}"</h2>}
              {category && !keyword && <h2 className="text-lg font-bold dark:text-white">{category}</h2>}
              {!keyword && !category && <h2 className="text-lg font-bold dark:text-white">All Products</h2>}
              {data && <p className="text-sm text-gray-500">{data.total} results</p>}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center gap-2 text-sm"
            >
              <FaSlidersH size={14} /> Filters
            </button>
          </div>

          {isLoading ? (
            <Loader text="Finding products..." />
          ) : error ? (
            <Message variant="danger">{error?.data?.message || 'Failed to load products'}</Message>
          ) : data?.products?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">😕</p>
              <h3 className="text-xl font-semibold dark:text-white mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => updateParam('page', page - 1)}
                    className="p-2 rounded-full border hover:border-amazon disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronLeft size={14} />
                  </button>
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => updateParam('page', p)}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${p === page ? 'bg-amazon text-amazon-blue-dark' : 'border hover:border-amazon dark:text-white'}`}>
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === data.pages}
                    onClick={() => updateParam('page', page + 1)}
                    className="p-2 rounded-full border hover:border-amazon disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
