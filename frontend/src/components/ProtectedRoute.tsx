import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route wrapper - redirects to login if not authenticated
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Access signal value - component will re-render when isAuthenticated changes
  if (!isAuthenticated.value) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}






