import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './reducers/app.reducer.js';

export const store = configureStore({
    reducer: {
        appModule: appReducer
    }
})
