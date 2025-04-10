import {
    DEFAULT_AVATAR,
    DEFAULT_CONSOLE_IMAGE,
    MANUFACTURERS
} from '../../utils/constants';

// Групираме тестовете за константите
describe('Utils: constants', () => {

    // Тест за DEFAULT_AVATAR
    describe('DEFAULT_AVATAR', () => {
        it('should be defined and be a non-empty string', () => {
            expect(DEFAULT_AVATAR).toBeDefined();
            expect(typeof DEFAULT_AVATAR).toBe('string');
            expect(DEFAULT_AVATAR.length).toBeGreaterThan(0);
        });

        it('should have the correct path value', () => {
            expect(DEFAULT_AVATAR).toBe('/images/default-avatar.jpg');
        });
    });

    // Тест за DEFAULT_CONSOLE_IMAGE
    describe('DEFAULT_CONSOLE_IMAGE', () => {
        it('should be defined and be a non-empty string', () => {
            expect(DEFAULT_CONSOLE_IMAGE).toBeDefined();
            expect(typeof DEFAULT_CONSOLE_IMAGE).toBe('string');
            expect(DEFAULT_CONSOLE_IMAGE.length).toBeGreaterThan(0);
        });

        it('should have the correct path value', () => {
            expect(DEFAULT_CONSOLE_IMAGE).toBe('/images/default-console.jpg');
        });
    });

    // Тест за MANUFACTURERS
    describe('MANUFACTURERS', () => {
        it('should be defined and be an object', () => {
            expect(MANUFACTURERS).toBeDefined();
            expect(typeof MANUFACTURERS).toBe('object');
            expect(MANUFACTURERS).not.toBeNull(); // Да не е null
        });

        it('should contain the correct manufacturer keys and string values', () => {
            // Проверяваме дали ключовете съществуват
            expect(MANUFACTURERS).toHaveProperty('NINTENDO');
            expect(MANUFACTURERS).toHaveProperty('SONY');
            expect(MANUFACTURERS).toHaveProperty('MICROSOFT');
            expect(MANUFACTURERS).toHaveProperty('SEGA');

            // Проверяваме конкретните стойности
            expect(MANUFACTURERS.NINTENDO).toBe('Nintendo');
            expect(MANUFACTURERS.SONY).toBe('SONY');
            expect(MANUFACTURERS.MICROSOFT).toBe('Microsoft');
            expect(MANUFACTURERS.SEGA).toBe('SEGA');
        });

        it('should not contain unexpected properties', () => {
            // Проверяваме дали обектът съдържа точно тези 4 ключа
            const expectedKeys = ['NINTENDO', 'SONY', 'MICROSOFT', 'SEGA'];
            expect(Object.keys(MANUFACTURERS)).toEqual(expect.arrayContaining(expectedKeys));
            expect(Object.keys(MANUFACTURERS).length).toBe(expectedKeys.length);
        });
    });

}); 