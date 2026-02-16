// features/aquaponics/components/WaterLevelChart.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ButtonGroup,
  Button,
  Skeleton,
  Alert,
  Stack,
} from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useGetWaterLevelHistoryQuery } from '../aquaponicsApi';

const timeRanges = [
  { label: '6H', hours: 6 },
  { label: '24H', hours: 24 },
  { label: '3D', hours: 72 },
  { label: '7D', hours: 168 },
];

const WaterLevelChart = ({ height = 300 }) => {
  const [selectedRange, setSelectedRange] = useState(24);

  const { 
    data, 
    error, 
    isLoading 
  } = useGetWaterLevelHistoryQuery(selectedRange, {
    pollingInterval: 60000, // Refresh every minute
  });

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            Error loading chart data. Please check your connection.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="rectangular" height={height} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const readings = data?.data || [];
  
  // Transform data for Nivo
  const chartData = [{
    id: 'water_level',
    color: '#2196f3',
    data: readings.map(reading => ({
      x: new Date(reading.recordedAt),
      y: reading.value
    }))
  }];

  // Custom theme for the chart
  const chartTheme = {
    background: 'transparent',
    text: {
      fontSize: 12,
      fill: '#666666',
    },
    axis: {
      domain: {
        line: {
          stroke: '#e0e0e0',
          strokeWidth: 1,
        },
      },
      ticks: {
        line: {
          stroke: '#e0e0e0',
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: '#666666',
        },
      },
    },
    grid: {
      line: {
        stroke: '#f0f0f0',
        strokeWidth: 1,
      },
    },
    tooltip: {
      container: {
        background: '#ffffff',
        color: '#333333',
        fontSize: 12,
        borderRadius: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
    },
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <TimelineIcon color="primary" />
              <Typography variant="h6" component="h2">
                Water Level History
              </Typography>
            </Box>
            
            {/* Time Range Selector */}
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

          {/* Chart */}
          <Box height={height}>
            {chartData[0].data.length > 0 ? (
              <ResponsiveLine
                data={chartData}
                theme={chartTheme}
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                xScale={{
                  type: 'time',
                  format: 'native',
                }}
                xFormat="time:%Y-%m-%d %H:%M"
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false,
                }}
                yFormat=" >-.1f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  format: selectedRange <= 24 ? '%H:%M' : '%m/%d',
                  tickValues: selectedRange <= 6 ? 'every 30 minutes' :
                             selectedRange <= 24 ? 'every 2 hours' :
                             selectedRange <= 72 ? 'every 8 hours' : 'every day',
                  legend: 'Time',
                  legendOffset: 45,
                  legendPosition: 'middle',
                }}
                axisLeft={{
                  legend: 'Water Level (cm)',
                  legendOffset: -45,
                  legendPosition: 'middle',
                }}
                pointSize={selectedRange <= 24 ? 4 : 2}
                pointColor={{ from: 'color' }}
                pointBorderWidth={1}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableGridX={true}
                enableGridY={true}
                colors={['#2196f3']}
                lineWidth={2}
                enableArea={true}
                areaOpacity={0.1}
                tooltip={({ point }) => (
                  <div
                    style={{
                      background: 'white',
                      padding: '8px 12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <div><strong>Water Level: {point.data.y.toFixed(1)} cm</strong></div>
                    <div>Time: {new Date(point.data.x).toLocaleString()}</div>
                  </div>
                )}
                animate={true}
                motionConfig="gentle"
              />
            ) : (
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                height="100%"
                color="text.secondary"
              >
                <Typography>No data available for the selected time range</Typography>
              </Box>
            )}
          </Box>

          {/* Data Summary */}
          {data?.summary && (
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Showing {data.summary.count} readings from the last {data.summary.timeRange}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WaterLevelChart;