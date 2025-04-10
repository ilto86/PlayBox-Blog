import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentSection.module.css';

export default function CommentSection({
    comments = [],
    authorsMap = {},
    currentUserId,
    onDeleteComment,
    isAuthenticated,
    consoleId,
    onCommentAdd,
}) {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!commentText.trim()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await onCommentAdd(consoleId, { text: commentText });
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return 'Recently';
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className={styles.commentSection}>
            <h3>Comments</h3>
            
            {isAuthenticated && (
                <form className={styles.commentForm} onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Write a comment..."
                        className={styles.commentInput}
                        rows="3"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={isSubmitting || !commentText.trim()}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                    </button>
                </form>
            )}
            
            <div className={styles.commentsList}>
                {comments.length > 0 ? (
                    comments.map(comment => {
                        const authorName = authorsMap[comment._ownerId] || 'Anonymous User';

                        return (
                            <div key={comment._id} className={styles.comment}>
                                <div className={styles.commentHeader}>
                                    <span className={styles.author}>
                                        {authorName}
                                    </span>
                                    <span className={styles.date}>
                                        {formatDate(comment.createdAt || comment._createdOn)}
                                    </span>
                                </div>
                                <div className={styles.commentContent}>
                                    <p>{comment.text}</p>
                                    {currentUserId === comment._ownerId && onDeleteComment && (
                                        <button
                                            onClick={() => onDeleteComment(comment._id)}
                                            className={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}

CommentSection.propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.string,
        _createdOn: PropTypes.number,
        _ownerId: PropTypes.string
    })).isRequired,
    authorsMap: PropTypes.object,
    currentUserId: PropTypes.string,
    onDeleteComment: PropTypes.func,
    isAuthenticated: PropTypes.bool.isRequired,
    consoleId: PropTypes.string,
    onCommentAdd: PropTypes.func,
}; 