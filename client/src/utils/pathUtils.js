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
        // Auth
        login: `${BASE_URL}/users/login`,
        register: `${BASE_URL}/users/register`,
        logout: `${BASE_URL}/users/logout`,
    },
    data: {
        // Users
        profiles: `${BASE_URL}/jsonstore/profiles`,
        profile: (userId) => `${BASE_URL}/jsonstore/profiles/${userId}`,

        // Consoles
        consoles: `${BASE_URL}/jsonstore/consoles`,
        console: (consoleId) => `${BASE_URL}/jsonstore/consoles/${consoleId}`,

        // User Consoles
        userConsoles: (userId) => `${BASE_URL}/jsonstore/consoles?where=_ownerId%3D%22${userId}%22`,
        
        // Likes
        likes: `${BASE_URL}/jsonstore/likes`,
        consoleLikes: (consoleId) => `${BASE_URL}/jsonstore/likes?where=consoleId%3D%22${consoleId}%22`,
        
        // User Likes
        userLikes: (userId) => `${BASE_URL}/jsonstore/likes?where=userId%3D%22${userId}%22`,
        
        // Comments
        comments: `${BASE_URL}/jsonstore/comments`,
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