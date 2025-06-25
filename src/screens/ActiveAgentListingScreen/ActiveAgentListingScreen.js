import React from "react";
import "./ActiveAgentListingScreen.css";
import { useLocation } from "react-router-dom";

// const agentData = [
//   { id: "0001", name: "Agent One", storeName: "Vennala", phone: "1112223334" },
//   { id: "0002", name: "Agent Two", storeName: "Thrippunithura", phone: "2223334445" },
//   { id: "0003", name: "Agent Three", storeName: "Vennala", phone: "3335556667" },
//   // Add more agents as needed
// ];


const ActiveAgentListingScreen = () => {

  const location = useLocation()

  const activeAgents = location.state?.activeAgents;

  return (
    <div className="active-agent-container">
      <h2>Active Agents</h2>
      <table className="active-agent-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Store Name</th>
            <th>Phone No</th>
          </tr>
        </thead>
        <tbody>
          {activeAgents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.id}</td>
              <td>{agent.name}</td>
              <td>{agent.storeName}</td>
              <td>{agent.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveAgentListingScreen;
