import React from "react";
import "./StorewiseReportScreen.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Sample data
// const storeData = [
//     {
//         storeId: "S001",
//         storeName: "Microstore 01, Vennala",
//         storeType: "Company-Owned",
//         deliveryAgents: ["Agent One", "Agent Two"],
//         totalTasksCompleted: 25,
//         totalCOD: 5000,
//         totalOnline: 3000,
//     },
//     {
//         storeId: "S002",
//         storeName: "Vendor Store 02",
//         storeType: "Vendor",
//         deliveryAgents: ["Agent Three"],
//         totalTasksCompleted: 10,
//         totalCOD: 1500,
//         totalOnline: 1200,
//     },
// ];


const StoreWiseReportScreen = () => {
    const navigate = useNavigate();
    const { storesDetails } = useSelector(state => state.storesDetailsTypes);
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
                    {storesDetails.map((store) => (
                        <tr key={storesDetails.id}>
                            {console.log("store", store)}
                            <td>{store.id}</td>
                            <td>{store.name}</td>
                            <td>{store.type}</td>
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
