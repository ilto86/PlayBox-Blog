import * as request from '../lib/request';
import { ApiPath } from '../utils/pathUtils';

export const getByConsoleId = async (consoleId) => {
    const query = new URLSearchParams({
        where: `consoleId="${consoleId}"`
    });
    const url = `${ApiPath.likes}?${query}`;
    
    try {
        const result = await request.get(url);
        return Array.isArray(result) ? result : Object.values(result || {});
    } catch (error) {
        console.error(`Error fetching likes for console ${consoleId}:`, error);
        return [];
    }
};

export const likeConsole = async (consoleId) => {
    console.log(`Attempting to like console: ${consoleId}`);
    try {
        const newLike = await request.post(ApiPath.likes, { consoleId });
        console.log('Like successful:', newLike);
        return newLike;
    } catch (error) {
        console.error(`Error liking console ${consoleId}:`, error);
        throw error;
    }
};

export const unlikeConsole = async (likeId) => {
    if (!likeId) {
        console.error('Attempted to unlike without a likeId.');
        throw new Error('Like ID is required to unlike.');
    }
    console.log(`Attempting to unlike likeId: ${likeId}`);
    try {
        const result = await request.remove(`${ApiPath.likes}/${likeId}`);
        console.log('Unlike successful:', result);
        return result;
    } catch (error) {
        console.error(`Error unliking like ${likeId}:`, error);
        throw error;
    }
};

export const checkUserLike = async (consoleId, userId) => {
    try {
        const allLikesResult = await request.get(ApiPath.likes);
        const allLikesArray = Object.values(allLikesResult || {});

        const userLike = allLikesArray.find(like => like.consoleId === consoleId && like.userId === userId);

        console.log(`checkUserLike for console ${consoleId}, user ${userId}: Found like?`, userLike);

        return {
            hasLiked: Boolean(userLike),
            likeId: userLike?._id
        };
    } catch (error) {
        console.error(`Service Error - checkUserLike (${consoleId}, ${userId}):`, error);
        return { hasLiked: false, likeId: null };
    }
};

export const getLikes = async (consoleId) => {
    try {
        const allLikesResult = await request.get(ApiPath.likes);
        const allLikesArray = Object.values(allLikesResult || {});

        const consoleLikes = allLikesArray.filter(like => like.consoleId === consoleId);

        console.log(`getLikes for console ${consoleId}: Found likes array:`, consoleLikes);

        return consoleLikes.length;
    } catch (error) {
        console.error(`Service Error - getLikes (${consoleId}):`, error);
        return 0;
    }
};