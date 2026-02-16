import { baseApi } from '../../app/baseApi.js'

const aquaponicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLatestWaterLevel: builder.query({
      query: () => '/aquaponics/waterlevel/latest',
      providesTags: ['WaterLevel'],
    }),
    getAllWaterLevels: builder.query({
      query: () => '/aquaponics/waterlevel/all',
      providesTags: ['WaterLevel'],
    }),
    getWaterLevelHistory: builder.query({
      query: (hours = 24) => `/aquaponics/waterlevel/history?hours=${hours}`,
      providesTags: ['WaterLevel'],
    }),
    getAquaponicsStats: builder.query({
      query: () => '/aquaponics/stats',
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
