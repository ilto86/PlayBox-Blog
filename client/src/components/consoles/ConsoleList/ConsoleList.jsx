import { useEffect, useState } from 'react';
import * as consoleService from '../../../services/consoleService';
import styles from './ConsoleList.module.css';
import { Link } from 'react-router-dom';
import Spinner from '../../common/Spinner/Spinner';
import sharedStyles from '../../../styles/shared/ConsoleCard.module.css';
import { getManufacturerClass } from '../../../utils/manufacturerUtils';
import ErrorBox from '../../common/ErrorBox/ErrorBox';

export default function ConsoleList() {
    const [consoles, setConsoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadConsoles = async () => {
            try {
                const result = await consoleService.getAll();
                console.log('Data from server:', result);
                setConsoles(Object.values(result));
            } catch (error) {
                console.error('Error loading consoles:', error);
                setError('Failed to load consoles');
            } finally {
                setIsLoading(false);
            }
        };

        loadConsoles();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <ErrorBox error={error} />;
    }

    return (
        <section className={styles.catalog}>
            <h1>All Gaming Consoles</h1>
            <div className={styles.consoleGrid}>
                {consoles.map(console => (
                    <div key={console._id} className={sharedStyles.consoleCard}>
                        <img 
                            src={console.imageUrl} 
                            alt={console.consoleName} 
                            className={sharedStyles.consoleImage}
                        />
                        <div className={sharedStyles.consoleInfo}>
                            <h3 className={sharedStyles.consoleName}>
                                {console.consoleName}
                            </h3>
                            <p className={`${sharedStyles.consoleManufacturer} ${sharedStyles[getManufacturerClass(console.manufacturer)]}`}>
                                {console.manufacturer}
                            </p>
                            <div className={sharedStyles.consoleDetails}>
                                <span className={sharedStyles.consolePrice}>
                                    {Number(console.price).toFixed(2)}&nbsp;€
                                </span>
                                <Link 
                                    to={`/consoles/${console._id}`} 
                                    className={sharedStyles.viewDetailsBtn}
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {consoles.length === 0 && (
                <h3 className={styles.noConsoles}>No consoles yet</h3>
            )}
        </section>
    );
}