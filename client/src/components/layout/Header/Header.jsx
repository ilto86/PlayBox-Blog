import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../../context/authContext';
import styles from './Header.module.css';

export default function Header() {
    const { isAuthenticated, username, logoutHandler } = useAuthContext();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.logo}>
                <Link to="/">
                    <i className="fas fa-gamepad"></i>
                    <span>PlayBox</span>
                </Link>

                {/* Сандвич бутон за мобилни устройства */}
                <button
                    className={styles.menuToggle}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Навигация */}
            <nav className={`${styles.nav} ${menuOpen ? styles.show : ''}`}>
                <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/consoles" onClick={() => setMenuOpen(false)}>Consoles</Link>

                {isAuthenticated && (
                    <>
                        <Link to="/consoles/create" onClick={() => setMenuOpen(false)}>Add Console</Link>
                        <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                        <span className={styles.username}>Hello, {username}!</span>
                        <button className={styles.logoutBtn} onClick={logoutHandler}>Logout</button>
                    </>
                )}

                {!isAuthenticated && (
                    <>
                        <Link to="/login" state={{ from: location.pathname }} onClick={() => setMenuOpen(false)}>Login</Link>
                        <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
