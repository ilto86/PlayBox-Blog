import * as request from '../lib/request';
import { API_Paths } from '../utils/pathUtils';

export const getProfile = async (userId) => {
    const result = await request.get(API_Paths.profile);
    return result;
};

export const updateProfile = async (userId, profileData) => {
    const result = await request.put(API_Paths.updateProfile(userId), profileData);
    return result;
};

export const changePassword = async (userId, passwordData) => {
    const result = await request.post(API_Paths.updateProfile(userId), {
        ...passwordData,
        action: 'changePassword'
    });
    return result;
}; 