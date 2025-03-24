import { useAuthContext } from '../../../context/authContext';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
    const { isAuthenticated, username } = useAuthContext();

    return (
        <section className={styles.home}>
            <h1>
                {isAuthenticated 
                    ? `Welcome, ${username}!` 
                    : 'Welcome to PlayBox'}
            </h1>
            
            <h2>Discover and Share Your Gaming Collection</h2>

            <div className={styles.buttons}>
                <Link to="/consoles" className={styles.button}>
                    Browse Consoles
                </Link>
                
                {isAuthenticated && (
                    <Link to="/consoles/create" className={styles.button}>
                        Add Your Console
                    </Link>
                )}
            </div>
        </section>
    );
} 