import React, { useState } from "react";
import "./SectionComponent.css";
import { useNavigate } from 'react-router-dom';
import AgentsComponent from "../AgentsComponent/AgentsComponent";
import TaskComponent from "../TaskComponent/TaskComponent";
import ReportComponent from "../ReportComponent/ReportComponent";
import { useSelector } from "react-redux";
import StoresComponent from "../StoreComponent/StoresComponent";

const SectionComponent = (props) => {
    // const [activeSection, setActiveSection] = useState("Agents");

    // const agents = [
    //     { name: "John Doe", store: "Vennala", type: "Freelance", id: 1 },
    //     { name: "Jane Smith", store: "Thrippunithura", type: "Employee", id: 2 },
    //     { name: "Agent One", store: "Vennala", type: "Freelance", id: 3 },
    //     { name: "Agent Smith", store: "Thrippunithura", type: "Employee", id: 4 },
    //     { name: "Agent Doe", store: "Vennala", type: "Freelance", id: 5 },
    //     { name: "Agent two", store: "Thrippunithura", type: "Employee", id: 6 },
    //     { name: "Agent three", store: "Vennala", type: "Freelance", id: 7 },
    //     { name: "Agent four", store: "Thrippunithura", type: "Employee", id: 8 },
    //     { name: "Agent Five", store: "Vennala", type: "Freelance", id: 9 },
    // ];
    const navigate = useNavigate();



    // console.log('mmmmm', props.agentsData)

    // const { agentsData } = useSelector(state => state.agents);

    return (
        // < main className="agentscomponent-content" >
        //     {props.activeSection === "Agents" && (
        //         <div>
        //             <div className="agentscomponent-agents-header">
        //                 <h2>Agents</h2>
        //                 <button onClick={onAddAgent} className="agentscomponent-add-agent">
        //                     ADD AGENT
        //                 </button>
        //             </div>
        //             <table className="agentscomponent-agent-table">
        //                 <thead>
        //                     <tr>
        //                         <th>Agent Name</th>
        //                         <th>Store Name</th>
        //                         <th>Type</th>
        //                         <th>Actions</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody>
        //                     {props.agentsData.map((agent) => (
        //                         <tr key={agent.id}>
        //                             <td>{agent.name}</td>
        //                             <td>{agent.storeName}</td>
        //                             <td>{agent.type}</td>
        //                             <td>
        //                                 <button onClick={() => onViewProfile(agent)} className="view-profile">
        //                                     View Profile
        //                                 </button>
        //                             </td>
        //                         </tr>
        //                     ))}
        //                 </tbody>
        //             </table>
        //         </div>
        //     )
        //     }
        // </main >
        props.activeSection === "Agents" ? (<AgentsComponent
            // agentsData={props.agentsData}
            activeSection={props.activeSection}
            props={props.props}
        // storeNames={props.storeNames}
        // types={props.types}
        />
        )
            : props.activeSection === "Stores" ? (<StoresComponent
            // tasksData={props.tasksData}
            // activeSection={props.activeSection}
            />)
                : <ReportComponent
                    // totalTasks={completedTasks.length}
                    totalAgents={25}
                    activeSection={props.activeSection}
                />
    )
}

export default SectionComponent;