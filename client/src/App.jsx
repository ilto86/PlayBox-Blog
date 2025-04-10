import { Routes, Route, useLocation } from 'react-router-dom';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import OwnerGuard from './guards/OwnerGuard';

// Layout
import Header from './components/layout/Header/Header';
import Home from './components/layout/Home/Home';
import Footer from './components/layout/Footer/Footer';

// Auth components
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import Profile from './components/auth/Profile/Profile';

// Console components
import ConsoleList from './components/consoles/ConsoleList/ConsoleList';
import ConsoleDetails from './components/consoles/ConsoleDetails/ConsoleDetails';
import CreateConsole from './components/consoles/CreateConsole/CreateConsole';
import EditConsole from './components/consoles/EditConsole/EditConsole';

// Contexts, paths, etc.
import { AuthProvider } from './context/authContext';
import { Path } from './utils/pathUtils';
import { ErrorProvider } from './context/errorContext';

function App() {
    const location = useLocation();
    console.log(`App.jsx: Location changed to ${location.pathname}${location.search}${location.hash}`);

    return (
        <AuthProvider>
            <ErrorProvider>
                <div id="box">
                    <Header />
                    <main id="main-content">
                        <Routes>
                            <Route path={Path.Home} element={<Home />} />
                            <Route path={Path.Login} element={<Login />} />
                            <Route path={Path.Register} element={<Register />} />
                            <Route path={Path.Consoles} element={<ConsoleList />} />
                            <Route path={`${Path.Consoles}/:consoleId`} element={<ConsoleDetails />} />

                            {/* Guest Guard Routes */}
                            <Route element={<GuestGuard />}>
                                <Route path={Path.Login} element={<Login />} />
                                <Route path={Path.Register} element={<Register />} />
                            </Route>

                            {/* Auth Guard Routes */}
                            <Route element={<AuthGuard />}>
                                <Route path={Path.Profile} element={<Profile />} />
                                <Route path={Path.ConsoleCreate} element={<CreateConsole />} />
                                
                                {/* Owner Guard Routes */}
                                <Route element={<OwnerGuard />}>
                                    <Route path={`${Path.Consoles}/:consoleId/edit`} element={<EditConsole />} />
                                </Route>
                            </Route>
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </ErrorProvider>
        </AuthProvider>
    );
}

export default App;