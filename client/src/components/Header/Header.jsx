import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
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


// import { Link } from 'react-router-dom';
// import './Header.module.css';

// export default function Header() {
//     return (
//         <header className="header">
//             <nav>
//                 <Link to="/">Home</Link>
//                 <Link to="/consoles">Consoles</Link>
//                 <Link to="/consoles/create">Add Console</Link>
//             </nav>
//         </header>
//     );
// }





// import { Link } from 'react-router-dom';

// export default function Header() {
//     return (
//         <header>
//             <nav>
//                 <Link to="/">Home</Link>
//                 <Link to="/consoles">Consoles</Link>
//                 <Link to="/consoles/create">Add Console</Link>
//             </nav>
//         </header>
//     );
// }