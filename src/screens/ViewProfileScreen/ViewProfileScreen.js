import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import './ViewProfileScreen.css';
import { useSelector } from 'react-redux';

const ViewProfileScreen = () => {
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(location.state.agent || {});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [header, setHeader] = useState('');
    // const [storeNames] = useState(location.state.storeNames || []);
    // const [types, setTypes] = useState(location.state.types || []);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const { storesDetails, agentTypes } = useSelector(state => state.storesDetailsTypes);

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
        setEditData(location.state.agent || {});
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
        const q = query(collection(db, 'deliveryAgents'), where('id', '==', id));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const handleSave = async () => {
        const { id, phoneNumber, name, storeName, storeId, type, completedOrders, completedOrdersCount, password, distanceCovered, onDuty } = editData;

        if (!phoneNumber || !name || !storeName || !type || !password) {
            setModalMessage('Please fill in all required fields.');
            setIsModalOpen(true);
            return;
        }

        const oldMobile = location.state?.agent?.phoneNumber;
        const oldId = location.state?.agent?.id;

        try {
            // Check if mobile number already exists
            if (oldMobile !== phoneNumber) {
                const mobileExists = await checkMobileExists(phoneNumber);
                if (mobileExists) {
                    setHeader('Alert');
                    setModalMessage('This mobile number already exists. Please use a different number.');
                    setIsModalOpen(true);
                    return;
                }
            }

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
                mobile: phoneNumber,
                name,
                password: password || '',
                storeName: storeName,
                storeId,
                type,
                completedOrders: completedOrders,
                onDuty: onDuty,
                distanceCovered: distanceCovered
            };

            if (oldMobile === phoneNumber && oldId === id) {
                await setDoc(doc(db, 'deliveryAgents', id), updatedFields);
            } else {
                await deleteDoc(doc(db, 'deliveryAgents', oldId));
                await setDoc(doc(db, 'deliveryAgents', id), updatedFields);
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
        const id = location.state?.agent?.id;

        if (!id) {
            console.error('id is missing.');
            return;
        }

        try {
            await deleteDoc(doc(db, 'deliveryAgents', id));
            setModalMessage('Profile deleted successfully!');
            setIsModalOpen(true);
            setIsDeleteModalOpen(false);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting profile:', error);
            setModalMessage('Failed to delete profile. Please try again.');
            setIsModalOpen(true);
        }
    };

    const onSuccess = () => {
        navigate('/dashboard')
    }

    const onModalClose = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="viewprofile-container">
            {/* {console.log("/////", editData)}
            {console.log("storesDetails", storesDetails)}
            {console.log("types", types)} */}
            <div className="viewprofile-profile-card">
                <h2 className="viewprofile-title">Profile Details</h2>
                <div className="viewprofile-duty-indicator">
                    <span
                        className={`viewprofile-duty-circle ${editData.onDuty ? 'on-duty' : 'off-duty'}`}
                    // title={editData.isOnDuty ? 'On Duty' : 'Off Duty'}
                    ></span>
                    <span className="viewprofile-duty-text">{editData.onDuty ? 'On Duty' : 'Off Duty'}</span>
                </div>
                <div className="viewprofile-field">
                    <label className="viewprofile-label">Agent ID:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="number"
                            name="id"
                            value={editData.id || ''}
                            onChange={handleInputChange}
                            className="viewprofile-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Phone Number:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="number"
                            name="phoneNumber"
                            value={editData.phoneNumber || ''}
                            onChange={handleInputChange}
                            className="viewprofile-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Name:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="text"
                            name="name"
                            value={editData.name || ''}
                            onChange={handleInputChange}
                            className="viewprofile-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Password:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="text"
                            name="password"
                            value={editData.password || ''}
                            onChange={handleInputChange}
                            className="viewprofile-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Store Name:</label>
                    <div className="viewprofile-input-or-value">
                        <select
                            name="storeName"
                            value={editData.storeName || ''}
                            onChange={handleInputChange}
                            className="viewprofile-dropdown"
                            disabled={!isEditing}
                        >
                            <option value="">Select Store</option>
                            {storesDetails.map((store, index) => (
                                <option key={index} value={store.name}>{store.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Type:</label>
                    <div className="viewprofile-input-or-value">
                        <select
                            name="type"
                            value={editData.type || ''}
                            onChange={handleInputChange}
                            className="viewprofile-dropdown"
                            disabled={!isEditing}
                        >
                            <option value="">Select Type</option>
                            {agentTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Completed Orders:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="number"
                            name="completedOrdersCount"
                            value={editData.completedOrdersCount || 0}
                            className="viewprofile-input"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Distance Covered:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="number"
                            name="completedOrdersCount"
                            value={editData.distanceCovered || 0}
                            className="viewprofile-input"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Total Earnings:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="number"
                            name="completedOrdersCount"
                            value={editData.distanceCovered * 2 || 0}
                            className="viewprofile-input"
                            disabled={true}
                        />
                    </div>
                </div>

                <div className="viewprofile-button-container">
                    {isEditing ? (
                        <>
                            <button className="viewprofile-button viewprofile-primary" onClick={handleSave}>Save</button>
                            <button className="viewprofile-button viewprofile-warning" onClick={handleEditToggle}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button className="viewprofile-button viewprofile-primary" onClick={handleEditToggle}>Edit Profile</button>
                            <button className="viewprofile-button viewprofile-danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Profile</button>
                        </>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="viewprofile-modal-overlay">
                    <div className="viewprofile-modal">
                        <h2 className={header === "Success" ? "viewprofile-modal-title viewprofile-success" : "viewprofile-modal-title"}>{header}</h2>
                        <p className="viewprofile-modal-message">{modalMessage}</p>
                        <div className="viewprofile-modal-actions">
                            <button className="viewprofile-modal-button close"
                                onClick={!success ? onModalClose : onSuccess}
                            >Close</button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="viewprofile-modal-overlay">
                    <div className="viewprofile-modal">
                        <h2 className="viewprofile-modal-title">Confirm Deletion</h2>
                        <p className="viewprofile-modal-message">Are you sure you want to delete this profile? This action cannot be undone.</p>
                        <div className="viewprofile-modal-actions">
                            <button className="viewprofile-modal-button viewprofile-confirm" onClick={handleDelete}>Confirm</button>
                            <button className="viewprofile-modal-button viewprofile-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewProfileScreen;
