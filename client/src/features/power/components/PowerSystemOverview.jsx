import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull'
import { useGetEnergyStatsQuery } from '../powerApi.js'

const cards = [
  { key: 'totalPower', label: 'Total Power', icon: BoltIcon, color: '#ff9800', unit: 'W', field: 'totalPowerW' },
  { key: 'avgVoltage', label: 'Avg Voltage', icon: ElectricalServicesIcon, color: '#2196f3', unit: 'V', field: 'avgVoltage' },
  { key: 'solarArrays', label: 'Solar Arrays', icon: SolarPowerIcon, color: '#4caf50', unit: '', field: 'solarArrayCount' },
  { key: 'batteryBanks', label: 'Battery Banks', icon: BatteryChargingFullIcon, color: '#9c27b0', unit: '', field: 'batteryBankCount' },
]

export default function PowerSystemOverview() {
  const { data, isLoading } = useGetEnergyStatsQuery(undefined, { pollingInterval: 30000 })
  const stats = data?.data || {}

  return (
    <Grid container spacing={2}>
      {cards.map(({ key, label, icon: Icon, color, unit, field }) => (
        <Grid key={key} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}22`, display: 'flex' }}>
              <Icon sx={{ color, fontSize: 28 }} />
            </Box>
            <Box>
              {isLoading ? (
                <Skeleton width={60} height={32} />
              ) : (
                <Typography variant="h5" fontWeight={700}>
                  {typeof stats[field] === 'number' ? `${stats[field].toFixed(field === 'avgVoltage' ? 1 : 0)}${unit ? ` ${unit}` : ''}` : '--'}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
