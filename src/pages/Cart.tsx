import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, BookOpen } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/utils';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 bg-sky-50 border border-sky-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mb-3">Your cart is empty</h1>
        <p className="text-slate-600 text-base mb-8 max-w-md mx-auto">
          You haven't added any books from Pioneer Books to your collection yet.
        </p>
        <Link to="/shop" className="bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white px-8 py-3.5 rounded-xl font-bold text-base transition-all shadow-md shadow-blue-200 inline-block">
          Explore Books Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mb-8">
        Your Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-sky-100/90 shadow-xs flex gap-5 items-center">
              <div className="w-20 h-28 rounded-xl overflow-hidden bg-sky-50 shrink-0 border border-slate-100">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-blue-950 line-clamp-1">{item.title}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                      Law Publication
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-3 bg-sky-50 rounded-lg p-1 border border-sky-100">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded-md transition-all text-slate-700 hover:text-blue-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-blue-950 text-xs w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded-md transition-all text-slate-700 hover:text-blue-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-base font-extrabold text-blue-950">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white p-7 rounded-3xl shadow-xl shadow-blue-950/20 border border-slate-800">
            <h2 className="text-xl font-bold mb-6 text-sky-100">Order Summary</h2>
            <div className="space-y-3.5 mb-6 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery (Pakistan)</span>
                <span className="text-sky-300 font-semibold">Standard Rates Applied at Checkout</span>
              </div>
              <div className="pt-4 border-t border-white/15 flex justify-between text-lg font-extrabold">
                <span>Total Amount</span>
                <span className="text-sky-300">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white py-4 rounded-xl font-bold text-base transition-all shadow-md shadow-blue-950/40 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
