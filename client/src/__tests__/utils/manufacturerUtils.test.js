import {
    getManufacturerClass,
    normalizeManufacturerName // Тестваме алиаса, което тества и оригиналната функция
} from '../../utils/manufacturerUtils';

// Групираме тестовете за този модул
describe('Utils: manufacturerUtils', () => {

    // Тестове за normalizeManufacturerName (и normalizeManufacturer)
    describe('normalizeManufacturerName', () => {
        // Nintendo
        it('should normalize various Nintendo variations to "Nintendo"', () => {
            expect(normalizeManufacturerName('nintendo')).toBe('Nintendo');
            expect(normalizeManufacturerName('NINTENDO')).toBe('Nintendo');
            expect(normalizeManufacturerName('Nintendo')).toBe('Nintendo');
            expect(normalizeManufacturerName('nintento')).toBe('Nintendo'); // typo
            expect(normalizeManufacturerName('nindendo')).toBe('Nintendo'); // typo
            expect(normalizeManufacturerName('nintando')).toBe('Nintendo'); // typo
        });

        // Sony
        it('should normalize various Sony variations to "Sony"', () => {
            expect(normalizeManufacturerName('sony')).toBe('Sony');
            expect(normalizeManufacturerName('SONY')).toBe('Sony');
            expect(normalizeManufacturerName('Sony')).toBe('Sony');
            expect(normalizeManufacturerName('сони')).toBe('Sony'); // cyrillic
            expect(normalizeManufacturerName('соны')).toBe('Sony'); // cyrillic typo?
        });

        // Microsoft
        it('should normalize various Microsoft variations to "Microsoft"', () => {
            expect(normalizeManufacturerName('microsoft')).toBe('Microsoft');
            expect(normalizeManufacturerName('MICROSOFT')).toBe('Microsoft');
            expect(normalizeManufacturerName('Microsoft')).toBe('Microsoft');
            expect(normalizeManufacturerName('майкрософт')).toBe('Microsoft'); // cyrillic
        });

        // Sega
        it('should normalize various Sega variations to "Sega"', () => {
            expect(normalizeManufacturerName('sega')).toBe('Sega');
            expect(normalizeManufacturerName('SEGA')).toBe('Sega');
            expect(normalizeManufacturerName('Sega')).toBe('Sega');
            expect(normalizeManufacturerName('сега')).toBe('Sega'); // cyrillic
        });

        // Unknown manufacturers
        it('should return the original name for unknown manufacturers', () => {
            expect(normalizeManufacturerName('Atari')).toBe('Atari');
            expect(normalizeManufacturerName('Commodore')).toBe('Commodore');
            expect(normalizeManufacturerName('unknown')).toBe('unknown');
        });

        // Edge cases
        it('should handle edge cases like empty string, null, undefined', () => {
            // Функцията разчита на .toLowerCase(), което ще даде грешка за null/undefined.
            // Може да се добави проверка в самата функция или да се приеме, че входът винаги е string.
            // Засега тестваме поведението при празен стринг.
            expect(normalizeManufacturerName('')).toBe(''); // Връща празен стринг, защото ''[lowercase] е '' и не е в map-a.
            // Очакваме грешка при null/undefined, ако не се добавят проверки:
            // expect(() => normalizeManufacturerName(null)).toThrow();
            // expect(() => normalizeManufacturerName(undefined)).toThrow();
            // Ако искаме да връща празен стринг, трябва да добавим проверка в началото на функцията:
            // if (!manufacturer) return '';
        });
    });

    // Тестове за getManufacturerClass
    describe('getManufacturerClass', () => {
        it('should return "nintendo" for various Nintendo inputs', () => {
            expect(getManufacturerClass('nintendo')).toBe('nintendo');
            expect(getManufacturerClass('NINTENDO')).toBe('nintendo');
            expect(getManufacturerClass('nintento')).toBe('nintendo'); // typo
        });

        it('should return "sony" for various Sony inputs', () => {
            expect(getManufacturerClass('sony')).toBe('sony');
            expect(getManufacturerClass('SONY')).toBe('sony');
            expect(getManufacturerClass('сони')).toBe('sony'); // cyrillic
        });

        it('should return "microsoft" for various Microsoft inputs', () => {
            expect(getManufacturerClass('microsoft')).toBe('microsoft');
            expect(getManufacturerClass('MICROSOFT')).toBe('microsoft');
            expect(getManufacturerClass('майкрософт')).toBe('microsoft'); // cyrillic
        });

        it('should return "sega" for various Sega inputs', () => {
            expect(getManufacturerClass('sega')).toBe('sega');
            expect(getManufacturerClass('SEGA')).toBe('sega');
            expect(getManufacturerClass('сега')).toBe('sega'); // cyrillic
        });

        it('should return an empty string for unknown manufacturers', () => {
            expect(getManufacturerClass('Atari')).toBe('');
            expect(getManufacturerClass('Commodore')).toBe('');
            expect(getManufacturerClass('unknown')).toBe('');
        });

        it('should return an empty string for empty string input', () => {
            expect(getManufacturerClass('')).toBe('');
        });

        // Подобно на горното, null/undefined ще предизвикат грешка, ако не се обработят.
        // it('should handle null or undefined input', () => {
        //     expect(getManufacturerClass(null)).toBe('');
        //     expect(getManufacturerClass(undefined)).toBe('');
        // });
        // За да работят тези, трябва да се добави проверка в normalizeManufacturer: if (!manufacturer) return '';
    });

}); 