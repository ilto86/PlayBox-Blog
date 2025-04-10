import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';

import Profile from '../../../components/auth/Profile/Profile';
import { AuthContext } from '../../../context/authContext';
import * as profileService from '../../../services/profileService';
import * as consoleService from '../../../services/consoleService';
import { Path } from '../../../utils/pathUtils';
import { DEFAULT_CONSOLE_IMAGE } from '../../../utils/constants';
import * as authService from '../../../services/authService';

// Мокваме сървисите
vi.mock('../../../services/profileService');
vi.mock('../../../services/consoleService', () => ({
    getUserConsoles: vi.fn(),
    // Добави други функции от consoleService, ако се използват в Profile.jsx
    // например: deleteConsole: vi.fn(), createConsole: vi.fn(), etc.
}));
// vi.mock('../../../services/authService'); // Мокваме и него, за всеки случай

// Мокваме зависимости за рутиране
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Мокваме дъщерни компоненти, които не са фокус на теста (опционално, но може да улесни)
// Ако LikeButton прави свои заявки или има сложна логика, е добре да се мокне
vi.mock('../../../components/consoles/LikeButton/LikeButton', () => ({
    // Default export, затова е { default: ... }
    default: ({ consoleId }) => <button data-testid={`like-button-${consoleId}`}>Like</button>
}));
// Може да мокнем и Modal, ако създава проблеми с портали или фокус
vi.mock('../../../components/common/Modal/Modal', () => ({
    default: ({ show, onClose, title, children, onConfirm, isLoading }) => {
        if (!show) {return null;}
        return (
            <div data-testid="mock-modal">
                <h2>{title}</h2>
                <div>{children}</div>
                <button onClick={onClose} disabled={isLoading}>Cancel</button>
                <button onClick={onConfirm} disabled={isLoading}>
                    {isLoading ? 'Deleting...' : 'Confirm'}
                </button>
            </div>
        );
    }
}));

// Mock ErrorBox to include data-testid
vi.mock('../../../components/common/ErrorBox/ErrorBox', () => ({
    default: ({ error, onClose }) => error ? (
        <div data-testid="error-box">
            <p>{error}</p>
            <button onClick={onClose}>&times;</button>
        </div>
    ) : null,
}));

// Mock Spinner
vi.mock('../../../components/common/Spinner/Spinner', () => ({
    default: () => <div data-testid="spinner">Spinner</div>,
}));

// Mock services
vi.mock('../../../services/profileService');
vi.mock('../../../services/consoleService');
vi.mock('../../../services/authService'); // Keep this for the direct call in Profile component

// --- Помощни данни ---
const MOCK_USER_ID = 'user123';
const MOCK_EMAIL = 'test@example.com';
const MOCK_USERNAME = 'TestUser';
const MOCK_IMAGE_URL = 'http://example.com/avatar.jpg';

const MOCK_PROFILE_DATA = {
    _id: MOCK_USER_ID,
    username: MOCK_USERNAME,
    imageUrl: MOCK_IMAGE_URL,
    // Добави други полета, ако getProfile ги връща и компонентът ги ползва
};

const MOCK_CONSOLE_1 = {
    _id: 'console1',
    consoleName: 'Test Console 1',
    manufacturer: 'Nintendo',
    price: '100',
    imageUrl: 'http://example.com/console1.jpg',
    _ownerId: MOCK_USER_ID,
};

const MOCK_CONSOLE_2 = {
    _id: 'console2',
    consoleName: 'Test Console 2',
    manufacturer: 'Sony',
    price: '200',
    imageUrl: null, // За тест на default image
    _ownerId: MOCK_USER_ID,
};

const MOCK_USER_CONSOLES = [MOCK_CONSOLE_1, MOCK_CONSOLE_2];

// --- Помощна функция за рендиране ---
const renderProfileComponent = (
    contextValueOverrides = {},
    profileData = MOCK_PROFILE_DATA,
    consoleData = MOCK_USER_CONSOLES
) => {
    // Мок имплементации по подразбиране
    profileService.getProfile.mockResolvedValue(profileData);
    consoleService.getUserConsoles.mockResolvedValue(consoleData);
    profileService.updateProfile.mockResolvedValue({ ...profileData, ...contextValueOverrides }); // Симулираме успешен ъпдейт
    // authService.deleteAccount.mockResolvedValue({}); // Ако се ползва директно

    const defaultContextValue = {
        userId: MOCK_USER_ID,
        email: MOCK_EMAIL,
        username: MOCK_USERNAME, // Може да се вземе от profileData? Не, контекстът го дава.
        imageUrl: profileData.imageUrl || MOCK_IMAGE_URL, // Същото
        isAuthenticated: true,
        updateUser: vi.fn(), // Mock функция за ъпдейт на контекста
        deleteAccountHandler: vi.fn().mockResolvedValue(true), // Mock за изтриване от контекста
        logoutHandler: vi.fn(), // Mock за logout от контекста
        error: null,
        clearError: vi.fn(),
    };

    const effectiveContextValue = { ...defaultContextValue, ...contextValueOverrides };

    // Увери се, че updateUser връща Promise, ако компонентът го очаква
    effectiveContextValue.updateUser.mockResolvedValue();

    return render(
        <MemoryRouter initialEntries={['/profile']}> {/* Може да се наложи да добавим и други пътища */}
            <AuthContext.Provider value={effectiveContextValue}>
                <Routes>
                    <Route path="/profile" element={<Profile />} />
                    <Route path={Path.Home} element={<div>Home Page</div>} />
                    <Route path={Path.ConsoleCreate} element={<div>Create Console Page</div>} />
                    <Route path="/consoles/:consoleId" element={<div>Console Details Page</div>} />
                </Routes>
            </AuthContext.Provider>
        </MemoryRouter>
    );
};


// --- Тестове ---
describe('Component: Profile', () => {
    let mockAuthContextValue;

    // Helper function to render the component
    const renderProfileComponent = (contextOverrides = {}, route = Path.Profile) => {
        const contextValue = {
            ...mockAuthContextValue,
            ...contextOverrides,
        };
        return render(
            <MemoryRouter initialEntries={[route]}>
                <AuthContext.Provider value={contextValue}>
                    <Routes>
                        <Route path={Path.Profile} element={<Profile />} />
                        {/* Add other routes if needed for navigation tests */}
                    </Routes>
                </AuthContext.Provider>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        // Reset mocks before each test
        vi.resetAllMocks();

        // Default successful mock implementations
        vi.mocked(profileService.getProfile).mockResolvedValue({
            _id: 'profile1',
            _ownerId: MOCK_USER_ID,
            username: MOCK_USERNAME,
            imageUrl: MOCK_IMAGE_URL,
        });
        vi.mocked(consoleService.getUserConsoles).mockResolvedValue([MOCK_CONSOLE_1, MOCK_CONSOLE_2]);
        vi.mocked(authService.deleteAccount).mockResolvedValue(); // Default success for delete

        // Default context value
        mockAuthContextValue = {
            email: MOCK_EMAIL,
            username: MOCK_USERNAME,
            imageUrl: MOCK_IMAGE_URL,
            userId: MOCK_USER_ID,
            isAuthenticated: true,
            updateUser: vi.fn(),
            deleteAccountHandler: vi.fn(() => authService.deleteAccount()), // Simulate context calling service
            logoutHandler: vi.fn(),
            error: null,
            clearError: vi.fn(),
        };
    });

    it('should render spinner initially', () => {
        renderProfileComponent();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('should render error box if profile fetching fails', async () => {
        const errorMessage = 'Failed to load profile data';
        // {{ Корекция: Mock getProfile да хвърли грешка }}
        vi.mocked(profileService.getProfile).mockRejectedValueOnce(new Error(errorMessage));

        renderProfileComponent();

        // {{ Корекция: Изчакай ErrorBox по data-testid }}
        const errorBox = await screen.findByTestId('error-box');
        expect(errorBox).toBeInTheDocument();
        expect(errorBox).toHaveTextContent(errorMessage);

        // {{ Корекция: Провери дали основното съдържание НЕ се рендира }}
        expect(screen.queryByRole('heading', { name: MOCK_USERNAME })).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: /my consoles/i })).not.toBeInTheDocument();
    });

    it('should render error box if console fetching fails', async () => {
        const errorMessage = 'Failed to load consoles';
         // {{ Корекция: Mock getUserConsoles да хвърли грешка }}
        vi.mocked(consoleService.getUserConsoles).mockRejectedValueOnce(new Error(errorMessage));

        renderProfileComponent();

        // {{ Корекция: Изчакай ErrorBox по data-testid }}
        const errorBox = await screen.findByTestId('error-box');
        expect(errorBox).toBeInTheDocument();
        // Забележка: Компонентът може да покаже обща грешка или специфичната. Ще търсим специфичната.
        // Ако показва обща, промени текста тук.
        expect(errorBox).toHaveTextContent(errorMessage);

        // {{ Корекция: Провери дали конзолите НЕ се рендират, но профилът ДА }}
        expect(await screen.findByRole('heading', { name: MOCK_USERNAME })).toBeInTheDocument(); // Profile should load
        expect(screen.queryByRole('heading', { name: /my consoles/i })).not.toBeInTheDocument();
        expect(screen.queryByText(MOCK_CONSOLE_1.name)).not.toBeInTheDocument();
    });

    it('should render profile information and consoles correctly on successful load', async () => {
        renderProfileComponent();

        // Изчакай зареждането да приключи (профил и конзоли)
        expect(await screen.findByRole('heading', { name: MOCK_USERNAME })).toBeInTheDocument();
        expect(await screen.findByText(MOCK_CONSOLE_1.name)).toBeInTheDocument();
        expect(await screen.findByText(MOCK_CONSOLE_2.name)).toBeInTheDocument();

        // Провери информацията за профила
        expect(screen.getByText(MOCK_EMAIL)).toBeInTheDocument();
        const profileImage = screen.getByAltText(MOCK_USERNAME);
        expect(profileImage).toBeInTheDocument();
        expect(profileImage).toHaveAttribute('src', MOCK_IMAGE_URL);
        expect(screen.getByText(/Total Consoles: 2/i)).toBeInTheDocument(); // Check console count

        // Провери информацията за конзолите
        const console1Image = screen.getByAltText(MOCK_CONSOLE_1.name);
        expect(console1Image).toBeInTheDocument();
        expect(console1Image).toHaveAttribute('src', MOCK_CONSOLE_1.imageUrl);

        // {{ Корекция: Използвай getAllByRole за линковете }}
        const viewDetailsLinks = screen.getAllByRole('link', { name: /view details/i });
        expect(viewDetailsLinks).toHaveLength(2);
        // Провери дали линковете сочат към правилните детайли
        expect(viewDetailsLinks.some(link => link.getAttribute('href') === Path.ConsoleDetails(MOCK_CONSOLE_1._id))).toBe(true);
        expect(viewDetailsLinks.some(link => link.getAttribute('href') === Path.ConsoleDetails(MOCK_CONSOLE_2._id))).toBe(true);

        // Провери дали бутонът "Add Console" е наличен
        expect(screen.getByRole('link', { name: /add console/i })).toBeInTheDocument();
    });

    describe('Edit Username', () => {
        it('should allow editing and saving username', async () => {
            const user = userEvent.setup();
            const newUsername = 'UpdatedUser';
            renderProfileComponent();

            // {{ Корекция: Изчакай зареждането ПРЕДИ да търсиш бутона }}
            expect(await screen.findByRole('heading', { name: MOCK_USERNAME })).toBeInTheDocument();

            // Кликни Edit
            const editButton = screen.getByRole('button', { name: /edit username/i });
            await user.click(editButton);

            // Провери дали полето за редакция се появява
            const usernameInput = screen.getByDisplayValue(MOCK_USERNAME);
            expect(usernameInput).toBeInTheDocument();

            // Промени името и кликни Save
            await user.clear(usernameInput);
            await user.type(usernameInput, newUsername);
            const saveButton = screen.getByRole('button', { name: /save/i });
            await user.click(saveButton);

            // Провери дали updateUser е извикан и името е обновено
            expect(mockAuthContextValue.updateUser).toHaveBeenCalledWith({ username: newUsername });
            // Тъй като updateUser е mock-нат, трябва да изчакаме UI-а да се обнови (ако има асинхронност)
            // В този случай, приемаме, че контекстът би обновил стойността синхронно за целите на теста
            // или че компонентът ще вземе новата стойност при следващо рендиране.
            // За по-сигурно, може да изчакаме новото име да се появи:
            expect(await screen.findByRole('heading', { name: newUsername })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument(); // Save бутонът изчезва
        });

        it('should handle error when saving username', async () => {
            const user = userEvent.setup();
            const errorMessage = 'Failed to update username';
            // Настрой mock-а на updateUser да хвърли грешка
            mockAuthContextValue.updateUser.mockRejectedValueOnce(new Error(errorMessage));

            renderProfileComponent();

            // {{ Корекция: Изчакай зареждането ПРЕДИ да търсиш бутона }}
            expect(await screen.findByRole('heading', { name: MOCK_USERNAME })).toBeInTheDocument();

            // Кликни Edit
            const editButton = screen.getByRole('button', { name: /edit username/i });
            await user.click(editButton);

            // Промени името и кликни Save
            const usernameInput = screen.getByDisplayValue(MOCK_USERNAME);
            await user.clear(usernameInput);
            await user.type(usernameInput, 'AttemptUpdate');
            const saveButton = screen.getByRole('button', { name: /save/i });
            await user.click(saveButton);

            // Провери дали се показва ErrorBox с правилната грешка
            const errorBox = await screen.findByTestId('error-box');
            expect(errorBox).toBeInTheDocument();
            // Грешката може да е обвита от useErrorHandling, провери за част от нея
            expect(errorBox).toHaveTextContent(/Failed to update username/i);

            // Провери дали режимът на редакция е все още активен
            expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
            expect(screen.getByDisplayValue('AttemptUpdate')).toBeInTheDocument();
        });

        // ... other edit username tests (cancel, validation) ...
    });

    // ... Edit Profile Image tests ...

    describe('Delete Profile', () => {
        it('should open and close delete confirmation modal', async () => {
            const user = userEvent.setup();
            renderProfileComponent();

            // {{ Корекция: Изчакай зареждането ПРЕДИ да търсиш бутона }}
            expect(await screen.findByRole('heading', { name: MOCK_USERNAME })).toBeInTheDocument();

            // Кликни Delete Profile бутона
            const deleteButton = screen.getByRole('button', { name: /delete profile/i });
            await user.click(deleteButton);

            // Провери дали модалът се отваря
            const modal = await screen.findByRole('dialog'); // Модалите обикновено имат role="dialog"
            expect(modal).toBeInTheDocument();
            expect(within(modal).getByText(/confirm delete/i)).toBeInTheDocument();
            expect(within(modal).getByText(/are you sure you want to delete/i)).toBeInTheDocument();

            // Кликни Cancel бутона в модала
            const cancelButton = within(modal).getByRole('button', { name: /cancel/i });
            await user.click(cancelButton);

            // Провери дали модалът се затваря
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('should call deleteAccountHandler, logoutHandler and navigate on Confirm', async () => {
            const user = userEvent.setup();
            const mockDeleteHandler = vi.fn().mockResolvedValue(true); // Mock delete handler от контекста
            const mockLogoutHandler = vi.fn();
            // {{ Корекция: Премахни vi.mocked реда }}
            // vi.mocked(useNavigate).mockReturnValue(mockNavigate); // <--- ПРЕМАХНИ ТОЗИ РЕД

            renderProfileComponent({
                deleteAccountHandler: mockDeleteHandler,
                logoutHandler: mockLogoutHandler,
            });

            // {{ Корекция: Изчакай зареждането ПРЕДИ да търсиш бутона }}
            expect(await screen.findByRole('heading', { name: MOCK_USERNAME })).toBeInTheDocument();

            // Отвори модала
            const deleteButton = screen.getByRole('button', { name: /delete profile/i });
            await user.click(deleteButton);
            const modal = await screen.findByRole('dialog');

            // Кликни Confirm
            const confirmButton = within(modal).getByRole('button', { name: /confirm/i });
            await user.click(confirmButton);

            // Провери дали deleteAccountHandler е извикан
            expect(mockDeleteHandler).toHaveBeenCalledTimes(1);

            // Изчакай асинхронните операции да приключат (ако има такива след delete)
            // waitFor е полезен тук, за да изчакаме logout и navigate
            await waitFor(() => {
                // Провери дали logoutHandler е извикан
                expect(mockLogoutHandler).toHaveBeenCalledTimes(1);
            });

            await waitFor(() => {
                 // Провери дали navigate е извикан към началната страница
                 // mockNavigate се взима от глобалния mock на react-router-dom
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });

            // Провери дали модалът е затворен
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('should show error message if deletion fails', async () => {
            const user = userEvent.setup();
            const errorMessage = 'Server error during deletion';
            const mockDeleteHandler = vi.fn().mockRejectedValue(new Error(errorMessage)); // Mock за грешка
            const mockLogoutHandler = vi.fn();
             // {{ Корекция: Премахни vi.mocked реда }}
            // vi.mocked(useNavigate).mockReturnValue(mockNavigate); // <--- ПРЕМАХНИ ТОЗИ РЕД

            renderProfileComponent({
                deleteAccountHandler: mockDeleteHandler,
                logoutHandler: mockLogoutHandler,
            });

             // {{ Корекция: Изчакай зареждането ПРЕДИ да търсиш бутона }}
            expect(await screen.findByRole('heading', { name: MOCK_USERNAME })).toBeInTheDocument();

            // Отвори модала
            const deleteButton = screen.getByRole('button', { name: /delete profile/i });
            await user.click(deleteButton);
            const modal = await screen.findByRole('dialog');

            // Кликни Confirm
            const confirmButton = within(modal).getByRole('button', { name: /confirm/i });
            await user.click(confirmButton);

            // Провери дали deleteAccountHandler е извикан
            expect(mockDeleteHandler).toHaveBeenCalledTimes(1);

            // Провери дали се показва ErrorBox с правилната грешка ВЪТРЕ В КОМПОНЕНТА (не в модала)
            const errorBox = await screen.findByTestId('error-box');
            expect(errorBox).toBeInTheDocument();
            expect(errorBox).toHaveTextContent(/Failed to delete account/i); // Провери за префикса от Profile.jsx
            expect(errorBox).toHaveTextContent(errorMessage); // Провери и за оригиналното съобщение

            // Провери дали модалът е все още отворен (или затворен, зависи от логиката)
            // Обикновено при грешка модалът остава отворен, за да може потребителят да опита пак или да затвори
            expect(screen.getByRole('dialog')).toBeInTheDocument();

            // Провери дали logout и navigate НЕ са извикани
            expect(mockLogoutHandler).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    // ... Navigation and Empty State tests ...
     describe('Navigation and Empty State', () => {
        // ... (тестове за навигация към create, details)

        it('should display message and Add Console button when no consoles exist', async () => {
            // Mock getUserConsoles да върне празен масив
            vi.mocked(consoleService.getUserConsoles).mockResolvedValue([]);

            renderProfileComponent();

            // Изчакай зареждането на профила
            expect(await screen.findByRole('heading', { name: MOCK_USERNAME })).toBeInTheDocument();

            // Провери за съобщението "No consoles added yet"
            expect(await screen.findByText(/No consoles added yet/i)).toBeInTheDocument();

            // Провери дали бутонът "Add Console" все още е наличен
            expect(screen.getByRole('link', { name: /add console/i })).toBeInTheDocument();

            // Провери дали мрежата с конзоли НЕ се рендира
            expect(screen.queryByTestId(`console-card-${MOCK_CONSOLE_1._id}`)).not.toBeInTheDocument();
        });
    });
});