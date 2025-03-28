import { Routes, Route } from 'react-router-dom';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import OwnerGuard from './guards/OwnerGuard';

// Layout
import Header from './components/layout/Header/Header';
import Home from './components/layout/Home/Home';

// Auth components
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import Profile from './components/auth/Profile/Profile';

// Console components
import ConsoleList from './components/consoles/ConsoleList/ConsoleList';
import ConsoleDetails from './components/consoles/ConsoleDetails/ConsoleDetails';
import CreateConsole from './components/consoles/CreateConsole/CreateConsole';
import EditConsole from './components/consoles/EditConsole/EditConsole';

function App() {
    return (
        <div>
            <Header />
            
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/consoles" element={<ConsoleList />} />
                    <Route path="/consoles/:consoleId" element={<ConsoleDetails />} />

                    {/* Guest Guard Routes */}
                    <Route element={<GuestGuard />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Auth Guard Routes */}
                    <Route element={<AuthGuard />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/consoles/create" element={<CreateConsole />} />
                        
                        {/* Owner Guard Routes */}
                        <Route element={<OwnerGuard />}>
                            <Route path="/consoles/:consoleId/edit" element={<EditConsole />} />
                        </Route>
                    </Route>
                </Routes>
            </main>
        </div>
    );
}

export default App;