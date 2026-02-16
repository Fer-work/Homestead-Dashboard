import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Box,
} from '@mui/material'
import SolarPowerIcon from '@mui/icons-material/SolarPower'
import { useGetSolarArraysQuery } from '../powerApi.js'

export default function SolarInputCard() {
  const { data, isLoading } = useGetSolarArraysQuery()
  const arrays = data?.data || []

  return (
    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SolarPowerIcon color="warning" />
        <Typography variant="h6">Solar Arrays</Typography>
      </Box>

      {isLoading ? (
        <Box>
          {[...Array(3)].map((_, i) => <Skeleton key={i} height={40} />)}
        </Box>
      ) : arrays.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No solar arrays registered yet
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Panels</TableCell>
              <TableCell align="right">Wattage</TableCell>
              <TableCell>Zone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {arrays.map((arr) => (
              <TableRow key={arr.id} hover>
                <TableCell>{arr.name}</TableCell>
                <TableCell align="right">{arr.panelCount}</TableCell>
                <TableCell align="right">{arr.totalWattage} W</TableCell>
                <TableCell>{arr.zone?.name || '--'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  )
}
