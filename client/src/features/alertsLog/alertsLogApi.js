import { baseApi } from '../../app/baseApi.js'

const alertsLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlerts: builder.query({
      query: ({ status, severity, limit = 50, offset = 0 } = {}) => {
        const params = new URLSearchParams()
        if (status) params.set('status', status)
        if (severity) params.set('severity', severity)
        params.set('limit', limit)
        params.set('offset', offset)
        return `/alerts?${params}`
      },
      providesTags: ['Alerts'],
    }),
    updateAlert: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/alerts/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Alerts'],
    }),
    getAlertRules: builder.query({
      query: () => '/alerts/rules',
      providesTags: ['AlertRules'],
    }),
    createAlertRule: builder.mutation({
      query: (body) => ({
        url: '/alerts/rules',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AlertRules'],
    }),
    updateAlertRule: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/alerts/rules/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AlertRules'],
    }),
    deleteAlertRule: builder.mutation({
      query: (id) => ({
        url: `/alerts/rules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AlertRules'],
    }),
  }),
})

export const {
  useGetAlertsQuery,
  useUpdateAlertMutation,
  useGetAlertRulesQuery,
  useCreateAlertRuleMutation,
  useUpdateAlertRuleMutation,
  useDeleteAlertRuleMutation,
} = alertsLogApi
