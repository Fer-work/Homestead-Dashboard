import { baseApi } from '../../app/baseApi.js'

const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewAlerts: builder.query({
      query: () => '/alerts?status=ACTIVE&limit=5',
      providesTags: ['Alerts'],
    }),
    getOverviewDevices: builder.query({
      query: () => '/devices',
      providesTags: ['Devices'],
    }),
  }),
})

export const {
  useGetOverviewAlertsQuery,
  useGetOverviewDevicesQuery,
} = overviewApi
