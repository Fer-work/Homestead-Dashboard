import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Divider,
} from '@mui/material'
import { useUpdateAlertMutation } from '../alertsLogApi.js'

const severityColor = {
  CRITICAL: 'error',
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info',
  INFO: 'default',
}

export default function AlertDetailsModal({ alert, open, onClose }) {
  const [updateAlert, { isLoading }] = useUpdateAlertMutation()

  if (!alert) return null

  const handleAction = async (status) => {
    await updateAlert({ id: alert.id, status })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Alert Details</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={alert.severity} color={severityColor[alert.severity] || 'default'} size="small" />
          <Chip label={alert.status} size="small" variant="outlined" />
        </Box>
        <Typography variant="h6" gutterBottom>{alert.title}</Typography>
        {alert.message && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {alert.message}
          </Typography>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2">
          <strong>Device:</strong> {alert.device?.name || alert.deviceId || '--'}
        </Typography>
        <Typography variant="body2">
          <strong>Sensor Type:</strong> {alert.sensorType || '--'}
        </Typography>
        <Typography variant="body2">
          <strong>Trigger Value:</strong> {alert.triggerValue ?? '--'}
        </Typography>
        <Typography variant="body2">
          <strong>Created:</strong> {new Date(alert.createdAt).toLocaleString()}
        </Typography>
        {alert.acknowledgedAt && (
          <Typography variant="body2">
            <strong>Acknowledged:</strong> {new Date(alert.acknowledgedAt).toLocaleString()}
            {alert.acknowledgedBy && ` by ${alert.acknowledgedBy}`}
          </Typography>
        )}
        {alert.resolvedAt && (
          <Typography variant="body2">
            <strong>Resolved:</strong> {new Date(alert.resolvedAt).toLocaleString()}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {alert.status === 'ACTIVE' && (
          <Button onClick={() => handleAction('ACKNOWLEDGED')} disabled={isLoading} color="warning">
            Acknowledge
          </Button>
        )}
        {alert.status !== 'RESOLVED' && (
          <Button onClick={() => handleAction('RESOLVED')} disabled={isLoading} color="success">
            Resolve
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
