import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import Dashboard from '../screens/Dashboard/Dashboard';
import ViewProfileScreen from '../screens/ViewProfileScreen/ViewProfileScreen';
import AddAgentScreen from '../screens/AddAgentScreen/AddAgentScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen/TaskDetailsScreen';
import TasksListingScreen from '../screens/TasksListingScreen/TasksListingScreen';
import ActiveAgentListingScreen from '../screens/ActiveAgentListingScreen/ActiveAgentListingScreen';
import StorewiseReport from '../screens/StorewiseReportScreen/StorewiseReportScreen';
import AgentWiseReportScreen from '../screens/AgentWiseReportScreen/AgentWiseReportScreen';
import StoreDetailsScreen from '../screens/StoreDetailsScreen/StoreDetailsScreen';

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
                    <Route path="/dashboard/agents/add-agent" element={<AddAgentScreen />} />
                    <Route path='/dashboard/agents/view-profile' element={<ViewProfileScreen />} />
                    <Route path='/dashboard/tasks/task-details' element={<TaskDetailsScreen />} />
                    <Route path='/dashboard/reports/tasks-listing/task-details' element={<TaskDetailsScreen />} />
                    <Route path='/dashboard/reports/tasks-listing' element={<TasksListingScreen />} />
                    <Route path='/dashboard/reports/agents-listing' element={<ActiveAgentListingScreen />} />
                    <Route path='/dashboard/reports/agentwise-report' element={<AgentWiseReportScreen />} />
                    <Route path='/dashboard/reports/storewise-report' element={<StorewiseReport />} />
                    <Route path='/dashboard/reports/storewise-report/store-details' element={<StoreDetailsScreen />} />
                </Routes>
            </Router>
        );
    }

export default AppRoutes;
