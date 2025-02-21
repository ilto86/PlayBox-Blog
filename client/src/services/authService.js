import * as request from '../lib/request';

const baseUrl = 'http://localhost:3030/users';

export const login = async (email, password) => {
    try {
        console.log('Sending login request with:', { email, password });
        
        const result = await request.post(`${baseUrl}/login`, {
            email,
            password
        });

        console.log('Login response:', result);
        return result;
    } catch (error) {
        console.error('Detailed login error:', error);
        throw error;
    }
};

export const register = async (email, password) => {
    const result = await request.post(`${baseUrl}/register`, {
        email,
        password
    });

    return result;
};

export const logout = async () => {
    await request.get(`${baseUrl}/logout`);
};