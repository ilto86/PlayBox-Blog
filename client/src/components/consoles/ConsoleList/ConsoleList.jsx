import { useEffect, useState } from 'react';
import * as consoleService from '../../../services/consoleService';
import styles from './ConsoleList.module.css';
import { Link } from 'react-router-dom';
import Spinner from '../../common/Spinner/Spinner';

export default function ConsoleList() {
    const [consoles, setConsoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        consoleService.getAll()
            .then(result => {
                setConsoles(result);
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <section className={styles.catalog}>
            <h1>All Gaming Consoles</h1>

            {isLoading && <Spinner />}

            {!isLoading && (
                <>
                    {consoles.map(console => (
                        <div key={console._id} className={styles.allConsoles}>
                            <div className={styles.allConsolesInfo}>
                                <img src={console.imageUrl} alt={console.consoleName} />
                                <h6>{console.consoleName}</h6>
                                <h2>{console.manufacturer}</h2>
                                <Link 
                                    to={`/consoles/${console._id}`} 
                                    className={styles.detailsButton}
                                >
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}

                    {consoles.length === 0 && (
                        <h3 className={styles.noArticles}>No consoles yet</h3>
                    )}
                </>
            )}
        </section>
    );
}