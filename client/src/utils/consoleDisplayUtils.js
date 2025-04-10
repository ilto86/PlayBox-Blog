export const getColorHex = (colorName) => {
    if (!colorName) {
        return '#FFFFFF';
    }

    const normalizedSearchName = colorName.toLowerCase().trim();

    const colorMap = {
            // **Бели и черни оттенъци**
            'white': '#FFFFFF',  // Бяло
            'black': '#000000',  // Черно
            'grey': '#808080',  // Сиво
            'light grey': '#8B8B8B',  // Светло сиво
            'dark grey': '#303030',  // Тъмно сиво
            'pearl white': '#F8F8F8',  // Перлено бяло
            'cream white': '#F9F9F9',  // Кремаво бяло 
            'vintage grey': '#9B9B9B',  // Винтидж сиво
            'classic grey': '#808080',  // Класическо сиво
            'slate grey': '#708090',  // Слатово сиво

            // **Синьо и нюанси на синьото**
            'blue': '#0000FF',  // Синьо
            'sky blue': '#87CEEB',  // Небесно синьо
            'royal blue': '#4169E1',  // Кралско синьо
            'dodger blue': '#1E90FF',  // подобно на небесното синьо
            'dark blue': '#00008B',  // Тъмно синьо
            'light blue': '#ADD8E6',  // Светло синьо
            'steel blue': '#4682B4',  // Стоманено синьо
            'indigo': '#4B0082',  // Индиго
            'turquoise blue': '#00CED1',  // Тюркоазено синьо
            'slate blue': '#6A5ACD',  // Слатово синьо

            // **Червено и нюанси на червеното**
            'red': '#FF0000',  // Червено
            'pearl ruby red': '#CE2029',  // Перлено-рубинено червено
            'famicom red': '#E60012',  // Червено на Famicom
            'crimson': '#DC143C',  // Кримсон
            'dark red': '#8B0000',  // Тъмно червено
            'light red': '#FF7F7F',  // Светло червено
            'firebrick': '#B22222',  // Огнено червено
            'salmon': '#FA8072',  // Лососево
            'coral': '#FF7F50',  // Коралово
            'pink': '#FFC0CB',  // Розово
            'fuchsia': '#FF00FF',  // Фуксия

            // **Зелено и нюанси на зеленото**
            'green': '#008000',  // Основното зелено
            'lime green': '#32CD32',  // Лайм зелено
            'forest green': '#228B22',  // Горско зелено
            'olive': '#808000',  // Маслинено зелено
            'sea green': '#2E8B57',  // Морско зелено
            'mint green': '#98FF98',  // Ментово зелено
            'emerald green': '#50C878',  // Изумрудено зелено
            'olive drab': '#6B8E23',  // Маслинено зеленикаво кафяво

            // **Жълто и нюанси на жълтото**
            'yellow': '#FFE000',  // Жълто
            'dandelion': '#FFD02E',  // Глухарче (жълто)
            'amber': '#FFBF00',  // Амбър
            'goldenrod': '#DAA520',  // Златен корн
            'khaki': '#F0E68C',  // Каки
            'wheat': '#F5DEB3',  // Пшеница

            // **Пурпурно и виолетово**
            'purple': '#800080',  // Лилаво
            'violet': '#EE82EE',  // Виолетово
            'lavender': '#E6E6FA',  // Лавандула
            'lavender blush': '#FFF0F5',  // Лавандулово румено
            'medium purple': '#9370DB',  // Средно лилаво
            'plum': '#8E4585',  // Сливов цвят
            'orchid': '#DA70D6',  // Орхидея
            'purple blue': '#6A5ACD',  // Лилаво синьо

            // **Кафяво и нюанси на кафявото**
            'brown': '#A52A2A',  // Кафяво
            'dark brown': '#8B4513',  // Тъмно кафяво
            'saddle Brown': '#8B4513',  // Кафява седло
            'tan': '#D2B48C',  // Загоряла кожа (Тан)
            'beige': '#F5F5DC',  // Бежаво

            // **Други цветове**
            'gold': '#FFD700',  // Злато
            'blond': '#FAF0BE',  // Рус
            'cyan': '#00FFFF',  // Циан
            'aqua': '#00FFFF',  // Аква
            'charcoal': '#36454F',  // Въглищно сиво
            'teal': '#008080',  // Тюркоазено, подобно на зелено
            'peach': '#FFDAB9',  // Праскова
            'seafoam': '#9FE2BF',  // Мидено зелено
            'turquoise': '#40E0D0',  // Тюркуаз
            'mint': '#00FF00',  // Лайм
    };

    return colorMap[normalizedSearchName] || '#FFFFFF';
};

export const getColorDisplayInfo = (consoleName, colorName) => {
    if (!colorName) {
        return { label: 'N/A', hexColor: '#CCCCCC' };
    }

    const dualColorConsoles = {
        'Nintendo Famicom': { colors: ['#E60012', '#F9F9F9'], names: ['Famicom Red', 'Cream White'] },
        'Nintendo NES': { colors: ['#EAEAE9', '#989692'], names: ['Vintage Grey', 'Grey'] },
        'PlayStation®5': { colors: ['#FFFFFF', '#000000'], names: ['White', 'Black'] },
        'Sega Dreamcast': { colors: ['#F8F8F8', '#E8E8E8'], names: ['White', 'Light Grey'] }
    };

    const splitColors = (colorStr) => {
        if (!colorStr) {
            return null;
        }
        const trimmedStr = colorStr.trim();
    
        const partsBySeparator = trimmedStr.split(/[/&]/);
        if (partsBySeparator.length === 2) {
            const color1 = partsBySeparator[0].trim();
            const color2 = partsBySeparator[1].trim();
            if (color1 && color2) {
                return [color1, color2];
            }
        }
    
        const matchAnd = trimmedStr.match(/^(.*?)\s+and\s+(.*?)$/i);
        if (matchAnd) {
            const color1 = matchAnd[1].trim();
            const color2 = matchAnd[2].trim();
            if (color1 && color2) {
                return [color1, color2];
            }
        }
    
        return null;
    };

    if (dualColorConsoles[consoleName]) {
        const { colors, names } = dualColorConsoles[consoleName];
        return {
            label: `${names[0]} & ${names[1]}`,
            hexColors: colors
        };
    }

    const splitColorNames = splitColors(colorName);
    if (splitColorNames && splitColorNames.length === 2) {
        return {
            label: `${splitColorNames[0]} & ${splitColorNames[1]}`,
            hexColors: [getColorHex(splitColorNames[0]), getColorHex(splitColorNames[1])]
        };
    }

    return {
        label: colorName,
        hexColor: getColorHex(colorName)
    };
};

export const getManufacturerClass = (manufacturer, styles) => {
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
    
    return styles[manufacturerVariants[manufacturer] || ''];
};

export const getManufacturerClassKey = (manufacturer) => {
    if (!manufacturer) {
        return '';
    }
    const lowerCaseManufacturer = manufacturer.toLowerCase();
    const manufacturerMap = {
        'nintendo': 'nintendo',
        'sony': 'sony',
        'microsoft': 'microsoft',
        'sega': 'sega'
    };
    return manufacturerMap[lowerCaseManufacturer] || '';
};

export const formatManufacturerForDisplay = (normalizedName) => {
    if (!normalizedName) {
        return '';
    }
    const lowerName = normalizedName.toLowerCase();
    if (lowerName === 'sega') {
        return 'SEGA';
    }
    if (lowerName === 'sony') {
        return 'SONY';
    }
    return normalizedName;
};