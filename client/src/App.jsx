import { Routes, Route } from 'react-router-dom';
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';
import OwnerGuard from './guards/OwnerGuard';

import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ConsoleList from './components/ConsoleList/ConsoleList';
import ConsoleDetails from './components/ConsoleDetails/ConsoleDetails';
import CreateConsole from './components/CreateConsole/CreateConsole';
import EditConsole from './components/EditConsole/EditConsole';

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