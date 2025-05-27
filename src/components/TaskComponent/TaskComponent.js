import React from "react";
import "./TaskComponent.css";
import { useNavigate } from "react-router-dom";

const TaskComponent = (props) => {
    const navigate = useNavigate();

    const handleTaskClick = (task) => {
        navigate('./task-details', { state: { task } });
    };

    return (
        <main className="taskcomponent-content">
            {/* {activeSection === "Tasks" && ( */}
                <div>
                    <h2 className="taskcomponent-title">Tasks</h2>
                    <div className="taskcomponent-cards-container">
                        {props.tasksData.map((task) => (
                            <div
                                key={task.id}
                                className="taskcomponent-card"
                                onClick={() => handleTaskClick(task)}
                            >
                                <p><strong>Task No:</strong> {task.taskNo}</p>
                                <p><strong>Customer:</strong> {task.customerName}</p>
                                <p><strong>Store:</strong> {task.microStoreName}</p>
                                <p><strong>Status:</strong> {task.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            {/* )} */}
        </main>
    );
};

export default TaskComponent;
