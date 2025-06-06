import React from "react";
import "./ReportComponent.css";
import { useNavigate } from "react-router-dom";

const ReportComponent = ({ totalTasks, totalAgents }) => {
    const navigate = useNavigate();

    const handleTasksClick = () => {
        navigate("./reports/tasks-listing");
    };

    const handleAgentsClick = () => {
        navigate("./reports/agents-listing");
    };

    const handleDeliveryAgentReport = () => {
        navigate("./reports/agentwise-report");
    };

    const handleStoreReport = () => {
        navigate("./reports/storewise-report");
    };

    return (
        <main className="reports-container">
            <h2>Reports</h2>
            <div className="report-cards">
                <div className="report-card" onClick={handleTasksClick}>
                    <h3>Total Tasks Completed</h3>
                    <p>{totalTasks}</p>
                </div>
                <div className="report-card" onClick={handleAgentsClick}>
                    <h3>Total Active Agents</h3>
                    <p>{totalAgents}</p>
                </div>
            </div>

            <div className="report-buttons">
                <button className="report-button" onClick={handleDeliveryAgentReport}>
                    Delivery Agent Wise Report
                </button>
                <button className="report-button" onClick={handleStoreReport}>
                    Store Wise Report
                </button>
            </div>
        </main>
    );
};

export default ReportComponent;
