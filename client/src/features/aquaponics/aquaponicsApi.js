// features/aquaponics/aquaponicsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const aquaponicsApi = createApi({
  reducerPath: 'aquaponicsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/aquaponics',
  }),
  tagTypes: ['WaterLevel', 'AquaponicsStats'],
  endpoints: (builder) => ({
    getLatestWaterLevel: builder.query({
      query: () => '/waterlevel/latest',
      providesTags: ['WaterLevel'],
    }),
    getAllWaterLevels: builder.query({
      query: () => '/waterlevel/all',
      providesTags: ['WaterLevel'],
    }),
    getWaterLevelHistory: builder.query({
      query: (hours = 24) => `/waterlevel/history?hours=${hours}`,
      providesTags: ['WaterLevel'],
    }),
    getAquaponicsStats: builder.query({
      query: () => '/stats',
      providesTags: ['AquaponicsStats'],
    }),
  }),
})

export const {
  useGetLatestWaterLevelQuery,
  useGetAllWaterLevelsQuery,
  useGetWaterLevelHistoryQuery,
  useGetAquaponicsStatsQuery,
} = aquaponicsApi