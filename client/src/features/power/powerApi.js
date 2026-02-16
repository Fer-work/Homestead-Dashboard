import { baseApi } from '../../app/baseApi.js'

const powerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSolarArrays: builder.query({
      query: () => '/energy/solar',
      providesTags: ['SolarArrays'],
    }),
    getSolarArray: builder.query({
      query: (id) => `/energy/solar/${id}`,
      providesTags: (result, error, id) => [{ type: 'SolarArrays', id }],
    }),
    createSolarArray: builder.mutation({
      query: (body) => ({ url: '/energy/solar', method: 'POST', body }),
      invalidatesTags: ['SolarArrays', 'EnergyStats'],
    }),
    updateSolarArray: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/energy/solar/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['SolarArrays', 'EnergyStats'],
    }),
    getBatteryBanks: builder.query({
      query: () => '/energy/batteries',
      providesTags: ['BatteryBanks'],
    }),
    getBatteryBank: builder.query({
      query: (id) => `/energy/batteries/${id}`,
      providesTags: (result, error, id) => [{ type: 'BatteryBanks', id }],
    }),
    createBatteryBank: builder.mutation({
      query: (body) => ({ url: '/energy/batteries', method: 'POST', body }),
      invalidatesTags: ['BatteryBanks', 'EnergyStats'],
    }),
    updateBatteryBank: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/energy/batteries/${id}`, method: 'PATCH', body }),
      invalidatesTags: ['BatteryBanks', 'EnergyStats'],
    }),
    getEnergyReadings: builder.query({
      query: ({ hours = 24, deviceId } = {}) => {
        const params = new URLSearchParams({ hours })
        if (deviceId) params.set('deviceId', deviceId)
        return `/energy/readings?${params}`
      },
      providesTags: ['EnergyReadings'],
    }),
    getEnergyStats: builder.query({
      query: () => '/energy/stats',
      providesTags: ['EnergyStats'],
    }),
  }),
})

export const {
  useGetSolarArraysQuery,
  useGetSolarArrayQuery,
  useCreateSolarArrayMutation,
  useUpdateSolarArrayMutation,
  useGetBatteryBanksQuery,
  useGetBatteryBankQuery,
  useCreateBatteryBankMutation,
  useUpdateBatteryBankMutation,
  useGetEnergyReadingsQuery,
  useGetEnergyStatsQuery,
} = powerApi
