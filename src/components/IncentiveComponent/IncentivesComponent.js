import React, { useEffect, useState } from "react";
import "./IncentivesComponent.css";
import { useDispatch, useSelector } from "react-redux";
import {
    updateIncentivesField,
    fetchIncentives,
    saveIncentives,
    deleteWeeklyTarget
} from "../../redux/slices/incentivesSlice";
import { ClipLoader } from "react-spinners";

const IncentivesComponent = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.incentives);

    const [showModal, setShowModal] = useState(false);
    const [showAddInputs, setShowAddInputs] = useState(false);
    const [newTarget, setNewTarget] = useState("");
    const [newIncentive, setNewIncentive] = useState("");

    const handleAddWeeklyTarget = () => {
        if (!newTarget || !newIncentive) return;

        dispatch(updateIncentivesField({
            section: "weeklyTargetIncentives",
            key: newTarget,
            value: Number(newIncentive)
        }));

        setNewTarget("");
        setNewIncentive("");
        setShowAddInputs(false); // hide after adding
    };
    // useEffect(() => {
    //     dispatch(fetchIncentives());
    // }, [dispatch]);

    const handleChange = (section, key, value) => {
        dispatch(updateIncentivesField({ section, key, value }));
    };

    const handleSave = () => {
        dispatch(saveIncentives(data));
        setShowModal(true);
    };

    const renderMoneyInput = (section, key, value) => (
        <div className="incentivescomponent-input-wrapper">
            <span className="incentivescomponent-currency">₹</span>
            <input
                type="number"
                value={value}
                onChange={(e) => {
                    const newValue = e.target.value === "" ? "" : Number(e.target.value);
                    handleChange(section, key, newValue);
                }}
                className="incentivescomponent-input"
            />
        </div>
    );

    if (loading) {
        return (
            <div className="incentivescomponent-loader">
                <ClipLoader color="#11998e" size={60} />
            </div>
        );
    }

    return (
        <main className="incentivescomponent-content">
            <div className="incentivescomponent-header">
                <h2>Incentives</h2>
                <button
                    onClick={handleSave}
                    className="incentivescomponent-save-btn"
                >
                    SAVE CHANGES
                </button>
            </div>

            {/* Monthly Salary */}
            <h3 className="incentivescomponent-section-title">
                Monthly Salary
            </h3>
            <table className="incentivescomponent-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.monthlySalary).map(([k, v]) => (
                        <tr key={k}>
                            <td>{k}</td>
                            <td>{renderMoneyInput("monthlySalary", k, v)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Petrol Allowance */}
            <h3 className="incentivescomponent-section-title">
                Petrol Allowance (per km)
            </h3>
            <table className="incentivescomponent-table">
                <tbody>
                    <tr>
                        <td>
                            <div className="incentivescomponent-input-wrapper">
                                <span className="incentivescomponent-currency">
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    value={data.petrolAllowance ?? ""}   // show empty if null/undefined
                                    onChange={(e) => {
                                        const newValue = e.target.value === "" ? "" : Number(e.target.value);
                                        handleChange(null, "petrolAllowance", newValue);
                                    }}
                                    className="incentivescomponent-input"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Weekly Target Incentives */}
            <h3 className="incentivescomponent-section-title">
                Weekly Target Incentives
            </h3>
            <table className="incentivescomponent-table">
                <thead>
                    <tr>
                        <th>Target</th>
                        <th>Incentive</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.weeklyTargetIncentives).map(([k, v]) => (
                        <tr key={k}>
                            <td>{k}</td>
                            <td>{renderMoneyInput("weeklyTargetIncentives", k, v)}</td>
                            <td>
                                <button onClick={() => dispatch(deleteWeeklyTarget(k))} className="incentivescomponent-delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}

                    {showAddInputs && (
                        <tr>
                            <td>
                                <input
                                    type="number"
                                    placeholder="Target"
                                    value={newTarget}
                                    onChange={(e) => setNewTarget(e.target.value)}
                                    className="incentivescomponent-input"
                                />
                            </td>
                            <td>
                                <div className="incentivescomponent-input-wrapper">
                                    <span className="incentivescomponent-currency">₹</span>
                                    <input
                                        type="number"
                                        placeholder="Incentive"
                                        value={newIncentive}
                                        onChange={(e) => setNewIncentive(e.target.value)}
                                        className="incentivescomponent-input"
                                    />
                                </div>
                            </td>
                            <td>
                                <button
                                    className="incentivescomponent-save-btn"
                                    style={{ padding: "5px 10px", marginRight: "5px" }}
                                    onClick={handleAddWeeklyTarget}
                                >
                                    Save
                                </button>
                                <button
                                    style={{
                                        backgroundColor: "gray",
                                        color: "white",
                                        padding: "5px 10px",
                                        border: "none",
                                        borderRadius: "4px"
                                    }}
                                    onClick={() => {
                                        setShowAddInputs(false)
                                        setNewIncentive(null)
                                        setNewTarget(null)
                                    }}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Add New Button */}
            {!showAddInputs && (
                <button
                    className="incentivescomponent-save-btn"
                    onClick={() => setShowAddInputs(true)}
                >
                    Add New
                </button>
            )}

            {/* Attendance Incentives */}
            <h3 className="incentivescomponent-section-title">
                Attendance Incentives
            </h3>
            <table className="incentivescomponent-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.attendanceIncentives).map(([k, v]) => (
                        <tr key={k}>
                            <td>{k}</td>
                            <td>
                                {renderMoneyInput("attendanceIncentives", k, v)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Compulsory Login Hours */}
            <h3 className="incentivescomponent-section-title">
                Compulsory Login Hours
            </h3>
            <table className="incentivescomponent-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.compulsoryLoginHours).map(([k, v]) => (
                        <tr key={k}>
                            <td>{k}</td>
                            <td>
                                <input
                                    type="text"
                                    value={v}
                                    onChange={(e) =>
                                        handleChange(
                                            "compulsoryLoginHours",
                                            k,
                                            e.target.value
                                        )
                                    }
                                    className="incentivescomponent-input"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Overtime Bonus */}
            <h3 className="incentivescomponent-section-title">
                Overtime Bonus
            </h3>
            <table className="incentivescomponent-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Amount per Hour</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.overtimeBonus).map(([k, v]) => (
                        <tr key={k}>
                            <td>{k}</td>
                            <td>{renderMoneyInput("overtimeBonus", k, v)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Refer Join and Earn */}
            <h3 className="incentivescomponent-section-title">
                Refer, Join and Earn
            </h3>
            <table className="incentivescomponent-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data.referJoinEarn).map(([k, v]) => (
                        <tr key={k}>
                            <td>{k}</td>
                            <td>{renderMoneyInput("referJoinEarn", k, v)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Incentives updated successfully!</h3>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default IncentivesComponent;
