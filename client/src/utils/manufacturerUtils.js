const normalizeManufacturer = (manufacturer) => {
    if (!manufacturer) {
        return '';
    }

    const normalized = manufacturer.toLowerCase();
    
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

export const normalizeManufacturerName = normalizeManufacturer; 