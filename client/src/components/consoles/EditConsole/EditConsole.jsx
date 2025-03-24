import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import * as consoleService from '../../../services/consoleService';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './EditConsole.module.css';

export default function EditConsole() {
    const navigate = useNavigate();
    const { consoleId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    
    const { values, onChange, onSubmit, changeValues } = useForm({
        consoleName: '',
        manufacturer: '',
        storageCapacity: '',
        color: '',
        releaseDate: '',
        price: '',
        imageUrl: ''
    }, async (formData) => {
        try {
            setIsSaving(true);
            await consoleService.edit(consoleId, formData);
            navigate(`/consoles/${consoleId}`);
        } catch (err) {
            console.log('Edit error:', err);
            setError('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    });

    useEffect(() => {
        setIsLoading(true);
        consoleService.getOne(consoleId)
            .then(result => {
                changeValues(result);
            })
            .catch(err => {
                console.log('Fetch error:', err);
                setError('Failed to load console data.');
                navigate('/consoles');
            })
            .finally(() => setIsLoading(false));
    }, [consoleId]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <section className={styles.edit}>
            {error && <ErrorBox error={error} onClose={() => setError(null)} />}
            
            <form onSubmit={onSubmit}>
                <div className={styles.container}>
                    <h1>Edit Console</h1>
                    
                    <label htmlFor="consoleName">Console name:</label>
                    <input
                        type="text"
                        id="consoleName"
                        name="consoleName"
                        value={values.consoleName}
                        onChange={onChange}
                        disabled={isSaving}
                    />

                    <label htmlFor="manufacturer">Manufacturer:</label>
                    <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        value={values.manufacturer}
                        onChange={onChange}
                        disabled={isSaving}
                    />

                    <label htmlFor="storageCapacity">Storage Capacity:</label>
                    <input
                        type="text"
                        id="storageCapacity"
                        name="storageCapacity"
                        value={values.storageCapacity}
                        onChange={onChange}
                        disabled={isSaving}
                    />

                    <label htmlFor="color">Color:</label>
                    <input
                        type="text"
                        id="color"
                        name="color"
                        value={values.color}
                        onChange={onChange}
                        disabled={isSaving}
                    />

                    <label htmlFor="releaseDate">Release Date:</label>
                    <input
                        type="text"
                        id="releaseDate"
                        name="releaseDate"
                        value={values.releaseDate}
                        onChange={onChange}
                        disabled={isSaving}
                    />

                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={values.price}
                        onChange={onChange}
                        disabled={isSaving}
                    />

                    <label htmlFor="imageUrl">Image:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={values.imageUrl}
                        onChange={onChange}
                        disabled={isSaving}
                    />

                    <input 
                        className={styles.btnSubmit} 
                        type="submit" 
                        value={isSaving ? "Saving..." : "Save Changes"}
                        disabled={isSaving}
                    />
                </div>
            </form>
        </section>
    );
} 