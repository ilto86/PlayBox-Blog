import { useState, useEffect } from 'react';
import * as profileService from '../services/profileService';

const cache = new Map();

export const useProfileData = (userId) => {
    const [data, setData] = useState(() => cache.get(userId));
    const [loading, setLoading] = useState(!cache.has(userId));
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!userId) return;
        
        // Ако имаме кеширани данни, не зареждаме отново
        if (cache.has(userId) && !loading) return;
        
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const result = await profileService.getProfile(userId);
                cache.set(userId, result);
                setData(result);
            } catch (err) {
                console.error('Error loading profile data:', err);
                setError(err.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [userId]);
    
    // Функция за обновяване на данните и кеша
    const updateData = async (newData) => {
        try {
            setLoading(true);
            setError(null);
            
            // Оптимистично UI обновяване
            const updatedData = { ...data, ...newData };
            setData(updatedData);
            cache.set(userId, updatedData);
            
            // API заявка
            const result = await profileService.updateProfile(userId, newData);
            
            // Обновяваме с данните от сървъра
            cache.set(userId, result);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to update profile');
            // Връщаме оригиналните данни от кеша
            const originalData = cache.get(userId);
            setData(originalData);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    
    // Функция за изчистване на кеша
    const clearCache = () => {
        cache.delete(userId);
        setData(null);
    };
    
    return { data, loading, error, updateData, clearCache };
};