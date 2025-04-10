import * as request from '../lib/request';
import { API, BASE_URL } from '../utils/pathUtils';
import * as consoleService from './consoleService';

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
    try {
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        const userId = auth._id;
        const token = auth.accessToken;
        
        if (!userId || !token) {
            throw new Error('User not found or not authenticated');
        }
        
        console.log('Starting account deletion process for user:', userId);
        
        try {
            const profiles = await request.get(API.data.profiles);
            console.log('Fetched profiles:', profiles);
            
            const profileEntry = Object.entries(profiles).find(([_, profile]) => profile._ownerId === userId);
            
            if (profileEntry) {
                const [profileId] = profileEntry;
                console.log('Found profile to delete:', profileId);
                await request.remove(`${API.data.profiles}/${profileId}`);
                console.log('Profile deleted successfully');
            } else {
                console.log('No profile found for this user');
            }
        } catch (profileError) {
            console.error('Error deleting profile:', profileError);
        }
        
        try {
            const userConsoles = await consoleService.getUserConsoles(userId);
            console.log('User consoles:', userConsoles);
            
            if (userConsoles?.length > 0) {
                for (const console of userConsoles) {
                    console.log('Deleting console:', console._id);
                    await consoleService.remove(console._id);
                }
                console.log('All consoles deleted successfully');
            }
        } catch (consoleError) {
            console.error('Error deleting consoles:', consoleError);
        }
        
        console.log('Attempting to delete user account');
        const response = await fetch(`${BASE_URL}/users/me`, {
            method: 'DELETE',
            headers: { 'X-Authorization': token }
        });
        
        console.log('Delete account response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`Failed to delete account: ${response.status}`);
        }
        
        console.log('Account deleted successfully, logging out');
        await logout();
        localStorage.removeItem('auth');
        return true;
    } catch (error) {
        console.error('Account deletion failed:', error);
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