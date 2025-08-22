import React, { useState } from "react";
import "./TasksListingScreen.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TasksListingScreen = () => {
    const navigate = useNavigate();
    const { completedTasks } = useSelector((state) => state.tasks);
    const { agentsData } = useSelector(state => state.agents);
    const [storeFilter, setStoreFilter] = useState("");
    const [agentFilter, setAgentFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleDetailsClick = (task) => {
        navigate("./task-details", { state: { task } });
    };

    const handleExportCSV = () => {
        const csvData = filteredTasks.map((task) => ({
            TaskNo: task.taskNo,
            CustomerName: task.customerName,
            DeliveryAgent: task.deliveryAgent,
            StoreName: task.microStoreName,
            Date: task.date,
        }));

        const csv = [
            Object.keys(csvData[0]).join(","),
            ...csvData.map((row) => Object.values(row).join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "completed_tasks.csv";
        link.click();
    };

    const filteredTasks = completedTasks
        .filter((task) =>
            storeFilter ? task.microStoreName === storeFilter : true
        )
        .filter((task) =>
            agentFilter ? task.deliveryAgent === agentFilter : true
        )
        .filter((task) => {
            if (startDate && endDate) {
                const taskDate = new Date(task.date);
                return (
                    taskDate >= new Date(startDate) &&
                    taskDate <= new Date(endDate)
                );
            }
            return true;
        })
        .filter((task) =>
            searchQuery
                ? Object.values(task).some((value) =>
                    String(value).toLowerCase().includes(searchQuery.toLowerCase())
                )
                : true
        ).sort((a, b) => {
            if (sortField === "date") {
                return sortOrder === "asc"
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            } else if (sortField === "taskNo") {
                return sortOrder === "asc"
                    ? a.taskNo.localeCompare(b.taskNo)
                    : b.taskNo.localeCompare(a.taskNo);
            }
            return 0;
        });

    // const uniqueStores = [...new Set(completedTasks.map((t) => t.microStoreName))];
    const uniqueAgents = [...new Set(completedTasks.map((t) => t.deliveryAgent))];

    const { storesDetails } = useSelector(state => state.storesDetailsTypes);

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="tasks-listing-container">
            <h2>Completed Tasks</h2>

            {/* Filters */}
            <div className="filters-container">
                <div className="filter-group">
                    <label>Select Store</label>
                    <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)}>
                        <option value="">All Stores</option>
                        {storesDetails.map((store, index) => (
                            <option key={store.id} value={store.name}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Select Agent</label>
                    <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
                        <option value="">All Agents</option>
                        {agentsData.map((agent, index) => (
                            <option key={agent.id} value={agent.name}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>From Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Sort By</label>
                    <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                        <option value="date">Sort by Date</option>
                        <option value="taskNo">Sort by Task No</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Order</label>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                <button className="export-button" onClick={handleExportCSV}>
                    Export CSV
                </button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            {/* Table */}
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
                    {paginatedTasks.length === 0 ? (
                        <tr>
                            <td colSpan="6">
                                <div className="no-tasks-message-flex">No tasks found.</div>
                            </td>
                        </tr>) : (
                        paginatedTasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.taskNo}</td>
                                <td>{task.customerName}</td>
                                <td>{task.deliveryAgent}</td>
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
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`page-button ${currentPage === page ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TasksListingScreen;
