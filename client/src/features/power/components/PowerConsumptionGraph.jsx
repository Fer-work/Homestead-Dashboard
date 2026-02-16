import { useState } from 'react'
import {
  Paper,
  Typography,
  Box,
  ButtonGroup,
  Button,
  Skeleton,
  Stack,
} from '@mui/material'
import TimelineIcon from '@mui/icons-material/Timeline'
import { ResponsiveLine } from '@nivo/line'
import { useGetEnergyReadingsQuery } from '../powerApi.js'

const timeRanges = [
  { label: '6H', hours: 6 },
  { label: '24H', hours: 24 },
  { label: '3D', hours: 72 },
  { label: '7D', hours: 168 },
]

export default function PowerConsumptionGraph() {
  const [selectedRange, setSelectedRange] = useState(24)

  const { data, isLoading } = useGetEnergyReadingsQuery(
    { hours: selectedRange },
    { pollingInterval: 60000 },
  )

  const readings = data?.data || []

  // Group by sensorType for multi-line chart
  const grouped = readings.reduce((acc, r) => {
    if (!acc[r.sensorType]) acc[r.sensorType] = []
    acc[r.sensorType].push({ x: new Date(r.recordedAt), y: r.value })
    return acc
  }, {})

  const lineColors = { POWER: '#ff9800', VOLTAGE: '#2196f3', CURRENT: '#4caf50', ENERGY: '#9c27b0' }
  const chartData = Object.entries(grouped).map(([type, points]) => ({
    id: type,
    data: points,
  }))

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <TimelineIcon color="warning" />
            <Typography variant="h6">Energy Readings</Typography>
          </Box>
          <ButtonGroup size="small" variant="outlined">
            {timeRanges.map((range) => (
              <Button
                key={range.hours}
                variant={selectedRange === range.hours ? 'contained' : 'outlined'}
                onClick={() => setSelectedRange(range.hours)}
              >
                {range.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Box sx={{ height: 350 }}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={350} />
          ) : chartData.length === 0 || chartData.every((s) => s.data.length === 0) ? (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <Typography variant="body2" color="text.secondary">
                No energy readings for the selected time range
              </Typography>
            </Box>
          ) : (
            <ResponsiveLine
              data={chartData}
              margin={{ top: 20, right: 100, bottom: 60, left: 60 }}
              xScale={{ type: 'time', format: 'native' }}
              xFormat="time:%Y-%m-%d %H:%M"
              yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
              yFormat=" >-.1f"
              axisBottom={{
                format: selectedRange <= 24 ? '%H:%M' : '%m/%d',
                tickValues: selectedRange <= 6 ? 'every 30 minutes' : selectedRange <= 24 ? 'every 2 hours' : selectedRange <= 72 ? 'every 8 hours' : 'every day',
                legend: 'Time',
                legendOffset: 45,
                legendPosition: 'middle',
              }}
              axisLeft={{
                legend: 'Value',
                legendOffset: -50,
                legendPosition: 'middle',
              }}
              colors={(d) => lineColors[d.id] || '#ccc'}
              lineWidth={2}
              pointSize={selectedRange <= 24 ? 3 : 1}
              useMesh
              enableArea={false}
              legends={[
                {
                  anchor: 'bottom-right',
                  direction: 'column',
                  translateX: 90,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemTextColor: '#999',
                  symbolSize: 10,
                  symbolShape: 'circle',
                },
              ]}
              theme={{
                text: { fill: '#ccc' },
                axis: { ticks: { text: { fill: '#999' } }, legend: { text: { fill: '#999' } } },
                grid: { line: { stroke: '#333' } },
              }}
              animate
              motionConfig="gentle"
            />
          )}
        </Box>

        {data?.summary && (
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Showing {data.summary.count} readings from the last {data.summary.timeRange}
          </Typography>
        )}
      </Stack>
    </Paper>
  )
}
