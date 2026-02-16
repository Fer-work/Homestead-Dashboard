import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useUpdateDeviceMutation } from '../deviceManagementApi.js'

const deviceStatuses = ['ONLINE', 'OFFLINE', 'MAINTENANCE', 'ERROR']

export default function DeviceConfigurationForm({ device }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [mqttTopic, setMqttTopic] = useState('')
  const [firmwareVersion, setFirmwareVersion] = useState('')
  const [success, setSuccess] = useState(false)

  const [updateDevice, { isLoading, error }] = useUpdateDeviceMutation()

  useEffect(() => {
    if (device) {
      setName(device.name || '')
      setStatus(device.status || '')
      setMqttTopic(device.mqttTopic || '')
      setFirmwareVersion(device.firmwareVersion || '')
    }
  }, [device])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    await updateDevice({ id: device.id, name, status, mqttTopic, firmwareVersion })
    setSuccess(true)
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>Failed to update device</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Device updated</Alert>}

      <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="normal" size="small" />
      <FormControl fullWidth margin="normal" size="small">
        <InputLabel>Status</InputLabel>
        <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
          {deviceStatuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </Select>
      </FormControl>
      <TextField fullWidth label="MQTT Topic" value={mqttTopic} onChange={(e) => setMqttTopic(e.target.value)} margin="normal" size="small" />
      <TextField fullWidth label="Firmware Version" value={firmwareVersion} onChange={(e) => setFirmwareVersion(e.target.value)} margin="normal" size="small" />

      <Button type="submit" variant="contained" disabled={isLoading} sx={{ mt: 2 }}>
        {isLoading ? <CircularProgress size={20} /> : 'Save Changes'}
      </Button>
    </Box>
  )
}
