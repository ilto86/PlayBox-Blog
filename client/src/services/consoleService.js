import * as request from '../lib/request';
import { API_Paths } from '../utils/pathUtils';

export const getAll = async () => {
    const result = await request.get(API_Paths.consoles);
    return Object.values(result);
};

export const getOne = async (consoleId) => {
    const result = await request.get(API_Paths.console(consoleId));
    return result;
};

export const create = async (consoleData) => {
    const result = await request.post(API_Paths.consoles, consoleData);
    return result;
};

export const edit = async (consoleId, consoleData) => {
    const result = await request.put(API_Paths.console(consoleId), consoleData);
    return result;
};

export const remove = async (consoleId) => {
    await request.remove(API_Paths.console(consoleId));
};