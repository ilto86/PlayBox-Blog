import { useState, useEffect, useCallback } from 'react';
import * as consoleService from '../services/consoleService'; // Коригирай пътя, ако е нужно

export function useConsoleDetails(consoleId) {
    const [consoleData, setConsoleData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Използваме useCallback, за да не се пресъздава функцията при всяко рендиране,
    // освен ако consoleId не се промени.
    const fetchConsole = useCallback(async () => {
        if (!consoleId) {
            setIsLoading(false);
            setError("Console ID is missing.");
            setConsoleData(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await consoleService.getOne(consoleId);
            setConsoleData(data);
        } catch (err) {
            console.error('Hook Error - fetchConsole:', err);
            setError(err.message || 'Failed to fetch console details.'); // Записваме съобщението от грешката
            setConsoleData(null); // Нулираме данните при грешка
            // НЕ навигираме оттук! Компонентът ще реши какво да прави.
        } finally {
            setIsLoading(false);
        }
    }, [consoleId]); // Зависимостта е consoleId

    // useEffect извиква fetchConsole при зареждане или при смяна на consoleId
    useEffect(() => {
        fetchConsole();
    }, [fetchConsole]); // Зависимостта е самата memoized функция fetchConsole

    // Връщаме състоянието и функция за рефеч, ако е нужна
    return { consoleData, isLoading, error, refetch: fetchConsole };
}