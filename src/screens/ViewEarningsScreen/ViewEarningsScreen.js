// src/screens/ViewEarningsScreen.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "react-calendar"; // Web version
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { useSelector } from "react-redux";
import "./ViewEarningsScreen.css";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";


const ViewEarningsScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const agent = location.state?.agent;
    const [selectedWeek, setSelectedWeek] = useState(() => {
        const today = moment();
        const startOfWeek = today.clone().startOf("isoWeek"); // Monday
        const endOfWeek = today.clone().endOf("isoWeek"); // Sunday
        return {
            startDate: startOfWeek.format("YYYY-MM-DD"),
            endDate: endOfWeek.format("YYYY-MM-DD"),
        };
    });

    const [earnings, setEarnings] = useState({
        distance: 0,
        tasks: 0,
        petrol: 0,
        target: 0,
        attendance: 0,
        specialAttendance: 0,
        overtime: 0,
    });

    const [todayEarnings, setTodayEarnings] = useState({
        distance: 0,
        petrol: 0,
        overtime: 0,
        tasks: 0,
    });
    const [referralInput, setReferralInput] = useState(0);
    const [joiningInput, setJoiningInput] = useState(0);

    // console.log(".>>>>>", agent)

    // if (!agent) {
    //     return <div className="agentdetails-container">No agent data found.</div>;
    // }

    const {
        id,
        name,
        phoneNumber,
        storeName,
        completedOrdersCount,
        totalEarnings,
        distanceCovered,
        type,
        onDuty
        // completedTasks,
        // deliveryAgents,
        // totalCOD,
        // totalOnline,
    } = agent;

    // const agent = useSelector((state) => state.agent);
    const { agentsData } = useSelector(state => state.agents);
    // const holidays = useSelector((state) => state.holidays.data);
    const holidays = useSelector(state => state.holidays.data);
    const incentives = useSelector((state) => state.incentives.data);
    const todayDate = moment().format("DD-MM-YYYY");

    useEffect(() => {
        if (id && selectedWeek.startDate && selectedWeek.endDate) {
            fetchEarnings(selectedWeek.startDate, selectedWeek.endDate);
            fetchTodayEarnings();
        }
        // eslint-disable-next-line
    }, [selectedWeek, agent.agentId]);

    // const defaultReferral = incentives?.referralBonus || 0;
    // const defaultJoining = incentives?.joiningBonus || 0;
    const defaultReferral = agentsData[0].referralBonus || 0;
    const defaultJoining = agentsData[0].joiningBonus || 0;
    const totalReferral = defaultReferral + Number(referralInput || 0);
    const totalJoining = defaultJoining + Number(joiningInput || 0);

    const handleSaveBonuses = async () => {
        if (!agent?.id) {
            alert("Agent ID not found!");
            return;
        }
        try {
            const agentRef = doc(db, "deliveryAgents", agent.id);
            await updateDoc(agentRef, {
                referralBonus: totalReferral,
                joiningBonus: totalJoining,
            });
            alert("Bonuses updated successfully ✅");
            setReferralInput(0);
            setJoiningInput(0);
        } catch (error) {
            console.error("Error updating bonuses:", error);
            alert("Failed to update bonuses ❌");
        }
    };

    // --- Incentives logic ---
    const getTargetIncentive = (count) => {
        if (!incentives?.weeklyTargetIncentives) return 0;
        const thresholds = Object.keys(incentives.weeklyTargetIncentives)
            .map(Number)
            .sort((a, b) => a - b);

        let incentive = 0;
        thresholds.forEach((threshold) => {
            if (count >= threshold) {
                incentive = incentives.weeklyTargetIncentives[threshold];
            }
        });
        return incentive;
    };

    const fetchEarnings = async (startDate, endDate) => {
        try {
            // Replace with Firestore fetch if needed
            const data = agent; // assuming agent has completedOrders etc.

            if (!data?.completedOrders) return;

            let tasks = data.completedOrders.filter((task) => {
                const taskDate = moment(task.deliveryAddress.date, "DD MMM YYYY");
                return taskDate.isBetween(moment(startDate), moment(endDate), undefined, "[]");
            });

            const totalDistance = tasks.reduce(
                (sum, task) => sum + parseFloat(task.kilometers || 0),
                0
            );
            const totalPetrol = totalDistance * (incentives?.petrolAllowance || 0);
            const totalTarget = getTargetIncentive(tasks.length);

            // Attendance incentives
            const attendanceDates = (agent.attendance || []).map((t) =>
                moment(t.date, "DD-MM-YYYY")
            );
            const filteredDates = attendanceDates.filter((date) =>
                date.isBetween(moment(startDate), moment(endDate), undefined, "[]")
            );
            const saturdays = new Set(
                filteredDates
                    .filter((date) => date.format("dddd") === "Saturday")
                    .map((d) => d.format("DD-MM-YYYY"))
            );
            const sundays = new Set(
                filteredDates
                    .filter((date) => date.format("dddd") === "Sunday")
                    .map((d) => d.format("DD-MM-YYYY"))
            );
            const attendanceIncentive =
                saturdays.size * (incentives?.attendanceIncentives?.Saturday || 0) +
                sundays.size * (incentives?.attendanceIncentives?.Sunday || 0);

            // Special Holiday Incentives
            const isFullTime = agent.type === "FULL TIME";
            const monthlySalary = Number(
                incentives?.monthlySalary?.[
                isFullTime ? "Full Time" : "Part Time"
                ] || 0
            );
            const holidayDates = holidays.map((h) => h.date);
            const specialAttendanceIncentive = filteredDates
                .filter((date) => holidayDates.includes(date.format("YYYY-MM-DD")))
                .reduce((sum, date) => {
                    const daysInMonth = moment(date).daysInMonth();
                    const dailySalary = monthlySalary / daysInMonth;
                    return sum + (dailySalary * 2 + 150);
                }, 0);

            // Overtime
            const calculateOvertime = (attendance) => {
                const required = Number(
                    incentives?.compulsoryLoginHours?.[isFullTime ? "Full Time" : "Part Time"] || 0
                );
                const rate = Number(
                    incentives?.overtimeBonus?.[isFullTime ? "Full Time" : "Part Time"] || 0
                );
                return attendance.reduce((sum, entry) => {
                    if (!entry.date || !entry.punchIn?.time || !entry.punchOut?.time)
                        return sum;
                    const format = "DD-MM-YYYY hh:mm:ss A";
                    const inTime = moment(`${entry.date} ${entry.punchIn.time}`, format);
                    const outTime = moment(`${entry.date} ${entry.punchOut.time}`, format);
                    if (!inTime.isValid() || !outTime.isValid()) return sum;
                    const workedHours = moment.duration(outTime.diff(inTime)).asHours();
                    const extra = Math.max(0, workedHours - required);
                    return sum + extra * rate;
                }, 0);
            };
            const filteredAttendance = (agent.attendance || []).filter((entry) =>
                moment(entry.date, "DD-MM-YYYY").isBetween(
                    moment(startDate),
                    moment(endDate),
                    undefined,
                    "[]"
                )
            );
            const totalOvertime = calculateOvertime(filteredAttendance);

            setEarnings({
                distance: totalDistance,
                tasks: tasks.length,
                petrol: totalPetrol,
                target: totalTarget,
                attendance: attendanceIncentive,
                specialAttendance: specialAttendanceIncentive,
                overtime: totalOvertime,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTodayEarnings = async () => {
        try {
            const data = agent;
            if (!data?.completedOrders) return;

            const todayTasks = data.completedOrders.filter(
                (task) =>
                    task.deliveryAddress.date === moment().format("DD MMM YYYY")
            );

            const distance = todayTasks.reduce(
                (sum, task) => sum + parseFloat(task.kilometers || 0),
                0
            );
            const petrol = distance * (incentives?.petrolAllowance || 0);

            setTodayEarnings({
                distance,
                petrol,
                overtime: 0,
                tasks: todayTasks.length,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const onDayChange = (day) => {
        const selectedDate = moment(day);
        const startOfWeek = selectedDate.clone().startOf("isoWeek");
        const endOfWeek = selectedDate.clone().endOf("isoWeek");
        setSelectedWeek({
            startDate: startOfWeek.format("YYYY-MM-DD"),
            endDate: endOfWeek.format("YYYY-MM-DD"),
        });
    };

    if (!agent) {
        return <div className="agentdetails-container">No agent data found.</div>;
    }

    return (
        <div className="earnings-container">
            {console.log('holidays', holidays)}
            {console.log('incentives', incentives)}
            {console.log('agentsData', agentsData[0].joiningBonus)}
            <div className="top-bar">
                {/* <button className="back-btn" onClick={() => navigate(-1)}>←</button> */}
                <h2 className="header-title">Earnings</h2>
                <div className="placeholder" />
            </div>

            <div className="content-container">
                <Calendar
                    onChange={onDayChange}
                    value={new Date(selectedWeek.startDate)}
                    tileClassName={({ date, view }) => {
                        if (view === "month") {
                            const day = moment(date).format("YYYY-MM-DD");
                            if (
                                day >= selectedWeek.startDate &&
                                day <= selectedWeek.endDate
                            ) {
                                return "highlight-week"; // custom CSS class
                            }
                        }
                        return null;
                    }}
                />
                {/* Today's Earnings */}
                <div className="card">
                    <h3 className="card-title">Today's Earnings ({todayDate})</h3>
                    <p>Tasks: <span>{todayEarnings.tasks}</span></p>
                    <p>Distance: <span>{todayEarnings.distance.toFixed(2)} km</span></p>
                    <p>Petrol Allowance: <span>₹{todayEarnings.petrol.toFixed(2)}</span></p>
                </div>

                {/* Weekly Earnings */}
                <div className="card">
                    <h3 className="card-title">
                        Weekly Earnings ({moment(selectedWeek.startDate).format("DD-MM-YYYY")} → {moment(selectedWeek.endDate).format("DD-MM-YYYY")})
                    </h3>
                    <p>Total Tasks: <span>{earnings.tasks}</span></p>
                    <p>Total Distance: <span>{earnings.distance.toFixed(2)} km</span></p>
                    <p>Petrol Allowance: <span>₹{earnings.petrol.toFixed(2)}</span></p>
                    <p>Target Incentives: <span>₹{earnings.target.toFixed(2)}</span></p>
                    <p>Attendance Incentives: <span>₹{earnings.attendance.toFixed(2)}</span></p>
                    <p>Special Holiday Incentives: <span>₹{earnings.specialAttendance.toFixed(2)}</span></p>
                    <p>Overtime Bonus: <span>₹{earnings.overtime.toFixed(2)}</span></p>
                </div>

                {/* Referral */}
                <div className="card">
                    <h3 className="card-title">Refer, Join and Earn</h3>

                    <p>
                        Referral Bonus: <span>₹{totalReferral}</span>
                    </p>
                    <input
                        type="number"
                        placeholder="Enter extra referral bonus"
                        value={referralInput}
                        onChange={(e) => setReferralInput(e.target.value)}
                        className="bonus-input"
                    />

                    <p>
                        Joining Bonus: <span>₹{totalJoining}</span>
                    </p>
                    <input
                        type="number"
                        placeholder="Enter extra joining bonus"
                        value={joiningInput}
                        onChange={(e) => setJoiningInput(e.target.value)}
                        className="bonus-input"
                    />

                    <button onClick={handleSaveBonuses} className="save-btn">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewEarningsScreen;
