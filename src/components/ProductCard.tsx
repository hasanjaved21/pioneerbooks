import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { QuickBuyModal } from './QuickBuyModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBuyModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileHover={{ y: -3 }}
        className="h-full"
      >
        <Link
          to={`/product/${product.id}`}
          className="group bg-white rounded-lg sm:rounded-xl overflow-hidden border border-sky-100 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-950/5 transition-all duration-300 flex flex-col h-full"
        >
          {/* Card Thumbnail */}
          <div className="relative aspect-[4/5] overflow-hidden bg-sky-50/40">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Card Body: Compact on mobile, clean typography */}
          <div className="p-2 sm:p-3 flex flex-col flex-grow">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-sky-700 line-clamp-1 mb-0.5">
              {product.category}
            </span>

            <h3 className="text-blue-950 font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-blue-600 transition-colors leading-tight mb-1">
              {product.title}
            </h3>

            <p className="text-slate-500 text-[10px] sm:text-[11px] line-clamp-2 leading-tight sm:leading-relaxed mb-2 flex-grow hidden xs:block">
              {product.description}
            </p>

            {/* Price & Red Buy Now button */}
            <div className="flex items-center justify-between mt-auto pt-1.5 sm:pt-2 border-t border-slate-100 gap-1.5">
              <div>
                <span className="text-[8px] sm:text-[9px] text-slate-400 block uppercase font-medium leading-none mb-0.5">
                  Price
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-blue-950 whitespace-nowrap">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Red Buy Now button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-[10px] sm:text-xs rounded-md sm:rounded-lg shadow-xs hover:shadow-md transition-all whitespace-nowrap cursor-pointer active:scale-95"
                title="Buy Now"
              >
                Buy Now
              </button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Direct Order modal asking for name, phone, address, and email */}
      <QuickBuyModal
        product={product}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
      />
    </>
  );
}
