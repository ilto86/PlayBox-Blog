import * as request from '../lib/request';
import { API } from '../utils/pathUtils';

export const getAll = async () => {
    const result = await request.get(API.data.profiles);
    return Object.values(result);
};

export const getOne = async (profileId) => {
    const result = await request.get(`${API.data.profiles}/${profileId}`);
    return result;
};

export const create = async (profileData) => {
    const result = await request.post(API.data.profiles, profileData);
    return result;
};

export const edit = async (profileId, profileData) => {
    const result = await request.put(`${API.data.profiles}/${profileId}`, profileData);
    return result;
};

export const remove = async (profileId) => {
    const result = await request.remove(`${API.data.profiles}/${profileId}`);
    return result;
};

export const getProfile = async (userId) => {
    try {
        const profiles = await request.get(API.data.profiles);
        const profile = Object.values(profiles).find(p => p._ownerId === userId);
        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};

export const updateProfile = async (userId, profileData) => {
    try {
        const profiles = await request.get(API.data.profiles);
        const existingProfile = Object.values(profiles).find(p => p._ownerId === userId);

        if (existingProfile) {
            const result = await request.put(`${API.data.profiles}/${existingProfile._id}`, {
                ...existingProfile,
                ...profileData,
                _ownerId: userId
            });
            return result;
        } else {
            const result = await request.post(API.data.profiles, {
                ...profileData,
                _ownerId: userId
            });
            return result;
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

export const uploadImage = async (userId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const result = await fetch(`${API.data.profile(userId)}/image`, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Authorization': localStorage.getItem('accessToken')
        }
    });
    
    if (!result.ok) {
        throw new Error('Failed to upload image');
    }
    
    return await result.json();
};

export const changePassword = async (userId, passwordData) => {
    const result = await request.post(API.updateProfile(userId), {
        ...passwordData,
        action: 'changePassword'
    });
    return result;
};

export const createProfile = async (userId, profileData) => {
    try {
        const result = await request.post(API.data.profiles, {
            ...profileData,
            _ownerId: userId
        });
        return result;
    } catch (error) {
        console.error('Error creating profile:', error);
        throw error;
    }
};

export const removeProfileByUserId = async (userId) => {
    try {
        const profiles = await request.get(API.data.profiles);
        const profileEntry = Object.entries(profiles).find(([_, profile]) => profile._ownerId === userId);
        
        if (profileEntry) {
            const [profileId, _] = profileEntry;
            await request.remove(`${API.data.profiles}/${profileId}`);
            console.log(`Profile with ID ${profileId} deleted successfully`);
            return true;
        } else {
            console.log(`No profile found for user ID ${userId}`);
            return false;
        }
    } catch (error) {
        console.error('Error removing profile by userId:', error);
        return false;
    }
}; 