import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import { useAuthContext } from '../../../context/authContext';
import * as consoleService from '../../../services/consoleService';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './CreateConsole.module.css';

export default function CreateConsole() {
    const navigate = useNavigate();
    const { userId } = useAuthContext();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    const { values, onChange, onSubmit } = useForm({
        consoleName: '',
        manufacturer: '',
        storageCapacity: '',
        color: '',
        releaseDate: '',
        price: '',
        imageUrl: ''
    }, async (formData) => {
        try {
            setIsCreating(true);
            const result = await consoleService.create({
                ...formData,
                _ownerId: userId
            });
            navigate(`/consoles/${result._id}`);
        } catch (err) {
            console.log('Create error:', err);
            setError('Failed to create console. Please try again.');
        } finally {
            setIsCreating(false);
        }
    });

    return (
        <section className={styles.create}>
            {error && <ErrorBox error={error} onClose={() => setError(null)} />}
            {isCreating && <Spinner />}
            
            <form onSubmit={onSubmit}>
                <div className={styles.container}>
                    <h1>Create Console</h1>
                    
                    <label htmlFor="consoleName">Console name:</label>
                    <input
                        type="text"
                        id="consoleName"
                        name="consoleName"
                        value={values.consoleName}
                        onChange={onChange}
                        placeholder="Enter console name..."
                        disabled={isCreating}
                    />

                    <label htmlFor="manufacturer">Manufacturer:</label>
                    <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        value={values.manufacturer}
                        onChange={onChange}
                        placeholder="Enter manufacturer..."
                        disabled={isCreating}
                    />

                    <label htmlFor="storageCapacity">Storage Capacity:</label>
                    <input 
                        type="text" 
                        id="storageCapacity" 
                        name="storageCapacity" 
                        value={values.storageCapacity}
                        onChange={onChange}
                        placeholder="Enter storage capacity..." 
                        disabled={isCreating}
                    />

                    <label htmlFor="color">Color:</label>
                    <input 
                        type="text" 
                        id="color" 
                        name="color" 
                        value={values.color}
                        onChange={onChange}
                        placeholder="Enter color..." 
                        disabled={isCreating}
                    />

                    <label htmlFor="releaseDate">Release Date:</label>
                    <input 
                        type="text" 
                        id="releaseDate" 
                        name="releaseDate" 
                        value={values.releaseDate}
                        onChange={onChange}
                        placeholder="Enter release date..." 
                        disabled={isCreating}
                    />

                    <label htmlFor="price">Price:</label>
                    <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        value={values.price}
                        onChange={onChange}
                        placeholder="Enter price..." 
                        disabled={isCreating}
                    />

                    <label htmlFor="imageUrl">Image:</label>
                    <input 
                        type="text" 
                        id="imageUrl" 
                        name="imageUrl" 
                        value={values.imageUrl}
                        onChange={onChange}
                        placeholder="Upload a photo..." 
                        disabled={isCreating}
                    />

                    <input 
                        className={styles.btnSubmit} 
                        type="submit" 
                        value={isCreating ? "Creating..." : "Create Console"}
                        disabled={isCreating}
                    />
                </div>
            </form>
        </section>
    );
}