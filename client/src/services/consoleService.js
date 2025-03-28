import * as request from '../lib/request';

const baseUrl = 'http://localhost:3030/jsonstore/consoles';

export const getAll = async () => {
    try {
        const result = await request.get(baseUrl);
        return result;
    } catch (error) {
        console.error('Error fetching consoles:', error);
        throw error;
    }
};

export const getOne = async (consoleId) => {
    try {
        const result = await request.get(`${baseUrl}/${consoleId}`);
        return result;
    } catch (error) {
        console.error('Error fetching console:', error);
        throw error;
    }
};

export const create = async (consoleData) => {
    try {
        const result = await request.post(baseUrl, consoleData);
        return result;
    } catch (error) {
        console.error('Error creating console:', error);
        throw error;
    }
};

export const edit = async (consoleId, consoleData) => {
    try {
        const result = await request.put(`${baseUrl}/${consoleId}`, consoleData);
        return result;
    } catch (error) {
        console.error('Error updating console:', error);
        throw error;
    }
};

export const remove = async (consoleId) => {
    try {
        await request.remove(`${baseUrl}/${consoleId}`);
    } catch (error) {
        console.error('Error deleting console:', error);
        throw error;
    }
};

export const getUserConsoles = async (userId) => {
    try {
        const result = await request.get(baseUrl);
        return Object.values(result || {}).filter(console => console._ownerId === userId);
    } catch (error) {
        console.error('Error fetching user consoles:', error);
        return [];
    }
};

export const deleteConsole = async (consoleId) => {
    try {
        await request.remove(`${baseUrl}/${consoleId}`);
    } catch (error) {
        console.error('Error deleting console:', error);
        throw error;
    }
};

export const getConsole = async (consoleId) => {
    try {
        const result = await request.get(`${baseUrl}/${consoleId}`);
        return result;
    } catch (error) {
        console.error('Error fetching console:', error);
        throw error;
    }
};