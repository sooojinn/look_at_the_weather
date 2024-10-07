import { Navigate } from 'react-router-dom';
import { isLogin } from '@/api/instance';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isLogin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
