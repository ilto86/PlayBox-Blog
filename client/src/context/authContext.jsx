import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(() => {
        const localStorageAuth = localStorage.getItem('auth');
        
        if (localStorageAuth) {
            return JSON.parse(localStorageAuth);
        }

        return {};
    });

    const [error, setError] = useState(null);

    const loginSubmitHandler = async (values) => {
        try {
            const result = await authService.login(values.email, values.password);
            
            setAuth(result);
            localStorage.setItem('auth', JSON.stringify(result));
            localStorage.setItem('accessToken', result.accessToken);
            
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Please try again.');
        }
    };

    const registerSubmitHandler = async (values) => {
        try {
            const result = await authService.register(values.email, values.password);
            
            setAuth(result);
            localStorage.setItem('auth', JSON.stringify(result));
            localStorage.setItem('accessToken', result.accessToken);
            
            navigate('/');
        } catch (error) {
            console.error('Register error:', error);
            setError(error.message || 'Registration failed. Please try again.');
        }
    };

    const logoutHandler = async () => {
        try {
            await authService.logout();
            
            
            localStorage.clear();   // Тук изчиствам всичко от localStorage
            
            setAuth({});
            navigate('/');
        } catch (error) {
            console.log('Logout error:', error);
            setError('Logout failed. Please try again.');
        }
    };

    const values = {
        loginSubmitHandler,
        registerSubmitHandler,
        logoutHandler,
        username: auth.username || auth.email,
        email: auth.email,
        userId: auth._id,
        isAuthenticated: !!auth.accessToken,
        error,
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }

    return context;
};