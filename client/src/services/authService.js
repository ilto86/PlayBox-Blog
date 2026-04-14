import * as request from '../lib/request';
import { API, BASE_URL } from '../utils/pathUtils';
import * as consoleService from './consoleService';
import { getToken, clearUserData } from './authService';

export const login = async (email, password) => {
    try {
        const result = await request.post(API.auth.login, {
            email,
            password,
        });

        localStorage.setItem('auth', JSON.stringify(result));
        return result;
    } catch (error) {
        throw new Error('Login or password don\'t match');
    }
};

export const register = async (email, password, username) => {
    try {
        const result = await request.post(API.auth.register, {
            email,
            password,
            username,
        });
        
        localStorage.setItem('auth', JSON.stringify(result));
        
        return result;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await request.get(API.auth.logout);
    } catch (error) {
        console.error('Logout request failed, proceeding with client cleanup:', error);
    } finally {
        localStorage.removeItem('auth');
    }
};

export const getCurrentUser = async (token) => {
    try {
        const result = await request.get(API.auth.me, {
            headers: {
                'X-Authorization': token,
            },
        });
        return result;
    } catch (error) {
        console.error('Failed to fetch current user:', error);
        throw error;
    }
};

export const deleteAccount = async () => {
    const response = await fetch(`${BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: {
            'X-Authorization': getToken()
        }
    });

    if (response.ok) {
        clearUserData();
    } else {
        const error = await response.json();
        throw error;
    }
};

export const getUserProfilesByIds = async (ownerIds) => {
    if (!ownerIds || ownerIds.length === 0) {
        return {};
    }

    try {
        const allProfiles = await request.get(API.data.profiles);

        const authorsMap = {};
        const ownerIdSet = new Set(ownerIds);

        for (const profileId in allProfiles) {
            const profile = allProfiles[profileId];
            if (profile._ownerId && ownerIdSet.has(profile._ownerId)) {
                authorsMap[profile._ownerId] = profile.username || profile.email || 'Unknown User';
            }
        }
        return authorsMap;
    } catch (error) {
        console.error('Error fetching user profiles by IDs:', error);
        return {};
    }
};