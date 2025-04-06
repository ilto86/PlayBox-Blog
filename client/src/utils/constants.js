// Общи константи за приложението
export const DEFAULT_AVATAR = '/images/default-avatar.jpg';

// Константи за конзоли
export const DEFAULT_CONSOLE_IMAGE = '/images/default-console.jpg';

export const MANUFACTURERS = {
    NINTENDO: 'Nintendo',
    SONY: 'SONY',
    MICROSOFT: 'Microsoft',
    SEGA: 'SEGA'
};

export const getManufacturerClass = (manufacturer, styles) => {
    // Създаваме обект с всички възможни варианти на изписване
    const manufacturerVariants = {
        // Nintendo variants
        'nintendo': 'nintendo',
        'NINTENDO': 'nintendo',
        'Nintendo': 'nintendo',
        // Sony variants
        'sony': 'sony',
        'SONY': 'sony',
        'Sony': 'sony',
        // Microsoft variants
        'microsoft': 'microsoft',
        'MICROSOFT': 'microsoft',
        'Microsoft': 'microsoft',
        // Sega variants
        'sega': 'sega',
        'SEGA': 'sega',
        'Sega': 'sega'
    };
    
    // Връщаме съответния клас или празен стринг, ако няма съвпадение
    return styles[manufacturerVariants[manufacturer] || ''];
};


