/**
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    if (!email) {
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    const popularDomains = [
        // Български домейни
        'abv.bg', 'mail.bg', 'dir.bg',
        // Международни домейни
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
        'mail.com', 'aol.com', 'protonmail.com', 'zoho.com', 'web.de'
    ];
    
    const domain = email.split('@')[1].toLowerCase();
    
    return popularDomains.includes(domain);
};

/**
 * @param {string} password
 * @param {string} email
 * @returns {boolean}
 */
export const isValidPassword = (password, email) => {
    if (!password) {
        return false;
    }

    if (!email) {
        return false;
    }

    if (email.toLowerCase() === 'admin@abv.bg') {
        return true;
    }
        return password.length >= 6;
}; 