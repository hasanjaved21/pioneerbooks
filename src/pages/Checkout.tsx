import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../lib/services';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';
import { ShieldCheck, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

export function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    phone: '',
    cnic: '',
    email: user?.email || '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await orderService.create({
        user_id: user?.id || 'guest-' + Date.now(),
        items: cart,
        total_price: total,
        status: 'pending',
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_cnic: formData.cnic,
        customer_email: formData.email,
        customer_address: formData.address,
      });

      setOrderComplete(true);
      clearCart();
      toast.success('Order placed successfully with Pioneer Books!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-sky-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mb-3">JazakAllah Khair!</h1>
        <p className="text-slate-600 text-base mb-8">
          Your order has been recorded at Pioneer Books. We will contact you shortly to confirm dispatch.
        </p>
        <div className="bg-sky-50/70 p-6 rounded-2xl border border-sky-100 mb-8 text-left space-y-3 text-sm">
          <h3 className="font-bold text-blue-950">Next Steps</h3>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <span>Our team verifies your ordered legal publications and prepares them for courier dispatch.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <span>Tracking details and consignment updates will be communicated directly to your phone.</span>
            </li>
          </ul>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-200 cursor-pointer"
        >
          Return to Pioneer Books Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950 mb-8">Order Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="space-y-6">
          <div className="bg-white p-7 sm:p-8 rounded-3xl border border-sky-100/90 shadow-xs">
            <h2 className="text-xl font-bold text-blue-950 mb-6">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-sky-50/50 border border-sky-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Enter recipient's full name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone / WhatsApp Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-sky-50/50 border border-sky-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="0300-1234567"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">CNIC No. <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full px-4 py-3 bg-sky-50/50 border border-sky-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="42101-1234567-1"
                    maxLength={15}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-sky-50/50 border border-sky-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="advocate@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Complete Shipping Address</label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-sky-50/50 border border-sky-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  placeholder="Chamber / Office / House #, Street, City, Province"
                />
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white py-4 rounded-xl font-bold text-base transition-all shadow-md shadow-blue-200 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-100 flex flex-col items-center text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <h4 className="font-bold text-blue-950 text-sm">Authentic Guarantee</h4>
              <p className="text-xs text-slate-500">Every title verified with authoritative statutory publications and genuine legal editions.</p>
            </div>
            <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-100 flex flex-col items-center text-center space-y-2">
              <Truck className="w-6 h-6 text-blue-600" />
              <h4 className="font-bold text-blue-950 text-sm">Nationwide Dispatch</h4>
              <p className="text-xs text-slate-500">Safe packaging and reliable courier service across Pakistan.</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 text-white p-7 rounded-3xl shadow-xl shadow-blue-950/20 border border-slate-800">
            <h2 className="text-xl font-bold mb-6 text-sky-100">Order Items ({cart.length})</h2>
            <div className="space-y-4 mb-6 max-h-[360px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3.5 items-center">
                  <div className="w-14 h-18 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-white text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-sky-300">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="font-extrabold text-sm text-sky-100">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 pt-6 border-t border-white/15 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span className="text-sky-300">Free / Standard</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold pt-3 border-t border-white/10">
                <span>Total</span>
                <span className="text-sky-300">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
