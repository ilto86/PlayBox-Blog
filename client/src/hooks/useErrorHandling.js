import { useState, useCallback } from 'react';

/**
 * Хук за стандартизирана обработка на грешки
 * @param {Object} options - Опции за конфигуриране
 * @param {string} options.initialError - Начална стойност на грешката
 * @param {Function} options.onError - Callback функция, която се извиква при грешка
 * @returns {Object} Обект с функции и състояние за обработка на грешки
 */
export const useErrorHandling = (options = {}) => {
    const { initialError = null, onError } = options;
    const [error, setError] = useState(initialError);

    /**
     * Изчиства текущата грешка
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    /**
     * Задава нова грешка
     * @param {Error|string} err - Грешка или съобщение за грешка
     */
    const handleError = useCallback((err) => {
        let errorMessage = err?.message || err || 'An unexpected error occurred';
        
        // Форматираме специфични съобщения за грешки
        if (errorMessage.includes("password don't match")) {
            // Тук можем да проверим дали имаме информация за имейла
            const email = err.email || err.data?.email;
            
            if (email && !isValidEmail(email)) {
                errorMessage = "Invalid email format. Please check your email.";
            } else {
                errorMessage = "E-mail or password don't match. Please check your credentials.";
            }
        }
        
        setError(errorMessage);
        
        if (onError && typeof onError === 'function') {
            onError(errorMessage, err);
        }
        
        console.error('Error handled by useErrorHandling:', err);
    }, [onError]);

    /**
     * Изпълнява асинхронна функция с обработка на грешки
     * @param {Function} asyncFn - Асинхронна функция за изпълнение
     * @param {Object} options - Опции за изпълнение
     * @param {boolean} options.clearErrorBefore - Дали да изчисти грешката преди изпълнение
     * @param {string} options.errorPrefix - Префикс за съобщението за грешка
     * @returns {Promise} Резултат от изпълнението на asyncFn
     */
    const executeWithErrorHandling = useCallback(async (asyncFn, options = {}) => {
        const { clearErrorBefore = true, errorPrefix = '' } = options;
        
        if (clearErrorBefore) {
            clearError();
        }
        
        try {
            return await asyncFn();
        } catch (err) {
            const prefixedError = errorPrefix 
                ? new Error(`${errorPrefix}: ${err.message}`) 
                : err;
            
            handleError(prefixedError);
            throw err; // Препредаваме грешката за допълнителна обработка
        }
    }, [clearError, handleError]);

    return {
        error,
        setError,
        clearError,
        handleError,
        executeWithErrorHandling,
        hasError: !!error
    };
}; 