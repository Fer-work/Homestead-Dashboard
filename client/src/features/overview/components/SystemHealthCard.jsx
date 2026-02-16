import { Paper, Typography, Box } from '@mui/material'
import { ResponsivePie } from '@nivo/pie'

const statusColors = {
  ONLINE: '#4caf50',
  OFFLINE: '#757575',
  ERROR: '#f44336',
  MAINTENANCE: '#ff9800',
}

export default function SystemHealthCard({ devices = [] }) {
  const counts = devices.reduce((acc, d) => {
    const status = d.status || 'OFFLINE'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(counts).map(([status, count]) => ({
    id: status,
    label: status,
    value: count,
    color: statusColors[status] || '#757575',
  }))

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>System Health</Typography>
      {pieData.length === 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
          <Typography variant="body2" color="text.secondary">No devices registered</Typography>
        </Box>
      ) : (
        <Box sx={{ height: 260 }}>
          <ResponsivePie
            data={pieData}
            margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
            innerRadius={0.55}
            padAngle={2}
            cornerRadius={4}
            colors={{ datum: 'data.color' }}
            borderWidth={0}
            enableArcLinkLabels={false}
            arcLabelsSkipAngle={20}
            arcLabelsTextColor="#fff"
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: 36,
                itemWidth: 90,
                itemHeight: 18,
                itemTextColor: '#999',
                symbolSize: 10,
                symbolShape: 'circle',
              },
            ]}
            theme={{
              text: { fill: '#ccc' },
            }}
          />
        </Box>
      )}
    </Paper>
  )
}
