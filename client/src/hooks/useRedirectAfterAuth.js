import { useLocation, useNavigate } from 'react-router-dom';

export const useRedirectAfterAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const redirectAfterAuth = (success) => {
        if (success) {
            // Ако from е обект, вземаме pathname, иначе използваме директно from
            const from = location.state?.from;
            const returnPath = typeof from === 'object' ? from.pathname : from || '/';
            
            console.log('Type of from:', typeof from);
            console.log('Final return path:', returnPath);
            
            navigate(returnPath, { replace: true });
        }
    };

    return redirectAfterAuth;
}; 