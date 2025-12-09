import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { authStore } from '../stores/authStore';

export function CallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse URL Parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        if (error) {
          console.error('❌ ORCID returned an error:', error, errorDescription);
          throw new Error(errorDescription || error);
        }

        if (!code) {
          console.error('❌ No authorization code received');
          throw new Error('No authorization code received');
        }

        setStatus('processing');

        // Send code to Backend
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';

        const response = await fetch(`${apiUrl}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Backend error:', errorData);
          
          const errorMessage = 
            errorData?.error?.message || 
            errorData?.message ||
            'Unable to connect to authentication server. Please try again.';
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        const result = data;
        
        if (!result.user || !result.token) {
          console.error('❌ Invalid response structure');
          throw new Error('Invalid response from server');
        }

        // Store token and user in authStore
        authStore.loginWithBackend(result.token, result.user);

        setStatus('success');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);

      } catch (err) {
        console.error('Authentication failed:', err);
        
        setStatus('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Authentication failed'
        );

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 5000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-emerald-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {status === 'processing' && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xl text-white">Authenticating with ORCID...</p>
            <p className="text-sm text-green-300">Connecting to backend server...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-xl text-white">Authentication successful!</p>
            <p className="text-green-300">Redirecting to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-xl text-white">Authentication failed</p>
            <p className="text-red-300">{errorMessage}</p>
            <p className="text-green-300 text-sm">Redirecting to login...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
