import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export const fetchStoreNames = createAsyncThunk('storeNames/fetchStoreNames', async () => {
    const docRef = doc(db, 'storeNames', 'storeNames');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().storeNames : [];
});

const storeNamesSlice = createSlice({
    name: 'storeNames',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoreNames.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStoreNames.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchStoreNames.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default storeNamesSlice.reducer;
