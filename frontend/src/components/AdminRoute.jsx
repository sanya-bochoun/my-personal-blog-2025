import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 