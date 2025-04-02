import { useAuthContext } from '../context/authContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Path } from '../utils/pathUtils';

export default function AuthGuard() {
    const { isAuthenticated } = useAuthContext();
    const location = useLocation();

    console.log(`AuthGuard: Checking path: ${location.pathname}, isAuthenticated: ${isAuthenticated}`);

    if (!isAuthenticated) {
        console.log(`AuthGuard: Not authenticated! Redirecting to login from ${location.pathname}`);
        return <Navigate to={Path.Login} state={{ from: location.pathname }} replace />;
    }

    console.log(`AuthGuard: Authenticated! Allowing access to ${location.pathname}`);
    return <Outlet />;
} 