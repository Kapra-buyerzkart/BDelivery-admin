import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import './AddStoreScreen.css';
import { useSelector } from 'react-redux';

const AddStoreScreen = () => {
    const [id, setId] = useState('');
    const [storeName, setStoreName] = useState('');
    const [type, setType] = useState('');
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
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
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

    const { storeTypes } = useSelector(state => state.storesDetailsTypes)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const docRef = doc(db, 'stores', 'stores');
            const docSnap = await getDoc(docRef);
            // const mobileQuery = await getDocs(query(collection(db, 'deliveryAgents'), where('mobile', '==', mobile)));

            // if (docSnap.exists()) {
            //     setIsIdExistsModalOpen(true);
            //     setModalHeader("Alert")
            //     setModalMessage("Agent with this ID already exists.")
            //     setIsModalOpen(true)
            //     setIsLoading(false);
            //     return;
            // }

            // if (mobileQuery.size > 0) {
            //     setIsMobileExistsModalOpen(true);
            //     setModalHeader("Alert")
            //     setModalMessage("Agent with this mobile number already exists.")
            //     setIsModalOpen(true)
            //     setIsLoading(false);
            //     return;
            // }

            const storeFields = {
                id: id,
                // mobile: phoneNumber,
                name: storeName,
                // password: password || '',
                // storeName: storeName,
                // storeId,
                type: selectedType,
                completedTasks: [],
                deliveryAgents: [],
                numberOfDeliveryAgents: 0,
                latitude: latitude,
                longitude: longitude
                // onDuty: onDuty,
                // distanceCovered: distanceCovered
            };

            const storesArray = docSnap.data().stores || [];

            const updatedStores = storesArray
                .concat(storeFields); // Add the new store

            await updateDoc(docRef, {
                stores: updatedStores
            });


            // await setDoc(docRef, {
            //     id,
            //     name,
            //     password,
            //     mobile,
            //     storeName: selectedStore,
            //     storeId,
            //     type: selectedType,
            //     completedOrders: [],
            //     onDuty: false
            // });

            setIsLoading(false);
            setModalHeader("Success") // Show success modal after successful creation
            setModalMessage("Store added successfully!")
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
        <div className="addstore-container">
            <form onSubmit={handleSubmit} className="addstore-form">
                <h2 className="addstore-header">Add Store</h2>
                <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
                {/* <input type="number" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required /> */}
                <input type="text" placeholder="Store Name" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
                {/* <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /> */}
                {/* <select value={selectedStore}
                    onChange={(e) => {
                        const selectedName = e.target.value;
                        setSelectedStore(selectedName);

                        const selectedStoreObj = storeNames.find(store => store.name === selectedName);
                        if (selectedStoreObj) {
                            setStoreId(selectedStoreObj.id);
                        } else {
                            setStoreId('');
                        }
                    }} required>
                    <option value="">Select Store Name</option>
                    {storeNames.map((store) => <option key={store.id} value={store.name}>{store.name}</option>)}
                </select> */}
                <select className={selectedType === '' ? 'placeholder' : ''} value={selectedType} onChange={(e) => setSelectedType(e.target.value)} >
                    <option value="">Select Type</option>
                    {storeTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Store'}</button>
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
                <div className="addstore-modal">
                    <div>
                        <h3 className={modalHeader === "Success" ? 'addstore-modal-success' : ""}>{modalHeader}</h3>
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

export default AddStoreScreen;
