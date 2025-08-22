import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export const fetchHolidays = createAsyncThunk('holidays/fetchHolidays', async () => {
    const docRef = doc(db, 'holidays', 'holidays');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().holidays : [];
});

const holidaysSlice = createSlice({
    name: 'holidays',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHolidays.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchHolidays.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchHolidays.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default holidaysSlice.reducer;
