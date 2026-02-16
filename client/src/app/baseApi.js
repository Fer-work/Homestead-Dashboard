import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: [
    'WaterLevel',
    'AquaponicsStats',
    'Alerts',
    'AlertRules',
    'Devices',
    'Auth',
    'SolarArrays',
    'BatteryBanks',
    'EnergyReadings',
    'EnergyStats',
  ],
  endpoints: () => ({}),
})
