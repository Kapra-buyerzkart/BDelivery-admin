import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { db } from "../../firebase/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import SectionComponent from "../../components/SectionComponent/SectionComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAgents } from "../../redux/slices/agentSlice";
import { fetchCompletedTasks } from "../../redux/slices/taskSlice";
import { fetchStoresDetailsTypes } from "../../redux/slices/storesDetailsTypes";
import { fetchHolidays } from "../../redux/slices/holidaysSlice";
import { fetchIncentives } from "../../redux/slices/incentivesSlice";

const Dashboard = (props) => {
    const [activeSection, setActiveSection] = useState("Agents");
    const [screen, setScreen] = useState("dashboard");
    // const [agentsData, setAgentsData] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [storeNames, setStoreNames] = useState([]);
    // const [types, setTypes] = useState([]);

    const sections = ["Agents", "Stores", "Reports", "Holidays", "Incentives"];
    // const tasksData = [
    //     {
    //         amount: 250,
    //         customerName: "Customer Two",
    //         deliveryAddress: {
    //             addressLineOne: "Address Line One",
    //             addressLineTwo: "Address Line Two",
    //             addressLineThree: "Palarivattom",
    //             latitude: "10.002803",
    //             longitude: "76.307631",
    //             pincode: "682025"
    //         },
    //         deliveryCompleted: false,
    //         id: "1748330349014",
    //         microStoreName: "Microstore 01, Vennala",
    //         mobile: "1111111114",
    //         pickupAddress: {
    //             addressLineOne: "2nd floor, Nandhanam Tower",
    //             addressLineTwo: "Kaniyapilly Rd",
    //             addressLineThree: "Chakkaraparambu, Vennala",
    //             latitude: "9.991581023428584",
    //             longitude: "76.31693806117408",
    //             pincode: "682028"
    //         },
    //         pickupCompleted: false,
    //         storeId: "2222233333",
    //         taskNo: "ORD1996141893",
    //         type: "cod",
    //         status: "Pending",
    //         date: "13 May, 2025",
    //         time: "5:30 pm",
    //         deliveryAgent: "Agent One"
    //     },
    //     {
    //         amount: 250,
    //         customerName: "Customer Two",
    //         deliveryAddress: {
    //             addressLineOne: "Address Line One",
    //             addressLineTwo: "Address Line Two",
    //             addressLineThree: "Palarivattom",
    //             latitude: "10.002803",
    //             longitude: "76.307631",
    //             pincode: "682025"
    //         },
    //         deliveryCompleted: false,
    //         id: "1748330349015",
    //         microStoreName: "Microstore 01, Vennala",
    //         mobile: "1111111114",
    //         pickupAddress: {
    //             addressLineOne: "2nd floor, Nandhanam Tower",
    //             addressLineTwo: "Kaniyapilly Rd",
    //             addressLineThree: "Chakkaraparambu, Vennala",
    //             latitude: "9.991581023428584",
    //             longitude: "76.31693806117408",
    //             pincode: "682028"
    //         },
    //         pickupCompleted: false,
    //         storeId: "2222233333",
    //         taskNo: "ORD1996141894",
    //         type: "cod",
    //         status: "Pending",
    //         date: "13 May, 2025",
    //         time: "6:30 pm",
    //         deliveryAgent: "Agent Two"
    //     },
    //     {
    //         amount: 250,
    //         customerName: "Customer Two",
    //         deliveryAddress: {
    //             addressLineOne: "Address Line One",
    //             addressLineTwo: "Address Line Two",
    //             addressLineThree: "Palarivattom",
    //             latitude: "10.002803",
    //             longitude: "76.307631",
    //             pincode: "682025"
    //         },
    //         deliveryCompleted: false,
    //         id: "1748330349016",
    //         microStoreName: "Microstore 01, Vennala",
    //         mobile: "1111111114",
    //         pickupAddress: {
    //             addressLineOne: "2nd floor, Nandhanam Tower",
    //             addressLineTwo: "Kaniyapilly Rd",
    //             addressLineThree: "Chakkaraparambu, Vennala",
    //             latitude: "9.991581023428584",
    //             longitude: "76.31693806117408",
    //             pincode: "682028"
    //         },
    //         pickupCompleted: false,
    //         storeId: "2222233333",
    //         taskNo: "ORD1996141894",
    //         type: "cod",
    //         status: "Completed",
    //         date: "13 May, 2025",
    //         time: "6:30 pm",
    //         deliveryAgent: "Agent Two"
    //     },
    // ]

    // console.log("API Key:", process.env.REACT_APP_FIREBASE_API_KEY_DEV);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAgents())
        dispatch(fetchCompletedTasks())
        dispatch(fetchStoresDetailsTypes())
        dispatch(fetchHolidays())
        dispatch(fetchIncentives())
    }, [])

    const { agentLoading } = useSelector(state => state.agents);
    const { tasksLoading } = useSelector(state => state.tasks);
    const { storesDetailsTypesLoading } = useSelector(state => state.storesDetailsTypes);

    // useEffect(() => {
    //     const fetchAgentsData = async () => {
    //         try {
    //             const agentsCollection = collection(db, "deliveryAgents");
    //             const querySnapshot = await getDocs(agentsCollection);

    //             const agents = querySnapshot.docs.map((doc) => {
    //                 const data = doc.data() || {};

    //                 const completedOrders = data.completedOrders || [];

    //                 // Calculate total distance covered
    //                 const totalDistanceCovered = completedOrders.reduce((sum, order) => {
    //                     return sum + (order.kilometers || 0);
    //                 }, 0);

    //                 return {
    //                     id: data.id || "Unknown",
    //                     phoneNumber: data.mobile,
    //                     name: data.name || "Unnamed Picker",
    //                     password: data.password,
    //                     storeName: data.storeName,
    //                     type: data.type,
    //                     completedOrders: data.completedOrders,
    //                     completedOrdersCount: data.completedOrders.length,
    //                     distanceCovered: totalDistanceCovered,
    //                     onDuty: data.onDuty,
    //                     storeId: data.storeId
    //                 };
    //             });

    //             setAgentsData(agents);
    //         } catch (error) {
    //             console.error("Error fetching agents data:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchAgentsData();
    // }, []);

    // useEffect(() => {
    //     // Fetch store names from Firestore
    //     const fetchStoreNames = async () => {
    //         try {
    //             // console.log("1111")
    //             const storeNamesDocRef = doc(db, 'storeNames', 'storeNames');
    //             const storeNamesDoc = await getDoc(storeNamesDocRef);
    //             if (storeNamesDoc.exists()) {
    //                 setStoreNames(storeNamesDoc.data().storeNames);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching store names:', error);
    //         }
    //     };

    //     // Fetch types from Firestore
    //     const fetchTypes = async () => {
    //         try {
    //             // console.log("222")
    //             const typesDocRef = doc(db, 'types', 'types');
    //             const typesDoc = await getDoc(typesDocRef);
    //             if (typesDoc.exists()) {
    //                 setTypes(typesDoc.data().types);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching types:', error);
    //         }
    //     };

    //     fetchStoreNames();
    //     fetchTypes();
    // }, []);

    const handleLogout = () => {
        props.onLogout();
    };

    useEffect(() => {
        const savedSection = sessionStorage.getItem("dashboard_activeSection");
        if (savedSection) {
            setActiveSection(savedSection);
        }
    }, []);

    const handleSectionChange = (section) => {
        setActiveSection(section);
        sessionStorage.setItem("dashboard_activeSection", section);
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <h1 className="dashboard-heading">Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>

            {agentLoading && tasksLoading && storesDetailsTypesLoading ? (
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
                                        onClick={() => handleSectionChange(section)}
                                    >
                                        {section}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <SectionComponent
                        // agentsData={agentsData}
                        activeSection={activeSection}
                        props={props}
                    // storeNames={storeNames}
                    // types={types}
                    // tasksData={completedTasks}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
