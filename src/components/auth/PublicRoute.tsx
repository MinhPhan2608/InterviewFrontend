import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts';

// Redirect logged-in users away from public pages (e.g., login page)
const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;

