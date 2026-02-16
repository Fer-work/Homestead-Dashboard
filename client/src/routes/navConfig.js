import DashboardIcon from '@mui/icons-material/Dashboard'
import BoltIcon from '@mui/icons-material/Bolt'
import SetMealIcon from '@mui/icons-material/SetMeal'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import CellTowerIcon from '@mui/icons-material/CellTower'
import ShieldIcon from '@mui/icons-material/Shield'
import HandymanIcon from '@mui/icons-material/Handyman'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DevicesIcon from '@mui/icons-material/Devices'
import VideocamIcon from '@mui/icons-material/Videocam'
import SettingsIcon from '@mui/icons-material/Settings'
import { PATHS } from './pathConstants.js'

const navConfig = [
  {
    group: 'MAIN',
    items: [
      { title: 'Overview', path: PATHS.OVERVIEW, icon: DashboardIcon },
    ],
  },
  {
    group: 'DOMAINS',
    items: [
      { title: 'Energy', path: PATHS.ENERGY, icon: BoltIcon },
      { title: 'Food', path: PATHS.AQUAPONICS, icon: SetMealIcon },
      { title: 'Water', path: PATHS.WATER, icon: WaterDropIcon },
      { title: 'Comms/AI', path: PATHS.COMMS, icon: CellTowerIcon },
      { title: 'Defense', path: PATHS.DEFENSE, icon: ShieldIcon },
      { title: 'Workshop', path: PATHS.WORKSHOP, icon: HandymanIcon },
    ],
  },
  {
    group: 'OPERATIONS',
    items: [
      { title: 'Alerts', path: PATHS.ALERTS, icon: NotificationsIcon },
      { title: 'Devices', path: PATHS.DEVICES, icon: DevicesIcon },
      { title: 'Video', path: PATHS.VIDEO, icon: VideocamIcon },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { title: 'Settings', path: PATHS.SETTINGS, icon: SettingsIcon },
    ],
  },
]

export default navConfig
