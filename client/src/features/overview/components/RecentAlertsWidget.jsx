import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Box,
  Button,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../../routes/pathConstants.js'

const severityColor = {
  CRITICAL: 'error',
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'info',
  INFO: 'default',
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

export default function RecentAlertsWidget({ alerts = [] }) {
  const navigate = useNavigate()

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Recent Alerts</Typography>
        <Button size="small" onClick={() => navigate(PATHS.ALERTS)}>View All</Button>
      </Box>
      {alerts.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No active alerts
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Severity</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
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
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{timeAgo(alert.createdAt)}</TableCell>
                <TableCell>
                  <Chip label={alert.status} size="small" variant="outlined" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  )
}
