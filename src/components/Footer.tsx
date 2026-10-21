import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Lock, X, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

export function Footer() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = password.trim();
    if (adminLogin(trimmed)) {
      toast.success('Admin access verified. Welcome to Pioneer Books Admin Portal.');
      setIsPasswordModalOpen(false);
      setPassword('');
      navigate('/admin/products');
    } else {
      setError('Invalid password. Please enter the correct admin password.');
      toast.error('Invalid admin password.');
    }
  };

  const openAdminModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setPassword('');
    setError('');
    setIsPasswordModalOpen(true);
  };

  return (
    <footer className="bg-slate-950 text-slate-100 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-800 shadow-md bg-white shrink-0 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Pioneer Books Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Pioneer Books
              </span>
            </Link>
            <p className="text-slate-300/80 leading-relaxed text-sm">
              Pakistan&apos;s trusted legal bookhouse at Pakistan Chowk, Karachi. Providing authoritative Bare Acts, Civil &amp; Criminal Codes, and judicial examination guides.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/p/Pioneer-Books-100088820884433/"
                target="_blank"
                rel="noopener noreferrer"
                title="Pioneer Books on Facebook"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-colors text-slate-300 hover:text-white"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923333073438?text=Hello%20Pioneer%20Books"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-colors text-slate-300 hover:text-white"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:pioneerbookhouse786@gmail.com"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-colors text-slate-300 hover:text-white"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-orange-400">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Catalog</Link></li>
              <li><Link to="/categories" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/about" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-orange-400">Key Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/shop?category=Bare Acts" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Bare Acts</Link></li>
              <li><Link to="/shop?category=Code of Civil" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Code of Civil (CPC)</Link></li>
              <li><Link to="/shop?category=Code of Criminal" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Code of Criminal (CrPC)</Link></li>
              <li><Link to="/shop?category=Constitutional Laws" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Constitutional Laws</Link></li>
              <li><Link to="/shop?category=Civil Judge Exam" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Civil Judge Exam</Link></li>
              <li><Link to="/shop?category=Corporate Laws" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-300 hover:text-white transition-colors">Corporate Laws</Link></li>
              <li><Link to="/categories" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">View All 33 Categories →</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-orange-400">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-slate-300/80">Shop no. 1-A Ismail Mansion, Pakistan Chowk, Garikhata, Karachi</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded border border-orange-500/30 shrink-0">PLUS CODE</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=V236%2BPX%20Garikhata%2C%20Karachi%2C%20Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-orange-400 font-mono text-xs transition-colors"
                >
                  V236+PX Garikhata, Karachi
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="tel:+923333073438" className="text-slate-300/90 hover:text-white transition-colors">
                  +92 333 3073438
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="mailto:pioneerbookhouse786@gmail.com" className="text-slate-300/80 hover:text-white transition-colors">
                  pioneerbookhouse786@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs space-y-3 md:space-y-0">
          <p>© 2026 Pioneer Books. All rights reserved. | created with digital service 0.2</p>
          <div className="flex items-center space-x-6">
            <Link to="/shop" className="hover:text-sky-400 transition-colors">Browse Catalog</Link>
            <button
              onClick={openAdminModal}
              className="text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5 mr-0.5 inline-block" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Password Prompt Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sky-100 text-slate-900">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-950 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-950/20">
                <ShieldCheck className="w-7 h-7 text-sky-400" />
              </div>
              <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-1">
                Pioneer Books
              </span>
              <h3 className="text-2xl font-extrabold text-blue-950">Admin Portal Access</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                Please enter the store management password to continue.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    autoFocus
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-xs text-rose-600 font-semibold mt-1.5">{error}</p>}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
