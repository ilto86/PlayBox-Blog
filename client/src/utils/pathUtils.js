const BASE_URL = 'http://localhost:3030';

export const Path = {
    Home: '/',
    Login: '/login',
    Register: '/register',
    Logout: '/logout',
    Consoles: '/consoles',
    ConsoleCreate: '/consoles/create',
    ConsoleDetails: '/consoles/:consoleId',
};

export const API_Paths = {
    login: `${BASE_URL}/users/login`,
    register: `${BASE_URL}/users/register`,
    logout: `${BASE_URL}/users/logout`,
    consoles: `${BASE_URL}/data/consoles`,
    console: (id) => `${BASE_URL}/data/consoles/${id}`,
}; 