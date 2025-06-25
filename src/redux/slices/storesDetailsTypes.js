import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export const fetchStoresDetailsTypes = createAsyncThunk('storesDetailsTypes/fetchStoresDetailsTypes', async () => {
    const storesDetailsRef = doc(db, 'stores', 'stores');
    const agentTypesRef = doc(db, 'agentTypes', 'agentTypes');
    const storeTypesRef = doc(db, 'storeTypes', 'storeTypes');

    const [storesDetailsSnap, agentTypesSnap, storeTypesSnap] = await Promise.all([
        getDoc(storesDetailsRef),
        getDoc(agentTypesRef),
        getDoc(storeTypesRef)
    ]);
    // console.log('storesDetailsSnap', storesDetailsSnap.data().stores)
    // console.log('storesDetailsSnap', storesDetailsSnap.data())

    return {
        storesDetails: storesDetailsSnap.exists() ? storesDetailsSnap.data().stores : [],
        agentTypes: agentTypesSnap.exists() ? agentTypesSnap.data().agentTypes : [],
        storeTypes: storeTypesSnap.exists() ? storeTypesSnap.data().storeTypes : []
    };
});

const fetchStoresDetailsTypesSlice = createSlice({
    name: 'storesDetailsTypes',
    initialState: {
        storesDetails: [],
        agentTypes: [],
        storeTypes: [],
        storesDetailsTypesLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStoresDetailsTypes.pending, (state) => {
                state.storesDetailsTypesLoading = true;
                state.error = null;
            })
            .addCase(fetchStoresDetailsTypes.fulfilled, (state, action) => {
                state.storesDetailsTypesLoading = false;
                state.storesDetails = action.payload.storesDetails;
                state.agentTypes = action.payload.agentTypes;
                state.storeTypes = action.payload.storeTypes;
            })
            .addCase(fetchStoresDetailsTypes.rejected, (state, action) => {
                state.storesDetailsTypesLoading = false;
                state.error = action.error.message;
            });
    }
});

export default fetchStoresDetailsTypesSlice.reducer;
