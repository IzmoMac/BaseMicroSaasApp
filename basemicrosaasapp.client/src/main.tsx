import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from './Dashboard.tsx';
import Fillup from './Fillup.tsx';
import Trip from './Trip.tsx';
import AppLayout from './components/AppLayout.tsx';
import { AuthProvider } from './components/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import './index.css';
import Login from './components/Login.tsx';
import LandingPage from './components/LandingPage.tsx';
import Account from './components/Account.tsx';
import DebugLayout from './components/DebugLayout.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DebugLayout/>}>
                    {/*<Route element={<DebugLayout { />}>*/}
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
                        <Route path="register" element={<div>register page</div>} />
                    </Route>
                </Routes>
            </ BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)