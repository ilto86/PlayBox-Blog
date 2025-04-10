import { createContext, useContext } from 'react';
import ErrorBox from '../components/common/ErrorBox/ErrorBox';
import { useErrorHandling } from '../hooks/useErrorHandling';

const ErrorContext = createContext(null);

export const ErrorProvider = ({ children }) => {
    const {
        error,
        clearError,
        handleError,
        executeWithErrorHandling,
        hasError
    } = useErrorHandling();

    const contextValue = {
        error,
        clearError,
        handleError,
        executeWithErrorHandling,
        hasError
    };

    return (
        <ErrorContext.Provider value={contextValue}>
            <ErrorBox error={error} onClose={clearError} />
            {children}
        </ErrorContext.Provider>
    );
};

export const useErrorContext = () => {
    const context = useContext(ErrorContext);
    if (context === null) {
        throw new Error('useErrorContext must be used within an ErrorProvider');
    }
    return context;
}; 