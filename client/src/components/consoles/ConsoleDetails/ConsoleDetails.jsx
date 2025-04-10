import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../../context/authContext';
import { useErrorHandling } from '../../../hooks/useErrorHandling';
import { useConsoleDetails } from '../../../hooks/useConsoleDetails';
import * as consoleService from '../../../services/consoleService';
import Modal from '../../common/Modal/Modal';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import Spinner from '../../common/Spinner/Spinner';
import styles from './ConsoleDetails.module.css';
import { DEFAULT_CONSOLE_IMAGE } from '../../../utils/constants';
import { getColorDisplayInfo, getManufacturerClassKey, formatManufacturerForDisplay } from '../../../utils/consoleDisplayUtils';
import LikeButton from '../../likes/LikeButton';
import CommentSection from '../../comments/CommentSection';
import * as commentService from '../../../services/commentService';
import * as authService from '../../../services/authService';

export default function ConsoleDetails() {
    const { consoleId } = useParams();
    const { userId, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    
    const { consoleData: currentConsole, isLoading: isLoadingConsole, error: fetchError } = useConsoleDetails(consoleId);

    const [comments, setComments] = useState([]);
    const [authorsMap, setAuthorsMap] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { error: deleteError, clearError: clearDeleteError, executeWithErrorHandling: executeDelete } = useErrorHandling();

    useEffect(() => {
        if (fetchError) {
            console.error('Error detected in component, navigating away:', fetchError);
            navigate('/consoles');
        }
    }, [fetchError, navigate]);

    useEffect(() => {
        const loadCommentsAndAuthors = async () => {
            try {
                const fetchedComments = await commentService.getByConsoleId(consoleId);
                setComments(fetchedComments);

                const ownerIds = [...new Set(fetchedComments.map(comment => comment._ownerId).filter(id => id))];

                if (ownerIds.length > 0) {
                    const fetchedAuthorsMap = await authService.getUserProfilesByIds(ownerIds);
                    setAuthorsMap(fetchedAuthorsMap);
                } else {
                    setAuthorsMap({});
                }

            } catch (error) {
                console.error('Error loading comments or authors:', error);
            }
        };

        loadCommentsAndAuthors();
    }, [consoleId]);

    const isOwner = currentConsole && userId === currentConsole._ownerId;

    const onDeleteClick = () => {
        clearDeleteError();
        setShowDeleteModal(true);
    };

    const onDeleteConfirm = async () => {
        setIsDeleting(true);

        await executeDelete(async () => {
            await consoleService.remove(consoleId);
            navigate('/consoles');
        }, {
            errorPrefix: 'Failed to delete console',
            onError: () => {
                setIsDeleting(false);
            }
        });

        if(!deleteError) {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const colorInfo = currentConsole ? getColorDisplayInfo(currentConsole.consoleName, currentConsole.color) : null;
    const manufacturerClassKey = currentConsole ? getManufacturerClassKey(currentConsole.manufacturer) : '';
    const manufacturerClassName = manufacturerClassKey ? styles[manufacturerClassKey] : '';
    const displayManufacturerName = currentConsole ? formatManufacturerForDisplay(currentConsole.manufacturer) : '';

    const handleCommentAdd = async (consoleId, commentData) => {
        try {
            const newComment = await commentService.create(consoleId, commentData);
            setComments(prev => [newComment, ...prev]);

            const currentUserAuth = JSON.parse(localStorage.getItem('auth') || '{}');
            const currentUsername = currentUserAuth.username || currentUserAuth.email || 'Unknown User';

            if (newComment._ownerId && !authorsMap[newComment._ownerId]) {
                setAuthorsMap(prevMap => ({
                    ...prevMap,
                    [newComment._ownerId]: currentUsername
                }));
            }

            return newComment;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await commentService.remove(commentId);
            setComments(prev => prev.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (isLoadingConsole) {
        return <Spinner />;
    }

    if (fetchError || !currentConsole) {
        return <ErrorBox error={fetchError || 'Console data could not be loaded.'} onClose={() => navigate('/consoles')} />;
    }

    return (
        <>
            <ErrorBox
                error={deleteError}
                onClose={clearDeleteError}
            />

            <div className={styles.consoleInfo}>
                <img
                    src={currentConsole.imageUrl || DEFAULT_CONSOLE_IMAGE}
                    alt={currentConsole.consoleName}
                    onError={(e) => {
                        e.target.src = DEFAULT_CONSOLE_IMAGE;
                    }}
                />
                <h1>{currentConsole.consoleName}</h1>

                <div className={styles.details}>
                    <p className={styles.manufacturer}>
                        <span className={styles.label}>Manufacturer:</span>
                        <span className={`${styles.manufacturerName} ${manufacturerClassName}`}>
                            {displayManufacturerName}
                        </span>
                    </p>
                    <p>
                        <span className={styles.label}>Storage:</span> {currentConsole.storageCapacity}
                    </p>
                    <p className={styles.colorInfo}>
                        <span className={styles.label}>Color:</span>
                        {colorInfo && (
                            <>
                                {colorInfo.label}
                                {colorInfo.hexColor && (
                                    <span
                                        className={styles.colorSample}
                                        style={{ backgroundColor: colorInfo.hexColor }}
                                        title={colorInfo.label}
                                    />
                                )}
                                {colorInfo.hexColors && (
                                    <span
                                        className={`${styles.colorSample} ${styles.dualColor}`}
                                        style={{
                                            '--color-left': colorInfo.hexColors[0],
                                            '--color-right': colorInfo.hexColors[1]
                                        }}
                                        title={colorInfo.label}
                                    />
                                )}
                            </>
                        )}
                    </p>
                    <p>
                        <span className={styles.label}>Release Date:</span> {currentConsole.releaseDate}
                    </p>
                    <p className={styles.price}>
                        <span className={styles.label}>Price:</span>
                        <span>{Number(currentConsole.price).toFixed(2)}&nbsp;€</span>
                    </p>
                </div>

                {!isOwner && (
                    <LikeButton
                        consoleId={consoleId}
                        isOwner={false}
                    />
                )}
                
                {isOwner && (
                    <div className={styles.actionButtons}>
                        <Link to={`/consoles/${consoleId}/edit`} className={styles.editButton}>
                            Edit
                        </Link>
                        <button onClick={onDeleteClick} className={styles.deleteButton}>
                            Delete
                        </button>
                    </div>
                )}

                <CommentSection
                    comments={comments}
                    authorsMap={authorsMap}
                    currentUserId={userId}
                    onDeleteComment={handleCommentDelete}
                    isAuthenticated={isAuthenticated}
                    consoleId={consoleId}
                    onCommentAdd={handleCommentAdd}
                />
            </div>

            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={onDeleteConfirm}
                title="Confirm Delete"
                isLoading={isDeleting}
            >
                <p>
                    Are you sure you want to delete{' '}
                    <span className={styles.consoleName}>
                        {currentConsole.consoleName}
                    </span>
                    ?
                </p>
                <p>⚠️ This action cannot be undone!</p>
                {deleteError && <p style={{color: 'red', marginTop: '10px'}}>Error: {deleteError}</p>}
            </Modal>
        </>
    );
}