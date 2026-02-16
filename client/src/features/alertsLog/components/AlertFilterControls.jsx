import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const statuses = ['', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED']
const severities = ['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']

export default function AlertFilterControls({ status, severity, onStatusChange, onSeverityChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Status</InputLabel>
        <Select value={status} label="Status" onChange={(e) => onStatusChange(e.target.value)}>
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>{s || 'All'}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Severity</InputLabel>
        <Select value={severity} label="Severity" onChange={(e) => onSeverityChange(e.target.value)}>
          {severities.map((s) => (
            <MenuItem key={s} value={s}>{s || 'All'}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
