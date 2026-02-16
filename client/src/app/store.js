import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { globalSlice } from '../state/index.js'
import { baseApi } from './baseApi.js'
import authReducer from '../features/auth/authSlice.js'

export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(baseApi.middleware),
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

export default store
