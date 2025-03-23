const BASE_URL = 'http://localhost:3030';

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

export const API_Paths = {
    // Auth
    login: `${BASE_URL}/users/login`,
    register: `${BASE_URL}/users/register`,
    logout: `${BASE_URL}/users/logout`,
    
    // Users
    profile: `${BASE_URL}/jsonstore/users`,
    updateProfile: (userId) => `${BASE_URL}/jsonstore/users/${userId}`,
    
    // Consoles
    consoles: `${BASE_URL}/jsonstore/consoles`,
    console: (id) => `${BASE_URL}/jsonstore/consoles/${id}`,
    
    // Likes
    likes: `${BASE_URL}/jsonstore/likes`,
    consoleLikes: (consoleId) => `${BASE_URL}/jsonstore/likes?where=consoleId%3D%22${consoleId}%22`,
    userLikes: (userId) => `${BASE_URL}/jsonstore/likes?where=userId%3D%22${userId}%22`,
    
    // Comments
    comments: `${BASE_URL}/jsonstore/comments`,
    consoleComments: (consoleId) => `${BASE_URL}/jsonstore/comments?where=consoleId%3D%22${consoleId}%22`,
}; 