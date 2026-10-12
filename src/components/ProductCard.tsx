import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Download, Star } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
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
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-sky-100/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/10 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-sky-50/50">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_featured && (
            <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-700 to-sky-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-current" />
              Featured
            </span>
          )}
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs w-fit",
            product.type === 'pdf' ? "bg-sky-100 text-sky-800 border border-sky-200" : "bg-blue-100 text-blue-800 border border-blue-200"
          )}>
            {product.type === 'pdf' ? 'Digital PDF' : 'Physical'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
            {product.category}
          </span>
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
        </div>
        <h3 className="text-blue-950 font-bold text-base mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-slate-600 text-xs mb-4 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-500 block leading-none">Price</span>
            <span className="text-lg font-extrabold text-blue-950">
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="p-2.5 bg-sky-50 text-blue-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-xs"
            title={product.type === 'pdf' ? "Add digital PDF to cart" : "Add book to cart"}
          >
            {product.type === 'pdf' ? <Download className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
