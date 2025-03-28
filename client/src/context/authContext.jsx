import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';
import { Path } from '../utils/pathUtils';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useLocalStorage('auth', {});
    const [error, setError] = useState(null);
    
    const formatUsername = (email) => {
        if (!email) {
            return '';
        }
        const username = email.split('@')[0];
        return username.charAt(0).toUpperCase() + username.slice(1);
    };

    const loginSubmitHandler = async (values) => {
        try {
            setError(null);
            const result = await authService.login(values.email, values.password);
            
            if (result) {
                // След успешен логин, зареждаме профилните данни
                const profileData = await profileService.getProfile(result._id);
                
                // Комбинираме auth данните с профилните данни
                const userData = {
                    ...result,
                    username: profileData?.username || formatUsername(result.email),
                    imageUrl: profileData?.imageUrl || ''
                };
                
                setAuth(userData);
                return true;
            } else {
                throw new Error('Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed');
            return false;
        }
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

    const updateUser = async (userData) => {
        // Обновяваме в localStorage
        setAuth(state => ({
            ...state,
            ...userData
        }));
    };

    const values = {
        loginSubmitHandler,
        registerSubmitHandler,
        logoutHandler,
        username: auth.username || formatUsername(auth?.email),
        email: auth?.email,
        userId: auth?._id,
        isAuthenticated: !!auth?.accessToken,
        updateUser,
        imageUrl: auth?.imageUrl,
        error,
        setError
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