import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success('Logged in successfully');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-ink-800 rounded-xl shadow-lg border border-ink-200 dark:border-ink-700">
        <h2 className="text-3xl font-display font-bold text-center">Welcome Back</h2>
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full p-3 rounded-lg border border-ink-300 dark:border-ink-600 bg-canvas-light dark:bg-canvas-dark focus:ring-2 focus:ring-marigold-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full p-3 rounded-lg border border-ink-300 dark:border-ink-600 bg-canvas-light dark:bg-canvas-dark focus:ring-2 focus:ring-marigold-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-center text-sm text-ink-600 dark:text-ink-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-marigold-600 dark:text-marigold-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
