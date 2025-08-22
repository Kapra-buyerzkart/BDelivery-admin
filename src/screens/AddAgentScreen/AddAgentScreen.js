import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import './AddAgentScreen.css';
import { useSelector } from 'react-redux';

const AddAgentScreen = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [storeNames, setStoreNames] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isIdExistsModalOpen, setIsIdExistsModalOpen] = useState(false);
    const [isMobileExistsModalOpen, setIsMobileExistsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // New state for success modal
    const [modalHeader, setModalHeader] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [storeId, setStoreId] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     const fetchDropdownData = async () => {
    //         const storeSnap = await getDoc(doc(db, 'storeNames', 'storeNames'));
    //         const typeSnap = await getDoc(doc(db, 'types', 'types'));
    //         setStoreNames(storeSnap.exists() ? storeSnap.data().storeNames : []);
    //         setTypes(typeSnap.exists() ? typeSnap.data().types : []);
    //     };
    //     fetchDropdownData();
    // }, []);

    const { storesDetails, agentTypes } = useSelector(state => state.storesDetailsTypes)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const agentDocRef = doc(db, 'deliveryAgents', id);
            const agentDocSnap = await getDoc(agentDocRef);
            const mobileQuery = await getDocs(query(collection(db, 'deliveryAgents'), where('mobile', '==', mobile)));
            const storeDocRef = doc(db, 'stores', 'stores');
            const storeDocSnap = await getDoc(storeDocRef);

            if (agentDocSnap.exists()) {
                setIsIdExistsModalOpen(true);
                setModalHeader("Alert")
                setModalMessage("Agent with this ID already exists.")
                setIsModalOpen(true)
                setIsLoading(false);
                return;
            }

            if (mobileQuery.size > 0) {
                setIsMobileExistsModalOpen(true);
                setModalHeader("Alert")
                setModalMessage("Agent with this mobile number already exists.")
                setIsModalOpen(true)
                setIsLoading(false);
                return;
            }

            await setDoc(agentDocRef, {
                id,
                name,
                password,
                mobile,
                storeName: selectedStore,
                storeId,
                type: selectedType,
                completedOrders: [],
                onDuty: false
            });

            const storesArray = storeDocSnap.data().stores || [];

            const updatedStores = storesArray.map(store => {
                if (store.id === storeId) {
                    const existingAgents = store.deliveryAgents || [];
                    const newCount = (store.deliveryAgentsCount || 0) + 1;

                    return {
                        ...store,
                        deliveryAgents: [
                            ...existingAgents,
                            { id: id, name: name }
                        ],
                        deliveryAgentsCount: newCount
                    };
                }
                return store;
            })

            await updateDoc(storeDocRef, {
                stores: updatedStores
            })

            setIsLoading(false);
            setModalHeader("Success") // Show success modal after successful creation
            setModalMessage("Agent added successfully!")
            setIsSuccessModalOpen(true);
            setIsModalOpen(true)
        } catch (error) {
            console.error('Error adding agent:', error);
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsIdExistsModalOpen(false);
        setIsMobileExistsModalOpen(false);
        setIsSuccessModalOpen(false); // Close success modal
        setIsModalOpen(false)
    };

    return (
        <div className="addagent-container">
            <form onSubmit={handleSubmit} className="addagent-form">
                <h2 className="addagent-header">Add Agent</h2>
                <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
                <input type="number" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <select className={selectedType === '' ? 'placeholder' : ''} value={selectedStore}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        setSelectedStore(selectedName);

                        const selectedStoreObj = storesDetails.find(store => store.name === selectedName);
                        if (selectedStoreObj) {
                            setStoreId(selectedStoreObj.id);
                        } else {
                            setStoreId('');
                        }
                    }} required>
                    <option value="">Select Store Name</option>
                    {storesDetails.map((store) => <option key={store.id} value={store.name}>{store.name}</option>)}
                </select>
                <select className={selectedType === '' ? 'placeholder' : ''} value={selectedType} onChange={(e) => setSelectedType(e.target.value)} required>
                    <option value="">Select Type</option>
                    {agentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Agent'}</button>
            </form>

            {/* ID exists modal */}
            {/* {isIdExistsModalOpen && (
                <div className="addagent-modal">
                    <div>
                        <h3>Alert</h3>
                        <p>Agent with this ID already exists.</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )} */}

            {/* Mobile exists modal */}
            {/* {isMobileExistsModalOpen && (
                <div className="addagent-modal">
                    <div>
                        <h3>Alert</h3>
                        <p>Agent with this mobile number already exists.</p>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )} */}

            {/* Success modal */}
            {/* {isSuccessModalOpen && (
                <div className="addagent-modal">
                    <div>
                        <h3>Success</h3>
                        <p>Agent added successfully!</p>
                        <button onClick={() => {
                            closeModal();
                            navigate('/dashboard'); // Navigate to the dashboard after closing modal
                        }}>Close</button>
                    </div>
                </div>
            )} */}

            {isModalOpen && (
                <div className="addagent-modal">
                    <div>
                        <h3 className={modalHeader === "Success" ? 'addagent-modal-success' : ""}>{modalHeader}</h3>
                        <p>{modalMessage}</p>
                        <button onClick={() => {
                            closeModal();
                            modalHeader === "Success" && navigate('/dashboard'); // Navigate to the dashboard after closing modal
                        }}>Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AddAgentScreen;
