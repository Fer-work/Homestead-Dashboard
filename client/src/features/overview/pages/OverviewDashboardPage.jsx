import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BoltIcon from '@mui/icons-material/Bolt'
import SetMealIcon from '@mui/icons-material/SetMeal'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import CellTowerIcon from '@mui/icons-material/CellTower'
import ShieldIcon from '@mui/icons-material/Shield'
import HandymanIcon from '@mui/icons-material/Handyman'
import { useGetOverviewAlertsQuery, useGetOverviewDevicesQuery } from '../overviewApi.js'
import { useGetLatestWaterLevelQuery } from '../../aquaponics/aquaponicsApi.js'
import KeyMetricsDisplay from '../components/KeyMetricsDisplay.jsx'
import RecentAlertsWidget from '../components/RecentAlertsWidget.jsx'
import SystemHealthCard from '../components/SystemHealthCard.jsx'
import { PATHS } from '../../../routes/pathConstants.js'

const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}))

const domainCards = [
  { title: 'Energy', subtitle: 'Solar, battery, biogas', icon: BoltIcon, path: PATHS.ENERGY, color: '#ff9800' },
  { title: 'Food', subtitle: 'Aquaponics, gardens', icon: SetMealIcon, path: PATHS.AQUAPONICS, color: '#4caf50' },
  { title: 'Water', subtitle: 'Rainwater, filtration', icon: WaterDropIcon, path: PATHS.WATER, color: '#2196f3' },
  { title: 'Comms/AI', subtitle: 'LoRa mesh, AI server', icon: CellTowerIcon, path: PATHS.COMMS, color: '#9c27b0' },
  { title: 'Defense', subtitle: 'Sensors, patrol', icon: ShieldIcon, path: PATHS.DEFENSE, color: '#f44336' },
  { title: 'Workshop', subtitle: '3D print, CNC, fab', icon: HandymanIcon, path: PATHS.WORKSHOP, color: '#795548' },
]

export default function OverviewDashboardPage() {
  const { data: alertsData, isLoading: alertsLoading } = useGetOverviewAlertsQuery()
  const { data: devicesData, isLoading: devicesLoading } = useGetOverviewDevicesQuery()
  const { data: waterData } = useGetLatestWaterLevelQuery()

  const alerts = alertsData?.data || []
  const devices = devicesData?.data || []
  const waterLevel = waterData?.data?.value ?? '--'
  const onlineCount = devices.filter((d) => d.status === 'ONLINE').length

  const navigate = useNavigate()

  if (alertsLoading && devicesLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3, display: 'flex', justifyContent: 'center', pt: 10 }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Dragon Sovereign Homestead
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Command Center
            </Typography>
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip label="All Systems" variant="outlined" color="primary" />
          <Chip label="Real-time" variant="outlined" color="success" />
        </Box>
      </PageHeader>

      {/* Row 1: Key Metrics */}
      <Box sx={{ mb: 3 }}>
        <KeyMetricsDisplay
          alertCount={alerts.length}
          deviceCount={onlineCount}
          waterLevel={waterLevel}
          systemStatus={alerts.some((a) => a.severity === 'CRITICAL') ? 'Critical' : 'Nominal'}
        />
      </Box>

      {/* Row 2: Alerts + System Health */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentAlertsWidget alerts={alerts} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <SystemHealthCard devices={devices} />
        </Grid>
      </Grid>

      {/* Row 3: Domain Quick-Nav */}
      <Typography variant="h6" sx={{ mb: 2 }}>Domains</Typography>
      <Grid container spacing={2}>
        {domainCards.map((card) => {
          const Icon = card.icon
          return (
            <Grid key={card.title} size={{ xs: 6, sm: 4, md: 2 }}>
              <Paper
                onClick={() => navigate(card.path)}
                sx={{
                  p: 2.5,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'border-color 0.2s, transform 0.2s',
                  '&:hover': {
                    borderColor: card.color,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Icon sx={{ fontSize: 36, color: card.color, mb: 1 }} />
                <Typography variant="subtitle2">{card.title}</Typography>
                <Typography variant="caption" color="text.secondary">{card.subtitle}</Typography>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}
