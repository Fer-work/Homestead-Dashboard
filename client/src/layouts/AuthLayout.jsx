import { Box, Paper, Typography } from '@mui/material'
import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../features/auth/authSlice.js'
import { PATHS } from '../routes/pathConstants.js'
import logo from '../assets/Quetzal.png'

export default function AuthLayout() {
  const token = useSelector(selectCurrentToken)

  if (token) {
    return <Navigate to={PATHS.OVERVIEW} replace />
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #121212 0%, #1a237e 50%, #121212 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 440,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            component="img"
            src={logo}
            alt="Dragon Sovereign"
            sx={{ width: 80, height: 80, mb: 1 }}
          />
          <Typography variant="h5" fontWeight={700}>
            Dragon Sovereign
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Homestead Command Center
          </Typography>
        </Box>
        <Outlet />
      </Paper>
    </Box>
  )
}
