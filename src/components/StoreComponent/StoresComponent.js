import React from "react";
import "./StoresComponent.css";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const StoresComponent = (props) => {
    const navigate = useNavigate();

    const { storesDetails } = useSelector(state => state.storesDetailsTypes);

    const onViewDetails = (store) => {
        navigate('./store/view-store', {
            state: {
                store,
            }
        });
    };

    const onAddAgent = () => {
        navigate('./store/add-store');
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
                        {storesDetails.map((store) => (
                            <tr key={store.id}>
                                <td>{store.id}</td>
                                <td>{store.name}</td>
                                <td>{store.type}</td>
                                <td>{store.deliveryAgents.length}</td>
                                {/* <td>
                                    <span className={agent.onDuty ? "agentstatus-active" : "agentstatus-inactive"}>
                                        {agent.onDuty ? "On Duty" : "Off Duty"}
                                    </span>
                                </td> */}
                                <td>
                                    <button onClick={() => onViewDetails(store)} className="view-profile">
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
