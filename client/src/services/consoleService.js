import * as request from '../lib/request';
import { ApiPath } from '../utils/pathUtils';
import { normalizeManufacturerName } from '../utils/manufacturerUtils';



export const getAll = async () => {
    try {
        const result = await request.get(ApiPath.consoles);
        return  Object.values(result || {});
    } catch (error) {
        console.error('Service Error - getAll consoles:', error);
        throw error;
    }
};

export const getOne = async (consoleId) => {
    try {
        const result = await request.get(ApiPath.console(consoleId));
        return result;
    } catch (error) {
        console.error(`Service Error - getOne console (${consoleId}):`, error);
        throw error;
    }
};

export const create = async (consoleData) => {
    try {
        const normalizedData = {
            ...consoleData,
            manufacturer: normalizeManufacturerName(consoleData.manufacturer)
        };
        
        const result = await request.post(ApiPath.consoles, normalizedData);
        return result;
    } catch (error) {
        console.error('Service Error - create console:', error);
        throw error;
    }
};

export const edit = async (consoleId, consoleData) => {
    try {
        const normalizedData = {
            ...consoleData,
            manufacturer: normalizeManufacturerName(consoleData.manufacturer)
        };
        
        const result = await request.put(ApiPath.console(consoleId), normalizedData);
        return result;
    } catch (error) {
        console.error(`Service Error - edit console (${consoleId}):`, error);
        throw error;
    }
};

export const remove = async (consoleId) => {
    try {
        await request.remove(ApiPath.console(consoleId));
    } catch (error) {
        console.error(`Service Error - remove console (${consoleId}):`, error);
        throw error;
    }
};

export const getUserConsoles = async (userId) => {
    const functionName = 'getUserConsoles';
    if (!userId) {
        console.warn(`${functionName}: userId is required.`);
        return [];
    }

    try {
        const allConsolesResult = await request.get(ApiPath.consoles);

        const consolesArray = Object.values(allConsolesResult || {});

        const userConsoles = consolesArray.filter(c => c._ownerId === userId);

        console.log(`${functionName} (${userId}): Found ${userConsoles.length} consoles for user after filtering ${consolesArray.length} total.`);
        return userConsoles;

    } catch (error) {
        console.error(`Service Error - ${functionName} (${userId}):`, error);
        throw error; 
    }
};