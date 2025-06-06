import React from "react";
import "./StorewiseReportScreen.css";
import { useNavigate } from "react-router-dom";

// Sample data
const storeData = [
    {
        storeId: "S001",
        storeName: "Microstore 01, Vennala",
        storeType: "Company-Owned",
        deliveryAgents: ["Agent One", "Agent Two"],
        totalTasksCompleted: 25,
        totalCOD: 5000,
        totalOnline: 3000,
    },
    {
        storeId: "S002",
        storeName: "Vendor Store 02",
        storeType: "Vendor",
        deliveryAgents: ["Agent Three"],
        totalTasksCompleted: 10,
        totalCOD: 1500,
        totalOnline: 1200,
    },
];

const StoreWiseReportScreen = () => {
    const navigate = useNavigate();

    const handleDetailsClick = (store) => {
        navigate("./store-details", { state: { store } });
    };

    return (
        <div className="storewise-container">
            <h2>Storewise Report</h2>
            <table className="storewise-table">
                <thead>
                    <tr>
                        <th>Store ID</th>
                        <th>Store Name</th>
                        <th>Store Type</th>
                        <th>No. of Delivery Agents</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {storeData.map((store) => (
                        <tr key={store.storeId}>
                            <td>{store.storeId}</td>
                            <td>{store.storeName}</td>
                            <td>{store.storeType}</td>
                            <td>{store.deliveryAgents.length}</td>
                            <td>
                                <button
                                    className="details-button"
                                    onClick={() => handleDetailsClick(store)}
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

export default StoreWiseReportScreen;
