import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, BookOpen, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { cn } from '../lib/utils';

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-sky-200/80 shadow-xs bg-white shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Pioneer Books Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-blue-950 tracking-tight leading-none">
                Pioneer <span className="text-blue-600">Books</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-600 mt-0.5">
                Best bookstore of Karachi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">Home</Link>
            <Link to="/shop" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">Catalog</Link>
            <Link to="/about" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">About Us</Link>
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <Link to="/cart" className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-sky-50 rounded-xl transition-all">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-slate-800">Salam, {profile?.name || 'User'}</span>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-blue-200"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            <Link to="/cart" className="relative p-2 text-slate-700">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 text-slate-700 hover:bg-sky-50 rounded-xl transition-colors active:scale-95"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Smooth Animated Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-white/98 backdrop-blur-md border-b border-sky-100 shadow-xl"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.04 },
                },
                closed: {
                  transition: { staggerChildren: 0.03, staggerDirection: -1 },
                },
              }}
              className="px-4 pt-3 pb-6 space-y-1.5"
            >
              {[
                { to: '/', label: 'Home' },
                { to: '/shop', label: 'Catalog' },
                { to: '/about', label: 'About Us' },
              ].map((item) => (
                <motion.div
                  key={item.to}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -10 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={item.to}
                    className="block px-3.5 py-2.5 text-slate-700 hover:text-blue-600 hover:bg-sky-50/80 rounded-xl font-semibold transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="pt-2 border-t border-slate-100">
                {!user ? (
                  <motion.div
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: 10 },
                    }}
                  >
                    <Link
                      to="/login"
                      className="block w-full text-center py-2.5 px-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-200 hover:from-blue-800 hover:to-blue-700 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login / Signup
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: 10 },
                    }}
                  >
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3.5 py-2.5 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-all"
                    >
                      Sign Out ({profile?.name || 'User'})
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
