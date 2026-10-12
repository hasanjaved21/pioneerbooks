import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, name, email, role: 'user' }]);
        if (profileError) {
          console.warn('Profile creation note:', profileError.message);
        }
      }

      toast.success('Account created! Please check your email or log in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-sky-100 shadow-xl shadow-blue-900/5">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-950 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-200">
            <BookOpen className="text-sky-200 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-blue-950">Join Pioneer Books</h2>
          <p className="mt-2 text-slate-600 text-sm">Start your journey of authentic knowledge</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSignup}>
          <div className="space-y-3.5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 w-5 h-5" />
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-sky-50/50 border border-sky-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                placeholder="Full Name"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 w-5 h-5" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-sky-50/50 border border-sky-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                placeholder="Email Address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 w-5 h-5" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-sky-50/50 border border-sky-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                placeholder="Password (minimum 6 characters)"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white py-3.5 rounded-xl font-bold text-base transition-all shadow-md shadow-blue-200 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-3">
          <p className="text-slate-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
