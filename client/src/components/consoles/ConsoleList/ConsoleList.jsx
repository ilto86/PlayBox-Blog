import { useEffect, useState, useContext } from 'react';
import * as consoleService from '../../../services/consoleService';
import styles from './ConsoleList.module.css';
import { Link } from 'react-router-dom';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import { DEFAULT_CONSOLE_IMAGE } from '../../../utils/constants';
import { getManufacturerClass, formatManufacturerForDisplay } from '../../../utils/consoleDisplayUtils';
import LikeButton from '../../likes/LikeButton';
import AuthContext from '../../../context/authContext';

export default function ConsoleList() {
    const [consoles, setConsoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const loadConsoles = async () => {
            try {
                const result = await consoleService.getAll();
                setConsoles(Array.isArray(result) ? result : Object.values(result || {}));
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
                {Array.isArray(consoles) && consoles.map((console, index) => {

                    if (!console || typeof console !== 'object') {
                        console.error(`Invalid item at index ${index}:`, console);
                        return <div key={`error-${index}`} style={{color: 'red'}}>Invalid console data at index {index}</div>;
                    }

                    const isOwner = userId && console._ownerId ? userId === console._ownerId : false;
                    const manufacturerClassName = getManufacturerClass(console.manufacturer, styles);
                    const displayManufacturerName = formatManufacturerForDisplay(console.manufacturer);

                    return (
                        <div key={console._id || `console-${index}`} className={styles.consoleCard}>
                            <img 
                                src={console.imageUrl || DEFAULT_CONSOLE_IMAGE} 
                                alt={console.consoleName} 
                                className={styles.consoleImage}
                                onError={(e) => {
                                    e.target.src = DEFAULT_CONSOLE_IMAGE;
                                }}
                            />
                            <div className={styles.consoleInfo}>
                                <h3 className={styles.consoleName}>
                                    {console.consoleName}
                                </h3>
                                <p className={`${styles.consoleManufacturer} ${manufacturerClassName}`}>
                                    {displayManufacturerName}
                                </p>
                                <div className={styles.consoleDetails}>
                                    <span className={styles.consolePrice}>
                                        {Number(console.price).toFixed(2)}&nbsp;€
                                    </span>
                                    <div className={styles.actionButtons}>
                                        {!isOwner && (
                                            <LikeButton
                                                consoleId={console._id}
                                                isOwner={isOwner}
                                            />
                                        )}
                                        <Link 
                                            to={`/consoles/${console._id}`} 
                                            className={styles.viewDetailsBtn}
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {consoles.length === 0 && (
                <h3 className={styles.noConsoles}>No consoles yet</h3>
            )}  
        </section>
    );
}       