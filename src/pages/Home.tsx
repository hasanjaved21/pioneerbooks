import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { productService } from '../lib/services';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { BOOK_CATEGORIES } from '../constants/categories';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await productService.getAll();
        setFeaturedProducts(products.filter((p) => p.is_featured).slice(0, 5));
        // Take 5 items for new arrivals
        setNewArrivals(products.slice(0, 5));
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const updateScrollButtons = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons, { passive: true });
      updateScrollButtons();
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = categoryScrollRef.current.clientWidth * 0.75;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Search Bar directly below Navigation Bar */}
      <section className="bg-gradient-to-b from-sky-50/80 via-white to-transparent pt-6 pb-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSearchSubmit} className="relative shadow-lg shadow-blue-950/5 rounded-2xl">
            <Search className="w-5 h-5 text-blue-600 absolute left-4 sm:left-5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Bare Act, Code, Law Category, or Book Title..."
              className="w-full pl-12 sm:pl-13 pr-28 sm:pr-32 py-3.5 sm:py-4 bg-white border border-sky-200/90 rounded-2xl text-sm sm:text-base text-blue-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Quick popular tags */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Popular:</span>
            {['Civil Laws', 'Bare Acts', 'Code of Criminal', 'Constitutional Laws', 'Corporate Laws'].map((tag) => (
              <Link
                key={tag}
                to={`/shop?category=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg border border-sky-100 transition-colors font-medium text-[11px]"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5 "New Arrival" cards right after Search Bar */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Just Added</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-0.5">
              New Arrivals
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Fresh editions and latest legal titles from Pioneer Books
            </p>
          </div>
          <Link
            to="/shop"
            className="text-blue-600 font-bold hover:text-blue-800 flex items-center space-x-1 text-xs sm:text-sm"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-sky-50/70 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </motion.section>

      {/* Browse by Legal Category: Category buttons just names + horizontal swiping */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Statutory Disciplines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-0.5">
              Browse by Legal Category
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Swipe left and right to explore all 33 legal subjects, Bare Acts, and Court Rules
            </p>
          </div>

          {/* Swipe / Navigation controls */}
          <div className="flex items-center space-x-2.5 self-end sm:self-auto">
            <button
              onClick={() => scrollCategories('left')}
              disabled={!canScrollLeft}
              aria-label="Swipe categories left"
              className={cn(
                'w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer',
                canScrollLeft
                  ? 'border-sky-200 bg-white text-blue-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-xs active:scale-95'
                  : 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-50'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollCategories('right')}
              disabled={!canScrollRight}
              aria-label="Swipe categories right"
              className={cn(
                'w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer',
                canScrollRight
                  ? 'border-sky-200 bg-white text-blue-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-xs active:scale-95'
                  : 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-50'
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              to="/shop"
              className="text-blue-600 font-bold hover:text-blue-800 flex items-center space-x-1 text-xs sm:text-sm pl-1"
            >
              <span>View All ({BOOK_CATEGORIES.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Swipeable Track: Category Buttons (Just Names, No Icon or Details) */}
        <div className="relative group">
          <div
            ref={categoryScrollRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-[160px] sm:auto-cols-[190px] md:auto-cols-[210px] gap-2.5 sm:gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 px-1 touch-pan-x select-none [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [scrollbar-color:#93c5fd_transparent]"
          >
            {BOOK_CATEGORIES.map((catName, index) => (
              <Link
                key={index}
                to={`/shop?category=${encodeURIComponent(catName)}`}
                className="h-14 px-3.5 bg-white rounded-xl border border-sky-100/90 hover:border-blue-600 hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-sky-50/70 hover:shadow-md transition-all text-center flex items-center justify-center snap-start shadow-xs group/cat cursor-pointer"
              >
                <span className="font-bold text-xs sm:text-sm text-blue-950 group-hover/cat:text-blue-600 transition-colors line-clamp-2">
                  {catName}
                </span>
              </Link>
            ))}
          </div>

          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-3 w-8 bg-gradient-to-r from-[#f8fafc] to-transparent pointer-events-none rounded-l-xl hidden sm:block"></div>
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none rounded-r-xl hidden sm:block"></div>
          )}
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Essential Law Books</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mb-0.5">
              Featured Legal Works
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Standard practitioners&apos; manuals, civil codes, and statutory reference digests
            </p>
          </div>
          <Link
            to="/shop"
            className="text-blue-600 font-bold hover:text-blue-800 flex items-center space-x-1 text-xs sm:text-sm"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-sky-50/70 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </motion.section>

      {/* Features strip: Pure physical book & legal services highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: ShieldCheck,
              title: 'Authoritative Legal Texts',
              desc: 'Official Bare Acts, latest amendments, and commentary cited before High Courts & Supreme Court of Pakistan.',
            },
            {
              icon: Truck,
              title: 'Nationwide Delivery',
              desc: 'Reliable dispatch to bar rooms, law chambers, universities, and residences across all provinces.',
            },
            {
              icon: BookOpen,
              title: 'Pakistan Chowk Heritage',
              desc: 'Serving the legal fraternity since 1945 at Pakistan Chowk, Karachi with verified statutory manuals.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="p-6 bg-white rounded-2xl border border-sky-100 hover:border-blue-300 transition-all shadow-xs hover:shadow-lg group"
            >
              <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-blue-950 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
