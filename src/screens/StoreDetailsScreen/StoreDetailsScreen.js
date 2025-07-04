import React from "react";
import { useLocation } from "react-router-dom";
import "./StoreDetailsScreen.css";

const StoreDetailsScreen = () => {
    const location = useLocation();
    const store = location.state?.store;
    console.log(".>>>>>", store)

    if (!store) {
        return <div className="storedetails-container">No store data found.</div>;
    }

    const {
        id,
        name,
        type,
        completedTasks,
        deliveryAgents,
        // totalCOD,
        // totalOnline,
    } = store;

    // const totalCollected = totalCOD + totalOnline;

    return (
        <div className="storedetails-container">
            <h2 className="storedetails-heading">Store Details</h2>
            <div className="storedetails-card">
                <p><strong>Store ID:</strong> {id}</p>
                <p><strong>Store Name:</strong> {name}</p>
                <p><strong>Store Type:</strong> {type}</p>
                <p><strong>Total Tasks Completed:</strong> {completedTasks.length}</p>
                <p><strong>Delivery Agents:</strong></p>
                <ul className="agents-list">
                    {deliveryAgents.map((agent, index) => (
                        <li key={index}>{agent.name}</li>
                    ))}
                </ul>
                {/* <p><strong>Total COD Collected:</strong> ₹{totalCOD}</p>
                <p><strong>Total Online Payment:</strong> ₹{totalOnline}</p>
                <p><strong>Total Amount Collected:</strong> ₹{totalCollected}</p> */}
            </div>
        </div>
    );
};

export default StoreDetailsScreen;
