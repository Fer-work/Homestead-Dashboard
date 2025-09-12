// features/aquaponics/pages/AquaponicsPage.jsx
import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import WaterIcon from "@mui/icons-material/Water";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WaterLevelGauge from "../components/WaterLevelGauge";
import WaterLevelChart from "../components/WaterLevelChart";

// Styled components
const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}15 0%, 
    ${theme.palette.secondary.main}15 100%)`,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const AquaponicsPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Page Header */}
      <PageHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <DashboardIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Aquaponics System
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Monitor your water levels, temperature, and system health in
              real-time
            </Typography>
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip
            icon={<WaterIcon />}
            label="Water Level Monitoring"
            variant="outlined"
            color="primary"
          />
          <Chip label="Real-time Data" variant="outlined" color="success" />
          <Chip label="Ultrasonic Sensor" variant="outlined" />
        </Box>
      </PageHeader>

      {/* Main Dashboard Grid */}
      <Grid container spacing={3}>
        {/* Water Level Gauge */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <WaterLevelGauge refreshInterval={30000} />
        </Grid>

        {/* Water Level Chart */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <WaterLevelChart height={350} />
        </Grid>

        {/* System Status Cards */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
            System Status
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard elevation={1}>
                <WaterIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" component="div">
                  Sump Tank
                </Typography>
                <Chip
                  label="Active"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Water level monitoring
                </Typography>
              </StatsCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard elevation={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "warning.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px auto",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  pH
                </Box>
                <Typography variant="h6" component="div">
                  pH Monitor
                </Typography>
                <Chip
                  label="Coming Soon"
                  color="default"
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Water acidity levels
                </Typography>
              </StatsCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard elevation={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "info.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px auto",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  �C
                </Box>
                <Typography variant="h6" component="div">
                  Temperature
                </Typography>
                <Chip
                  label="Coming Soon"
                  color="default"
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Water temperature
                </Typography>
              </StatsCard>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatsCard elevation={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px auto",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  O�
                </Box>
                <Typography variant="h6" component="div">
                  Dissolved Oxygen
                </Typography>
                <Chip
                  label="Coming Soon"
                  color="default"
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Fish tank oxygen levels
                </Typography>
              </StatsCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Future Features Section */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{ p: 3, mt: 2, border: "2px dashed", borderColor: "divider" }}
          >
            <Typography variant="h6" component="h3" gutterBottom>
              =� Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              The Dragon Natura Homestead monitoring system is actively under
              development. Future features will include:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                " pH monitoring and automatic adjustment alerts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                " Temperature monitoring for fish tanks and grow beds
              </Typography>
              <Typography variant="body2" color="text.secondary">
                " Dissolved oxygen level tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                " Pump status monitoring and control
              </Typography>
              <Typography variant="body2" color="text.secondary">
                " Automated feeding schedules
              </Typography>
              <Typography variant="body2" color="text.secondary">
                " Mobile alerts for critical system events
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AquaponicsPage;
