const normalizeManufacturer = (manufacturer) => {
    const normalized = manufacturer.toLowerCase();
    
    // Map за всички възможни вариации
    const manufacturerVariations = {
        // Nintendo variations
        'nintendo': 'Nintendo',
        'nintento': 'Nintendo',
        'nindendo': 'Nintendo',
        'nintando': 'Nintendo',
        
        // Sony variations
        'sony': 'Sony',
        'сони': 'Sony',
        'соны': 'Sony',
        
        // Microsoft variations
        'microsoft': 'Microsoft',
        'майкрософт': 'Microsoft',
        
        // Sega variations
        'sega': 'Sega',
        'сега': 'Sega'
    };

    return manufacturerVariations[normalized] || manufacturer;
};

export const getManufacturerClass = (manufacturer) => {
    const normalizedManufacturer = normalizeManufacturer(manufacturer);
    
    const manufacturerMap = {
        'Nintendo': 'nintendo',
        'Sony': 'sony',
        'Microsoft': 'microsoft',
        'Sega': 'sega'
    };
    
    return manufacturerMap[normalizedManufacturer] || '';
};

// Експортваме функцията за нормализация, за да можем да я използваме и при създаване/редактиране на конзола
export const normalizeManufacturerName = normalizeManufacturer; 