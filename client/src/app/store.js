// app/store.js
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { globalSlice } from '../state/index.js'
import { aquaponicsApi } from '../features/aquaponics/aquaponicsApi.js'

export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
    [aquaponicsApi.reducerPath]: aquaponicsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types from RTK Query
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(aquaponicsApi.middleware),
})

// Enable listener behavior for the store
setupListeners(store.dispatch)

export default store