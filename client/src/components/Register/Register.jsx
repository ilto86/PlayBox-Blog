import { useAuthContext } from '../../context/authContext';
import { useForm } from '../../hooks/useForm';
import styles from './Register.module.css';
import { Link } from 'react-router-dom';

export default function Register() {
    const { registerSubmitHandler, error } = useAuthContext();
    const { values, onChange, onSubmit } = useForm({
        email: '',
        password: '',
        confirmPassword: '',
    }, async (values) => {
        if (values.password !== values.confirmPassword) {
            // Можем да добавим error handling тук
            return;
        }

        try {
            await registerSubmitHandler(values);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    });

    return (
        <section className={styles.register}>
            <form onSubmit={onSubmit}>
                <div className={styles.container}>
                    <h1>Register</h1>
                    
                    {error && <p className={styles.error}>{error}</p>}

                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={onChange}
                        value={values.email}
                        placeholder="peter@abv.bg"
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

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={onChange}
                        value={values.confirmPassword}
                        placeholder="********"
                    />

                    <input type="submit" className={styles.btnSubmit} value="Register" />

                    <p className={styles.field}>
                        <span>If you already have profile click <Link to="/login">here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
} 