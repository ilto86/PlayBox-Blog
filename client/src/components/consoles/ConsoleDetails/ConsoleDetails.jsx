import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/authContext';
import * as consoleService from '../../../services/consoleService';
import Modal from '../../common/Modal/Modal';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import Spinner from '../../common/Spinner/Spinner';
import styles from './ConsoleDetails.module.css';

export default function ConsoleDetails() {
    const { consoleId } = useParams();
    const { userId, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    const [currentConsole, setCurrentConsole] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        consoleService.getOne(consoleId)
            .then(result => {
                setCurrentConsole(result);
            })
            .catch(err => {
                console.log('Error fetching console:', err);
                navigate('/consoles');
            })
            .finally(() => setIsLoading(false));
    }, [consoleId, navigate]);

    const isOwner = userId === currentConsole._ownerId;

    const onDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const onDeleteConfirm = async () => {
        try {
            setIsDeleting(true);
            await consoleService.remove(consoleId);
            navigate('/consoles');
        } catch (err) {
            console.log('Delete error:', err);
            setError('Failed to delete console. Please try again later.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <>
            <ErrorBox 
                error={error} 
                onClose={() => setError(null)} 
            />
            
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
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={onDeleteConfirm}
                title="Confirm Delete"
            >
                <p>
                    Are you sure you want to delete{' '}
                    <span className={styles.consoleName}>
                        {currentConsole.consoleName}
                    </span>
                    ?
                </p>
                <p>⚠️ This action cannot be undone!</p>
            </Modal>
        </>
    );
} 