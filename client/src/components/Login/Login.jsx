import { useAuthContext } from '../../context/authContext';
import { useForm } from '../../hooks/useForm';
import styles from './Login.module.css';

export default function Login() {
    const { loginSubmitHandler, error } = useAuthContext();
    const { values, onChange, onSubmit } = useForm({
        email: '',
        password: '',
    }, async (values) => {
        try {
            console.log('Submitting with values:', values); // Тук дебъгвам за да видя данните на текущия юзър с който се логвам
            await loginSubmitHandler(values);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    });

    return (
        <section className={styles.login}>
            <form onSubmit={onSubmit}>
                <div className={styles.container}>
                    <h1>Login</h1>
                    
                    {error && <p className={styles.error}>{error}</p>}

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

                    <input type="submit" className={styles.btnSubmit} value="Login" />

                    <p className={styles.field}>
                        <span>If you don't have profile click <a href="/register">here</a></span>
                    </p>
                </div>
            </form>
        </section>
    );
} 