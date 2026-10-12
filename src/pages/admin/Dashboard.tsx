import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, ShoppingBag, Users, TrendingUp, ArrowUpRight, Clock, CheckCircle2, Package, Activity } from 'lucide-react';
import { productService, orderService } from '../../lib/services';
import { Product, Order } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const products = await productService.getAll();
        const orders = await orderService.getAll();

        const revenue = orders.reduce((sum, order) => sum + order.total_price, 0);
        const pending = orders.filter((o) => o.status === 'pending').length;

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: revenue,
          pendingOrders: pending,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error loading admin stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { title: 'Total Books', value: stats.totalProducts, icon: Book, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
    { title: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Admin Quick Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-sky-100">
        <Link
          to="/admin/products"
          className="bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-900 border border-sky-100 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-colors"
        >
          <Book className="w-4 h-4 text-blue-600" />
          <span>All Books & Products ({stats.totalProducts})</span>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-900 border border-sky-100 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-sky-600" />
          <span>Customer Orders ({stats.totalOrders})</span>
        </Link>
        <Link
          to="/admin/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-xs shadow-blue-500/20"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Overview & Stats</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full mb-2">
            <span>Admin Dashboard</span>
            <span>·</span>
            <span>Pioneer Books</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950">Store Overview</h1>
          <p className="text-slate-600 text-sm mt-1">Real-time performance metrics and recent customer activity.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2"
          >
            <Book className="w-4 h-4" />
            <span>Manage Books</span>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white border border-sky-200 text-blue-950 hover:bg-sky-50 px-5 py-3 rounded-xl font-bold text-sm shadow-2xs transition-all flex items-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4 text-sky-600" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs flex items-center space-x-5 hover:border-sky-300 transition-colors"
          >
            <div className={cn('w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs', stat.bg)}>
              <stat.icon className={cn('w-7 h-7', stat.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-950">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-sky-100 shadow-2xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-blue-950">Recent Customer Orders</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest purchase requests across physical books and digital PDFs</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-sky-100 text-blue-950">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/70">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No orders placed yet. Orders will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="py-3.5 font-mono text-xs font-semibold text-sky-700">#{order.id.slice(0, 8)}</td>
                      <td className="py-3.5 font-medium text-slate-900">{order.customer_name}</td>
                      <td className="py-3.5 font-bold text-blue-950">{formatPrice(order.total_price)}</td>
                      <td className="py-3.5">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider',
                            order.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'delivered'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-sky-100 text-sky-800'
                          )}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white p-6 sm:p-7 rounded-2xl shadow-xl shadow-blue-950/20 border border-blue-900">
            <div className="flex items-center space-x-2.5 mb-4">
              <Package className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold">Quick Management</h3>
            </div>
            <p className="text-xs text-blue-200/80 mb-5 leading-relaxed">
              Add books directly into the catalog or check pending customer orders.
            </p>
            <div className="space-y-3">
              <Link
                to="/admin/products?add=true"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-md shadow-blue-950/40"
              >
                <Package className="w-4 h-4" />
                <span>Add New Book</span>
              </Link>
              <Link
                to="/admin/orders"
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 border border-white/15"
              >
                <Users className="w-4 h-4" />
                <span>Manage Customer Orders</span>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-4 h-4 text-sky-600" />
              <h3 className="text-base font-bold text-blue-950">System Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-sm text-slate-600">Database Connection</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-sky-700">Supabase Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-sm text-slate-600">Storage Buckets</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                  <span className="text-xs font-bold text-sky-700">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-slate-600">Admin Authentication</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-xs font-bold text-blue-700">Secured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
