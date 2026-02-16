import { baseApi } from '../../app/baseApi.js'

const deviceManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query({
      query: ({ deviceType, status } = {}) => {
        const params = new URLSearchParams()
        if (deviceType) params.set('deviceType', deviceType)
        if (status) params.set('status', status)
        const qs = params.toString()
        return `/devices${qs ? `?${qs}` : ''}`
      },
      providesTags: ['Devices'],
    }),
    getDevice: builder.query({
      query: (id) => `/devices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Devices', id }],
    }),
    updateDevice: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/devices/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Devices'],
    }),
    sendCommand: builder.mutation({
      query: ({ deviceId, command, parameters }) => ({
        url: `/devices/${deviceId}/commands`,
        method: 'POST',
        body: { command, parameters },
      }),
    }),
  }),
})

export const {
  useGetDevicesQuery,
  useGetDeviceQuery,
  useUpdateDeviceMutation,
  useSendCommandMutation,
} = deviceManagementApi
