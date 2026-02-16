import { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Chip,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Switch,
  IconButton,
  Tooltip,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DeleteIcon from '@mui/icons-material/Delete'
import { useGetAlertsQuery, useGetAlertRulesQuery, useUpdateAlertRuleMutation, useDeleteAlertRuleMutation } from '../alertsLogApi.js'
import AlertLogTable from '../components/AlertLogTable.jsx'
import AlertFilterControls from '../components/AlertFilterControls.jsx'

const PageHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}))

export default function AlertsLogPage() {
  const [tab, setTab] = useState(0)
  const [status, setStatus] = useState('ACTIVE')
  const [severity, setSeverity] = useState('')

  const queryStatus = tab === 0 ? 'ACTIVE' : tab === 1 ? status : undefined
  const { data: alertsData, isLoading: alertsLoading } = useGetAlertsQuery(
    { status: tab === 0 ? 'ACTIVE' : (status || undefined), severity: severity || undefined },
  )
  const { data: rulesData, isLoading: rulesLoading } = useGetAlertRulesQuery(undefined, { skip: tab !== 2 })
  const [updateAlertRule] = useUpdateAlertRuleMutation()
  const [deleteAlertRule] = useDeleteAlertRuleMutation()

  const alerts = alertsData?.data || []
  const rules = rulesData?.data || []

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PageHeader>
        <Box display="flex" alignItems="center" gap={2}>
          <NotificationsIcon sx={{ fontSize: 40, color: 'error.main' }} />
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Alert Log
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Monitor and manage system alerts and rules
            </Typography>
          </Box>
        </Box>
        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
          <Chip label={`${alertsData?.total ?? 0} total`} variant="outlined" color="primary" />
        </Box>
      </PageHeader>

      <Paper sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Active Alerts" />
          <Tab label="All Alerts" />
          <Tab label="Alert Rules" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {/* Tabs 0 & 1: Alerts */}
          {tab < 2 && (
            <>
              {tab === 1 && (
                <AlertFilterControls
                  status={status}
                  severity={severity}
                  onStatusChange={setStatus}
                  onSeverityChange={setSeverity}
                />
              )}
              {alertsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <AlertLogTable alerts={alerts} />
              )}
            </>
          )}

          {/* Tab 2: Alert Rules */}
          {tab === 2 && (
            <>
              {rulesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : rules.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No alert rules configured</Typography>
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Sensor Type</TableCell>
                      <TableCell>Condition</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Enabled</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id} hover>
                        <TableCell>{rule.name}</TableCell>
                        <TableCell>{rule.sensorType}</TableCell>
                        <TableCell>
                          {rule.condition} {rule.threshold}
                          {rule.condition === 'between' && ` - ${rule.thresholdHigh}`}
                        </TableCell>
                        <TableCell>
                          <Chip label={rule.severity} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Switch
                            size="small"
                            checked={rule.enabled}
                            onChange={() => updateAlertRule({ id: rule.id, enabled: !rule.enabled })}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => deleteAlertRule(rule.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Container>
  )
}
