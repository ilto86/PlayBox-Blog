import { useAuthContext } from '../../../context/authContext';
import { useForm } from '../../../hooks/useForm';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useState } from 'react';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import { Path } from '../../../utils/pathUtils';

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { loginSubmitHandler, error, setError } = useAuthContext();
    
    const { values, onChange } = useForm({
        email: '',
        password: '',
    });

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            console.log("Login.jsx: Calling loginSubmitHandler...");
            const result = await loginSubmitHandler(values);
            console.log("Login.jsx: loginSubmitHandler returned", result);

            if (result) {
                const returnPath = location.state?.from || Path.Home;
                console.log(`Login.jsx: Login successful. Preparing to redirect to: ${returnPath}`);
                navigate(returnPath, { replace: true });
                console.log("Login.jsx: navigate() called.");
            } else {
                console.log("Login.jsx: Login failed (no result returned).");
            }
        } catch (err) {
            console.error("Login.jsx: Login failed in component catch:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles.login}>
            {error && <ErrorBox error={error} onClose={() => setError(null)} />}
            {isLoading && <Spinner />}
            
            <form onSubmit={onSubmitHandler}>
                <div className={styles.container}>
                    <h1>Login</h1>

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={onChange}
                        value={values.email}
                        placeholder="user@mail.com"
                        autoComplete="email"
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={onChange}
                        value={values.password}
                        placeholder="********"
                        autoComplete="current-password"
                    />

                    <input 
                        type="submit" 
                        className={styles.btnSubmit} 
                        value={isLoading ? 'Loading...' : 'Login'} 
                        disabled={isLoading}
                    />

                    <p className={styles.field}>
                        <span>If you don&apos;t have profile click <Link to="/register">here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
} 