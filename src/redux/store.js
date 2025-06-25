import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import agentReducer from './slices/agentSlice';
import typesStoreNamesReducer from './slices/storesDetailsTypes';
import storesDetailsTypesReducer from './slices/storesDetailsTypes';

export const store = configureStore({
    reducer: {
        tasks: taskReducer,
        agents: agentReducer,
        typesStoreNames: typesStoreNamesReducer,
        storesDetailsTypes: storesDetailsTypesReducer
    }
});