import React from "react";
import "./TasksListingScreen.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const TasksListingScreen = () => {
    const navigate = useNavigate();

    const { completedTasks } = useSelector(state => state.tasks);

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
                    {completedTasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.taskNo}</td>
                            <td>{task.customerName}</td>
                            <td>{task.agentName}</td>
                            <td>{task.microStoreName}</td>
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
