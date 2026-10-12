import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, BookOpen, Search } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-sky-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-sky-200/80 shadow-xs bg-white shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src="https://scontent.fkhi2-2.fna.fbcdn.net/v/t39.99422-6/809209856_1101177619532009_3112873547259779385_n.png?stp=dst-jpg_tt6&cstp=mx1254x1254&ctp=s1254x1254&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=HGcsXRsQ8b4Q7kNvwHbDMLl&_nc_oc=Adqa6fQp45379XDNms327v1Uk8NWsbgjczy1Who-aetTU72nfYUuaQ7ZG6NC6vJclzs&_nc_zt=14&_nc_ht=scontent.fkhi2-2.fna&_nc_gid=m15HS9_1r2hJZjQGG2CBpw&_nc_ss=7b2a8&oh=00_AQNOoUbwp1gCyddhXsubHPpjcvJlfk9p8SlIOXnqlVenyg&oe=6AD13960"
                alt="Pioneer Books Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-blue-950 tracking-tight leading-none">
                Pioneer <span className="text-blue-600">Books</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-600 mt-0.5">
                Authentic Islamic Bookstore
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">Home</Link>
            <Link to="/shop" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">Shop</Link>
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
              className="p-2 text-slate-700 hover:bg-sky-50 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-sky-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <Link to="/" className="block px-3 py-2 text-slate-700 hover:text-blue-600 font-semibold" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/shop" className="block px-3 py-2 text-slate-700 hover:text-blue-600 font-semibold" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/about" className="block px-3 py-2 text-slate-700 hover:text-blue-600 font-semibold" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            {!user && (
              <Link to="/login" className="block px-3 py-2 text-blue-600 font-bold" onClick={() => setIsMenuOpen(false)}>Login / Signup</Link>
            )}
            {user && (
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-red-600 font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
