import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import ConsoleList from './components/ConsoleList/ConsoleList';
import CreateConsole from './components/CreateConsole/CreateConsole';

function App() {
    return (
        <div>
            <Header />
            
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/consoles" element={<ConsoleList />} />
                    <Route path="/consoles/create" element={<CreateConsole />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;