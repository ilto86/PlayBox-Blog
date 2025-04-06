import { useEffect, useState } from 'react';
import * as consoleService from '../../../services/consoleService';
import styles from './ConsoleList.module.css';
import { Link } from 'react-router-dom';
import Spinner from '../../common/Spinner/Spinner';
import sharedStyles from '../../../styles/shared/ConsoleCard.module.css';
import { getManufacturerClass } from '../../../utils/constants';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import { DEFAULT_CONSOLE_IMAGE } from '../../../utils/constants';
import { getManufacturerClassKey, formatManufacturerForDisplay } from '../../../utils/consoleDisplayUtils';


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
                {consoles.map(console => {
                    
                    // НОВО: Форматираме името за показване
                    const displayManufacturerName = console ? formatManufacturerForDisplay(console.manufacturer) : '';
                    
                    return (

                        <div key={console._id} className={sharedStyles.consoleCard}>
                            <img 
                                src={console.imageUrl || DEFAULT_CONSOLE_IMAGE} 
                                alt={console.consoleName} 
                                className={sharedStyles.consoleImage}
                                onError={(e) => {
                                    e.target.src = DEFAULT_CONSOLE_IMAGE;
                                }}
                            />
                            <div className={sharedStyles.consoleInfo}>
                                <h3 className={sharedStyles.consoleName}>
                                    {console.consoleName}
                                </h3>
                                <p className={`${sharedStyles.consoleManufacturer} ${getManufacturerClass(console.manufacturer, sharedStyles)}`}>
                                {/* <p className={`${sharedStyles.consoleManufacturer} ${manufacturerClassName}`}> */}
                                    {/* {console.manufacturer} */}
                                    {displayManufacturerName}
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
                    ); // Край на return за ЕЛЕМЕНТА от map
                })}     {/* Край на map callback функцията (затваряща КЪДРАВА СКОБА '}') */}
            </div>      {/* Край на div.consoleGrid */}
            
            {/* Условно показване на съобщение, ако няма конзоли */}
            {consoles.length === 0 && (
                <h3 className={styles.noConsoles}>No consoles yet</h3>
            )}  
        </section>   // Край на section.catalog
    );               // Край на return за целия компонент ConsoleList
}       