import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../../context/authContext';
import styles from './Header.module.css';

export default function Header() {
    const { isAuthenticated, username, logoutHandler } = useAuthContext();
    const location = useLocation();

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
                        <Link to="/profile">My Profile</Link>
                        <span className={styles.username}>Hello, {username}!</span>
                        <button className={styles.logoutBtn} onClick={logoutHandler}>Logout</button>
                    </>
                )}

                {!isAuthenticated && (
                    <>
                        <Link to="/login" state={{ from: location }}>Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}