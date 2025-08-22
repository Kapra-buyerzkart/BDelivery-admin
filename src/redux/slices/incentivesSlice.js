// src/redux/slices/incentivesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const incentivesRef = doc(db, "incentives", "incentivesValues");

export const fetchIncentives = createAsyncThunk(
    "incentives/fetchIncentives",
    async () => {
        const snap = await getDoc(incentivesRef);
        if (snap.exists()) {
            return snap.data();
        }
        return null;
    }
);

export const saveIncentives = createAsyncThunk(
    "incentives/saveIncentives",
    async (data) => {
        await setDoc(incentivesRef, data);
        return data;
    }
);

const initialState = {
    data: {
        attendanceIncentives: { saturday: 0, sunday: 0 },
        compulsoryLoginHours: { full_time: "0 hrs", part_time: "0 hrs" },
        monthlySalary: { FULL_TIME: 0, PART_TIME: 0 },
        overtimeBonus: { per_hour_full_time: 0, per_hour_part_time: 0 },
        petrolAllowance: 0,
        referJoinEarn: { joining_bonus: 0, referral_bonus: 0 },
        weeklyTargetIncentives: {
            25: 0,
            35: 0,
            50: 0,
            60: 0,
            75: 0,
            110: 0,
            150: 0
        }
    },
    loading: false,
    error: null
};

const incentivesSlice = createSlice({
    name: "incentives",
    initialState,
    reducers: {
        updateIncentivesField: (state, action) => {
            const { section, key, value } = action.payload;

            if (section) {
                // update inside a section (e.g. monthlySalary.basic)
                state.data[section][key] = value;
            } else {
                // update root-level field (e.g. petrolAllowance)
                state.data[key] = value;
            }
        },
        setWeeklyTargets: (state, action) => {
            state.data.weeklyTargetIncentives = action.payload;
        },
        deleteWeeklyTarget: (state, action) => {
            delete state.data.weeklyTargetIncentives[action.payload];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIncentives.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchIncentives.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.data = action.payload;
                }
            })
            .addCase(fetchIncentives.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(saveIncentives.fulfilled, (state, action) => {
                state.data = action.payload;
            });
    }
});

export const { updateIncentivesField, setWeeklyTargets, deleteWeeklyTarget } = incentivesSlice.actions;
export default incentivesSlice.reducer;
