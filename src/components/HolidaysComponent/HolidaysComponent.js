import React, { useEffect, useState } from "react";
import "./HolidaysComponent.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchHolidays } from "../../redux/slices/holidaysSlice";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const HolidaysComponent = () => {
    const dispatch = useDispatch();
    const holidays = useSelector(state => state.holidays.data);
    const loading = useSelector(state => state.holidays.loading);

    const [newDate, setNewDate] = useState("");
    const [newReason, setNewReason] = useState("");

    const holidaysRef = doc(db, "holidays", "holidays");

    const updateFirestore = async (updatedHolidays) => {
        await setDoc(holidaysRef, { holidays: updatedHolidays });
    };

    const handleAddHoliday = async () => {
        if (!newDate || !newReason) return;

        const newHoliday = {
            id: Date.now(),
            date: newDate,
            name: newReason
        };

        const updated = [...holidays, newHoliday];
        await updateFirestore(updated);
        dispatch(fetchHolidays()); // refresh after update

        setNewDate("");
        setNewReason("");
    };

    const handleDelete = async (id) => {
        const updated = holidays.filter(h => h.id !== id);
        await updateFirestore(updated);
        dispatch(fetchHolidays()); // refresh after update
    };

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    };

    return (
        <main className="holidayscomponent-content">
            <div>
                <div className="holidayscomponent-holidays-header">
                    <h2>Holidays</h2>
                    <button onClick={handleAddHoliday} className="holidayscomponent-add-holiday">
                        ADD HOLIDAY
                    </button>
                </div>

                <div className="holidayscomponent-form">
                    <input
                        type="date"
                        value={newDate}
                        onChange={e => setNewDate(e.target.value)}
                        className="holidayscomponent-input"
                    />
                    <input
                        type="text"
                        value={newReason}
                        placeholder="Holiday Reason"
                        onChange={e => setNewReason(e.target.value)}
                        className="holidayscomponent-input"
                    />
                </div>

                <table className="holidayscomponent-holiday-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3">Loading...</td></tr>
                        ) : holidays.length === 0 ? (
                            <tr><td colSpan="3" className="holidayscomponent-empty">No holidays added yet.</td></tr>
                        ) : (
                            holidays.map(holiday => (
                                <tr key={holiday.id}>
                                    <td>{formatDate(holiday.date)}</td>
                                    <td>{holiday.name}</td>
                                    <td>
                                        <button
                                            className="holidayscomponent-delete-btn"
                                            onClick={() => handleDelete(holiday.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
};

export default HolidaysComponent;
