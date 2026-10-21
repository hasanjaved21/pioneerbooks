import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowRight, Layers } from 'lucide-react';
import { BOOK_CATEGORIES } from '../constants/categories';
import { motion } from 'framer-motion';

export function Categories() {
  const [search, setSearch] = useState('');

  const filteredCategories = BOOK_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-sky-100">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-2">
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>Pioneer Books · Law Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
            All Legal Categories
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Explore authoritative publications across all {BOOK_CATEGORIES.length} legal disciplines, Bare Acts, and Court Rules
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {filteredCategories.map((category, idx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.4) }}
            whileHover={{ y: -3 }}
          >
            <Link
              to={`/shop?category=${encodeURIComponent(category)}`}
              className="group p-4 bg-white rounded-2xl border border-sky-100 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/10 transition-all flex flex-col justify-between h-28 sm:h-32 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-orange-50 group-hover:bg-orange-500 text-orange-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-orange-500 transition-colors">
                  #{idx + 1}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-blue-950 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                  {category}
                </h3>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-600 flex items-center gap-1 mt-1 font-medium">
                  <span>Browse titles</span>
                  <ArrowRight className="w-2.5 h-2.5 text-orange-500 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-sky-100 p-8">
          <Layers className="w-10 h-10 text-orange-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-blue-950 mb-1">No categories match &quot;{search}&quot;</h3>
          <p className="text-slate-500 text-xs mb-4">Try a different search term to explore our statutory collections.</p>
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
}
