import { useState } from 'react'
import { Card, CardHeader, CardContent, Box, Typography, Chip } from '@mui/material'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'

export default function CameraStream({ device }) {
  const [imgError, setImgError] = useState(false)
  const streamUrl = device.metadata?.streamUrl

  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
      <CardHeader
        avatar={<VideocamIcon />}
        title={device.name}
        subheader={device.zone?.name}
        action={
          <Chip
            label={device.status}
            color={device.status === 'ONLINE' ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Box
          sx={{
            width: '100%',
            aspectRatio: '16 / 9',
            bgcolor: '#000',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {!streamUrl ? (
            <Box sx={{ textAlign: 'center' }}>
              <VideocamOffIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.disabled">
                No stream URL configured
              </Typography>
            </Box>
          ) : imgError ? (
            <Box sx={{ textAlign: 'center' }}>
              <VideocamOffIcon sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
              <Typography variant="body2" color="error.main">
                Stream unavailable
              </Typography>
            </Box>
          ) : (
            <Box
              component="img"
              src={streamUrl}
              alt={`${device.name} stream`}
              onError={() => setImgError(true)}
              sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
