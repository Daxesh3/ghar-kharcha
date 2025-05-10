import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Reports from './pages/Reports';
import Suggestions from './pages/Suggestions';
import FamilyMembers from './pages/FamilyMembers';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

// PWA
import { registerSW } from './utils/pwa';
import Budgets from './pages/Budgets';

const App: React.FC = () => {
    const { currentUser, loading } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        registerSW().then((registered) => {
            setIsRegistered(registered);
        });
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Routes>
            {/* Auth routes */}
            <Route path='/signin' element={currentUser ? <Navigate to='/' /> : <SignIn />} />
            <Route path='/signup' element={currentUser ? <Navigate to='/' /> : <SignUp />} />

            {/* Protected routes */}
            <Route path='/' element={currentUser ? <Layout /> : <Navigate to='/signin' />}>
                <Route index element={<Dashboard />} />
                <Route path='add-expense' element={<AddExpense />} />
                <Route path='reports' element={<Reports />} />
                <Route path='suggestions' element={<Suggestions />} />
                <Route path='family' element={<FamilyMembers />} />
                <Route path='budgets' element={<Budgets />} />
                <Route path='settings' element={<Settings />} />
            </Route>

            {/* 404 route */}
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
};

export default App;
