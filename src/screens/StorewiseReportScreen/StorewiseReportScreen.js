import React, { useState, useMemo } from "react";
import "./StorewiseReportScreen.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ITEMS_PER_PAGE = 10;

const StoreWiseReportScreen = () => {
    const navigate = useNavigate();
    const { storesDetails } = useSelector((state) => state.storesDetailsTypes);

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredStores = useMemo(() => {
        if (!searchQuery.trim()) return storesDetails;
        return storesDetails.filter((store) =>
            Object.values(store).some((value) =>
                Array.isArray(value)
                    ? value.join(", ").toLowerCase().includes(searchQuery.toLowerCase())
                    : String(value ?? "").toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, storesDetails]);

    const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);

    const paginatedStores = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStores.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredStores, currentPage]);

    const handleDetailsClick = (store) => {
        navigate("./store-details", { state: { store } });
    };

    const handleDownloadCSV = () => {
        const headers = ["Store ID", "Store Name", "Store Type", "No. of Delivery Agents"];
        const rows = filteredStores.map((store) => [
            store.id,
            store.name,
            store.type,
            store.deliveryAgents.length,
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows]
                .map((e) => e.map((v) => `"${v}"`).join(","))
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "storewise_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="storewise-container">
            <div className="storewise-header">
                <h2>Store Wise Report</h2>
                <div className="storewise-actions">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="search-input"
                    />
                    <button onClick={handleDownloadCSV} className="csv-button">
                        Download CSV
                    </button>
                </div>
            </div>

            <table className="storewise-table">
                <thead>
                    <tr>
                        <th>Store ID</th>
                        <th>Store Name</th>
                        <th>Store Type</th>
                        <th>No. of Delivery Agents</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedStores.length === 0 ? (
                        <tr>
                            <td colSpan="5">No stores found.</td>
                        </tr>
                    ) : (
                        paginatedStores.map((store) => (
                            <tr key={store.id}>
                                <td>{store.id}</td>
                                <td>{store.name}</td>
                                <td>{store.type}</td>
                                <td>{store.deliveryAgentsCount}</td>
                                <td>
                                    <button
                                        className="details-button"
                                        onClick={() => handleDetailsClick(store)}
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

export default StoreWiseReportScreen;
