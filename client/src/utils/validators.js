/**
 * Валидира имейл адрес
 * @param {string} email - Имейл адрес за валидация
 * @returns {boolean} Дали имейлът е валиден
 */
export const isValidEmail = (email) => {
    if (!email) {
        return false;
    }
    
    // Базова проверка за формат на имейл
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Проверка за популярни домейни
    const popularDomains = [
        // Български домейни
        'abv.bg', 'mail.bg', 'dir.bg',
        // Международни домейни
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
        'mail.com', 'aol.com', 'protonmail.com', 'zoho.com', 'web.de'
    ];
    
    const domain = email.split('@')[1].toLowerCase();
    
    // Проверяваме САМО дали домейнът е в списъка с популярни домейни
    return popularDomains.includes(domain);
};

/**
 * Валидира парола
 * @param {string} password - Парола за валидация
 * @returns {boolean} Дали паролата е валидна
 */
export const isValidPassword = (password) => {
    if (!password) {
        return false;
    }
    
    // Минимум 6 символа
    return password.length >= 6;
}; 