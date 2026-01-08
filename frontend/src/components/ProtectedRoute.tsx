import { Navigate } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { isAuthenticated } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route wrapper - redirects to login if not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Required for proper reactivity when isAuthenticated signal changes
  useSignals();

  if (!isAuthenticated.value) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}






