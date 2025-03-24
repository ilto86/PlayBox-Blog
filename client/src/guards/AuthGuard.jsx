import { useAuthContext } from '../context/authContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function AuthGuard() {
    const { isAuthenticated } = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
} 