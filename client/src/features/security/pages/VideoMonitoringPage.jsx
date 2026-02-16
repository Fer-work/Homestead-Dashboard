import {
  Container,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import VideocamIcon from '@mui/icons-material/Videocam'
import { useGetDevicesQuery } from '../../deviceManagement/deviceManagementApi.js'
import CameraStream from '../components/CameraStream.jsx'

const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}))

export default function VideoMonitoringPage() {
  const { data, isLoading } = useGetDevicesQuery({ deviceType: 'CAMERA' })
  const cameras = data?.data || []

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <VideocamIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Video Monitoring
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Raspberry Pi camera feeds (MJPEG)
            </Typography>
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip label={`${cameras.length} cameras`} variant="outlined" color="primary" />
        </Box>
      </PageHeader>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : cameras.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <VideocamIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No cameras registered
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Register a device with type CAMERA to see its feed here
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cameras.map((camera) => (
            <Grid key={camera.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <CameraStream device={camera} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
