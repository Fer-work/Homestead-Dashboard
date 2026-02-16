import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import DevicesIcon from '@mui/icons-material/Devices'
import { useGetDevicesQuery } from '../deviceManagementApi.js'
import DeviceList from '../components/DeviceList.jsx'

const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}))

const deviceTypes = ['', 'SENSOR', 'ACTUATOR', 'CAMERA', 'GATEWAY', 'CONTROLLER', 'ROVER', 'DRONE']
const deviceStatuses = ['', 'ONLINE', 'OFFLINE', 'ERROR', 'MAINTENANCE']

export default function DeviceManagementPage() {
  const [deviceType, setDeviceType] = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading } = useGetDevicesQuery({
    deviceType: deviceType || undefined,
    status: status || undefined,
  })
  const devices = data?.data || []

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <DevicesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Device Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Monitor and configure IoT devices
            </Typography>
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip label={`${devices.length} devices`} variant="outlined" color="primary" />
        </Box>
      </PageHeader>

      <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
        {/* Filter bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Device Type</InputLabel>
            <Select value={deviceType} label="Device Type" onChange={(e) => setDeviceType(e.target.value)}>
              {deviceTypes.map((t) => <MenuItem key={t} value={t}>{t || 'All'}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
              {deviceStatuses.map((s) => <MenuItem key={s} value={s}>{s || 'All'}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DeviceList devices={devices} />
        )}
      </Paper>
    </Container>
  )
}
