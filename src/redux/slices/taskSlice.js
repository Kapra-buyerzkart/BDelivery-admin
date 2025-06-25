import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

// Async thunk to fetch completed tasks
export const fetchCompletedTasks = createAsyncThunk(
    'tasks/fetchCompletedTasks',
    async () => {
        const q = query(collection(db, 'tasks'), where('deliveryCompleted', '==', true));
        const snapshot = await getDocs(q);

        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return tasks;
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        completedTasks: [],
        tasksLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCompletedTasks.pending, state => {
                state.tasksLoading = true;
                state.error = null;
            })
            .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
                state.tasksLoading = false;
                state.completedTasks = action.payload;
            })
            .addCase(fetchCompletedTasks.rejected, (state, action) => {
                state.tasksLoading = false;
                state.error = action.error.message;
            });
    }
});

export default taskSlice.reducer;
