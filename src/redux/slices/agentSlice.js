import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export const fetchAgents = createAsyncThunk('agents/fetchAgents', async () => {
    const snapshot = await getDocs(collection(db, 'deliveryAgents'));

    return snapshot.docs.map((doc) => {
        const data = doc.data() || {};
        const completedOrders = data.completedOrders || [];

        const totalDistanceCovered = completedOrders.reduce((sum, order) => sum + (order.kilometers || 0), 0);

        return {
            id: data.id || "Unknown",
            phoneNumber: data.mobile,
            name: data.name || "Unnamed Picker",
            password: data.password,
            storeName: data.storeName,
            type: data.type,
            completedOrders,
            completedOrdersCount: completedOrders.length,
            distanceCovered: totalDistanceCovered,
            onDuty: data.onDuty,
            storeId: data.storeId
        };
    });
});

const agentSlice = createSlice({
    name: 'agents',
    initialState: {
        agentsData: [],
        agentLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgents.pending, (state) => {
                state.agentLoading = true;
            })
            .addCase(fetchAgents.fulfilled, (state, action) => {
                state.agentLoading = false;
                state.agentsData = action.payload;
            })
            .addCase(fetchAgents.rejected, (state, action) => {
                state.agentLoading = false;
                state.error = action.error.message;
            });
    }
});

export default agentSlice.reducer;
