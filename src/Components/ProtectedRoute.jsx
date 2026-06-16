import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/sign-up" replace />;
};

export default ProtectedRoute;
