import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [state, setState] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log('Error reading localStorage:', error);
            return initialValue;
        }
    });

    useEffect(() => {
        const checkServerAndToken = async () => {
            try {
                const response = await fetch('http://localhost:3030/users/me', {
                    headers: {
                        'X-Authorization': state?.accessToken
                    }
                });
                
                if (!response.ok) {
                    localStorage.removeItem(key);
                    setState(initialValue);
                }
            } catch (error) {
                localStorage.removeItem(key);
                setState(initialValue);
            }
        };

        if (state?.accessToken) {
            checkServerAndToken();
        }
    }, []);

    const setItem = (value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            setState(value);
        } catch (error) {
            console.log('Error saving to localStorage:', error);
        }
    };

    return [
        state,
        setItem
    ];
}; 