import React from "react";
import "./TasksListingScreen.css";
import { useNavigate } from "react-router-dom";

const tasksData = [
    {
        amount: 250,
        customerName: "Customer Two",
        deliveryAddress: {
            addressLineOne: "Address Line One",
            addressLineTwo: "Address Line Two",
            addressLineThree: "Palarivattom",
            latitude: "10.002803",
            longitude: "76.307631",
            pincode: "682025"
        },
        deliveryCompleted: false,
        id: "1748330349014",
        microStoreName: "Microstore 01, Vennala",
        mobile: "1111111114",
        pickupAddress: {
            addressLineOne: "2nd floor, Nandhanam Tower",
            addressLineTwo: "Kaniyapilly Rd",
            addressLineThree: "Chakkaraparambu, Vennala",
            latitude: "9.991581023428584",
            longitude: "76.31693806117408",
            pincode: "682028"
        },
        pickupCompleted: false,
        storeId: "2222233333",
        taskNo: "ORD1996141893",
        type: "cod",
        status: "Pending",
        date: "13 May, 2025",
        time: "5:30 pm",
        deliveryAgent: "Agent One",
        storeName: "Vennala"
    },
    {
        amount: 250,
        customerName: "Customer Two",
        deliveryAddress: {
            addressLineOne: "Address Line One",
            addressLineTwo: "Address Line Two",
            addressLineThree: "Palarivattom",
            latitude: "10.002803",
            longitude: "76.307631",
            pincode: "682025"
        },
        deliveryCompleted: false,
        id: "1748330349015",
        microStoreName: "Microstore 01, Vennala",
        mobile: "1111111114",
        pickupAddress: {
            addressLineOne: "2nd floor, Nandhanam Tower",
            addressLineTwo: "Kaniyapilly Rd",
            addressLineThree: "Chakkaraparambu, Vennala",
            latitude: "9.991581023428584",
            longitude: "76.31693806117408",
            pincode: "682028"
        },
        pickupCompleted: false,
        storeId: "2222233333",
        taskNo: "ORD1996141894",
        type: "cod",
        status: "Pending",
        date: "13 May, 2025",
        time: "6:30 pm",
        deliveryAgent: "Agent Two",
        storeName: "Thrippunithura"
    },
    {
        amount: 250,
        customerName: "Customer Two",
        deliveryAddress: {
            addressLineOne: "Address Line One",
            addressLineTwo: "Address Line Two",
            addressLineThree: "Palarivattom",
            latitude: "10.002803",
            longitude: "76.307631",
            pincode: "682025"
        },
        deliveryCompleted: false,
        id: "1748330349016",
        microStoreName: "Microstore 01, Vennala",
        mobile: "1111111114",
        pickupAddress: {
            addressLineOne: "2nd floor, Nandhanam Tower",
            addressLineTwo: "Kaniyapilly Rd",
            addressLineThree: "Chakkaraparambu, Vennala",
            latitude: "9.991581023428584",
            longitude: "76.31693806117408",
            pincode: "682028"
        },
        pickupCompleted: false,
        storeId: "2222233333",
        taskNo: "ORD1996141894",
        type: "cod",
        status: "Completed",
        date: "13 May, 2025",
        time: "6:30 pm",
        deliveryAgent: "Agent Two",
        storeName: "Vennala"
    },
]

const TasksListingScreen = () => {
    const navigate = useNavigate();

    const handleDetailsClick = (task) => {
        navigate('./task-details', { state: { task } });
    };

    return (
        <div className="tasks-listing-container">
            <h2>Completed Tasks</h2>
            <table className="tasks-table">
                <thead>
                    <tr>
                        <th>Task No</th>
                        <th>Customer Name</th>
                        <th>Delivery Agent</th>
                        <th>Store Name</th>
                        <th>Date</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {tasksData.map((task) => (
                        <tr key={task.id}>
                            <td>{task.taskNo}</td>
                            <td>{task.customerName}</td>
                            <td>{task.deliveryAgent}</td>
                            <td>{task.storeName}</td>
                            <td>{task.date}</td>
                            <td>
                                <button
                                    className="details-button"
                                    onClick={() => handleDetailsClick(task)}
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

export default TasksListingScreen;
