import React, { useEffect, useState } from "react";
import "./ReportComponent.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ReportComponent = ({ totalTasks, totalAgents }) => {
    const [activeAgents, setActiveAgents] = useState([])

    const navigate = useNavigate();

    const handleTasksClick = () => {
        navigate("./reports/tasks-listing");
    };

    const handleAgentsClick = () => {
        navigate("./reports/agents-listing", { state: { activeAgents } });
    };

    const handleDeliveryAgentReport = () => {
        navigate("./reports/agentwise-report");
    };

    const handleStoreReport = () => {
        navigate("./reports/storewise-report");
    };

    const { completedTasks } = useSelector(state => state.tasks);
    const { agentsData } = useSelector(state => state.agents);

    useEffect(() => {
        const filteredAgents = agentsData.filter(agent => agent.onDuty === true)
        setActiveAgents(filteredAgents)
    }, [agentsData])

    return (
        <main className="reports-container">
            <h2>Reports</h2>
            <div className="report-cards">
                <div className="report-card" onClick={handleTasksClick}>
                    <h3>Total Tasks Completed</h3>
                    <p>{completedTasks.length}</p>
                </div>
                <div className="report-card" onClick={handleAgentsClick}>
                    <h3>Total Active Agents</h3>
                    <p>{activeAgents.length}</p>
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
