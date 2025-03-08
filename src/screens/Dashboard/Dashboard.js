import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import AgentsComponent from "../../components/AgentsComponent/AgentsComponent";
import { db } from "../../firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ClipLoader } from "react-spinners";

const Dashboard = (props) => {
    const [activeSection, setActiveSection] = useState("Agents");
    const [screen, setScreen] = useState("dashboard");
    const [agentsData, setAgentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [storeNames, setStoreNames] = useState([]);
    const [types, setTypes] = useState([]);

    const sections = ["Agents", "Tasks", "Reports", "Geofence", "Wallet", "API Keys"];

    // console.log("API Key:", process.env.REACT_APP_FIREBASE_API_KEY_DEV);

    useEffect(() => {
        const fetchAgentsData = async () => {
            try {
                const agentsCollection = collection(db, "deliveryAgents");
                const querySnapshot = await getDocs(agentsCollection);

                const agents = querySnapshot.docs.map((doc) => {
                    const data = doc.data() || {};
                    return {
                        id: data.id || "Unknown",
                        phoneNumber: data.mobile,
                        name: data.name || "Unnamed Picker",
                        password: data.password,
                        storeName: data.storeName,
                        type: data.type,
                        completedOrders: data.completedOrders,
                        completedOrdersCount: data.completedOrders.length,
                    };
                });

                setAgentsData(agents);
            } catch (error) {
                console.error("Error fetching agents data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgentsData();
    }, []);

    useEffect(() => {
        // Fetch store names from Firestore
        const fetchStoreNames = async () => {
            try {
                // console.log("1111")
                const storeNamesDocRef = doc(db, 'storeNames', 'storeNames');
                const storeNamesDoc = await getDoc(storeNamesDocRef);
                if (storeNamesDoc.exists()) {
                    setStoreNames(storeNamesDoc.data().storeNames);
                }
            } catch (error) {
                console.error('Error fetching store names:', error);
            }
        };

        // Fetch types from Firestore
        const fetchTypes = async () => {
            try {
                // console.log("222")
                const typesDocRef = doc(db, 'types', 'types');
                const typesDoc = await getDoc(typesDocRef);
                if (typesDoc.exists()) {
                    setTypes(typesDoc.data().types);
                }
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        fetchStoreNames();
        fetchTypes();
    }, []);

    const handleLogout = () => {
        props.onLogout();
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <h1 className="dashboard-heading">Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>

            {loading ? (
                // Loader while data is loading
                <div className="dashboard-loader-container">
                    <ClipLoader color="#11998e" size={60} />
                </div>
            ) : (
                <div className="dashboard-body">
                    {/* Sidebar */}
                    <aside className="dashboard-sidebar">
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

                    <AgentsComponent
                        agentsData={agentsData}
                        activeSection={activeSection}
                        props={props}
                        storeNames={storeNames}
                        types={types}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
