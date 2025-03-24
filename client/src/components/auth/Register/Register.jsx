import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/authContext';
import { useForm } from '../../../hooks/useForm';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './Register.module.css';
import { Link } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const { registerSubmitHandler, error } = useAuthContext();
    
    const { values, onChange, onSubmit } = useForm({
        email: '',
        password: '',
        confirmPassword: '',
    }, async (values) => {
        if (values.password !== values.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            setIsRegistering(true);
            await registerSubmitHandler(values);
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
        } finally {
            setIsRegistering(false);
        }
    });

    return (
        <section className={styles.register}>
            {error && <ErrorBox error={error} onClose={() => setError(null)} />}
            {isRegistering && <Spinner />}
            
            <form onSubmit={onSubmit}>
                <div className={styles.container}>
                    <h1>Register</h1>

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={onChange}
                        placeholder="user@mail.com"
                        disabled={isRegistering}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={values.password}
                        onChange={onChange}
                        placeholder="********"
                        disabled={isRegistering}
                    />

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={onChange}
                        placeholder="********"
                        disabled={isRegistering}
                    />

                    <input 
                        type="submit" 
                        className={styles.btnSubmit} 
                        value={isRegistering ? "Registering..." : "Register"}
                        disabled={isRegistering}
                    />

                    <p className={styles.field}>
                        <span>If you already have profile click <Link to="/login">here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
} 