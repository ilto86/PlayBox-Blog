import { useAuthContext } from '../context/authContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AuthGuard() {
    const { isAuthenticated } = useAuthContext();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <Outlet />;
} 