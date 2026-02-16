import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  TextField,
  Divider,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useGetDeviceQuery, useSendCommandMutation } from '../deviceManagementApi.js'
import DeviceConfigurationForm from '../components/DeviceConfigurationForm.jsx'
import { PATHS } from '../../../routes/pathConstants.js'

const statusColor = {
  ONLINE: 'success',
  OFFLINE: 'default',
  ERROR: 'error',
  MAINTENANCE: 'warning',
}

export default function DeviceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGetDeviceQuery(id)
  const [sendCommand, { isLoading: sendingCommand }] = useSendCommandMutation()
  const [command, setCommand] = useState('')

  const device = data?.data

  const handleSendCommand = async (e) => {
    e.preventDefault()
    if (!command.trim()) return
    await sendCommand({ deviceId: id, command: command.trim() })
    setCommand('')
  }

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!device) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography>Device not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(PATHS.DEVICES)} sx={{ mt: 2 }}>
          Back to Devices
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(PATHS.DEVICES)} sx={{ mb: 2 }}>
        Back to Devices
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4">{device.name}</Typography>
        <Chip label={device.status} color={statusColor[device.status] || 'default'} />
        <Chip label={device.deviceType} variant="outlined" />
      </Box>

      <Grid container spacing={3}>
        {/* Device config */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>Configuration</Typography>
            <DeviceConfigurationForm device={device} />
          </Paper>
        </Grid>

        {/* Device info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
            <Typography variant="h6" gutterBottom>Info</Typography>
            <Typography variant="body2"><strong>ID:</strong> {device.id}</Typography>
            <Typography variant="body2"><strong>Zone:</strong> {device.zone?.name || '--'}</Typography>
            <Typography variant="body2"><strong>MAC:</strong> {device.macAddress || '--'}</Typography>
            <Typography variant="body2"><strong>MQTT:</strong> {device.mqttTopic || '--'}</Typography>
            <Typography variant="body2"><strong>Firmware:</strong> {device.firmwareVersion || '--'}</Typography>
            <Typography variant="body2"><strong>Last Seen:</strong> {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : '--'}</Typography>
          </Paper>

          {/* Send Command */}
          <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>Send Command</Typography>
            <Box component="form" onSubmit={handleSendCommand} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="e.g. reboot, calibrate, read_sensors"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
              />
              <Button type="submit" variant="contained" disabled={sendingCommand || !command.trim()}>
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Readings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>Recent Readings</Typography>
            {device.sensorReadings?.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {device.sensorReadings.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.sensorType}</TableCell>
                      <TableCell align="right">{r.value.toFixed(2)}</TableCell>
                      <TableCell>{r.unit}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(r.recordedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">No readings</Typography>
            )}
          </Paper>
        </Grid>

        {/* Pending Commands */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>Pending Commands</Typography>
            {device.actuatorCommands?.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Command</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {device.actuatorCommands.map((cmd) => (
                    <TableRow key={cmd.id}>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{cmd.command}</TableCell>
                      <TableCell><Chip label={cmd.status} size="small" variant="outlined" /></TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{new Date(cmd.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">No pending commands</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
