import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import * as consoleService from '../../services/consoleService';
import styles from './EditConsole.module.css';

export default function EditConsole() {
    const navigate = useNavigate();
    const { consoleId } = useParams();
    
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
            await consoleService.edit(consoleId, formData);
            navigate(`/consoles/${consoleId}`);
        } catch (err) {
            console.log('Edit error:', err);
        }
    });

    useEffect(() => {
        consoleService.getOne(consoleId)
            .then(result => {
                changeValues(result);
            });
    }, [consoleId]);

    return (
        <section className={styles.edit}>
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
                    />

                    <label htmlFor="manufacturer">Manufacturer:</label>
                    <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        value={values.manufacturer}
                        onChange={onChange}
                    />

                    <label htmlFor="storageCapacity">Storage Capacity:</label>
                    <input
                        type="text"
                        id="storageCapacity"
                        name="storageCapacity"
                        value={values.storageCapacity}
                        onChange={onChange}
                    />

                    <label htmlFor="color">Color:</label>
                    <input
                        type="text"
                        id="color"
                        name="color"
                        value={values.color}
                        onChange={onChange}
                    />

                    <label htmlFor="releaseDate">Release Date:</label>
                    <input
                        type="text"
                        id="releaseDate"
                        name="releaseDate"
                        value={values.releaseDate}
                        onChange={onChange}
                    />

                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={values.price}
                        onChange={onChange}
                    />

                    <label htmlFor="imageUrl">Image:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={values.imageUrl}
                        onChange={onChange}
                    />

                    <input className={styles.btnSubmit} type="submit" value="Edit Console" />
                </div>
            </form>
        </section>
    );
} 