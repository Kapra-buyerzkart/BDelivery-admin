import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import taskReducer from './slices/taskSlice';
import agentReducer from './slices/agentSlice';
import typesStoreNamesReducer from './slices/storesDetailsTypes';
import storesDetailsTypesReducer from './slices/storesDetailsTypes';

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    tasks: taskReducer,
    agents: agentReducer,
    typesStoreNames: typesStoreNamesReducer,
    storesDetailsTypes: storesDetailsTypesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // required for redux-persist
        }),
});

export const persistor = persistStore(store);
