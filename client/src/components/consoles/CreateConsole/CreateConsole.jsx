import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import { useAuthContext } from '../../../context/authContext';
import * as consoleService from '../../../services/consoleService';
import { DEFAULT_CONSOLE_IMAGE } from '../../../utils/constants';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './CreateConsole.module.css';

export default function CreateConsole() {
    const navigate = useNavigate();
    const { userId } = useAuthContext();
    const [isCreating, setIsCreating] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = (formData) => {
        const newErrors = {};
        
        if (!formData.consoleName?.trim()) {
            newErrors.consoleName = 'Console name is required';
        }
        
        if (!formData.manufacturer?.trim()) {
            newErrors.manufacturer = 'Manufacturer is required';
        }

        if (!formData.storageCapacity?.trim()) {
            newErrors.storageCapacity = 'Storage capacity is required';
        }

        if (!formData.releaseDate?.trim()) {
            newErrors.releaseDate = 'Release date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { values, onChange, onSubmit } = useForm({
        consoleName: '',
        manufacturer: '',
        storageCapacity: '',
        color: '',
        releaseDate: '',
        price: '',
        imageUrl: ''
    }, async (formData) => {
        if (!validateForm(formData)) {
            return;
        }

        try {
            setIsCreating(true);
            const consoleData = {
                ...formData,
                imageUrl: formData.imageUrl.trim() || DEFAULT_CONSOLE_IMAGE,
                price: formData.price.trim() ? Number(formData.price) : 0,
                _ownerId: userId
            };
            
            const result = await consoleService.create(consoleData);
            navigate(`/consoles/${result._id}`);
        } catch (err) {
            console.error('Create error:', err);
            setErrors(state => ({
                ...state,
                submit: 'Failed to create console. Please try again.'
            }));
        } finally {
            setIsCreating(false);
        }
    });

    return (
        <section className={styles.create}>
            {errors.submit && <ErrorBox error={errors.submit} onClose={() => setErrors(state => ({ ...state, submit: null }))} />}
            
            <form onSubmit={onSubmit}>
                <div className={styles.container}>
                    <h1>Create Console</h1>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="consoleName">Console name: *</label>
                        <input
                            type="text"
                            id="consoleName"
                            name="consoleName"
                            value={values.consoleName}
                            onChange={onChange}
                            className={errors.consoleName ? styles.errorInput : ''}
                            disabled={isCreating}
                        />
                        {errors.consoleName && <span className={styles.error}>{errors.consoleName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="manufacturer">Manufacturer: *</label>
                        <input
                            type="text"
                            id="manufacturer"
                            name="manufacturer"
                            value={values.manufacturer}
                            onChange={onChange}
                            className={errors.manufacturer ? styles.errorInput : ''}
                            disabled={isCreating}
                        />
                        {errors.manufacturer && <span className={styles.error}>{errors.manufacturer}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="storageCapacity">Storage Capacity: *</label>
                        <input 
                            type="text" 
                            id="storageCapacity" 
                            name="storageCapacity" 
                            value={values.storageCapacity}
                            onChange={onChange}
                            className={errors.storageCapacity ? styles.errorInput : ''}
                            disabled={isCreating}
                        />
                        {errors.storageCapacity && <span className={styles.error}>{errors.storageCapacity}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="releaseDate">Release Date: *</label>
                        <input 
                            type="text" 
                            id="releaseDate" 
                            name="releaseDate" 
                            value={values.releaseDate}
                            onChange={onChange}
                            className={errors.releaseDate ? styles.errorInput : ''}
                            disabled={isCreating}
                        />
                        {errors.releaseDate && <span className={styles.error}>{errors.releaseDate}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="color">Color:</label>
                        <input 
                            type="text" 
                            id="color" 
                            name="color" 
                            value={values.color}
                            onChange={onChange}
                            disabled={isCreating}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="imageUrl">Image URL:</label>
                        <input 
                            type="text" 
                            id="imageUrl" 
                            name="imageUrl" 
                            value={values.imageUrl}
                            onChange={onChange}
                            disabled={isCreating}
                        />
                    </div>

                    <input 
                        className={styles.btnSubmit} 
                        type="submit" 
                        value={isCreating ? "Creating..." : "Create Console"}
                        disabled={isCreating}
                    />
                </div>
            </form>

            {isCreating && <Spinner />}
        </section>
    );
}