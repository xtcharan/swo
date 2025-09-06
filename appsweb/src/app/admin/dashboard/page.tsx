'use client';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { theme } from '../../../styles/theme';

export default function AdminDashboard() {
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push('/'); // Redirect to the homepage after logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="/logo.webp"
                  alt="SWO Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && <span className="text-sm text-gray-600">{user.email}</span>}
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.surface
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back, Admin!</h2>

            <div className="space-y-6">
              <p className="text-gray-600">
                You have successfully logged into the admin panel.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard</h3>
                  <p className="text-gray-600">Overview of your admin controls</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
                  <p className="text-gray-600">Configure system preferences</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Reports</h3>
                  <p className="text-gray-600">View analytics and reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
