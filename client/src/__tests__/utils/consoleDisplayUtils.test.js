import {
    getColorHex,
    getColorDisplayInfo,
    getManufacturerClassKey,
    getManufacturerClass, // Ще тестваме и тази, но с mock styles
    formatManufacturerForDisplay
} from '../../utils/consoleDisplayUtils';

// Групираме тестовете за този модул
describe('Utils: consoleDisplayUtils', () => {

    // Тестове за getColorHex
    describe('getColorHex', () => {
        it('should return the correct hex for known color names (case-insensitive, trimmed)', () => {
            expect(getColorHex('white')).toBe('#FFFFFF');
            expect(getColorHex('Black')).toBe('#000000'); // Case-insensitive
            expect(getColorHex(' sky blue ')).toBe('#87CEEB'); // Trimmed and case-insensitive
            expect(getColorHex('famicom red')).toBe('#E60012');
        });

        it('should return the default hex (#FFFFFF) for unknown color names', () => {
            expect(getColorHex('unknown color')).toBe('#FFFFFF');
            expect(getColorHex('very dark blueish green')).toBe('#FFFFFF');
        });

        it('should return the default hex (#FFFFFF) for null, undefined, or empty string', () => {
            expect(getColorHex(null)).toBe('#FFFFFF');
            expect(getColorHex(undefined)).toBe('#FFFFFF');
            expect(getColorHex('')).toBe('#FFFFFF');
        });
    });

    // Тестове за getColorDisplayInfo
    describe('getColorDisplayInfo', () => {
        it('should return N/A info if colorName is missing', () => {
            expect(getColorDisplayInfo('Any Console', null)).toEqual({ label: 'N/A', hexColor: '#CCCCCC' });
            expect(getColorDisplayInfo('Any Console', undefined)).toEqual({ label: 'N/A', hexColor: '#CCCCCC' });
            expect(getColorDisplayInfo('Any Console', '')).toEqual({ label: 'N/A', hexColor: '#CCCCCC' });
        });

        it('should return specific dual-color info for known dual-color consoles', () => {
            expect(getColorDisplayInfo('Nintendo Famicom', 'Any Color String')).toEqual({
                label: 'Famicom Red & Cream White',
                hexColors: ['#E60012', '#F9F9F9']
            });
            expect(getColorDisplayInfo('PlayStation®5', 'White/Black')).toEqual({
                label: 'White & Black',
                hexColors: ['#FFFFFF', '#000000']
            });
            // Добави тестове и за другите dualColorConsoles, ако искаш
        });

        it('should split color names with "/" and return dual-color info', () => {
            expect(getColorDisplayInfo('Some Console', 'Red/Blue')).toEqual({
                label: 'Red & Blue',
                hexColors: ['#FF0000', '#0000FF'] // Hex кодовете от getColorHex
            });
            expect(getColorDisplayInfo('Some Console', ' White / Black ')).toEqual({
                label: 'White & Black',
                hexColors: ['#FFFFFF', '#000000'] // Trimmed and looked up
            });
            // Тест с един познат и един непознат цвят
            expect(getColorDisplayInfo('Some Console', 'Green/Unknown')).toEqual({
                label: 'Green & Unknown',
                hexColors: ['#008000', '#FFFFFF'] // Непознатият връща default hex
            });
        });

        it('should split color names with " and " and return dual-color info', () => {
            expect(getColorDisplayInfo('Some Console', 'Gold and Silver')).toEqual({ // Silver не е в списъка
                label: 'Gold & Silver',
                hexColors: ['#FFD700', '#FFFFFF'] // Silver връща default hex
            });
            expect(getColorDisplayInfo('Some Console', ' sky blue and pink ')).toEqual({
                label: 'sky blue & pink',
                hexColors: ['#87CEEB', '#FFC0CB'] // Trimmed and looked up
            });
        });

        it('should return single-color info for standard color names', () => {
            expect(getColorDisplayInfo('Any Console', 'Red')).toEqual({
                label: 'Red',
                hexColor: '#FF0000'
            });
            expect(getColorDisplayInfo('Any Console', ' unknown color ')).toEqual({
                label: ' unknown color ', // Запазва оригиналния label
                hexColor: '#FFFFFF' // Връща default hex
            });
        });
    });

    // Тестове за getManufacturerClassKey
    describe('getManufacturerClassKey', () => {
        it('should return the correct lowercase key for known manufacturers (case-insensitive)', () => {
            expect(getManufacturerClassKey('Nintendo')).toBe('nintendo');
            expect(getManufacturerClassKey('sony')).toBe('sony');
            expect(getManufacturerClassKey('MICROSOFT')).toBe('microsoft');
            expect(getManufacturerClassKey('Sega')).toBe('sega');
        });

        it('should return an empty string for unknown manufacturers', () => {
            expect(getManufacturerClassKey('Atari')).toBe('');
            expect(getManufacturerClassKey('Commodore')).toBe('');
        });

        it('should return an empty string for null, undefined, or empty string', () => {
            expect(getManufacturerClassKey(null)).toBe('');
            expect(getManufacturerClassKey(undefined)).toBe('');
            expect(getManufacturerClassKey('')).toBe('');
        });
    });

    // Тестове за getManufacturerClass (с mock styles)
    describe('getManufacturerClass', () => {
        // Създаваме mock styles обект, подобен на този, който идва от CSS Modules
        const mockStyles = {
            nintendo: 'style-nintendo-123',
            sony: 'style-sony-abc',
            microsoft: 'style-microsoft-xyz',
            sega: 'style-sega-qwerty',
            '': 'style-default-000' // Какво би върнал styles['']
        };

        it('should return the correct style class for known manufacturers (case-insensitive)', () => {
            expect(getManufacturerClass('Nintendo', mockStyles)).toBe('style-nintendo-123');
            expect(getManufacturerClass('sony', mockStyles)).toBe('style-sony-abc');
            expect(getManufacturerClass('MICROSOFT', mockStyles)).toBe('style-microsoft-xyz');
            expect(getManufacturerClass('Sega', mockStyles)).toBe('style-sega-qwerty');
        });

        it('should return the default style class (styles[\'\']) for unknown manufacturers', () => {
            expect(getManufacturerClass('Atari', mockStyles)).toBe('style-default-000');
        });

        it('should return the default style class (styles[\'\']) for null, undefined, or empty string', () => {
            expect(getManufacturerClass(null, mockStyles)).toBe('style-default-000');
            expect(getManufacturerClass(undefined, mockStyles)).toBe('style-default-000');
            expect(getManufacturerClass('', mockStyles)).toBe('style-default-000');
        });
    });

     // Тестове за formatManufacturerForDisplay
    describe('formatManufacturerForDisplay', () => {
        it('should return "SEGA" for "sega" (case-insensitive)', () => {
            expect(formatManufacturerForDisplay('sega')).toBe('SEGA');
            expect(formatManufacturerForDisplay('Sega')).toBe('SEGA');
            expect(formatManufacturerForDisplay('SEGA')).toBe('SEGA');
        });

        it('should return "SONY" for "sony" (case-insensitive)', () => {
            expect(formatManufacturerForDisplay('sony')).toBe('SONY');
            expect(formatManufacturerForDisplay('Sony')).toBe('SONY');
            expect(formatManufacturerForDisplay('SONY')).toBe('SONY');
        });

        it('should return the original name for other manufacturers', () => {
            expect(formatManufacturerForDisplay('Nintendo')).toBe('Nintendo');
            expect(formatManufacturerForDisplay('Microsoft')).toBe('Microsoft');
            expect(formatManufacturerForDisplay('Atari')).toBe('Atari'); // Дори непознати
        });

        it('should return an empty string for null, undefined, or empty string', () => {
            expect(formatManufacturerForDisplay(null)).toBe('');
            expect(formatManufacturerForDisplay(undefined)).toBe('');
            expect(formatManufacturerForDisplay('')).toBe('');
        });
    });

}); 