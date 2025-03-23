import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
    return (
        <section className={styles.home}>
            <h1>Welcome to PlayBox</h1>
            <h2>Your Gaming Console Collection</h2>
            
            <Link to="/consoles" className={styles.button}>
                Browse Consoles
            </Link>
        </section>
    );
} 