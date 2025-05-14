import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from './views/Dashboard.tsx';
import Fillup from './views/Fillup.tsx';
import Trip from './views/Trip.tsx';
import Account from './views/Account.tsx';
import AppLayout from './components/AppLayout.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import DebugLayout from './components/DebugLayout.tsx';
import LandingPage from './views/LandingPage.tsx';
import Login from './views/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Register from './views/Register.tsx';
import './main.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/*<Route path="/" element={<DebugLayout/>}>*/}
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
                            <Route path="*" element={<Dashboard />} />
                        </Route>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    {/*</Route>*/}
                </Routes>
            </ BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)