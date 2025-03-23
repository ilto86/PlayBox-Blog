import * as request from '../lib/request';
import { API_Paths } from '../utils/pathUtils';

// Likes
export const likeConsole = async (consoleId) => {
    const result = await request.post(API_Paths.likes, { consoleId });
    return result;
};

export const unlikeConsole = async (likeId) => {
    await request.remove(`${API_Paths.likes}/${likeId}`);
};

export const getConsoleLikes = async (consoleId) => {
    const result = await request.get(API_Paths.consoleLikes(consoleId));
    return result;
};

export const getUserLikes = async (userId) => {
    const result = await request.get(API_Paths.userLikes(userId));
    return result;
};

// Comments
export const createComment = async (consoleId, text) => {
    const result = await request.post(API_Paths.comments, {
        consoleId,
        text
    });
    return result;
};

export const getConsoleComments = async (consoleId) => {
    const result = await request.get(API_Paths.consoleComments(consoleId));
    return result;
};

export const deleteComment = async (commentId) => {
    await request.remove(`${API_Paths.comments}/${commentId}`);
};

export const editComment = async (commentId, text) => {
    const result = await request.put(`${API_Paths.comments}/${commentId}`, { text });
    return result;
}; 