import { useEffect } from 'react';

export const useServerStatus = (onServerDown) => {
    useEffect(() => {
        const checkServer = async () => {
            try {
                const response = await fetch('http://localhost:3030');
                if (!response.ok) {
                    onServerDown();
                }
            } catch (error) {
                console.log('Server connection error:', error);
                onServerDown();
            }
        };

        // Проверяваме при стартиране
        checkServer();

        // Проверяваме на всеки 30 секунди
        const interval = setInterval(checkServer, 30000);

        return () => clearInterval(interval);
    }, [onServerDown]);
}; 