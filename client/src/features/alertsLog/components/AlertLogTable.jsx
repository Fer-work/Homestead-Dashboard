import { useState } from 'react'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import InfoIcon from '@mui/icons-material/Info'
import { useUpdateAlertMutation } from '../alertsLogApi.js'
import AlertDetailsModal from './AlertDetailsModal.jsx'

const severityColor = {
  CRITICAL: 'error',
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info',
  INFO: 'default',
}

const statusColor = {
  ACTIVE: 'error',
  ACKNOWLEDGED: 'warning',
  RESOLVED: 'success',
}

function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AlertLogTable({ alerts = [] }) {
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [updateAlert] = useUpdateAlertMutation()

  if (alerts.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">No alerts found</Typography>
      </Box>
    )
  }

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Severity</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Device</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id} hover>
              <TableCell>
                <Chip
                  label={alert.severity}
                  color={severityColor[alert.severity] || 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{alert.title}</TableCell>
              <TableCell>{alert.device?.name || '--'}</TableCell>
              <TableCell>
                <Chip
                  label={alert.status}
                  color={statusColor[alert.status] || 'default'}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{timeAgo(alert.createdAt)}</TableCell>
              <TableCell align="right">
                <Tooltip title="Details">
                  <IconButton size="small" onClick={() => setSelectedAlert(alert)}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {alert.status === 'ACTIVE' && (
                  <Tooltip title="Acknowledge">
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => updateAlert({ id: alert.id, status: 'ACKNOWLEDGED' })}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {alert.status !== 'RESOLVED' && (
                  <Tooltip title="Resolve">
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => updateAlert({ id: alert.id, status: 'RESOLVED' })}
                    >
                      <DoneAllIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDetailsModal
        alert={selectedAlert}
        open={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
      />
    </>
  )
}
