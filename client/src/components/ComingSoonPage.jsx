import { Container, Typography, Box, Paper, Stack, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'
import ConstructionIcon from '@mui/icons-material/Construction'

const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}))

export default function ComingSoonPage({ title, subtitle, icon: Icon, features = [] }) {
  const HeaderIcon = Icon || ConstructionIcon

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <HeaderIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip label="Coming Soon" variant="outlined" color="warning" />
        </Box>
      </PageHeader>

      <Paper sx={{ p: 3, border: '2px dashed', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Planned Features
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This domain is under active development. ESP32 hardware is on the way.
        </Typography>
        {features.length > 0 && (
          <Stack spacing={1}>
            {features.map((feature) => (
              <Typography key={feature} variant="body2" color="text.secondary">
                &bull; {feature}
              </Typography>
            ))}
          </Stack>
        )}
      </Paper>
    </Container>
  )
}
