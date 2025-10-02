import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import type { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, isRestoring } = useAuthContext();

  if (!isRestoring && (!isAuthenticated || !user)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
