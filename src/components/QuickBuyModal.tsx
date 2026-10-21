import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { orderService } from '../lib/services';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

interface QuickBuyModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickBuyModal({ product, isOpen, onClose }: QuickBuyModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    phone: '',
    cnic: '',
    address: '',
    email: user?.email || '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.email.trim()) {
      toast.error('Please fill in required details (Name, Phone, Address, Email)');
      return;
    }

    setLoading(true);
    try {
      await orderService.create({
        user_id: user?.id || 'guest-' + Date.now(),
        items: [{ ...product, quantity: 1 }],
        total_price: product.price,
        status: 'pending',
        customer_name: formData.name.trim(),
        customer_phone: formData.phone.trim(),
        customer_cnic: formData.cnic.trim(),
        customer_email: formData.email.trim(),
        customer_address: formData.address.trim(),
      });

      setOrderComplete(true);
      toast.success('Order placed successfully! Pioneer Books will contact you.');
    } catch (error) {
      console.error('Error placing quick order:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-100">Direct Order · Express Checkout</span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">Buy Now</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderComplete ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-2xl font-extrabold text-blue-950">Thank You! Order Placed</h4>
            <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto">
              We received your order for <strong>{product.title}</strong> ({formatPrice(product.price)}). Our team at Pakistan Chowk will contact you via WhatsApp / Call to confirm dispatch.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Close &amp; Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Product summary snippet */}
            <div className="flex items-center gap-3 p-3 bg-sky-50/70 rounded-2xl border border-sky-100">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800'}
                alt={product.title}
                className="w-12 h-16 object-cover rounded-lg border border-sky-200 shrink-0"
              />
              <div className="flex-grow min-w-0">
                <span className="text-[10px] font-bold uppercase text-sky-700 block line-clamp-1">{product.category}</span>
                <h4 className="text-xs sm:text-sm font-bold text-blue-950 line-clamp-1">{product.title}</h4>
                <p className="text-sm font-black text-red-600 mt-0.5">{formatPrice(product.price)}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Please enter your details below for swift courier delivery and dispatch confirmation:
            </p>

            {/* Inputs: name, phone, address, email */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name of recipient / advocate"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0300-1234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CNIC No. <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    placeholder="42101-1234567-1"
                    maxLength={15}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="advocate@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Chamber / Office / House #, Street, City, Province"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold text-sm shadow-md shadow-red-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Confirm Order ({formatPrice(product.price)})</span>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cash on Delivery (COD) · Free Verification by Phone</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
