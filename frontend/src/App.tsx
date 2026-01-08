import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { CallbackPage } from './pages/CallbackPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NewEntryPage } from './features/entry';
import { trpc, getTRPCClientConfig } from './utils/trpc';
import { initAuth, logout } from './stores/authStore';

export default function App() {
  // Create tRPC and React Query clients
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient(getTRPCClientConfig()));

  // Initialize auth on app load
  useEffect(() => {
    initAuth();

    // Check token validity on load
    const checkToken = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
        const token = localStorage.getItem('nobs_access_token');

        if (token) {
          const response = await fetch(`${apiUrl}/api/auth/check`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!response.ok) {
            // Token invalid - logout
            logout();
          }
        }
      } catch (error) {
        // Network error - don't logout, but log for debugging
        // User may be offline; we'll handle auth failure on next API call
        console.warn('Token validation check failed (network error):', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    checkToken();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entry/new"
              element={
                <ProtectedRoute>
                  <NewEntryPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}