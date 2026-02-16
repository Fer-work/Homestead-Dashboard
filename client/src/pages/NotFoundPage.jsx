import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '../routes/pathConstants.js'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: 'text.disabled' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate(PATHS.OVERVIEW)}>
        Back to Dashboard
      </Button>
    </Box>
  )
}
