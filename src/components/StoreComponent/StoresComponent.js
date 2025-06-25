import React from "react";
import "./StoresComponent.css";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const StoresComponent = (props) => {
    const navigate = useNavigate();

    const { agentsData } = useSelector(state => state.agents);

    const onViewProfile = (agent) => {
        navigate('./agents/view-profile', {
            state: {
                agent,
                // storeNames: props.storeNames,
                // types: props.types
            }
        });
    };

    const onAddAgent = () => {
        navigate('./agents/add-agent');
    };

    return (
        <main className="storescomponent-content">
            <div>
                <div className="storescomponent-agents-header">
                    <h2>Stores</h2>
                    <button onClick={onAddAgent} className="storescomponent-add-agent">
                        ADD STORE
                    </button>
                </div>
                <table className="storescomponent-agent-table">
                    <thead>
                        <tr>
                            <th>Store Id</th>
                            <th>Store Name</th>
                            <th>Store Type</th>
                            <th>Delivery Agents</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agentsData.map((agent) => (
                            <tr key={agent.id}>
                                <td>{agent.name}</td>
                                <td>{agent.storeName}</td>
                                <td>{agent.type}</td>
                                <td>
                                    <span className={agent.onDuty ? "agentstatus-active" : "agentstatus-inactive"}>
                                        {agent.onDuty ? "On Duty" : "Off Duty"}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => onViewProfile(agent)} className="view-profile">
                                        View Details
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

export default StoresComponent;
