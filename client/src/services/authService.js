import * as request from '../lib/request';
import { API, BASE_URL } from '../utils/pathUtils';
import * as profileService from './profileService';
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
        
        // Delete profile data
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
            // Continue with deletion of other data
        }
        
        // Delete consoles - FIX: Corrected variable name from 'console' to 'userConsole'
        try {
            const userConsoles = await consoleService.getUserConsoles(userId);
            console.log('User consoles:', userConsoles);
            
            if (userConsoles?.length > 0) {
                for (const userConsole of userConsoles) {
                    console.log('Deleting console:', userConsole._id);
                    await consoleService.remove(userConsole._id);
                }
                console.log('All consoles deleted successfully');
            }
        } catch (consoleError) {
            console.error('Error deleting consoles:', consoleError);
            // Continue with account deletion
        }
        
        // Delete user account
        console.log('Attempting to delete user account');
        try {
            await request.remove(`${BASE_URL}/users/me`);
            console.log('Account deleted successfully');
        } catch (error) {
            console.error('Error deleting user account:', error);
            throw new Error('Failed to delete account');
        }
        
        console.log('Logging out after successful deletion');
        await logout();
        localStorage.removeItem('auth');
        return true;
    } catch (error) {
        console.error('Account deletion failed:', error);
        throw error;
    }
};