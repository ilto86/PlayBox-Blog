const buildOptions = (data) => {
    const options = {
        method: 'GET',  // По подразбиране GET
        headers: {}
    };

    if (data) {
        options.method = 'POST';  // Ако имаме данни, променяме на POST
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    // Взимаме токена от auth данните
    const auth = localStorage.getItem('auth');
    if (auth) {
        try {
            const authData = JSON.parse(auth);
            if (authData.accessToken) {
                options.headers['X-Authorization'] = authData.accessToken;
            }
        } catch (err) {
            console.error('Error parsing auth data');
        }
    }

    return options;
};

const request = async (url, options) => {
    try {
        const response = await fetch(url, options);
        
        if (response.status === 204) {
            return {};
        }

        const result = await response.json();
        
        if (!response.ok) {
            throw result;
        }

        return result;
    } catch (error) {
        if (error.message) {
            throw error;
        }
        throw new Error(error);
    }
};

// Добавяме мемоизация на buildOptions
// const memoizedBuildOptions = memoize(buildOptions);

export const get = async (url) => {
    return await request(url, buildOptions());
};

export const post = async (url, data) => {
    return await request(url, buildOptions(data));
};

export const put = async (url, data) => {
    return await request(url, { ...buildOptions(data), method: 'PUT' });
};

export const remove = async (url) => {
    return await request(url, { ...buildOptions(), method: 'DELETE' });
};

export const patch = async (url, data) => {
    return await request(url, { ...buildOptions(data), method: 'PATCH' });
};
