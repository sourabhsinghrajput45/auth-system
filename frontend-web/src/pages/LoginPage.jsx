import React, { useState } from 'react';
import authAPI from '../api/authAPI';
import Button from '../components/Button';

export default function LoginPage({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const result = await authAPI.login(email, password);

  if (result.ok) {
    onLoginSuccess(result.data); //  ONLY THIS
  } else {
    setError(result.data.message || "Login failed");
  }

  setLoading(false);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5 font-sans">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-7 text-center text-gray-900">Log In</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              className="p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className="p-4 bg-green-100 text-green-800 rounded-md border border-green-300 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-800 rounded-md border border-red-300 text-sm">
              {error}
            </div>
          )}

          <Button disabled={loading || !email || !password} type="submit">
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <span
            onClick={() => onNavigate('signup')}
            className="text-blue-600 cursor-pointer font-medium underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
