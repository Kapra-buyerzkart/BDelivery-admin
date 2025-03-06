import React, { useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import './ViewProfileScreen.css';

const ViewProfileScreen = () => {
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(location.state || {});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [header, setHeader] = useState('');
    const navigate = useNavigate();

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditData(location.state || {});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
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
        const { id, phoneNumber, name, storeName, type, completedOrders, completedOrdersCount, password } = editData;

        if (!phoneNumber || !name || !storeName || !type || !password) {
            setModalMessage('Please fill in all required fields.');
            setIsModalOpen(true);
            return;
        }

        const oldMobile = location.state?.phoneNumber;
        const oldId = location.state?.id;

        try {
            // Check if mobile number already exists
            if (oldMobile !== phoneNumber) {
                const mobileExists = await checkMobileExists(phoneNumber);
                if (mobileExists) {
                    setHeader('Alert')
                    setModalMessage('This mobile number already exists. Please use a different number.');
                    setIsModalOpen(true);
                    return;
                }
            }

            if (oldId !== id) {
                const idExists = await checkIdExists(id);
                if (idExists) {
                    setHeader('Alert')
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
                type,
                completedOrders: completedOrders,
            };

            if (oldMobile === phoneNumber && oldId === id) {
                await setDoc(doc(db, 'deliveryAgents', id), updatedFields);
            } else {
                await deleteDoc(doc(db, 'deliveryAgents', oldId));
                await setDoc(doc(db, 'deliveryAgents', id), updatedFields);
            }
            setHeader("Success")
            setModalMessage('Profile updated successfully!');
            setIsModalOpen(true);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setHeader("Error")
            setModalMessage('Failed to update profile. Please try again.');
            setIsModalOpen(true);
        }
    };

    const handleDelete = async () => {
        const id = location.state?.id;

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

    return (
        <div className="viewprofile-container">
            <div className="viewprofile-profile-card">
                <h2 className="viewprofile-title">Profile Details</h2>

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
                    <label className="viewprofile-label">Store Name:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="text"
                            name="storeName"
                            value={editData.storeName || ''}
                            onChange={handleInputChange}
                            className="viewprofile-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">Type:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="text"
                            name="type"
                            value={editData.type || ''}
                            onChange={handleInputChange}
                            className="viewprofile-input"
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="viewprofile-field">
                    <label className="viewprofile-label">completed Orders:</label>
                    <div className="viewprofile-input-or-value">
                        <input
                            type="number"
                            name="type"
                            value={editData.completedOrdersCount || ''}
                            // onChange={handleInputChange}
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
                        <h2 className={header == "Success" ? "viewprofile-modal-title viewprofile-success" : "viewprofile-modal-title"}>{header}</h2>
                        <p className="viewprofile-modal-message">{modalMessage}</p>
                        <div className="viewprofile-modal-actions">
                            <button className="viewprofile-modal-button close" onClick={() => setIsModalOpen(false)}>Close</button>
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
