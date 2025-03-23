const buildOptions = (data) => {
    const options = {};

    if (data) {
        options.body = JSON.stringify(data);
        options.headers = {
            'content-type': 'application/json'
        };
    }

    const token = localStorage.getItem('accessToken');
    console.log('Current token:', token); // Тук дебъгвам за да видя текущия token    

    if (token) {
        options.headers = {
            ...options.headers,
            'X-Authorization': token
        };
    }

    return options;
};

const request = async (method, url, data) => {
    try {
        const response = await fetch(url, {
            ...buildOptions(data),
            method,
        });

        // Тук ако получа грешка 403 или сървърът е недостъпен, изчиствам authorization данните:
        if (response.status === 403) {
            localStorage.removeItem('authorization');
            localStorage.removeItem('accessToken');
            window.location.reload(); // Тук презареждам страницата
            return;
        }

        if (response.status === 204) {
            return {};
        }

        const result = await response.json();

        if (!response.ok) {
            throw result;
        }

        return result;
    } catch (error) {
        if (!window.navigator.onLine) {
            // Тук ако нямам интернет връзка, изчиствам authorization данните:
            localStorage.removeItem('auth');
            localStorage.removeItem('accessToken');
        }
        throw error;
    }
};

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');
export const put = request.bind(null, 'PUT');
export const remove = request.bind(null, 'DELETE');
export const patch = request.bind(null, 'PATCH');
