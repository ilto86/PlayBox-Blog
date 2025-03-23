import styles from './ErrorBox.module.css';

export default function ErrorBox({ error, onClose }) {
    if (!error) {
        return null;
    }

    return (
        <div className={styles.errorBox}>
            <p>{error}</p>
            <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
    );
} 