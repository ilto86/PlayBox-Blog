import * as request from '../lib/request';
import { ApiPath } from '../utils/pathUtils';
import { normalizeManufacturerName } from '../utils/manufacturerUtils';

const baseUrl = 'http://localhost:3030/jsonstore/consoles';

export const getAll = async () => {
    try {
        const result = await request.get(ApiPath.consoles);
        return  Object.values(result || {});
        // result;
    } catch (error) {
        console.error('Service Error - getAll consoles:', error);
        // console.error('Error fetching consoles:', error);
        throw error;
    }
};

export const getOne = async (consoleId) => {
    try {
        const result = await request.get(ApiPath.console(consoleId));
        // const result = await request.get(`${baseUrl}/${consoleId}`);
        return result;
    } catch (error) {
        console.error(`Service Error - getOne console (${consoleId}):`, error);
        // console.error('Error fetching console:', error);
        throw error;
    }
};

export const create = async (consoleData) => {
    try {
        // Нормализираме името на производителя преди да го запазим
        const normalizedData = {
            ...consoleData,
            manufacturer: normalizeManufacturerName(consoleData.manufacturer)
        };
        
        const result = await request.post(ApiPath.consoles, normalizedData);
        return result;
    } catch (error) {
        console.error('Service Error - create console:', error);
        // console.error('Error creating console:', error);
        throw error;
    }
};

export const edit = async (consoleId, consoleData) => {
    try {
        // Нормализираме името на производителя преди да го запазим
        const normalizedData = {
            ...consoleData,
            manufacturer: normalizeManufacturerName(consoleData.manufacturer)
        };
        
        const result = await request.put(ApiPath.console(consoleId), normalizedData);
        //const result = await request.put(`${baseUrl}/${consoleId}`, normalizedData);
        return result;
    } catch (error) {
        console.error(`Service Error - edit console (${consoleId}):`, error);
        // console.error('Error updating console:', error);
        throw error;
    }
};

export const remove = async (consoleId) => {
    try {
        await request.remove(ApiPath.console(consoleId));
        // await request.remove(`${baseUrl}/${consoleId}`);
    } catch (error) {
        console.error(`Service Error - remove console (${consoleId}):`, error);
        //console.error('Error deleting console:', error);
        throw error;
    }
};

export const getUserConsoles = async (userId) => {
    // Този код изтегля ВСИЧКИ конзоли и филтрира на клиента.
    // Ако беше моят бекенд код, щях да имплементирам филтриране на сървъра/API.
    // Примерна заявка към API с филтър (ако се поддържаше и този Practice server):
    // const query = `?where=_ownerId%3D"${userId}"`;
    // const result = await request.get(BASE_URL + query);
    // return Object.values(result || {});

    // Текущия код работи, но може да е бавен при много данни:
    try {
        const result = await request.get(ApiPath.userConsoles(userId));
        // const result = await request.get(baseUrl);

        // Ако API-то връща обект, а не масив при филтриране:
        return Object.values(result || {}).filter(console => console._ownerId === userId);
        // Ако API-то връща директно масив при филтриране:
        // return result || [];
    } catch (error) {
        console.error(`Service Error - getUserConsoles (${userId}):`, error);
        // console.error('Error fetching user consoles:', error);
        return [];
    }
};

// export const deleteConsole = async (consoleId) => {
//     try {
//         await request.remove(ApiPath.console(consoleId));
//         // await request.remove(`${baseUrl}/${consoleId}`);
//     } catch (error) {
//         console.error(`Service Error - remove console (${consoleId}):`, error);
//         // console.error('Error deleting console:', error);
//         throw error;
//     }
// };
    
// export const getConsole = async (consoleId) => {
//     try {
//         const result = await request.get(ApiPath.console(consoleId));
//         // const result = await request.get(`${baseUrl}/${consoleId}`);
//         return result;
//     } catch (error) {
//         console.error(`Service Error - getOne console (${consoleId}):`, error);
//         // console.error('Error fetching console:', error);
//         throw error;
//     }
// };