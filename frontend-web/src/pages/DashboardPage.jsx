import React, { useEffect, useState } from "react";
import authAPI from "../api/authAPI";

export default function DashboardPage({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await authAPI.getCurrentUser();

        if (result.authenticated) {
          setUser({ email: result.email });
        } else {
          onLogout(); // bubble up to App
        }
      } catch {
        onLogout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [onLogout]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } finally {
      onLogout(); // always reset auth state
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5 font-sans">
        <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full">
          <p className="text-center text-gray-500 text-base">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5 font-sans">
      <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-7 text-center text-gray-900">
          Dashboard
        </h1>

        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-md border border-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="p-6 bg-gray-50 border border-gray-200 rounded-md mb-5">
          <p className="text-lg font-semibold mb-2 text-gray-900">
            Welcome!
          </p>
          <p className="text-blue-600 mb-3 font-medium">{user.email}</p>
          <p className="text-green-600 font-medium text-sm">
            Your email is verified. You have full access.
          </p>
        </div>

        <div className="mb-4">
          <div className="p-5 bg-blue-100 border border-blue-300 rounded-md">
            <h3 className="text-blue-900 font-semibold mb-3">
              Authentication Status
            </h3>
            <p className="text-blue-800 text-sm mb-1">✓ Authenticated</p>
            <p className="text-blue-800 text-sm mb-1">✓ Email Verified</p>
            <p className="text-blue-800 text-sm">✓ Full Portal Access</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 py-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
