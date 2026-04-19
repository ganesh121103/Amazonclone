import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) navigate(redirect, { replace: true });
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold">
            <span className="text-gray-900 dark:text-white">amazon</span><span className="text-amazon">.in</span>
          </Link>
        </div>

        <div className="card p-6">
          <h1 className="text-xl font-bold dark:text-white mb-5">Sign in</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="email@example.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} required placeholder="Min 6 characters"
                  className="input-field pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-amazon-blue-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <><FaSignInAlt size={14} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to Amazon Clone's Conditions of Use.
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">New to Amazon Clone? {' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="text-amazon hover:underline font-medium">
              Create your account
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 card p-3 text-xs text-gray-500 dark:text-gray-400">
          <p className="font-semibold mb-1 dark:text-gray-300">🔑 Demo Credentials:</p>
          <p>Admin: admin@amazonclone.com / admin123</p>
          <p>User: rahul@example.com / user1234</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
