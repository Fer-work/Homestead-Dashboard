import { Container, Grid, Typography, Box, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import BoltIcon from '@mui/icons-material/Bolt'
import PowerSystemOverview from '../components/PowerSystemOverview.jsx'
import SolarInputCard from '../components/SolarInputCard.jsx'
import BatteryStatusChart from '../components/BatteryStatusChart.jsx'
import PowerConsumptionGraph from '../components/PowerConsumptionGraph.jsx'
import WindInputCard from '../components/WindInputCard.jsx'

const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}))

export default function PowerManagementPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <BoltIcon sx={{ fontSize: 40, color: 'warning.main' }} />
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Energy Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Solar arrays, battery banks, and power monitoring
            </Typography>
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip label="Solar" variant="outlined" color="warning" />
          <Chip label="Battery" variant="outlined" color="secondary" />
          <Chip label="Real-time" variant="outlined" color="success" />
        </Box>
      </PageHeader>

      {/* Row 1: Stats */}
      <Box sx={{ mb: 3 }}>
        <PowerSystemOverview />
      </Box>

      {/* Row 2: Solar + Battery */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SolarInputCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BatteryStatusChart />
        </Grid>
      </Grid>

      {/* Row 3: Power readings over time */}
      <Box sx={{ mb: 3 }}>
        <PowerConsumptionGraph />
      </Box>

      {/* Row 4: Wind placeholder */}
      <WindInputCard />
    </Container>
  )
}
