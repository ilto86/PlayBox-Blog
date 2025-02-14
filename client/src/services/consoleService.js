const baseUrl = 'http://localhost:3030/jsonstore/consoles';

export const getAll = async () => {
    const response = await fetch(baseUrl);
    const result = await response.json();

    const consoles = Object.values(result);

    return consoles;
};

export const create = async (consoleData) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(consoleData)
    });

    const result = await response.json();

    return result;
};