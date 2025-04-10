export const BASE_URL = 'http://localhost:3030';

// Клиентски пътища
export const Path = {
    Home: '/',
    Login: '/login',
    Register: '/register',
    Logout: '/logout',
    Consoles: '/consoles',
    ConsoleCreate: '/consoles/create',
    ConsoleDetails: '/consoles/:consoleId',
    ConsoleEdit: '/consoles/:consoleId/edit',
    Profile: '/profile',
    ProfileEdit: '/profile/edit',
};

// Консолидирана API структура (jsonstore - за операции без филтриране)
export const API = {
    auth: {
        login: `${BASE_URL}/users/login`,
        register: `${BASE_URL}/users/register`,
        logout: `${BASE_URL}/users/logout`,
    },
    data: {
        // Users (jsonstore - може би за authService.getUserProfilesByIds?)
        profiles: `${BASE_URL}/jsonstore/profiles`,
        profile: (userId) => `${BASE_URL}/jsonstore/profiles/${userId}`,

        // Consoles (jsonstore)
        consoles: `${BASE_URL}/jsonstore/consoles`,
        console: (consoleId) => `${BASE_URL}/jsonstore/consoles/${consoleId}`,

        // Likes (jsonstore)
        likes: `${BASE_URL}/jsonstore/likes`,

        // Comments (jsonstore)
        comments: `${BASE_URL}/jsonstore/comments`,
    }
};

// Плоска структура за лесен достъп (основно /data/ ендпоинти за CRUD операции с филтриране)
export const ApiPath = {
    // Auth
    login: API.auth.login,
    register: API.auth.register,
    logout: API.auth.logout,

    // Consoles (пътища към data)
    consoles: API.data.consoles,
    console: API.data.console,

    // Likes (пътища към data )
    likes: `${BASE_URL}/data/likes`,

    // Comments (пътища към /data/comments за CRUD и филтриране)
    comments: `${BASE_URL}/data/comments`,
};

// За обратна съвместимост за API_Paths
export const API_Paths = ApiPath; 