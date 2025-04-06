import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/authContext';
import { useForm } from '../../../hooks/useForm';
import Spinner from '../../common/Spinner/Spinner';
import ErrorBox from '../../common/ErrorBox/ErrorBox';
import styles from './Register.module.css';
import { Link } from 'react-router-dom';
import { Path } from '../../../utils/pathUtils';
import { isValidEmail, isValidPassword } from '../../../utils/validators';

export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { registerSubmitHandler, error, clearError } = useAuthContext();
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
            
            if (name === 'confirmPassword') {
                const password = document.querySelector('input[name="password"]').value;
                if (value !== password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
            }
            
            return newErrors;
        });
    };
    
    const { values, onChange } = useForm({
        email: '',
        password: '',
        confirmPassword: ''
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
        
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
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
            await registerSubmitHandler(values);
            navigate(Path.Home);
        } catch (err) {
            console.error("Registration failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className={styles.register}>
            {error && <ErrorBox error={error} onClose={clearError} />}
            {isLoading && <Spinner />}
            
            <form onSubmit={onSubmitHandler}>
                <div className={styles.container}>
                    <h1>Register</h1>

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
                        autoComplete="new-password"
                        className={validationErrors.password ? styles.inputError : ''}
                    />
                    {validationErrors.password && (
                        <p className={styles.errorMessage}>{validationErrors.password}</p>
                    )}

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={onChange}
                        value={values.confirmPassword}
                        placeholder="********"
                        autoComplete="new-password"
                        className={validationErrors.confirmPassword ? styles.inputError : ''}
                    />
                    {validationErrors.confirmPassword && (
                        <p className={styles.errorMessage}>{validationErrors.confirmPassword}</p>
                    )}

                    <input 
                        type="submit" 
                        className={styles.btnSubmit} 
                        value={isLoading ? 'Loading...' : 'Register'} 
                        disabled={isLoading}
                    />

                    <p className={styles.field}>
                        <span>If you already have profile click <Link to="/login">here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
} 