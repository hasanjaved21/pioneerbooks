import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StoreLocationSection } from './components/StoreLocationSection';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { About } from './pages/About';
import { Categories } from './pages/Categories';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminLogin } from './pages/admin/AdminLogin';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'sonner';
import { isSupabaseConfigured } from './lib/supabase';
import { AlertCircle } from 'lucide-react';
import { ScrollToTop } from './components/ScrollToTop';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50/50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (adminOnly) {
    if (!isAdmin) return <Navigate to="/admin/login" />;
    return <>{children}</>;
  }

  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}

export default function App() {
  const [supabaseOffline, setSupabaseOffline] = React.useState(false);
  const [bannerDismissed, setBannerDismissed] = React.useState(false);

  React.useEffect(() => {
    import('./lib/services').then(({ subscribeToSupabaseStatus }) => {
      const unsubscribe = subscribeToSupabaseStatus((online) => {
        setSupabaseOffline(!online);
      });
      return unsubscribe;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-100 p-4 sticky top-0 z-[60]">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Supabase is not configured. Please set <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your environment variables to enable all features.
            </p>
          </div>
        </div>
      )}

      {isSupabaseConfigured && supabaseOffline && !bannerDismissed && (
        <div className="bg-blue-950 text-sky-100 border-b border-blue-900 px-4 py-2.5 text-xs sm:text-sm sticky top-0 z-[60]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
              <p>
                <strong>Offline-Ready Mode:</strong> Your Supabase cloud instance appears paused or unreachable. Pioneer Books is serving catalog items and saving books to local storage. If your Supabase project was paused due to inactivity, unpause it in the Supabase Dashboard.
              </p>
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-sky-300 hover:text-white font-bold ml-4 text-base px-1 cursor-pointer"
              title="Dismiss notice"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute adminOnly><AdminProducts /></PrivateRoute>} />
          <Route path="/admin/orders" element={<PrivateRoute adminOnly><AdminOrders /></PrivateRoute>} />
        </Routes>
      </main>
      <StoreLocationSection />
      <Footer />
      <Toaster position="top-center" richColors />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923333073438?text=Hello%20Pioneer%20Books%2C%20I%20am%20interested%20in%20your%20books."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Pioneer Books on WhatsApp (+92 333 3073438)"
        title="Chat on WhatsApp (+92 333 3073438)"
        className="fixed bottom-6 right-6 z-50 group flex items-center bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-105 hover:shadow-[#25D366]/40 transition-all duration-300 cursor-pointer"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-bold transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:mr-2">
          WhatsApp (+92 333 3073438)
        </span>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.196 8.196 0 0 1-1.26-4.48c0-4.54 3.7-8.24 8.24-8.24m4.52 11.58c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.17-.47-.29" />
        </svg>
      </a>
    </div>
  );
}
