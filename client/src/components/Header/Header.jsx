import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
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
                <Link to="/consoles/create">Add Console</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </nav>
        </header>
    );
}