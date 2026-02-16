import { Paper, Typography, Box, Skeleton } from '@mui/material'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull'
import { ResponsiveBar } from '@nivo/bar'
import { useGetBatteryBanksQuery } from '../powerApi.js'

export default function BatteryStatusChart() {
  const { data, isLoading } = useGetBatteryBanksQuery()
  const banks = data?.data || []

  const barData = banks.map((bank) => ({
    id: bank.name,
    name: bank.name,
    capacityWh: bank.capacityWh,
    nominalVoltage: bank.nominalVoltage,
  }))

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <BatteryChargingFullIcon color="secondary" />
        <Typography variant="h6">Battery Banks</Typography>
      </Box>

      {isLoading ? (
        <Skeleton variant="rectangular" height={260} />
      ) : barData.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
          <Typography variant="body2" color="text.secondary">
            No battery banks registered yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 260 }}>
          <ResponsiveBar
            data={barData}
            keys={['capacityWh']}
            indexBy="name"
            margin={{ top: 10, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            colors={['#9c27b0']}
            borderRadius={4}
            axisBottom={{
              tickRotation: -30,
            }}
            axisLeft={{
              legend: 'Capacity (Wh)',
              legendPosition: 'middle',
              legendOffset: -50,
            }}
            labelSkipWidth={16}
            labelSkipHeight={16}
            labelTextColor="#fff"
            theme={{
              text: { fill: '#ccc' },
              axis: { ticks: { text: { fill: '#999' } }, legend: { text: { fill: '#999' } } },
              grid: { line: { stroke: '#333' } },
            }}
          />
        </Box>
      )}
    </Paper>
  )
}
