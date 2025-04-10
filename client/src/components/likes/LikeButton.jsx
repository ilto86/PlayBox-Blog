import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as likeService from '../../services/likeService';
import { useAuthContext } from '../../context/authContext';
import styles from './LikeButton.module.css';

export default function LikeButton({ consoleId, isOwner }) {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { userId, isAuthenticated } = useAuthContext();

    useEffect(() => {
        const loadLikes = async () => {
            setIsLoading(true);
            try {
                const likesData = await likeService.getByConsoleId(consoleId);
                setLikes(likesData.length);
                
                if (userId) {
                    const userLike = likesData.find(like => like._ownerId === userId);
                    if (userLike) {
                        setHasLiked(true);
                        setLikeId(userLike._id);
                    } else {
                        setHasLiked(false);
                        setLikeId(null);
                    }
                } else {
                    setHasLiked(false);
                    setLikeId(null);
                }
            } catch (error) {
                console.error('Error loading likes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadLikes();
    }, [consoleId, userId]);

    const handleLikeClick = async () => {
        if (isOwner || isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            if (hasLiked) {
                if (likeId) {
                    await likeService.unlikeConsole(likeId);
                    setLikes(prev => prev - 1);
                    setHasLiked(false);
                    setLikeId(null);
                } else {
                    console.error('Cannot unlike: Like ID not found.');
                }
            } else {
                const newLike = await likeService.likeConsole(consoleId);
                setLikes(prev => prev + 1);
                setHasLiked(true);
                setLikeId(newLike._id);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <button 
            className={`${styles.likeButton} ${hasLiked ? styles.liked : ''} ${isOwner ? styles.disabled : ''}`}
            onClick={handleLikeClick}
            disabled={isLoading || isOwner}
            title={isOwner ? 'You can&apos;t like your own console' : hasLiked ? 'Unlike' : 'Like'}
        >
            <span className={styles.thumbIcon}>
                👍
            </span>
            <span className={styles.likeCount}>{likes}</span>
        </button>
    );
}

LikeButton.propTypes = {
    consoleId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired
}; 