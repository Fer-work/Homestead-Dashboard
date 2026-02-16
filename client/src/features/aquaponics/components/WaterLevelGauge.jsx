// features/aquaponics/components/WaterLevelGauge.jsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Skeleton,
  Alert,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WaterIcon from '@mui/icons-material/Water';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useGetLatestWaterLevelQuery, useGetAquaponicsStatsQuery } from '../aquaponicsApi';

// Styled components for the gauge
const GaugeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(180deg, 
    ${theme.palette.primary.light}20 0%, 
    ${theme.palette.primary.main}40 100%)`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const WaterFill = styled(Box)(({ level, theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: `${Math.max(5, Math.min(95, level))}%`,
  background: `linear-gradient(0deg, 
    ${theme.palette.info.dark} 0%, 
    ${theme.palette.info.main} 50%, 
    ${theme.palette.info.light} 100%)`,
  transition: 'height 0.8s ease-in-out',
  opacity: 0.8,
}));

const GaugeText = styled(Typography)(({ theme }) => ({
  position: 'relative',
  zIndex: 10,
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
}));

const getStatusColor = (status) => {
  switch (status) {
    case 'low': return 'error';
    case 'high': return 'warning';
    case 'normal': return 'success';
    default: return 'default';
  }
};

const getStatusIcon = (current, previous) => {
  if (!previous) return null;
  const diff = parseFloat(current) - parseFloat(previous);
  if (Math.abs(diff) < 0.5) return null; // No significant change
  return diff > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />;
};

const WaterLevelGauge = ({ refreshInterval = 30000 }) => {
  const { 
    data: latestData, 
    error: latestError, 
    isLoading: latestLoading,
    refetch: refetchLatest 
  } = useGetLatestWaterLevelQuery(undefined, {
    pollingInterval: refreshInterval,
  });

  const { 
    data: statsData, 
    error: statsError, 
    isLoading: statsLoading 
  } = useGetAquaponicsStatsQuery(undefined, {
    pollingInterval: refreshInterval,
  });

  if (latestError || statsError) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            Error loading water level data. Please check your connection.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (latestLoading || statsLoading) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" width="40%" />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const currentReading = latestData?.data;
  const stats = statsData?.data;
  const currentLevel = currentReading ? currentReading.value : 0;
  const status = stats?.status || 'unknown';
  
  // Convert cm to percentage (assuming 0-150cm range)
  const levelPercentage = Math.max(0, Math.min(100, (currentLevel / 150) * 100));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <WaterIcon color="primary" />
              <Typography variant="h6" component="h2">
                Water Level
              </Typography>
            </Box>
            <Chip 
              label={status.toUpperCase()} 
              color={getStatusColor(status)}
              size="small"
              icon={getStatusIcon(currentLevel, stats?.last24Hours?.avg_level)}
            />
          </Box>

          {/* Gauge */}
          <GaugeContainer>
            <WaterFill level={levelPercentage} />
            <GaugeText variant="h4">
              {currentLevel.toFixed(1)} cm
            </GaugeText>
          </GaugeContainer>

          {/* Stats */}
          {stats?.last24Hours && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  24h Average
                </Typography>
                <Typography variant="h6">
                  {parseFloat(stats.last24Hours.avg_level || 0).toFixed(1)} cm
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Range (24h)
                </Typography>
                <Typography variant="h6">
                  {parseFloat(stats.last24Hours.min_level || 0).toFixed(1)} - {parseFloat(stats.last24Hours.max_level || 0).toFixed(1)} cm
                </Typography>
              </Box>
            </Box>
          )}

          {/* Last Updated */}
          {currentReading?.recordedAt && (
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Last updated: {formatDate(currentReading.recordedAt)}
            </Typography>
          )}

          {/* Progress Bar */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tank Capacity
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={levelPercentage} 
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Box display="flex" justifyContent="space-between" mt={0.5}>
              <Typography variant="caption">0 cm</Typography>
              <Typography variant="caption">150 cm</Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WaterLevelGauge;