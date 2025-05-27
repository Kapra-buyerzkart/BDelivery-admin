import React from "react";
import "./AgentsComponent.css";
import { useNavigate } from 'react-router-dom';

const AgentsComponent = (props) => {
    const navigate = useNavigate();

    const onViewProfile = (agent) => {
        navigate('./view-profile', {
            state: {
                agent,
                storeNames: props.storeNames,
                types: props.types
            }
        });
    };

    const onAddAgent = () => {
        navigate('./add-agent');
    };

    return (
        <main className="agentscomponent-content">
            <div>
                <div className="agentscomponent-agents-header">
                    <h2>Agents</h2>
                    <button onClick={onAddAgent} className="agentscomponent-add-agent">
                        ADD AGENT
                    </button>
                </div>
                <table className="agentscomponent-agent-table">
                    <thead>
                        <tr>
                            <th>Agent Name</th>
                            <th>Store Name</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.agentsData.map((agent) => (
                            <tr key={agent.id}>
                                <td>{agent.name}</td>
                                <td>{agent.storeName}</td>
                                <td>{agent.type}</td>
                                <td>
                                    <span className={agent.isActive ? "agentstatus-active" : "agentstatus-inactive"}>
                                        {agent.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => onViewProfile(agent)} className="view-profile">
                                        View Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default AgentsComponent;
