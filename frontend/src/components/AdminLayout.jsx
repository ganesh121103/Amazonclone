import { Link, useLocation, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaChevronRight, FaStore } from 'react-icons/fa';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/admin/products', label: 'Products', icon: FaBox },
  { to: '/admin/orders', label: 'Orders', icon: FaShoppingBag },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
];

const AdminLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-112px)] bg-gray-50/50 dark:bg-gray-900/50">
      {/* Sidebar - Glassmorphism */}
      <aside className="w-64 glass-panel flex-shrink-0 hidden md:flex flex-col sticky top-[112px] h-[calc(100vh-112px)] z-10 border-r border-gray-200/50 dark:border-gray-700/50">
        <div className="px-6 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
           <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amazon to-orange-300 flex items-center justify-center shadow-lg shadow-amazon/20">
               <span className="text-amazon-blue-dark font-black text-xl leading-none">A</span>
             </div>
             <div>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Workspace</p>
               <p className="text-sm dark:text-white font-bold leading-tight">Admin Center</p>
             </div>
           </div>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to;
            return (
              <Link key={to} to={to}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                  ${isActive 
                    ? 'bg-amazon text-amazon-blue-dark shadow-md shadow-amazon/20 translate-x-1' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-sm hover:translate-x-1'}`}>
                <Icon size={16} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {label}
                {isActive && <FaChevronRight size={10} className="ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>
        
        <div className="px-6 py-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <Link to="/" className="group flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-amazon dark:hover:text-amazon font-semibold transition-all">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-amazon/10 transition-colors">
              <FaStore size={14} />
            </div>
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile top tabs */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden sticky top-[112px] z-20 flex overflow-x-auto glass-panel border-b border-gray-200/50 dark:border-gray-700/50 p-3 gap-2 hide-scrollbar">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0
                  ${isActive ? 'bg-amazon text-amazon-blue-dark shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Icon size={14} /> {label}
              </Link>
            );
          })}
        </div>
        <div className="flex-1 p-4 md:p-8 relative">
          {/* Ambient background blob for the main area to give that depth */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amazon/10 blur-[120px] rounded-full pointer-events-none z-0 hidden lg:block"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none z-0 hidden lg:block"></div>
          
          <div className="relative z-10 min-h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
