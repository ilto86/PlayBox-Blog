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

// Консолидирана API структура
export const API = {
    auth: {
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
        userConsoles: (userId) => `${BASE_URL}/jsonstore/consoles?where=_ownerId%3D%22${userId}%22`,
        
        // Likes
        likes: `${BASE_URL}/jsonstore/likes`,
        consoleLikes: (consoleId) => `${BASE_URL}/jsonstore/likes?where=consoleId%3D%22${consoleId}%22`,
        userLikes: (userId) => `${BASE_URL}/jsonstore/likes?where=userId%3D%22${userId}%22`,
        
        // Comments
        comments: `${BASE_URL}/jsonstore/comments`,
        consoleComments: (consoleId) => `${BASE_URL}/jsonstore/comments?where=consoleId%3D%22${consoleId}%22`,
    }
};

// Плоска структура за лесен достъп (заменя API_Paths)
export const ApiPath = {
    // Auth
    login: API.auth.login,
    register: API.auth.register,
    logout: API.auth.logout,
    
    // Profiles
    profiles: API.data.profiles,
    profile: API.data.profile,
    
    // Consoles
    consoles: API.data.consoles,
    console: API.data.console,
    userConsoles: API.data.userConsoles,
    
    // Likes
    likes: API.data.likes,
    consoleLikes: API.data.consoleLikes,
    userLikes: API.data.userLikes,
    
    // Comments
    comments: API.data.comments,
    consoleComments: API.data.consoleComments,
};

// За обратна съвместимост - ще бъде премахнато в бъдеща версия
export const API_Paths = ApiPath; 