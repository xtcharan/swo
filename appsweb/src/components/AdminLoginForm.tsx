'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { theme } from '../styles/theme';

export const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(`Error: ${error.message}`);
    } else {
      setMessage('Login successful! Redirecting...');
    }
    setLoading(false);
  };

  const handleActivateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Call the Supabase Edge Function for whitelisted OTP
    const { data, error } = await supabase.functions.invoke('admin-otp-request', {
      body: { email },
    });

    if (error) {
      setError(error.message || 'An error occurred while sending the code.');
    } else {
      setMessage(data?.message || 'Activation code sent to your email!');
      // Future: Navigate to OTP verification page
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full overflow-hidden mb-6">
            <img
              src="/logo.webp"
              alt="SWO Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Admin Panel Login
          </h1>
          <p className="text-sm text-gray-600">
            Access the SWO admin dashboard
          </p>
        </div>

        {!isActivating ? (
          // Password Login Form (for returning users)
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{
                  borderColor: '#ddd',
                  borderRadius: `${theme.borderRadius.md}px`
                }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{
                  borderColor: '#ddd',
                  borderRadius: `${theme.borderRadius.md}px`
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
              style={{
                backgroundColor: theme.colors.primary
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                First time here or forgot your password?{' '}
                <button
                  type="button"
                  onClick={() => setIsActivating(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  style={{ color: theme.colors.primary }}
                >
                  Activate your account
                </button>
              </p>
            </div>
          </form>
        ) : (
          // Account Activation Form (for new users)
          <form onSubmit={handleActivateRequest} className="space-y-6">
            <div>
              <label htmlFor="activation-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="activation-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                style={{
                  borderColor: '#ddd',
                  borderRadius: `${theme.borderRadius.md}px`
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Sending Code...' : 'Send Activation Code'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsActivating(false)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  style={{ color: theme.colors.primary }}
                >
                  Sign in with password
                </button>
              </p>
            </div>
          </form>
        )}

        <div className="mt-6 space-y-4">
          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
