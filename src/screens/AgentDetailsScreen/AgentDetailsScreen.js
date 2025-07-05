import React from "react";
import { useLocation } from "react-router-dom";
import "./AgentDetailsScreen.css";

const AgentDetailsScreen = () => {
    const location = useLocation();
    const agent = location.state?.agent;
    // console.log(".>>>>>", agent)

    if (!agent) {
        return <div className="agentdetails-container">No agent data found.</div>;
    }

    const {
        id,
        name,
        phoneNumber,
        storeName,
        completedOrdersCount,
        totalEarnings,
        distanceCovered,
        type,
        onDuty
        // completedTasks,
        // deliveryAgents,
        // totalCOD,
        // totalOnline,
    } = agent;

    // const totalCollected = totalCOD + totalOnline;

    return (
        <div className="agentdetails-container">
            <h2 className="agentdetails-heading">Agent Details</h2>
            <div className="agentdetails-card">
                <p><strong>Agent ID:</strong> {id}</p>
                <p><strong>Agent Name:</strong> {name}</p>
                <p><strong>Phone Number:</strong> {phoneNumber}</p>
                <p><strong>Store Name:</strong> {storeName}</p>
                <p><strong>Completed Tasks:</strong> {completedOrdersCount}</p>
                <p><strong>Total Earnings:</strong> {totalEarnings}</p>
                <p><strong>Distance Covered:</strong> {distanceCovered} KM</p>
                <p><strong>Agent Type:</strong> {type}</p>
                <p>
                    <strong>Status:</strong>{" "}
                    <span className={onDuty ? "status-on" : "status-off"}>
                        {onDuty ? "ON DUTY" : "OFF DUTY"}
                    </span>
                </p>                {/* <p><strong>Delivery Agents:</strong></p>
                <ul className="agents-list">
                    {deliveryAgents.map((agent, index) => (
                        <li key={index}>{agent.name}</li>
                    ))}
                </ul> */}
                {/* <p><strong>Total COD Collected:</strong> ₹{totalCOD}</p>
                <p><strong>Total Online Payment:</strong> ₹{totalOnline}</p>
                <p><strong>Total Amount Collected:</strong> ₹{totalCollected}</p> */}
            </div>
        </div>
    );
};

export default AgentDetailsScreen;
