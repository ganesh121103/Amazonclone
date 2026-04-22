import { Link } from 'react-router-dom';
import { useGetDashboardStatsQuery } from '../../slices/ordersApiSlice';
import { useGetAdminProductsQuery } from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { FaShoppingBag, FaUsers, FaBox, FaRupeeSign, FaChevronRight, FaArrowUp } from 'react-icons/fa';

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetDashboardStatsQuery();

  if (isLoading) return <div className="p-8 flex justify-center"><Loader /></div>;
  if (error) return <div className="p-8"><Message variant="danger">{error?.data?.message}</Message></div>;

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: FaRupeeSign, color: 'from-emerald-400 to-emerald-600 shadow-emerald-500/30', change: '+12.5%' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FaShoppingBag, color: 'from-blue-400 to-blue-600 shadow-blue-500/30', change: '+8.2%' },
    { label: 'Total Products', value: stats.totalProducts, icon: FaBox, color: 'from-purple-400 to-purple-600 shadow-purple-500/30', change: '+3.1%' },
    { label: 'Total Users', value: stats.totalUsers, icon: FaUsers, color: 'from-orange-400 to-orange-600 shadow-orange-500/30', change: '+15.4%' },
  ];

  // Build simple bar chart from monthlyRevenue
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxRevenue = Math.max(...(stats.monthlyRevenue?.map((m) => m.revenue) || [1]));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 animate-slide-up-fade">
        <div>
          <h1 className="text-3xl font-black dark:text-white tracking-tight">Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your store's performance at a glance.</p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-full hidden sm:block">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, change }, i) => (
          <div key={label} className={`glass-card p-6 flex flex-col relative overflow-hidden animate-slide-up-fade stagger-${(i % 4) + 1} group`}>
            {/* Ambient Back Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 -mr-10 -mt-10`}></div>
            
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={20} />
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-black dark:text-white mb-1 tracking-tight">{typeof value === 'number' ? value.toLocaleString('en-IN') : value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{label}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-3 font-bold bg-emerald-50 dark:bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full"><FaArrowUp size={10} />{change} this month</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 animate-slide-up-fade stagger-5">
        {/* Monthly revenue bar chart */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold dark:text-white">Revenue Timeline</h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Last 6 Months</span>
          </div>
          {stats.monthlyRevenue?.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-12 m-auto">No revenue data yet. Start selling!</p>
          ) : (
            <div className="flex items-end gap-3 sm:gap-6 h-56 mt-auto">
              {stats.monthlyRevenue.map((m) => {
                const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={`${m._id.year}-${m._id.month}`} className="flex flex-col items-center flex-1 gap-2 group">
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">₹{(m.revenue/1000).toFixed(0)}k</span>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-xl relative overflow-hidden" style={{ height: '100%' }}>
                      <div
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-amazon to-orange-300 rounded-t-xl transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,153,0,0.4)]"
                        style={{ height: `${Math.max(height, 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{months[m._id.month - 1]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent orders feed */}
        <div className="glass-card p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold dark:text-white">Live Orders</h2>
            <Link to="/admin/orders" className="text-amazon text-xs font-bold hover:underline flex items-center gap-1 bg-amazon/10 px-2.5 py-1 rounded-full">
              View All <FaChevronRight size={10} />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar">
            {stats.recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex-shrink-0">
                  {order.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold dark:text-white truncate">{order.user?.name || 'Unknown'}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium text-gray-500">{order.orderItems.length} items</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                    <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                  <p className="text-sm font-black dark:text-white">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                    order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                    order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                    order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                    'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-6 mt-6 animate-slide-up-fade stagger-6 mb-10">
        {[
          { label: 'Manage Products', to: '/admin/products', color: 'from-purple-500 to-indigo-600 shadow-purple-500/25' },
          { label: 'Manage Orders', to: '/admin/orders', color: 'from-blue-500 to-cyan-500 shadow-blue-500/25' },
          { label: 'Manage Users', to: '/admin/users', color: 'from-emerald-400 to-teal-500 shadow-emerald-500/25' },
        ].map(({ label, to, color }) => (
          <Link key={label} to={to}
            className={`bg-gradient-to-r ${color} shadow-lg text-white rounded-2xl p-5 font-bold text-sm flex items-center justify-between hover:scale-[1.02] transition-transform duration-300 overflow-hidden relative group`}>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="relative z-10">{label}</span>
            <FaChevronRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardScreen;;
