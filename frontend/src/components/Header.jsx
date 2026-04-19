import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { logout } from '../slices/authSlice';
import { toggleTheme } from '../slices/themeSlice';
import { clearCartItems } from '../slices/cartSlice';
import { useLogoutUserMutation } from '../slices/usersApiSlice';
import { FaShoppingCart, FaUser, FaSearch, FaSun, FaMoon, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { isDark } = useSelector((state) => state.theme);
  const [logoutUser] = useLogoutUserMutation();
  const [keyword, setKeyword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    dispatch(clearCartItems());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/?keyword=${keyword.trim()}`);
    else navigate('/');
    setKeyword('');
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Main navbar */}
      <nav className="bg-amazon-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-14">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1 border border-transparent hover:border-white rounded px-1 py-0.5 transition-colors">
            <span className="text-white font-extrabold text-xl tracking-tight">amazon</span>
            <span className="text-amazon font-extrabold text-xl">.in</span>
          </Link>

          {/* Deliver to */}
          <div className="hidden md:flex flex-col text-xs border border-transparent hover:border-white rounded px-1 py-0.5 transition-colors cursor-pointer flex-shrink-0">
            <span className="text-gray-300">Deliver to</span>
            <span className="font-bold text-sm">India 🇮🇳</span>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-1 min-w-0">
            <select className="bg-gray-200 text-gray-800 text-xs px-2 rounded-l-md border-r border-gray-300 focus:outline-none h-10 hidden sm:block">
              <option>All</option>
            </select>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search Amazon.in"
              className="flex-1 text-gray-900 text-sm px-3 h-10 focus:outline-none min-w-0"
            />
            <button type="submit" className="bg-amazon hover:bg-amazon-dark h-10 px-4 rounded-r-md transition-colors flex-shrink-0">
              <FaSearch className="text-amazon-blue-dark" />
            </button>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 hover:bg-amazon-blue-light rounded transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <FaSun className="text-amazon" size={16} /> : <FaMoon size={16} />}
            </button>

            {/* Account */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex flex-col border border-transparent hover:border-white rounded px-2 py-0.5 transition-colors"
              >
                <span className="text-xs text-gray-300">
                  {userInfo ? `Hello, ${userInfo.name.split(' ')[0]}` : 'Hello, sign in'}
                </span>
                <span className="text-sm font-bold flex items-center gap-1">
                  Account & Lists <FaChevronDown size={10} />
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-xl py-2 animate-fade-in z-50"
                  onMouseLeave={() => setDropdownOpen(false)}>
                  {userInfo ? (
                    <>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">My Profile</Link>
                      <Link to="/orders" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">My Orders</Link>
                      {userInfo.isAdmin && (
                        <>
                          <hr className="my-1 border-gray-200 dark:border-gray-600" />
                          <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold text-amazon-teal">Admin Panel</Link>
                        </>
                      )}
                      <hr className="my-1 border-gray-200 dark:border-gray-600" />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-semibold">Sign In</Link>
                      <Link to="/register" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Orders link */}
            <Link to="/orders" className="hidden sm:flex flex-col border border-transparent hover:border-white rounded px-2 py-0.5 transition-colors">
              <span className="text-xs text-gray-300">Returns</span>
              <span className="text-sm font-bold">& Orders</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-1 border border-transparent hover:border-white rounded px-2 py-1 transition-colors">
              <div className="relative">
                <FaShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amazon text-amazon-blue-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-bold hidden sm:block">Cart</span>
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 hover:bg-amazon-blue-light rounded transition-colors">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden bg-amazon-blue-light px-4 py-3 flex flex-col gap-2 animate-slide-in">
            {userInfo ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="py-2 text-sm hover:text-amazon">My Profile</Link>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="py-2 text-sm hover:text-amazon">My Orders</Link>
                {userInfo.isAdmin && <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-amazon font-semibold">Admin Panel</Link>}
                <button onClick={handleLogout} className="py-2 text-sm text-red-400 text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2 text-sm hover:text-amazon">Sign In</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="py-2 text-sm hover:text-amazon">Create Account</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Secondary nav bar */}
      <div className="bg-amazon-blue text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 overflow-x-auto py-1 scrollbar-hide whitespace-nowrap">
          {['Electronics', 'Computers', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Toys & Games', 'Beauty', 'Automotive'].map((cat) => (
            <Link
              key={cat}
              to={`/?category=${encodeURIComponent(cat)}`}
              className="hover:text-amazon transition-colors flex-shrink-0 py-1 border border-transparent hover:border-white rounded px-1"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
