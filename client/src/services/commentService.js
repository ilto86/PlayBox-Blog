import * as request from '../lib/request';
import { ApiPath } from '../utils/pathUtils';

export const create = async (consoleId, commentData) => {
    const newComment = await request.post(ApiPath.comments, {
        consoleId,
        text: commentData.text,
    });
    return newComment;
};

export const getByConsoleId = async (consoleId) => {
    try {
        const allCommentsResult = await request.get(ApiPath.comments);

        const allCommentsArray = Object.values(allCommentsResult || {});

        const filteredComments = allCommentsArray.filter(comment => comment.consoleId === consoleId);

        const sortedComments = filteredComments.sort((a, b) => (b._createdOn || 0) - (a._createdOn || 0));

        return sortedComments;

    } catch (error) {
        console.error(`Error fetching comments for console ${consoleId}:`, error);
        return [];
    }
};

export const remove = async (commentId) => {
    return request.remove(`${ApiPath.comments}/${commentId}`);
};