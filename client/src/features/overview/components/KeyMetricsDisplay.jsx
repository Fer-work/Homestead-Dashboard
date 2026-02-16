import { Grid, Paper, Typography, Box } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import DevicesIcon from '@mui/icons-material/Devices'
import WaterIcon from '@mui/icons-material/Water'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const metrics = [
  { key: 'alerts', label: 'Active Alerts', icon: WarningAmberIcon, color: 'error.main' },
  { key: 'devices', label: 'Online Devices', icon: DevicesIcon, color: 'primary.main' },
  { key: 'waterLevel', label: 'Latest Water Level', icon: WaterIcon, color: 'info.main' },
  { key: 'status', label: 'System Status', icon: CheckCircleIcon, color: 'secondary.main' },
]

export default function KeyMetricsDisplay({ alertCount = 0, deviceCount = 0, waterLevel = '--', systemStatus = 'Nominal' }) {
  const values = {
    alerts: alertCount,
    devices: deviceCount,
    waterLevel: typeof waterLevel === 'number' ? `${waterLevel.toFixed(1)} cm` : waterLevel,
    status: systemStatus,
  }

  return (
    <Grid container spacing={2}>
      {metrics.map(({ key, label, icon: Icon, color }) => (
        <Grid key={key} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}22`, display: 'flex' }}>
              <Icon sx={{ color, fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>{values[key]}</Typography>
              <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
