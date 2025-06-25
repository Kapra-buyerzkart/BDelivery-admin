import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TaskDetailsScreen.css";

const TaskDetailsScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const task = location.state?.task;

    if (!task) {
        return <div className="taskdetails-container">No task data found.</div>;
    }

    const {
        taskNo,
        customerName,
        deliveryAddress,
        microStoreName,
        pickupAddress,
        date,
        time,
        type,
        amount,
        status,
        deliveryAgent
    } = task;

    return (
        <div className="taskdetails-container">
            {/* <button className="back-button" onClick={() => navigate(-1)}>← Back</button> */}
            <h2 className="taskdetails-heading">Task Details</h2>
            <div className="taskdetails-card">
                <p><strong>Task Number:</strong> {taskNo}</p>
                <p><strong>Customer Name:</strong> {customerName}</p>
                <p><strong>Delivery Address:</strong><br />
                    {deliveryAddress?.addressLineOne}<br />
                    {deliveryAddress?.addressLineTwo}<br />
                    {deliveryAddress?.addressLineThree}<br />
                    {deliveryAddress?.pincode}
                </p>
                <p><strong>Store Name:</strong> {microStoreName}</p>
                <p><strong>Pickup Address:</strong><br />
                    {pickupAddress?.addressLineOne}<br />
                    {pickupAddress?.addressLineTwo}<br />
                    {pickupAddress?.addressLineThree}<br />
                    {pickupAddress?.pincode}
                </p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Payment Type:</strong> {type}</p>
                <p><strong>Amount:</strong> ₹{amount}</p>
                {/* <p><strong>Status:</strong> {status}</p> */}
                {status === "Completed" && (
                    <p><strong>Delivery Agent:</strong> {deliveryAgent}</p>
                )}
            </div>
        </div>
    );
};

export default TaskDetailsScreen;
