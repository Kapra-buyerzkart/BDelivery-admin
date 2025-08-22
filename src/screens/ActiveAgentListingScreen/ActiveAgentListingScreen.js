import React, { useState, useMemo } from "react";
import "./ActiveAgentListingScreen.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ActiveAgentListingScreen = () => {
  const location = useLocation();
  const activeAgents = location.state?.activeAgents || [];

  const [storeFilter, setStoreFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10;

  const { storesDetails } = useSelector(state => state.storesDetailsTypes);

  const filteredAgents = useMemo(() => {
    return storeFilter
      ? activeAgents.filter(agent => agent.storeName === storeFilter)
      : activeAgents;
  }, [storeFilter, activeAgents]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);
  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="active-agent-container">
      <h2>Active Agents</h2>

      {/* Store Name Filter */}
      <div className="agent-filters">
        <label htmlFor="storeFilter">Filter by Store:</label>
        <select
          id="storeFilter"
          value={storeFilter}
          onChange={(e) => {
            setStoreFilter(e.target.value);
            setCurrentPage(1); // Reset to page 1 on filter change
          }}
        >
          <option value="">All Stores</option>
          {storesDetails.map((store) => (
            <option key={store.id} value={store.name}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      {/* {currentAgents.length === 0 ? (
        <div className="no-agents">No active agents found.</div>
      ) : (
        <>
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
              {currentAgents.map((agent) => (
                <tr key={agent.id}>
                  <td>{agent.id}</td>
                  <td>{agent.name}</td>
                  <td>{agent.storeName}</td>
                  <td>{agent.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )} */}

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
          {currentAgents.length === 0 ? (
            <tr>
              <td colSpan="6">
                <div className="no-tasks-message-flex">No tasks found.</div>
              </td>
            </tr>) : (
            currentAgents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.id}</td>
                <td>{agent.name}</td>
                <td>{agent.storeName}</td>
                <td>{agent.phoneNumber}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            className={`page-button ${currentPage === page ? "active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        {/* {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))} */}
      </div>


    </div>
  );
};

export default ActiveAgentListingScreen;
