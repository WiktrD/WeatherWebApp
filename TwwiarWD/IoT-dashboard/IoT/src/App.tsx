import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isExpired } from 'react-jwt';
import { useEffect, useState } from 'react';

import Dashboard from './Dashboard';
import Navbar from './components/Navbar';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';

function App() {
    const token = localStorage.getItem('token');
    const tokenExpired = !token || isExpired(token);

    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    }, [darkMode]);

    return (

        <div className="App">
            <BrowserRouter>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/register" element={<SignUpForm />} />
                    <Route
                        path="/dashboard"
                        element={
                            tokenExpired ? (
                                <Navigate to="/" replace />
                            ) : (
                                <Dashboard darkMode={darkMode} />
                            )
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
