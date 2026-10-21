import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, CheckCircle, Clock, XCircle, Truck, Package, Phone, MapPin, User, ChevronRight, BookOpen, BarChart3, ShoppingBag } from 'lucide-react';
import { orderService } from '../../lib/services';
import { Order } from '../../types';
import { formatPrice, cn } from '../../lib/utils';
import { toast } from 'sonner';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
      if (data.length > 0 && !selectedOrder) {
        setSelectedOrder(data[0]);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Order['status']) => {
    try {
      await orderService.updateStatus(id, status);
      toast.success(`Order status updated to ${status}`);
      loadOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'processing':
        return <Package className="w-3.5 h-3.5" />;
      case 'shipped':
        return <Truck className="w-3.5 h-3.5" />;
      case 'delivered':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'cancelled':
        return <XCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Admin Quick Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-sky-100">
        <Link
          to="/admin/products"
          className="bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-900 border border-sky-100 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>All Books & Products</span>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shadow-xs shadow-blue-500/20"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </Link>
        <Link
          to="/admin/dashboard"
          className="bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-900 border border-sky-100 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-colors"
        >
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          <span>Overview & Stats</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full mb-2">
            <span>Admin Portal</span>
            <span>·</span>
            <span>Pioneer Books</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950">Customer Orders</h1>
          <p className="text-slate-600 text-sm mt-1">Review orders, verify deliveries, and manage fulfillment.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-sky-100 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-sky-100 text-blue-950">
                  <th className="px-6 py-4 font-bold">Order ID</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100/70">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-5">
                        <div className="h-4 bg-sky-50 rounded-lg w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No customer orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={cn(
                        'hover:bg-sky-50/40 transition-colors cursor-pointer',
                        selectedOrder?.id === order.id ? 'bg-sky-50/70' : ''
                      )}
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-sky-700">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{order.customer_name}</td>
                      <td className="px-6 py-4 font-bold text-blue-950">{formatPrice(order.total_price)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider',
                            order.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'delivered'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-sky-100 text-sky-800'
                          )}
                        >
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="p-1.5 text-blue-600 hover:bg-sky-100 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {selectedOrder ? (
            <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-sky-100">
                <div>
                  <h2 className="text-lg font-bold text-blue-950">Order #{selectedOrder.id.slice(0, 8)}</h2>
                  <p className="text-xs text-slate-500">
                    {new Date(selectedOrder.created_at).toLocaleDateString()} at{' '}
                    {new Date(selectedOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider',
                    selectedOrder.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : selectedOrder.status === 'delivered'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-sky-100 text-sky-800'
                  )}
                >
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">Customer Details</p>
                <div className="bg-sky-50/50 p-3.5 rounded-xl border border-sky-100 space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-slate-900 font-bold">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600 text-xs">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>{selectedOrder.customer_phone}</span>
                  </div>
                  {selectedOrder.customer_cnic && (
                    <div className="flex items-center space-x-2 text-slate-600 text-xs">
                      <span className="font-semibold text-sky-600">CNIC:</span>
                      <span>{selectedOrder.customer_cnic}</span>
                    </div>
                  )}
                  {selectedOrder.customer_email && (
                    <div className="flex items-center space-x-2 text-slate-600 text-xs">
                      <span className="font-semibold text-sky-600">@</span>
                      <span>{selectedOrder.customer_email}</span>
                    </div>
                  )}
                  <div className="flex items-start space-x-2 text-slate-600 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{selectedOrder.customer_address}</span>
                  </div>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">Ordered Books</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-slate-100">
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-blue-950">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-extrabold text-base text-blue-950">
                    <span>Total Amount</span>
                    <span>{formatPrice(selectedOrder.total_price)}</span>
                  </div>
                </div>
              </div>

              {/* Status Updater */}
              <div className="space-y-2.5 pt-2 border-t border-sky-100">
                <p className="text-xs font-bold text-blue-950 uppercase tracking-wider">Update Fulfillment Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                      className={cn(
                        'px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
                        selectedOrder.status === s
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-sky-50 text-slate-700 hover:bg-sky-100 border border-sky-100'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-sky-50/50 p-10 rounded-2xl border border-dashed border-sky-200 text-center">
              <Package className="w-10 h-10 text-sky-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">Select an order from the list to view full details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
