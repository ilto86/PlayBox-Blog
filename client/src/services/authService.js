import * as request from '../lib/request';
import { API } from '../utils/pathUtils';
import { createProfile } from './profileService';


export const login = async (email, password) => {
    try {
        const result = await request.post(API.auth.login, {
            email,
            password,
        });
        return result;
    } catch (error) {
        throw new Error('Login or password don\'t match');
    }
};

export const register = async (email, password) => {
    try {
        const result = await request.post(API.auth.register, {
            email,
            password,
        });
        
        // Създаване на профил при регистрация
        await createProfile(result._id, { email, username: email.split('@')[0] });
        
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
        console.error('Logout error:', error);
        throw error;
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