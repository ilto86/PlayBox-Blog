import { useAuthContext } from '../context/authContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function GuestGuard() {
    const { isAuthenticated } = useAuthContext();

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <Outlet />;
} 