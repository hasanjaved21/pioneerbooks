import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Download, ArrowLeft, Star, Share2, BookOpen, CheckCircle2, Info } from 'lucide-react';
import { productService } from '../lib/services';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { formatPrice, cn } from '../lib/utils';
import { toast } from 'sonner';
import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const p = await productService.getById(id);
        setProduct(p);

        // Load related products
        const related = await productService.getByCategory(p.category);
        setRelatedProducts(related.filter(item => item.id !== id).slice(0, 4));
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Product not found');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!product) return null;

  const handleAction = () => {
    addToCart(product);
    toast.success(`"${product.title}" added to cart!`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/shop" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-bold mb-10 hover:translate-x-[-4px] transition-transform text-sm">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Pioneer Books Shop</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-24">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-sky-50 shadow-xl shadow-blue-900/10 border border-sky-100">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800'}
              alt={product.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-5 right-5 flex flex-col gap-3">
            <button
              onClick={handleShare}
              className="p-3 bg-white/95 backdrop-blur-xs rounded-full shadow-md hover:bg-white text-slate-700 hover:text-blue-600 transition-colors"
              title="Share book"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                product.type === 'pdf' ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"
              )}>
                {product.type === 'pdf' ? 'Instant Digital PDF' : 'Physical Hardcopy'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-950 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-slate-600 font-medium">(4.9 / 5.0 Reader Rating)</span>
            </div>
          </div>

          <div className="text-3xl font-extrabold text-blue-950">
            {formatPrice(product.price)}
          </div>

          <p className="text-slate-700 leading-relaxed text-base">
            {product.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-6 border-y border-sky-100 text-sm">
            <div className="flex items-center space-x-2.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Authentic Scholarship</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>High Quality Print / Paper</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Instant Download Link</span>
            </div>
            <div className="flex items-center space-x-2.5 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Cash on Delivery / Online Pay</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAction}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white px-10 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-3 cursor-pointer"
            >
              {product.type === 'pdf' ? <Download className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
              <span>{product.type === 'pdf' ? 'Add Digital PDF to Cart' : 'Add Physical Book to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-sky-100">
          <div>
            <h2 className="text-2xl font-extrabold text-blue-950 mb-1">More from {product.category}</h2>
            <p className="text-slate-600 text-sm">Readers who purchased this title also explored</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
