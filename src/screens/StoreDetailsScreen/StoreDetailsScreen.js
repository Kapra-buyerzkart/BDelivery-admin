import React from "react";
import { useLocation } from "react-router-dom";
import "./StoreDetailsScreen.css";

const StoreDetailsScreen = () => {
    const location = useLocation();
    const store = location.state?.store;

    if (!store) {
        return <div className="storedetails-container">No store data found.</div>;
    }

    const {
        storeId,
        storeName,
        storeType,
        totalTasksCompleted,
        deliveryAgents,
        totalCOD,
        totalOnline,
    } = store;

    const totalCollected = totalCOD + totalOnline;

    return (
        <div className="storedetails-container">
            <h2 className="storedetails-heading">Store Details</h2>
            <div className="storedetails-card">
                <p><strong>Store ID:</strong> {storeId}</p>
                <p><strong>Store Name:</strong> {storeName}</p>
                <p><strong>Store Type:</strong> {storeType}</p>
                <p><strong>Total Tasks Completed:</strong> {totalTasksCompleted}</p>
                <p><strong>Delivery Agents:</strong></p>
                <ul className="agents-list">
                    {deliveryAgents.map((agent, index) => (
                        <li key={index}>{agent}</li>
                    ))}
                </ul>
                <p><strong>Total COD Collected:</strong> ₹{totalCOD}</p>
                <p><strong>Total Online Payment:</strong> ₹{totalOnline}</p>
                <p><strong>Total Amount Collected:</strong> ₹{totalCollected}</p>
            </div>
        </div>
    );
};

export default StoreDetailsScreen;
