import { useAuthContext } from '../../../context/authContext';
import { useForm } from '../../../hooks/useForm';
import styles from './Login.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    
    const { loginSubmitHandler, error } = useAuthContext();
    const { values, onChange, onSubmit } = useForm({
        email: '',
        password: '',
    }, async (values) => {
        try {
            setIsLoading(true);
            await loginSubmitHandler(values);
            const path = location.state?.from?.pathname || '/';
            navigate(path);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <section className={styles.login}>
            {error && <ErrorBox error={error} />}
            {isLoading && <Spinner />}
            
            <form onSubmit={onSubmit}>
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
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={onChange}
                        value={values.password}
                        placeholder="********"
                    />

                    <input 
                        type="submit" 
                        className={styles.btnSubmit} 
                        value="Login" 
                        disabled={isLoading}
                    />

                    <p className={styles.field}>
                        <span>If you don't have profile click <Link to="/register">here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
} 