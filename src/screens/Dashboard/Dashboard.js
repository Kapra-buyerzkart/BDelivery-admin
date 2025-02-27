import React, { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState("Agents");

    const sections = ["Agents", "Tasks", "Reports", "Geofence", "Wallet", "API Keys"];

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <h1 className="dashboard-heading">Dashboard</h1>
                <button className="logout-button">Logout</button>
            </header>

            <div className="dashboard-body">
                {/* Sidebar */}
                <aside className="sidebar">
                    <ul>
                        {sections.map((section) => (
                            <li key={section}>
                                <button
                                    className={activeSection === section ? "active" : ""}
                                    onClick={() => setActiveSection(section)}
                                >
                                    {section}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="content">
                    <h2>{activeSection}</h2>
                    <p>Content for {activeSection} section will be displayed here.</p>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;