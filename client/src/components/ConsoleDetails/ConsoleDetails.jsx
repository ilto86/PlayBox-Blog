import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import * as consoleService from '../../services/consoleService';
import styles from './ConsoleDetails.module.css';

export default function ConsoleDetails() {
    const { consoleId } = useParams();
    const { userId, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    const [currentConsole, setCurrentConsole] = useState({});

    useEffect(() => {
        consoleService.getOne(consoleId)
            .then(result => {
                // Добавяме userId към конзолата при създаване
                setCurrentConsole(result);
            })
            .catch(err => {
                console.log('Error fetching console:', err);
                navigate('/consoles');
            });
    }, [consoleId]);

    const isOwner = userId === currentConsole._ownerId;

    const onDeleteClick = async () => {
        const hasConfirmed = confirm(`Are you sure you want to delete ${currentConsole.consoleName}?`);
        
        if (hasConfirmed) {
            try {
                await consoleService.remove(consoleId);
                navigate('/consoles');
            } catch (err) {
                console.log('Delete error:', err);
                // Тук можем да добавим показване на грешка
            }
        }
    };

    return (
        <section className={styles.details}>
            <h1>{currentConsole.consoleName}</h1>
            
            <div className={styles.content}>
                <div className={styles.imageWrap}>
                    <img src={currentConsole.imageUrl} alt={currentConsole.consoleName} />
                </div>

                <div className={styles.info}>
                    <p><strong>Manufacturer:</strong> {currentConsole.manufacturer}</p>
                    <p><strong>Storage:</strong> {currentConsole.storageCapacity}</p>
                    <p><strong>Color:</strong> {currentConsole.color}</p>
                    <p><strong>Release Date:</strong> {currentConsole.releaseDate}</p>
                    <p className={styles.price}><strong>Price:</strong> ${currentConsole.price}</p>

                    {isAuthenticated && isOwner && (
                        <div className={styles.buttons}>
                            <button 
                                onClick={() => navigate(`/consoles/${consoleId}/edit`)}
                                className={styles.editBtn}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={onDeleteClick}
                                className={styles.deleteBtn}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
} 