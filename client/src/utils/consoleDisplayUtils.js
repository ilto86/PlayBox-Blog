export const getColorHex = (colorName) => {
    if (!colorName) return '#FFFFFF'; // Връщаме бяло по подразбиране, ако няма цвят

    // Преобразуваме към малки букви веднъж за търсене без значение от регистъра
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

            // **Сини и техни нюанси**
            'blue': '#0000FF',  // Синьо
            'sky blue': '#87CEEB',  // Небесно синьо
            'royal blue': '#4169E1',  // Кралско синьо
            'dodger blue': '#1E90FF',  // Синьо, подобно на цвета на небе в добър ден
            'dark blue': '#00008B',  // Тъмно синьо
            'light blue': '#ADD8E6',  // Светло синьо
            'steel blue': '#4682B4',  // Стоманено синьо
            'indigo': '#4B0082',  // Индиго
            'turquoise blue': '#00CED1',  // Тюркоазено синьо
            'slate blue': '#6A5ACD',  // Слатово синьо

            // **Червени и техни нюанси**
            'red': '#FF0000',  // Червено
            'pearl ruby red': '#CE2029',  // Перлен рубинено
            'famicom red': '#E60012',  // Червено на Famicom
            'crimson': '#DC143C',  // Кримсон
            'dark red': '#8B0000',  // Тъмно червено
            'light red': '#FF7F7F',  // Светло червено
            'firebrick': '#B22222',  // Огнено червено
            'salmon': '#FA8072',  // Лососево
            'coral': '#FF7F50',  // Корал
            'pink': '#FFC0CB',  // Розово
            'fuchsia': '#FF00FF',  // Фуксия

            // **Зелени и техни нюанси**
            'green': '#008000',  // Основно зелено
            'lime green': '#32CD32',  // Лайм зелено
            'forest green': '#228B22',  // Лесно зелено
            'olive': '#808000',  // Маслинено зелено
            'sea green': '#2E8B57',  // Морско зелено
            'mint green': '#98FF98',  // Ментово зелено
            'emerald green': '#50C878',  // Изумрудено зелено
            'olive drab': '#6B8E23',  // Маслинено кафяво

            // **Жълти и техни нюанси**
            'yellow': '#FFE000',  // Жълто
            'dandelion': '#FFD02E',  // Глухарче (жълто)
            'amber': '#FFBF00',  // Амбър
            'goldenrod': '#DAA520',  // Златен корн
            'khaki': '#F0E68C',  // Хаки
            'wheat': '#F5DEB3',  // Пшеница

            // **Пурпурни и виолетови нюанси**
            'purple': '#800080',  // Лилаво
            'violet': '#EE82EE',  // Виолетово
            'lavender': '#E6E6FA',  // Лавандула
            'lavender blush': '#FFF0F5',  // Лавандулово румени
            'medium purple': '#9370DB',  // Средно лилаво
            'plum': '#8E4585',  // Сливов цвят
            'orchid': '#DA70D6',  // Орхидея
            'purple blue': '#6A5ACD',  // Лилаво синьо

            // **Кафяви и техни нюанси**
            'brown': '#A52A2A',  // Кафяво
            'dark brown': '#8B4513',  // Тъмно кафяво
            'saddle Brown': '#8B4513',  // Кафява седло
            'tan': '#D2B48C',  // Загоряла кожа (Тан)
            'beige': '#F5F5DC',  // Бежаво

            // **Други цветове**
            'gold': '#FFD700',  // Златно
            'blond': '#FAF0BE',  // Блонд
            'cyan': '#00FFFF',  // Циан
            'aqua': '#00FFFF',  // Аква
            'charcoal': '#36454F',  // Въглищно сив
            'teal': '#008080',  // Тюркоаз
            'peach': '#FFDAB9',  // Праскова
            'seafoam': '#9FE2BF',  // Мидена зелена
            'turquoise': '#40E0D0',  // Туркуаз
            'mint': '#00FF00',  // Лайм
    };

    // Директно търсене в мапа с нормализираното име
    return colorMap[normalizedSearchName] || '#FFFFFF'; // Бяло, ако не е намерен


    // const hexValue = colorMap[normalizedSearchName];
    // if (hexValue) {
    //     console.log(`[getColorHex] Found hex: ${hexValue}`); // <-- Debug Log 3
    //     return hexValue;
    // } else {
    //     console.log(`[getColorHex] Color not found in map, returning default white.`); // <-- Debug Log 4
    //     return '#FFFFFF'; // Връщаме бяло, ако не е намерен
    // }
};

// Преименуваме я, за да е ясно, че връща ИНФОРМАЦИЯ, а не JSX
export const getColorDisplayInfo = (consoleName, colorName) => {
    if (!colorName) {
        // Връщаме информация за цвят по подразбиране или null/undefined
        return { label: 'N/A', hexColor: '#CCCCCC' }; // Примерно сиво за N/A
    }

    // Специални случаи за двуцветни конзоли (предефинирани)
    const dualColorConsoles = {
        'Nintendo Famicom': { colors: ['#E60012', '#F9F9F9'], names: ['Famicom Red', 'Cream White'] },
        'Nintendo NES': { colors: ['#EAEAE9', '#989692'], names: ['Vintage Grey', 'Grey'] },
        'PlayStation®5': { colors: ['#FFFFFF', '#000000'], names: ['White', 'Black'] },
        'Sega Dreamcast': { colors: ['#F8F8F8', '#E8E8E8'], names: ['White', 'Light Grey'] }
    };

    const splitColors = (colorStr) => {
        // const trimmedStr = colorStr.trim();
        // if (trimmedStr.includes('/', '&')) {
        //     return trimmedStr.split('/', '&').map(c => c.trim());
        // }
        // // Търсим ' and ' без значение от регистъра
        // const match = trimmedStr.match(/^(.*)\s+and\s+(.*)$/i);
        // if (match) {
        //     // Връщаме двете части, преобразувани към PascalCase (или както предпочиташ)
        //     const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        //     return [
        //         match[1].trim().split(' ').map(capitalize).join(' '),
        //         match[2].trim().split(' ').map(capitalize).join(' ')
        //     ];
        // }
        // return null;

        if (!colorStr) return null;
        const trimmedStr = colorStr.trim();
    
        // 1. Опит за разделяне по '/' или '&' с регулярен израз /[\/&]/
        const partsBySeparator = trimmedStr.split(/[\/&]/);
        if (partsBySeparator.length === 2) {
            const color1 = partsBySeparator[0].trim();
            const color2 = partsBySeparator[1].trim();
            // Проверяваме дали и двете части не са празни след trim
            if (color1 && color2) {
                // Връщаме имената както са въведени (но trim-нати)
                return [color1, color2];
            }
        }
    
        // 2. Ако разделянето не е успешно, опит за търсене на " and " (нечувствително към регистър)
        // Използваме (.*?) за non-greedy matching
        const matchAnd = trimmedStr.match(/^(.*?)\s+and\s+(.*?)$/i);
        if (matchAnd) {
            const color1 = matchAnd[1].trim();
            const color2 = matchAnd[2].trim();
            // Проверяваме дали и двете части не са празни след trim
            if (color1 && color2) {
                // Връщаме имената както са въведени (но trim-нати)
                return [color1, color2];
            }
        }
    
        // 3. Ако нито един метод не е успешен, връщаме null
        return null;
    };

    // 1. Проверка за предефинирани двуцветни конзоли по ИМЕ на конзолата
    if (dualColorConsoles[consoleName]) {
        const { colors, names } = dualColorConsoles[consoleName];
        return {
            label: `${names[0]} & ${names[1]}`,
            hexColors: colors // Директно използваме дефинираните hex стойности
        };
    }

    // 2. Проверка за два цвята в самото ИМЕ на цвета
    const splitColorNames = splitColors(colorName);
    if (splitColorNames && splitColorNames.length === 2) {
        return {
            label: `${splitColorNames[0]} & ${splitColorNames[1]}`,
            hexColors: [getColorHex(splitColorNames[0]), getColorHex(splitColorNames[1])]
        };
    }

    // 3. Случай за единичен цвят
    return {
        label: colorName, // Показваме оригиналното име
        hexColor: getColorHex(colorName)
    };
};

// Може да добавиш и getManufacturerClass тук, ако искаш всичко за показване да е на едно място
// import styles from './path/to/your/styles.module.css'; // Ще трябва да импортнеш стиловете тук, ако ги ползваш
export const getManufacturerClassKey = (manufacturer) => {
    if (!manufacturer) return '';
    const lowerCaseManufacturer = manufacturer.toLowerCase();
     // Опростен мап, ако нормализацията се случва при запис
    const manufacturerMap = {
        'nintendo': 'nintendo',
        'sony': 'sony',
        'microsoft': 'microsoft',
        'sega': 'sega'
    };
    return manufacturerMap[lowerCaseManufacturer] || ''; // Връща само ключа ('nintendo')
};

// функция за конзолите SONY & SEGA
export const formatManufacturerForDisplay = (normalizedName) => {
    if (!normalizedName) return '';
    const lowerName = normalizedName.toLowerCase();
    if (lowerName === 'sega') return 'SEGA';
    if (lowerName === 'sony') return 'SONY';
    // Връщаме нормализираното име (вероятно PascalCase) за всички останали
    return normalizedName;
};