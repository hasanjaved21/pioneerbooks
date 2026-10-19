import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`"${product.title}" added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Link
        to={`/product/${product.id}`}
        className="group bg-white rounded-xl overflow-hidden border border-sky-100 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-950/5 transition-all duration-300 flex flex-col h-full"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-sky-50/40">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {product.is_featured && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-md text-[9px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-3.5 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 line-clamp-1">
              {product.category}
            </span>
            <div className="flex items-center text-amber-400 shrink-0">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="text-[10px] font-bold text-slate-500 ml-0.5">4.9</span>
            </div>
          </div>
          <h3 className="text-blue-950 font-bold text-xs sm:text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors leading-snug">
            {product.title}
          </h3>
          <p className="text-slate-500 text-[11px] mb-2.5 line-clamp-2 leading-relaxed flex-grow">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-medium leading-none mb-0.5">Price</span>
              <span className="text-sm font-extrabold text-blue-950">
                {formatPrice(product.price)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-2 bg-sky-50 text-blue-700 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-xs cursor-pointer active:scale-95"
              title="Add book to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
