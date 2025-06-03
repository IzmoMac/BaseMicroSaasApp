import AppLayout from '@components/AppLayout';
import DebugLayout from '@components/DebugLayout';
import ProtectedRoute from '@components/ProtectedRoute';
import { AuthProvider } from '@context/AuthContext';
import Account from '@views/auth/Account';
import Login from '@views/auth/Login';
import Register from '@views/auth/Register';
import Dashboard from '@views/Dashboard';
import Data from '@views/Data';
import Fillup from '@views/Fillup';
import LandingPage from '@views/LandingPage';
import Trip from '@views/Trip';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
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
                            <Route index element={<Dashboard />} />
                            <Route path="fillup" element={<Fillup />} />
                            <Route path="trip" element={<Trip />} />
                            <Route path="account" element={<Account />} />
                            <Route path="data" element={<Data/>} />
                            <Route path="*" element={<Dashboard />} />
                        </Route>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>
                </Routes>
            </ BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)