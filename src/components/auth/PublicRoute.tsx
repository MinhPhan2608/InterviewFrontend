import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts';

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
