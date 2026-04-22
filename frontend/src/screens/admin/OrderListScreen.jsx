import { useState } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaSearch, FaFilter } from 'react-icons/fa';

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Processing: 'bg-orange-100/80 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
  Shipped: 'bg-blue-100/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
  Delivered: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
  Cancelled: 'bg-red-100/80 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
};

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleStatusChange = async (orderId, status, currentStatus) => {
    if (status === currentStatus) return;
    if (!window.confirm(`Change order status to "${status}"?`)) return;
    try {
      await updateStatus({ id: orderId, status }).unwrap();
      toast.success(`Order status updated to "${status}"`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const filtered = (orders || []).filter((o) => {
    const matchSearch = !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-slide-up-fade">
        <div>
          <h1 className="text-3xl font-black dark:text-white tracking-tight">Orders Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and update customer order statuses.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID or customer..." 
              className="w-full sm:w-64 pl-10 py-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amazon focus:bg-white dark:focus:bg-gray-900 transition-all shadow-sm" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="w-36 py-2.5 px-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amazon shadow-sm appearance-none cursor-pointer">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex gap-3 flex-wrap mb-6 animate-slide-up-fade stagger-1">
        {STATUS_OPTIONS.map((s) => {
          const count = (orders || []).filter((o) => o.orderStatus === s).length;
          const isActive = filterStatus === s;
          return (
            <button key={s} onClick={() => setFilterStatus(isActive ? '' : s)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border shadow-sm ${
                isActive 
                  ? STATUS_COLORS[s] 
                  : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:scale-105'
              }`}>
              {s}: {count}
            </button>
          );
        })}
      </div>

      {isLoading ? <div className="flex justify-center p-12"><Loader /></div> : error ? (
        <Message variant="danger">{error?.data?.message}</Message>
      ) : (
        <div className="glass-card animate-slide-up-fade stagger-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 dark:bg-gray-800/30 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Paid', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left border-b border-gray-100 dark:border-gray-700/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {filtered.map((order, i) => (
                  <tr key={order._id} className="table-row-hover group" style={{ animationDelay: `${0.1 * i}s` }}>
                    <td className="px-6 py-4">
                      <code className="text-xs font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/20">
                          {order.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white leading-tight">{order.user?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                        {order.orderItems.length}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">Paid</span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100/80 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30">Unpaid</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value, order.orderStatus)}
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full outline-none cursor-pointer appearance-none ${STATUS_COLORS[order.orderStatus]} hover:scale-105 transition-transform`}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link to={`/order/${order._id}`}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-amazon flex items-center justify-center hover:bg-amazon hover:text-white dark:hover:bg-amazon transition-colors mx-auto shadow-sm">
                        <FaEye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-16 text-gray-500 font-medium tracking-wide">No orders found matching your criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-700/50 text-xs font-semibold text-gray-500 dark:text-gray-400 flex justify-between items-center">
            <span>Showing {filtered.length} of {orders?.length || 0} orders</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Data is live
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;
