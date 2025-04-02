import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useLocalStorage } from '../hooks/useLocalStorage';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';
import { Path } from '../utils/pathUtils';
import { DEFAULT_AVATAR } from '../utils/constants';

const AuthContext = createContext();

const formatUsername = (email) => email?.split('@')[0] || 'User';

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useLocalStorage('auth', {});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loginSubmitHandler = async (values) => {
        setError(null);
        try {
            const basicAuthResult = await authService.login(values.email, values.password);
            
            let profileData = null;
            try {
                profileData = await profileService.getProfile(basicAuthResult._id);
            } catch (profileError) {
                profileData = {
                    username: formatUsername(basicAuthResult.email),
                    imageUrl: DEFAULT_AVATAR,
                    _id: basicAuthResult._id
                };
            }

            const fullUserData = {
                ...basicAuthResult,
                username: profileData?.username || formatUsername(basicAuthResult.email),
                imageUrl: profileData?.imageUrl || DEFAULT_AVATAR,
                _id: basicAuthResult._id
            };

            setAuth(fullUserData);
            return fullUserData;

        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            throw err;
        }
    };

    const registerSubmitHandler = async (values) => {
        setError(null);
        try {
            const result = await authService.register(values.email, values.password);
            setAuth(result);
            navigate(Path.Home);
            return result;
        } catch (err) {
            setError(err.message || 'Registration failed.');
            throw err;
        }
    };

    const logoutHandler = async () => {
        setError(null);
        try {
            if (auth?.accessToken) {
                await authService.logout();
            }
        } catch (logoutError) {
            console.error('Logout failed:', logoutError);
        } finally {
            setAuth({});
            navigate(Path.Home);
        }
    };

    const updateUser = async (userData) => {
        setAuth(state => ({
            ...state,
            ...userData
        }));
    };

    const contextValues = {
        loginSubmitHandler,
        registerSubmitHandler,
        logoutHandler,
        username: auth?.username,
        email: auth?.email,
        userId: auth?._id,
        isAuthenticated: !!auth?.accessToken,
        updateUser,
        imageUrl: auth?.imageUrl || DEFAULT_AVATAR,
        error,
        setError
    };

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    );
};

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

export default AuthContext; 