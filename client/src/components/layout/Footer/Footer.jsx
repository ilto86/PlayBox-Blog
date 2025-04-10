import styles from './Footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <p>&copy; {currentYear} PlayBox. All rights reserved.</p>
            {/* Тук мога да добавя други елементи като, например: контакти(телефонен номер, email), социални контакти, адрес, и т.н.   */}
            {/* <div className={styles.links}>
                <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
            </div> */}
        </footer>
    );
} 