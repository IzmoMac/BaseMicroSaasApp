import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
import Account from './views/auth/Account';
import AppLayout from './components/AppLayout';
import { AuthProvider } from './context/AuthContext';
import DebugLayout from './components/DebugLayout';
import LandingPage from './views/LandingPage';
import Login from './views/auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './views/auth/Register';
import './main.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DebugLayout/>}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="app" element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }>
                            <Route path="account" element={<Account />} />
                        </Route>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>
                </Routes>
            </ BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)