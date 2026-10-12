import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      toast.success('Admin access granted');
      navigate('/admin/products');
    } else {
      toast.error('Invalid admin password. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-sky-100 shadow-xl shadow-blue-950/5">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-950 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-950/20">
            <ShieldCheck className="text-sky-300 w-8 h-8" />
          </div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full mb-2">
            <span>Pioneer Books</span>
            <span>·</span>
            <span>Admin Portal</span>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-950">Store Manager Login</h2>
          <p className="mt-2 text-slate-500 text-sm">Enter admin password to access the bookstore management portal.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAdminLogin} autoComplete="off">
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-600 w-5 h-5" />
              <input
                required
                id="admin-password"
                name="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-sky-50/50 border border-sky-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-slate-900 transition-all text-sm placeholder:text-slate-400"
                placeholder="Enter Admin Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Access Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
