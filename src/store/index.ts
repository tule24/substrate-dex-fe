import { configureStore } from '@reduxjs/toolkit';
import * as reducers from './reducers'

export const store = configureStore({
    reducer: {
        account: reducers.accountReducer,
        trade: reducers.tradeReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;