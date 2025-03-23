import * as request from '../lib/request';
import { API_Paths } from '../utils/pathUtils';

export const login = async (email, password) => {
    const result = await request.post(API_Paths.login, { email, password });
    return result;
};

export const register = async (email, password) => {
    const result = await request.post(API_Paths.register, { email, password });
    return result;
};

export const logout = async () => {
    await request.get(API_Paths.logout);
};