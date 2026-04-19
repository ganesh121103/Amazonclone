import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) navigate(redirect, { replace: true });
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      const data = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(data));
      toast.success(`Welcome, ${data.name.split(' ')[0]}! Account created.`);
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
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
          <h1 className="text-xl font-bold dark:text-white mb-5">Create account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                required placeholder="Your full name" className="input-field" />
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input type={showPwd ? 'text' : 'password'} value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required placeholder="Re-enter password" className="input-field" />
            </div>

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-amazon-blue-dark border-t-transparent rounded-full animate-spin" />
              ) : (
                <><FaUserPlus size={14} /> Create Account</>
              )}
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Already have an account? {' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="text-amazon hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
