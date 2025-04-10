import {
    BASE_URL,
    Path,
    API,
    ApiPath,
    API_Paths // Тестваме и алиаса
} from '../../utils/pathUtils';

// Групираме тестовете за пътищата и URL-ите
describe('Utils: pathUtils', () => {

    // Тест за BASE_URL
    describe('BASE_URL', () => {
        it('should be defined and have the correct value', () => {
            expect(BASE_URL).toBeDefined();
            expect(BASE_URL).toBe('http://localhost:3030');
        });
    });

    // Тест за Path (клиентски пътища)
    describe('Path', () => {
        it('should be defined and be an object', () => {
            expect(Path).toBeDefined();
            expect(typeof Path).toBe('object');
            expect(Path).not.toBeNull();
        });

        it('should contain the correct client-side paths', () => {
            expect(Path.Home).toBe('/');
            expect(Path.Login).toBe('/login');
            expect(Path.Register).toBe('/register');
            expect(Path.Logout).toBe('/logout');
            expect(Path.Consoles).toBe('/consoles');
            expect(Path.ConsoleCreate).toBe('/consoles/create');
            expect(Path.ConsoleDetails).toBe('/consoles/:consoleId');
            expect(Path.ConsoleEdit).toBe('/consoles/:consoleId/edit');
            expect(Path.Profile).toBe('/profile');
            expect(Path.ProfileEdit).toBe('/profile/edit');
        });

        it('should contain only the expected keys', () => {
            const expectedKeys = [
                'Home', 'Login', 'Register', 'Logout', 'Consoles',
                'ConsoleCreate', 'ConsoleDetails', 'ConsoleEdit',
                'Profile', 'ProfileEdit'
            ];
            expect(Object.keys(Path)).toEqual(expect.arrayContaining(expectedKeys));
            expect(Object.keys(Path).length).toBe(expectedKeys.length);
        });
    });

    // Тест за API (структурирани jsonstore ендпойнти)
    describe('API', () => {
        it('should be defined and have auth and data properties', () => {
            expect(API).toBeDefined();
            expect(API).toHaveProperty('auth');
            expect(API).toHaveProperty('data');
            expect(typeof API.auth).toBe('object');
            expect(typeof API.data).toBe('object');
        });

        it('should contain correct auth endpoints', () => {
            expect(API.auth.login).toBe(`${BASE_URL}/users/login`);
            expect(API.auth.register).toBe(`${BASE_URL}/users/register`);
            expect(API.auth.logout).toBe(`${BASE_URL}/users/logout`);
        });

        it('should contain correct data endpoints (jsonstore)', () => {
            expect(API.data.profiles).toBe(`${BASE_URL}/jsonstore/profiles`);
            expect(API.data.consoles).toBe(`${BASE_URL}/jsonstore/consoles`);
            expect(API.data.likes).toBe(`${BASE_URL}/jsonstore/likes`);
            expect(API.data.comments).toBe(`${BASE_URL}/jsonstore/comments`);
        });

        it('should contain correct data endpoint functions (jsonstore)', () => {
            const testUserId = 'user123';
            const testConsoleId = 'consoleABC';
            expect(API.data.profile(testUserId)).toBe(`${BASE_URL}/jsonstore/profiles/${testUserId}`);
            expect(API.data.console(testConsoleId)).toBe(`${BASE_URL}/jsonstore/consoles/${testConsoleId}`);
        });
    });

    // Тест за ApiPath (плоски /data/ ендпойнти)
    describe('ApiPath', () => {
        it('should be defined and be an object', () => {
            expect(ApiPath).toBeDefined();
            expect(typeof ApiPath).toBe('object');
            expect(ApiPath).not.toBeNull();
        });

        it('should contain correct auth endpoints (referencing API.auth)', () => {
            expect(ApiPath.login).toBe(API.auth.login); // Проверка за референция
            expect(ApiPath.register).toBe(API.auth.register);
            expect(ApiPath.logout).toBe(API.auth.logout);
        });

        it('should contain correct console endpoints (referencing API.data)', () => {
            expect(ApiPath.consoles).toBe(API.data.consoles); // Проверка за референция
            expect(ApiPath.console).toBe(API.data.console); // Проверка за референция (на функцията)
            // Допълнително тестваме функцията
            const testConsoleId = 'consoleXYZ';
            expect(ApiPath.console(testConsoleId)).toBe(`${BASE_URL}/jsonstore/consoles/${testConsoleId}`);
        });

        it('should contain correct likes endpoint (/data/)', () => {
            expect(ApiPath.likes).toBe(`${BASE_URL}/data/likes`);
        });

        it('should contain correct comments endpoint (/data/)', () => {
            expect(ApiPath.comments).toBe(`${BASE_URL}/data/comments`);
        });

        it('should contain only the expected keys', () => {
            const expectedKeys = ['login', 'register', 'logout', 'consoles', 'console', 'likes', 'comments'];
            expect(Object.keys(ApiPath)).toEqual(expect.arrayContaining(expectedKeys));
            expect(Object.keys(ApiPath).length).toBe(expectedKeys.length);
        });
    });

    // Тест за API_Paths (алиас)
    describe('API_Paths', () => {
        it('should be strictly equal to ApiPath', () => {
            expect(API_Paths).toBe(ApiPath); // Проверка за идентичност (===)
        });
    });

}); 