import styles from './Modal.module.css';

export default function Modal({ show, onClose, onConfirm, title, children }) {
    if (!show) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <header className={styles.modalHeader}>
                    <h3>{title}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </header>

                <div className={styles.modalContent}>
                    {children}
                </div>

                <footer className={styles.modalFooter}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.confirmBtn} onClick={onConfirm}>Confirm</button>
                </footer>
            </div>
        </div>
    );
} 