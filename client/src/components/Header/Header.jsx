import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import styles from './Header.module.css';

export default function Header() {
    const { isAuthenticated, username, logoutHandler } = useAuthContext();

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link to="/">
                    <i className="fas fa-gamepad"></i>
                    <span>PlayBox</span>
                </Link>
            </div>
            
            <nav>
                <Link to="/">Home</Link>
                <Link to="/consoles">Consoles</Link>
                
                {isAuthenticated && (
                    <>
                        <Link to="/consoles/create">Add Console</Link>
                        <span className={styles.username}>Hello, {username}!</span>
                        <button className={styles.logoutBtn} onClick={logoutHandler}>Logout</button>
                    </>
                )}

                {!isAuthenticated && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}