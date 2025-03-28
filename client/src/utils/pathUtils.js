export const BASE_URL = 'http://localhost:3030';

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

// Структура отразяваща архитектурата на сървъра
export const API = {
    auth: {
        login: `${BASE_URL}/users/login`,
        register: `${BASE_URL}/users/register`,
        logout: `${BASE_URL}/users/logout`,
    },
    data: {
        profiles: `${BASE_URL}/jsonstore/profiles`,
        profile: (userId) => `${BASE_URL}/jsonstore/profiles/${userId}`,
        consoles: `${BASE_URL}/jsonstore/consoles`,
        console: (consoleId) => `${BASE_URL}/jsonstore/consoles/${consoleId}`,
        userConsoles: (userId) => `${BASE_URL}/jsonstore/consoles?where=_ownerId%3D%22${userId}%22`,
        likes: `${BASE_URL}/jsonstore/likes`,
        comments: `${BASE_URL}/jsonstore/comments`,
        consoleLikes: (consoleId) => `${BASE_URL}/jsonstore/likes?where=consoleId%3D%22${consoleId}%22`,
        userLikes: (userId) => `${BASE_URL}/jsonstore/likes?where=userId%3D%22${userId}%22`,
        consoleComments: (consoleId) => `${BASE_URL}/jsonstore/comments?where=consoleId%3D%22${consoleId}%22`,
    }
};

// За обратна съвместимост
export const API_Paths = {
    login: API.auth.login,
    register: API.auth.register,
    logout: API.auth.logout,
    profile: API.data.profiles,
    consoles: API.data.consoles,
    likes: API.data.likes,
    comments: API.data.comments,
}; 