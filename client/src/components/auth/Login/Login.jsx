import { useAuthContext } from '../../../context/authContext';
import { useForm } from '../../../hooks/useForm';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useState } from 'react';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import { Path } from '../../../utils/pathUtils';
import { isValidEmail, isValidPassword } from '../../../utils/validators';

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { loginSubmitHandler, error, clearError } = useAuthContext();
    const [validationErrors, setValidationErrors] = useState({});
    
    const validateField = (name, value) => {
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            
            if (name === 'email') {
                if (!isValidEmail(value)) {
                    newErrors.email = 'Please enter a valid email address';
                } else {
                    delete newErrors.email;
                }
            }
            
            if (name === 'password') {
                if (!isValidPassword(value)) {
                    newErrors.password = 'Password must be at least 6 characters';
                } else {
                    delete newErrors.password;
                }
            }
            
            return newErrors;
        });
    };
    
    const { values, onChange } = useForm({
        email: '',
        password: '',
    }, null, {
        onChangeCallback: validateField
    });

    const validateForm = () => {
        const errors = {};
        
        if (!isValidEmail(values.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!isValidPassword(values.password)) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        clearError();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);

        try {
            const result = await loginSubmitHandler(values);

            if (result) {
                const returnPath = location.state?.from || Path.Home;
                navigate(returnPath, { replace: true });
            }
        } catch (err) {
            // Грешката се обработва от useErrorHandling
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles.login}>
            {error && <ErrorBox error={error} onClose={clearError} />}
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
                        className={validationErrors.email ? styles.inputError : ''}
                    />
                    {validationErrors.email && (
                        <p className={styles.errorMessage}>{validationErrors.email}</p>
                    )}

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={onChange}
                        value={values.password}
                        placeholder="********"
                        autoComplete="current-password"
                        className={validationErrors.password ? styles.inputError : ''}
                    />
                    {validationErrors.password && (
                        <p className={styles.errorMessage}>{validationErrors.password}</p>
                    )}

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