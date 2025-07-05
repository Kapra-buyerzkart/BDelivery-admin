import React from "react";
import "./AgentWiseReportScreen.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AgentWiseReportScreen = () => {
    const navigate = useNavigate();
    const { agentsData } = useSelector(state => state.agents);
    const handleDetailsClick = (agent) => {
        navigate("/dashboard/reports/agentwise-report/agent-details", { state: { agent } });
    };

    return (
        <div className="agentwise-report-container">
            <h2>Agent-wise Report</h2>
            <table className="agentwise-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Store</th>
                        <th>Completed Tasks</th>
                        <th>Total Earnings (₹)</th>
                        <th>Total Kilometers</th>
                        <th>Details</th>
                        {/* <th>Details</th> */}
                    </tr>
                </thead>
                <tbody>
                    {agentsData.map((agent, index) => (
                        <tr key={index}>
                            <td>{agent.id}</td>
                            <td>{agent.name}</td>
                            <td>{agent.phoneNumber}</td>
                            <td>{agent.storeName}</td>
                            <td>{agent.completedOrdersCount}</td>
                            <td>{agent.totalEarnings}</td>
                            <td>{agent.distanceCovered}</td>
                            <td>
                                <button
                                    className="details-button"
                                    onClick={() => handleDetailsClick(agent)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AgentWiseReportScreen;
