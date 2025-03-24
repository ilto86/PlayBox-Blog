import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import * as authService from '../services/authService';
import { Path } from '../utils/pathUtils';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useLocalStorage('auth', {});
    
    const formatUsername = (email) => {
        if (!email) {
            return '';
        }
        const username = email.split('@')[0];
        return username.charAt(0).toUpperCase() + username.slice(1);
    };

    const loginSubmitHandler = async (values) => {
        const result = await authService.login(values.email, values.password);
        setAuth(result);
    };

    const registerSubmitHandler = async (values) => {
        const result = await authService.register(values.email, values.password);
        setAuth(result);
        navigate(Path.Home);
    };

    const logoutHandler = async () => {
        await authService.logout();
        setAuth({});
        navigate(Path.Home);
    };

    const values = {
        loginSubmitHandler,
        registerSubmitHandler,
        logoutHandler,
        username: auth.username || formatUsername(auth?.email),
        email: auth?.email,
        userId: auth?._id,
        isAuthenticated: !!auth?.accessToken,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

// PropTypes validation
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};