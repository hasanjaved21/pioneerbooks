import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Download,
  ChevronLeft,
  ChevronRight,
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
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await productService.getAll();
        setFeaturedProducts(products.filter((p) => p.is_featured).slice(0, 4));
        setNewArrivals(products.slice(0, 4));
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[580px] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 py-16 sm:py-20">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-500/20 border border-sky-400/30 text-sky-300 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Pakistan Chowk, Karachi · Established 1945</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Pakistan&apos;s Trusted{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-300">
                Law Bookstore
              </span>{' '}
              & Supplier
            </h1>
            <p className="text-lg text-blue-100/80 max-w-lg leading-relaxed">
              Explore authoritative Bare Acts, Civil & Criminal Codes, Corporate Law, Court Rules, Legal Registers & Case Law Digests. Available in physical hardbound editions and instant digital PDFs.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/shop"
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-xl shadow-blue-950/50 flex items-center space-x-2 cursor-pointer"
              >
                <span>Browse All 33 Categories</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/shop?type=pdf"
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold text-base transition-all backdrop-blur-xs cursor-pointer"
              >
                Digital Legal PDFs
              </Link>
            </div>
          </motion.div>

          {/* Right Side Hero Image Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:block relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-slate-950/70 border border-sky-400/20 group bg-slate-950">
              <img
                src="/src/assets/images/hero_law_banner_1791798870717.jpg"
                alt="Pioneer Books - Law Book Seller & Supplier"
                referrerPolicy="no-referrer"
                className="w-full h-[470px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></span>
                  <span className="text-xs uppercase tracking-widest text-sky-300 font-extrabold">
                    PIONEER BOOKS · LAW BOOK SELLER & SUPPLIER
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Shop no. 1-A Ismail Mansion, Pakistan Chowk Karachi
                </h3>
                <p className="text-sm text-sky-100/80 mt-1.5 flex items-center gap-3">
                  <span>Constitutional · Civil · Criminal · Corporate Law</span>
                  <span className="text-sky-400">·</span>
                  <span className="text-sky-300 font-bold">0333-3073438</span>
                </p>
              </div>
            </div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-sky-500/25 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: 'Authoritative Legal Texts',
              desc: 'Official Bare Acts, latest amendments, and commentary cited before High Courts & the Supreme Court.',
            },
            {
              icon: Truck,
              title: 'Nationwide Delivery',
              desc: 'Secure dispatch to bar rooms, law chambers, libraries, and residences across Pakistan.',
            },
            {
              icon: Download,
              title: 'Instant Legal PDFs',
              desc: 'High-resolution searchable PDF bare acts and judicial examination guides available immediately.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-3xl border border-sky-100/70 hover:border-blue-300 transition-all shadow-xs hover:shadow-md group"
            >
              <div className="w-14 h-14 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <feature.icon className="w-7 h-7 text-blue-700 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Legal Category - Just Names & Swipe Left/Right */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Statutory Disciplines</span>
            </div>
            <h2 className="text-3xl font-extrabold text-blue-950 mb-1">
              Browse by Legal Category
            </h2>
            <p className="text-slate-600 text-sm">
              Swipe left and right to explore all 33 legal subjects, Bare Acts, and Court Rules
            </p>
          </div>

          {/* Swipe / Navigation controls */}
          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button
              onClick={() => scrollCategories('left')}
              disabled={!canScrollLeft}
              aria-label="Swipe categories left"
              className={cn(
                'w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer',
                canScrollLeft
                  ? 'border-sky-200 bg-white text-blue-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-xs active:scale-95'
                  : 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-50'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCategories('right')}
              disabled={!canScrollRight}
              aria-label="Swipe categories right"
              className={cn(
                'w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer',
                canScrollRight
                  ? 'border-sky-200 bg-white text-blue-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-xs active:scale-95'
                  : 'border-slate-200 bg-slate-100/60 text-slate-400 cursor-not-allowed opacity-50'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              to="/shop"
              className="text-blue-600 font-bold hover:text-blue-800 flex items-center space-x-1 text-sm pl-2"
            >
              <span>View All ({BOOK_CATEGORIES.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Swipeable Track: Category Buttons (Just Names, No Icon or Details) */}
        <div className="relative group">
          <div
            ref={categoryScrollRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-[175px] sm:auto-cols-[210px] md:auto-cols-[230px] gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 touch-pan-x select-none [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] [scrollbar-color:#93c5fd_transparent]"
          >
            {BOOK_CATEGORIES.map((catName, index) => (
              <Link
                key={index}
                to={`/shop?category=${encodeURIComponent(catName)}`}
                className="h-16 px-4 bg-white rounded-2xl border border-sky-100/90 hover:border-blue-600 hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-sky-50/70 hover:shadow-md transition-all text-center flex items-center justify-center snap-start shadow-xs group/cat cursor-pointer"
              >
                <span className="font-bold text-sm sm:text-base text-blue-950 group-hover/cat:text-blue-600 transition-colors line-clamp-2">
                  {catName}
                </span>
              </Link>
            ))}
          </div>

          {/* Subtle edge fades indicating horizontal swipeability */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none rounded-l-2xl hidden sm:block"></div>
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none rounded-r-2xl hidden sm:block"></div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Essential Law Books</span>
            </div>
            <h2 className="text-3xl font-extrabold text-blue-950 mb-1">
              Featured Legal Works
            </h2>
            <p className="text-slate-600 text-sm">
              Standard practitioners&apos; manuals, civil codes, and statutory reference digests
            </p>
          </div>
          <Link
            to="/shop"
            className="text-blue-600 font-bold hover:text-blue-800 flex items-center space-x-1 text-sm"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-sky-50/70 rounded-3xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Fresh Additions</span>
            </div>
            <h2 className="text-3xl font-extrabold text-blue-950 mb-1">New Legal Titles</h2>
            <p className="text-slate-600 text-sm">
              The latest additions to the Pioneer Books library
            </p>
          </div>
          <Link
            to="/shop"
            className="text-blue-600 font-bold hover:text-blue-800 flex items-center space-x-1 text-sm"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-sky-50/70 rounded-3xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Digital Law PDF Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
              Immediate Legal Research
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Instant Digital Law PDFs for Court & Chambers
            </h2>
            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed">
              Access digital acts, rules, draft agreements, and examination guides instantly on your tablet, laptop, or phone. High-resolution, searchable, and printable.
            </p>
            <div className="pt-2">
              <Link
                to="/shop?type=pdf"
                className="inline-flex items-center space-x-2 bg-sky-400 hover:bg-sky-300 text-slate-950 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-sky-400/20"
              >
                <Download className="w-4 h-4" />
                <span>Explore Digital PDFs</span>
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
