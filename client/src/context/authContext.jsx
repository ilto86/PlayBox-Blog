import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { useErrorHandling } from '../hooks/useErrorHandling';
import * as authService from '../services/authService';
import * as profileService from '../services/profileService';
import { Path } from '../utils/pathUtils';
import { DEFAULT_AVATAR } from '../utils/constants';

const AuthContext = createContext();

const formatUsername = (email) => email?.split('@')[0] || 'User';

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useLocalStorage('auth', {});
    const { 
        error,  
        clearError, 
        executeWithErrorHandling 
    } = useErrorHandling();
    const navigate = useNavigate();

    const loginSubmitHandler = async (values) => {
        return executeWithErrorHandling(async () => {
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
        }, { errorPrefix: '' });
    };

    const registerSubmitHandler = async (values) => {
        return executeWithErrorHandling(async () => {
            const result = await authService.register(values.email, values.password);
            
            const fullUserData = {
                ...result,
                username: formatUsername(result.email),
                imageUrl: DEFAULT_AVATAR
            };
            
            setAuth(fullUserData);
            navigate(Path.Home);
            return fullUserData;
        }, { errorPrefix: 'Registration failed' });
    };

    const logoutHandler = async () => {
        return executeWithErrorHandling(async () => {
            if (auth?.accessToken) {
                await authService.logout();
            }
            setAuth({});
            navigate(Path.Home);
        }, { errorPrefix: 'Logout failed' });
    };

    const updateUser = async (userData) => {
        setAuth(state => ({
            ...state,
            ...userData
        }));
    };

    const deleteAccountHandler = async () => {
        return executeWithErrorHandling(async () => {
            await authService.deleteAccount();
            setAuth({});
        }, {
            errorPrefix: 'Failed to delete account'
        });
    };

    const contextValues = {
        loginSubmitHandler,
        registerSubmitHandler,
        logoutHandler,
        username: auth?.username || formatUsername(auth?.email),
        email: auth?.email,
        userId: auth?._id,
        isAuthenticated: !!auth?.accessToken,
        updateUser,
        imageUrl: auth?.imageUrl || DEFAULT_AVATAR,
        error,
        clearError,
        deleteAccountHandler,
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