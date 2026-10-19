import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, BookOpen, Check } from 'lucide-react';
import { productService } from '../lib/services';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../lib/utils';
import { BOOK_CATEGORIES } from '../constants/categories';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const currentCategory = searchParams.get('category') || 'All';
  const currentType = searchParams.get('type') || 'All';

  const categories = ['All', ...BOOK_CATEGORIES];
  const types = ['All', 'physical', 'pdf'];

  const filteredCategoryList = categories.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let data = await productService.getAll();

        if (currentCategory !== 'All') {
          data = data.filter(
            (p) => p.category.toLowerCase() === currentCategory.toLowerCase()
          );
        }
        if (currentType !== 'All') {
          data = data.filter(
            (p) => p.type.toLowerCase() === currentType.toLowerCase()
          );
        }
        if (searchQuery) {
          data = data.filter(
            (p) =>
              p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [currentCategory, currentType, searchQuery]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full mb-2">
            <span>Pioneer Books</span>
            <span>·</span>
            <span>Pakistan Law Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mb-1">
            Law Books & Publications
          </h1>
          <p className="text-slate-600 text-sm">
            Showing {products.length} titles across {BOOK_CATEGORIES.length} legal disciplines
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search acts, codes, digests, titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-sky-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-xs text-sm"
          />
        </div>
      </div>

      {/* Active Filter Bar */}
      {(currentCategory !== 'All' || currentType !== 'All' || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-sky-50/60 p-3 rounded-2xl border border-sky-100 text-xs">
          <span className="font-bold text-slate-600 px-2">Active Filters:</span>
          {currentCategory !== 'All' && (
            <span className="inline-flex items-center space-x-1.5 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold">
              <span>Category: {currentCategory}</span>
              <button
                onClick={() => updateFilter('category', 'All')}
                className="hover:text-blue-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center space-x-1.5 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold">
              <span>Keyword: &quot;{searchQuery}&quot;</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-blue-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchParams({});
              setSearchQuery('');
            }}
            className="text-blue-700 hover:underline font-bold ml-auto px-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside
          className={cn(
            'lg:w-72 space-y-6 shrink-0',
            showFilters
              ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto'
              : 'hidden lg:block'
          )}
        >
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="text-xl font-bold text-blue-950">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-slate-500 hover:text-blue-900 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Categories Box */}
          <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-sky-100/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                Categories ({BOOK_CATEGORIES.length})
              </h3>
              {currentCategory !== 'All' && (
                <button
                  onClick={() => updateFilter('category', 'All')}
                  className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Quick search categories */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter 33 categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  updateFilter('category', 'All');
                  setShowFilters(false);
                }}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                  currentCategory === 'All'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-sky-100/60'
                )}
              >
                All Categories ({BOOK_CATEGORIES.length})
              </button>

              {filteredCategoryList
                .filter((c) => c !== 'All')
                .map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      updateFilter('category', cat);
                      setShowFilters(false);
                    }}
                    className={cn(
                      'block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer truncate',
                      currentCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-sky-100/60'
                    )}
                    title={cat}
                  >
                    {cat}
                  </button>
                ))}

              {filteredCategoryList.filter((c) => c !== 'All').length === 0 && (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No matching category
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center space-x-2 bg-sky-50 text-blue-700 px-4 py-2.5 rounded-xl font-bold text-sm border border-sky-100 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter Categories ({currentCategory !== 'All' ? currentCategory : 'All'})</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-sky-50/70 rounded-2xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-sky-50/40 rounded-3xl border border-sky-100 p-8">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">No books found</h3>
              <p className="text-slate-600 text-sm max-w-sm mx-auto">
                No matching legal titles found in category &quot;{currentCategory}&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery('');
                }}
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
