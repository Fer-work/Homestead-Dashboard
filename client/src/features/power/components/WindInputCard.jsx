import { Paper, Typography, Box } from '@mui/material'
import AirIcon from '@mui/icons-material/Air'

export default function WindInputCard() {
  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AirIcon color="info" />
        <Typography variant="h6">Wind Turbines</Typography>
      </Box>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Wind turbine monitoring coming soon
        </Typography>
      </Box>
    </Paper>
  )
}
