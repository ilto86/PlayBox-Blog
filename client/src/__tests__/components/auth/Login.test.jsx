import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // По-добър за симулиране на реални потребителски действия
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest'; // Vitest's mocking utilities
import styles from '../../../components/auth/Login/Login.module.css'; // <--- ДОБАВИ ТОЗИ РЕД

import Login from '../../../components/auth/Login/Login';
import { AuthContext } from '../../../context/authContext'; // Искаме да wrap-нем с истински Provider, но с mock стойности
import { Path } from '../../../utils/pathUtils';

// Mocking react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual, // Запазваме Link, MemoryRouter и т.н.
        useNavigate: () => mockNavigate,
        // Може да мокнем и useLocation, ако е нужно за специфични тестове
        // useLocation: () => ({ pathname: '/login', state: null }),
    };
});

// Helper функция за рендиране с Context Provider и Router
const renderLoginComponent = (contextValue) => {
    const defaultContextValue = {
        loginSubmitHandler: vi.fn().mockResolvedValue(true), // Успешен логин по подразбиране
        error: null,
        clearError: vi.fn(),
        // Добави други стойности от контекста, ако Login ги използва директно
    };

    // Сливаме default стойностите с подадените за конкретния тест
    const effectiveContextValue = { ...defaultContextValue, ...contextValue };

    return render(
        <MemoryRouter initialEntries={['/login']}>
            <AuthContext.Provider value={effectiveContextValue}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    {/* Добавяме и други пътища, за да тестваме навигацията */}
                    <Route path={Path.Home} element={<div>Home Page</div>} />
                    <Route path="/register" element={<div>Register Page</div>} />
                </Routes>
            </AuthContext.Provider>
        </MemoryRouter>
    );
};


describe('Component: Login', () => {
    // Почистваме моковете след всеки тест
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render the login form correctly', () => {
        renderLoginComponent();

        // Проверка за заглавието
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

        // Проверка за полетата чрез техните лейбъли
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

        // Проверка за бутона за събмит
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

        // Проверка за линка към регистрация
        expect(screen.getByRole('link', { name: /here/i })).toHaveAttribute('href', '/register');
        expect(screen.getByText(/if you don't have profile click/i)).toBeInTheDocument();
    });

    it('should allow typing in email and password fields', async () => {
        const user = userEvent.setup();
        renderLoginComponent();

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('should show validation error for invalid email on change/blur', async () => {
        const user = userEvent.setup();
        renderLoginComponent();
        const emailInput = screen.getByLabelText(/email/i);

        await user.type(emailInput, 'invalid-email');

        // Изчакваме появата на съобщението
        expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
        // Проверка за CSS клас чрез styles обекта
        expect(emailInput).toHaveClass(styles.inputError);
    });

    it('should show validation error for short password on change/blur', async () => {
        const user = userEvent.setup();
        renderLoginComponent();
        const passwordInput = screen.getByLabelText(/password/i);

        await user.type(passwordInput, '123');

        expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        // Проверка за CSS клас чрез styles обекта
        expect(passwordInput).toHaveClass(styles.inputError);
    });

    it('should NOT show password validation error for admin email, even with short password', async () => {
        const user = userEvent.setup();
        renderLoginComponent();
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        await user.type(emailInput, 'admin@abv.bg');
        await user.type(passwordInput, '123'); // Къса парола
        // fireEvent.blur(passwordInput);

        // Проверяваме, че съобщението за грешка НЕ присъства
        expect(screen.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument();
        expect(passwordInput).not.toHaveClass(styles.inputError);
    });


    it('should show validation errors on submit if fields are invalid', async () => {
        const user = userEvent.setup();
        const mockLoginHandler = vi.fn();
        renderLoginComponent({ loginSubmitHandler: mockLoginHandler });

        const submitButton = screen.getByRole('button', { name: /login/i });

        // 1. Опит за събмит с празни полета
        await user.click(submitButton);

        expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument(); // Трябва да се появи и за паролата
        expect(mockLoginHandler).not.toHaveBeenCalled(); // Функцията за логин не трябва да е извикана

        // 2. Опит с невалиден имейл
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        await user.type(emailInput, 'invalid');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
        expect(screen.queryByText(/password must be at least 6 characters/i)).not.toBeInTheDocument(); // Паролата е валидна
        expect(mockLoginHandler).not.toHaveBeenCalled();

        // 3. Опит с валиден имейл, но къса парола
        await user.clear(emailInput);
        await user.clear(passwordInput);
        await user.type(emailInput, 'valid@email.com');
        await user.type(passwordInput, '123');
        await user.click(submitButton);

        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
        expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        expect(mockLoginHandler).not.toHaveBeenCalled();
    });


    it('should call loginSubmitHandler and navigate on successful submission', async () => {
        const user = userEvent.setup();
        const mockLoginHandler = vi.fn().mockResolvedValue(true); // Симулираме успешен логин
        renderLoginComponent({ loginSubmitHandler: mockLoginHandler });

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        const testEmail = 'test@example.com';
        const testPassword = 'password123';

        await user.type(emailInput, testEmail);
        await user.type(passwordInput, testPassword);
        await user.click(submitButton);

        // Проверка дали handler-ът е извикан с правилните данни
        await waitFor(() => {
            expect(mockLoginHandler).toHaveBeenCalledTimes(1);
            expect(mockLoginHandler).toHaveBeenCalledWith({ email: testEmail, password: testPassword });
        });

        // Проверка дали навигацията е извикана към началната страница (по подразбиране)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledTimes(1);
            expect(mockNavigate).toHaveBeenCalledWith(Path.Home, { replace: true });
        });

        // Проверка дали спинърът се е показал и скрил (опционално, може да е трудно за хващане)
        // expect(screen.getByRole('status')).toBeInTheDocument(); // Провери дали Spinner има role="status"
        // await waitForElementToBeRemoved(() => screen.queryByRole('status'));
    });

    it('should display ErrorBox if loginSubmitHandler provides an error', async () => {
        const user = userEvent.setup();
        const errorMessage = 'Invalid credentials';
        // Симулираме неуспешен логин, като подаваме грешка през контекста
        const mockLoginHandler = vi.fn().mockResolvedValue(false); // loginSubmitHandler връща false при неуспех
        const mockClearError = vi.fn();
        renderLoginComponent({
            loginSubmitHandler: mockLoginHandler,
            error: errorMessage, // Подаваме грешката директно
            clearError: mockClearError
        });

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        // Проверяваме дали ErrorBox се показва с правилната грешка
        // Трябва ErrorBox да рендира текста на грешката
        expect(await screen.findByText(errorMessage)).toBeInTheDocument();

        // Проверяваме дали clearError е извикан при опит за събмит
        expect(mockClearError).toHaveBeenCalled();

        // Проверяваме дали навигация НЕ е извикана
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should disable submit button and show loading text while submitting', async () => {
        const user = userEvent.setup();
        // Създаваме Promise, който можем да контролираме ръчно
        let resolveLogin;
        const loginPromise = new Promise(resolve => { resolveLogin = resolve; });
        const mockLoginHandler = vi.fn().mockReturnValue(loginPromise);

        renderLoginComponent({ loginSubmitHandler: mockLoginHandler });

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /login/i }); // Намираме го по началния текст

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        // Веднага след клика, бутонът трябва да е disabled и текстът да е "Loading..."
        // Използваме getByRole отново, но с новия текст
        const loadingButton = screen.getByRole('button', { name: /loading.../i });
        expect(loadingButton).toBeDisabled();

        // (Опционално) Проверка за спинъра
        // expect(screen.getByRole('status')).toBeInTheDocument(); // Ако Spinner има role="status"

        // Умираме Promise-а, за да приключи асинхронната операция
        resolveLogin(true); // Симулираме успешен край

        // Изчакваме бутонът да се върне в нормално състояние
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /login/i })).toBeEnabled();
        });
    });

}); 