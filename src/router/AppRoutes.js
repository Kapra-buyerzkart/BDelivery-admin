import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import Dashboard from '../screens/Dashboard/Dashboard';
import ViewProfileScreen from '../screens/ViewProfileScreen/ViewProfileScreen';
import AddAgentScreen from '../screens/AddAgentScreen/AddAgentScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen/TaskDetailsScreen';
import TasksListingScreen from '../screens/TasksListingScreen/TasksListingScreen';
import ActiveAgentListingScreen from '../screens/ActiveAgentListingScreen/ActiveAgentListingScreen';

const
    AppRoutes = () => {

        const [isLoggedIn, setIsLoggedIn] = useState(
            JSON.parse(localStorage.getItem("isLoggedIn")) || false
        );

        // Sync isAuthenticated with localStorage
        useEffect(() => {
            localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
        }, [isLoggedIn]);

        const handleLogin = () => setIsLoggedIn(true);
        const handleLogout = () => setIsLoggedIn(false);

        return (
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginScreen onLogin={handleLogin} />}
                    />
                    <Route
                        path="/dashboard"
                        element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" replace />}
                    />
                    {/* <Route path="/pickers" element={<PickersScreen />} />
                <Route path="/wallet" element={<WalletScreen />} />
                <Route path="/report" element={<ReportScreen />} />\
                <Route path="/settings" element={<SettingsScreen />} /> */}
                    <Route path="/dashboard/add-agent" element={<AddAgentScreen />} />
                    <Route path='/dashboard/view-profile' element={<ViewProfileScreen />} />
                    <Route path='/dashboard/task-details' element={<TaskDetailsScreen />} />
                    <Route path='/dashboard/tasks-listing' element={<TasksListingScreen />} />
                    <Route path='/dashboard/agents-listing' element={<ActiveAgentListingScreen />} />
                </Routes>
            </Router>
        );
    }

export default AppRoutes;
