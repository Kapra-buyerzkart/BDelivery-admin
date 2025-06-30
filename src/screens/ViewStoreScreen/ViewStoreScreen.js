import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import './ViewStoreScreen.css';
import { useSelector } from 'react-redux';

const ViewStoreScreen = () => {
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(location.state.store || {});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [header, setHeader] = useState('');
    // const [storeNames] = useState(location.state.storeNames || []);
    // const [types, setTypes] = useState(location.state.types || []);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const { storesDetails, agentTypes, storeTypes } = useSelector(state => state.storesDetailsTypes);

    // useEffect(() => {
    //     // Fetch store names from Firestore
    //     const fetchStoreNames = async () => {
    //         try {
    //             console.log("1111")
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

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditData(location.state.store || {});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'storeName') {
            // Find the selected store object
            const selectedStore = storesDetails.find(store => store.name === value);
            const selectedStoreId = selectedStore ? selectedStore.id : '';

            // Update both storeName and storeId
            setEditData(prevData => ({
                ...prevData,
                storeName: value,
                storeId: selectedStoreId
            }));
        } else {
            // Handle other fields normally
            setEditData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    // Function to check if mobile number already exists
    const checkMobileExists = async (mobile) => {
        const q = query(collection(db, 'deliveryAgents'), where('mobile', '==', mobile));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const checkIdExists = async (id) => {
        const docRef = doc(db, "stores", "stores");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const storesArray = docSnap.data().stores || [];
            return storesArray.some(store => store.id === id);
        } else {
            console.error("No such document!");
            return false;
        }
    };

    const handleSave = async () => {
        const { id, name, type, completedTasks, deliveryAgents } = editData;

        if (!id || !name || !type) {
            setModalMessage('Please fill in all required fields.');
            setIsModalOpen(true);
            return;
        }

        // const oldMobile = location.state?.agent?.phoneNumber;
        const oldId = location.state?.store?.id;

        try {
            // Check if mobile number already exists
            // if (oldMobile !== phoneNumber) {
            //     const mobileExists = await checkMobileExists(phoneNumber);
            //     if (mobileExists) {
            //         setHeader('Alert');
            //         setModalMessage('This mobile number already exists. Please use a different number.');
            //         setIsModalOpen(true);
            //         return;
            //     }
            // }

            if (oldId !== id) {
                const idExists = await checkIdExists(id);
                if (idExists) {
                    setHeader('Alert');
                    setModalMessage('This Id already exists. Please use a different Id.');
                    setIsModalOpen(true);
                    return;
                }
            }

            const updatedFields = {
                id: id,
                // mobile: phoneNumber,
                name,
                // password: password || '',
                // storeName: storeName,
                // storeId,
                type,
                completedTasks: completedTasks,
                deliveryAgents: deliveryAgents
                // onDuty: onDuty,
                // distanceCovered: distanceCovered
            };

            const docRef = doc(db, "stores", "stores");
            const docSnap = await getDoc(docRef);
            const storesArray = docSnap.data().stores || [];


            if (oldId === id) {
                // await setDoc(doc(db, 'deliveryAgents', id), updatedFields);
                const updatedStores = storesArray.map(store => {
                    if (store.id === id) {
                        return { ...store, ...updatedFields }; // Merge old and updated fields
                    }
                    return store;
                });

                await updateDoc(docRef, {
                    stores: updatedStores
                });

            } else {
                const updatedStores = storesArray
                    .filter(store => store.id !== oldId) // Remove the old store
                    .concat(updatedFields); // Add the new store

                await updateDoc(docRef, {
                    stores: updatedStores
                });
            }
            setHeader("Success");
            setModalMessage('Profile updated successfully!');
            setIsModalOpen(true);
            setIsEditing(false);
            setSuccess(true)
        } catch (error) {
            console.error('Error updating profile:', error);
            setHeader("Error");
            setModalMessage('Failed to update profile. Please try again.');
            setIsModalOpen(true);
        }
    };

    const handleDelete = async () => {
        const id = location.state?.store?.id;

        if (!id) {
            console.error('id is missing.');
            return;
        }

        try {
            const docRef = doc(db, "stores", "stores");
            const docSnap = await getDoc(docRef);
            const storesArray = docSnap.data().stores || [];

            const updatedStores = storesArray
                .filter(store => store.id !== id)

            await updateDoc(docRef, {
                stores: updatedStores
            });
            // setIsModalOpen(true);
            setIsDeleteModalOpen(false);
            navigate('/dashboard');
        } catch (error) {

        }


        // try {
        //     await deleteDoc(doc(db, 'stores', id));
        //     setModalMessage('Profile deleted successfully!');
        //     setIsModalOpen(true);
        //     setIsDeleteModalOpen(false);
        //     navigate('/dashboard');
        // } catch (error) {
        //     console.error('Error deleting profile:', error);
        //     setModalMessage('Failed to delete profile. Please try again.');
        //     setIsModalOpen(true);
        // }
    };

    const onSuccess = () => {
        navigate('/dashboard')
    }

    const onModalClose = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="viewstore-container">
            {/* {console.log("/////", editData)}
            {console.log("storesDetails", storesDetails)}
            {console.log("types", types)} */}
            <div className="viewstore-store-card">
                <h2 className="viewstore-title">Store Details</h2>
                {/* <div className="viewstore-duty-indicator">
                    <span
                        className={`viewstore-duty-circle ${editData.onDuty ? 'on-duty' : 'off-duty'}`}
                    // title={editData.isOnDuty ? 'On Duty' : 'Off Duty'}
                    ></span>
                    <span className="viewstore-duty-text">{editData.onDuty ? 'On Duty' : 'Off Duty'}</span>
                </div> */}
                <div className="viewstore-field">
                    <label className="viewstore-label">Store ID:</label>
                    <div className="viewstore-input-or-value">
                        <input
                            type="number"
                            name="id"
                            value={editData.id || ''}
                            onChange={handleInputChange}
                            className="viewstore-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* <div className="viewstore-field">
                    <label className="viewstore-label">Phone Number:</label>
                    <div className="viewstore-input-or-value">
                        <input
                            type="number"
                            name="phoneNumber"
                            value={editData.phoneNumber || ''}
                            onChange={handleInputChange}
                            className="viewstore-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div> */}

                <div className="viewstore-field">
                    <label className="viewstore-label">Name:</label>
                    <div className="viewstore-input-or-value">
                        <input
                            type="text"
                            name="name"
                            value={editData.name || ''}
                            onChange={handleInputChange}
                            className="viewstore-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* <div className="viewstore-field">
                    <label className="viewstore-label">Password:</label>
                    <div className="viewstore-input-or-value">
                        <input
                            type="text"
                            name="password"
                            value={editData.password || ''}
                            onChange={handleInputChange}
                            className="viewstore-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div> */}

                {/* <div className="viewstore-field">
                    <label className="viewstore-label">Store Name:</label>
                    <div className="viewstore-input-or-value">
                        <select
                            name="storeName"
                            value={editData.storeName || ''}
                            onChange={handleInputChange}
                            className="viewstore-dropdown"
                            disabled={!isEditing}
                        >
                            <option value="">Select Store</option>
                            {storesDetails.map((store, index) => (
                                <option key={index} value={store.name}>{store.name}</option>
                            ))}
                        </select>
                    </div>
                </div> */}

                <div className="viewstore-field">
                    <label className="viewstore-label">Type:</label>
                    <div className="viewstore-input-or-value">
                        <select
                            name="type"
                            value={editData.type || ''}
                            onChange={handleInputChange}
                            className="viewstore-dropdown"
                            disabled={!isEditing}
                        >
                            <option value="">Select Type</option>
                            {storeTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="viewstore-field">
                    <label className="viewstore-label">Completed Orders:</label>
                    <div className="viewstore-input-or-value">
                        <input
                            type="number"
                            name="completedOrdersCount"
                            value={editData.completedTasks.length || 0}
                            className="viewstore-input"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="viewstore-field">
                    <label className="viewstore-label">Delivery Agents:</label>
                    <div className="viewstore-input-or-value">
                        <input
                            type="number"
                            name="completedOrdersCount"
                            value={editData.deliveryAgents.length || 0}
                            className="viewstore-input"
                            disabled={true}
                        />
                    </div>
                </div>

                {/* <div className="viewstore-field">
                    <label className="viewstore-label">Total Earnings:</label>
                    <div className="viewstore-input-or-value">
                        <input
                            type="number"
                            name="completedOrdersCount"
                            value={editData.distanceCovered * 2 || 0}
                            className="viewstore-input"
                            disabled={true}
                        />
                    </div>
                </div> */}

                <div className="viewstore-button-container">
                    {isEditing ? (
                        <>
                            <button className="viewstore-button viewstore-primary" onClick={handleSave}>Save</button>
                            <button className="viewstore-button viewstore-warning" onClick={handleEditToggle}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button className="viewstore-button viewstore-primary" onClick={handleEditToggle}>Edit Profile</button>
                            <button className="viewstore-button viewstore-danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Profile</button>
                        </>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="viewstore-modal-overlay">
                    <div className="viewstore-modal">
                        <h2 className={header === "Success" ? "viewstore-modal-title viewstore-success" : "viewstore-modal-title"}>{header}</h2>
                        <p className="viewstore-modal-message">{modalMessage}</p>
                        <div className="viewstore-modal-actions">
                            <button className="viewstore-modal-button close"
                                onClick={!success ? onModalClose : onSuccess}
                            >Close</button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="viewstore-modal-overlay">
                    <div className="viewstore-modal">
                        <h2 className="viewstore-modal-title">Confirm Deletion</h2>
                        <p className="viewstore-modal-message">Are you sure you want to delete this store? This action cannot be undone.</p>
                        <div className="viewstore-modal-actions">
                            <button className="viewstore-modal-button viewstore-confirm" onClick={handleDelete}>Confirm</button>
                            <button className="viewstore-modal-button viewstore-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewStoreScreen;
