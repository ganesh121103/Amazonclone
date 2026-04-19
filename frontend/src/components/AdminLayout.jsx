import { Link, useLocation, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, FaChevronRight } from 'react-icons/fa';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/admin/products', label: 'Products', icon: FaBox },
  { to: '/admin/orders', label: 'Orders', icon: FaShoppingBag },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
];

const AdminLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-112px)]">
      {/* Sidebar */}
      <aside className="w-56 bg-amazon-blue-dark text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="px-4 py-5 border-b border-amazon-blue">
          <p className="text-xs text-gray-400 uppercase font-semibold tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to;
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                  ${isActive ? 'bg-amazon text-amazon-blue-dark' : 'text-gray-300 hover:bg-amazon-blue hover:text-white'}`}>
                <Icon size={15} />
                {label}
                {isActive && <FaChevronRight size={10} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-amazon-blue">
          <Link to="/" className="text-xs text-gray-400 hover:text-amazon transition-colors">← Back to Store</Link>
        </div>
      </aside>

      {/* Mobile top tabs */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex overflow-x-auto bg-amazon-blue-dark text-white">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0
                ${pathname === to ? 'border-b-2 border-amazon text-amazon' : 'text-gray-300'}`}>
              <Icon size={12} /> {label}
            </Link>
          ))}
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
