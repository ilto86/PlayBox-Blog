import ConsoleList from './components/ConsoleList/ConsoleList';
import './App.css';

function App() {
  return (
    <>
      <header>
        <div className="header-content">
          <div className="logo">
            <h1>🎮 PlayBox Blog</h1>
          </div>
          <nav>
            <a href="/">Home</a>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </nav>
        </div>
      </header>
      
      <main>
        <ConsoleList />
      </main>
    </>
  );
}

export default App;
