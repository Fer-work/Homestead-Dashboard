import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Typography,
  Box,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const statusColor = {
  ONLINE: 'success',
  OFFLINE: 'default',
  ERROR: 'error',
  MAINTENANCE: 'warning',
}

function timeAgo(dateString) {
  if (!dateString) return '--'
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function DeviceList({ devices = [] }) {
  const navigate = useNavigate()

  if (devices.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">No devices found</Typography>
      </Box>
    )
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Zone</TableCell>
          <TableCell>MAC</TableCell>
          <TableCell>Last Seen</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {devices.map((device) => (
          <TableRow
            key={device.id}
            hover
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate(`/devices/${device.id}`)}
          >
            <TableCell>{device.name}</TableCell>
            <TableCell>{device.deviceType}</TableCell>
            <TableCell>
              <Chip
                label={device.status}
                color={statusColor[device.status] || 'default'}
                size="small"
                variant="outlined"
              />
            </TableCell>
            <TableCell>{device.zone?.name || '--'}</TableCell>
            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{device.macAddress || '--'}</TableCell>
            <TableCell sx={{ whiteSpace: 'nowrap' }}>{timeAgo(device.lastSeenAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
