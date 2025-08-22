import React, { useState, useMemo } from "react";
import "./AgentWiseReportScreen.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 10;

const AgentWiseReportScreen = () => {
    const navigate = useNavigate();
    const { agentsData } = useSelector(state => state.agents);

    const [storeFilter, setStoreFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredAgents = useMemo(() => {
        let filtered = agentsData;

        if (storeFilter !== "All") {
            filtered = filtered.filter(agent => agent.storeName === storeFilter);
        }

        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(agent =>
                Object.values(agent).some(value =>
                    String(value ?? "").toLowerCase().includes(query)
                )
            );
        }
        return filtered;
    }, [agentsData, storeFilter, searchQuery]);

    const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
    const paginatedAgents = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAgents.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredAgents, currentPage]);

    const storeNames = useMemo(() => {
        const stores = new Set(agentsData.map(agent => agent.storeName));
        return ["All Stores", ...Array.from(stores)];
    }, [agentsData]);

    const handleDetailsClick = (agent) => {
        navigate("/dashboard/reports/agentwise-report/agent-details", { state: { agent } });
    };

    const handleViewEarningsClick = (agent) => {
        navigate("/dashboard/reports/agentwise-report/view-earnings", { state: { agent } });
    };

    const downloadCSV = () => {
        const headers = ["Id", "Name", "Mobile", "Store", "Completed Tasks", "Total Earnings (₹)", "Total Kilometers"];
        const rows = filteredAgents.map(agent => [
            agent.id,
            agent.name,
            agent.phoneNumber,
            agent.storeName,
            agent.completedOrdersCount,
            agent.totalEarnings,
            agent.distanceCovered
        ]);
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "AgentWiseReport.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="agentwise-report-container">
            <h2>Agent-wise Report</h2>

            {/* Filters */}
            <div className="filters-container">
                <input
                    className="search-box"
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={e => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <select
                    className="store-filter"
                    value={storeFilter}
                    onChange={e => {
                        setStoreFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    {storeNames.map(store => (
                        <option key={store} value={store}>{store}</option>
                    ))}
                </select>

                <button className="csv-button" onClick={downloadCSV}>
                    Download CSV
                </button>
            </div>

            {/* Table */}
            <table className="agentwise-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Store</th>
                        <th>Completed Tasks</th>
                        <th>Total Kilometers</th>
                        <th>Earnings</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedAgents.length === 0 ? (
                        <tr>
                            <td colSpan="8">
                                <div className="no-tasks-message-flex">No agents found.</div>
                            </td>
                        </tr>
                    ) : (
                        paginatedAgents.map((agent, index) => (
                            <tr key={index}>
                                <td>{agent.id}</td>
                                <td>{agent.name}</td>
                                <td>{agent.phoneNumber}</td>
                                <td>{agent.storeName}</td>
                                <td>{agent.completedOrdersCount}</td>
                                <td>{agent.distanceCovered}</td>
                                <td>
                                    <button
                                        className="details-button"
                                        onClick={() => handleViewEarningsClick(agent)}
                                    >
                                        View
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="details-button"
                                        onClick={() => handleDetailsClick(agent)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={`page-button ${page === currentPage ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AgentWiseReportScreen;
