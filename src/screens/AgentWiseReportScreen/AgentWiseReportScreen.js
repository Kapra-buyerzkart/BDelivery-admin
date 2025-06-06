import React from "react";
import "./AgentWiseReportScreen.css";
import { useNavigate } from "react-router-dom";

const agentsData = [
    {
        id: "A001",
        name: "Agent One",
        mobile: "1112223334",
        store: "Vennala",
        completedTasks: 10,
        totalEarnings: 2200,
        totalKilometers: 34.5,
    },
    {
        id: "A002",
        name: "Agent Two",
        mobile: "9998887776",
        store: "Palarivattom",
        completedTasks: 8,
        totalEarnings: 1900,
        totalKilometers: 29.3,
    },
    {
        id: "A003",
        name: "Agent Three",
        mobile: "8887776665",
        store: "Edappally",
        completedTasks: 6,
        totalEarnings: 1400,
        totalKilometers: 21.8,
    },
];

const AgentWiseReportScreen = () => {
    const navigate = useNavigate();

    const handleDetailsClick = (agent) => {
        navigate("/agent-details", { state: { agent } });
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
                        {/* <th>Details</th> */}
                    </tr>
                </thead>
                <tbody>
                    {agentsData.map((agent, index) => (
                        <tr key={index}>
                            <td>{agent.id}</td>
                            <td>{agent.name}</td>
                            <td>{agent.mobile}</td>
                            <td>{agent.store}</td>
                            <td>{agent.completedTasks}</td>
                            <td>{agent.totalEarnings}</td>
                            <td>{agent.totalKilometers}</td>
                            {/* <td>
                                <button
                                    className="details-button"
                                    onClick={() => handleDetailsClick(agent)}
                                >
                                    View
                                </button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AgentWiseReportScreen;
