import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import { selectCurrentUser, logout } from '../../features/auth/authSlice.js'
import { useGetOverviewAlertsQuery } from '../../features/overview/overviewApi.js'
import { PATHS } from '../../routes/pathConstants.js'
import { DRAWER_WIDTH, DRAWER_COLLAPSED } from './Sidebar.jsx'

export default function Topbar({ sidebarOpen, collapsed, onToggleSidebar, onToggleCollapse }) {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const { data: alertsData } = useGetOverviewAlertsQuery(undefined, { pollingInterval: 60000 })
  const activeAlertCount = alertsData?.data?.length || 0

  const handleLogout = () => {
    setAnchorEl(null)
    dispatch(logout())
    navigate(PATHS.LOGIN)
  }

  const drawerWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1), margin-left 225ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Toolbar>
        {/* Mobile hamburger */}
        <IconButton
          edge="start"
          onClick={onToggleSidebar}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Desktop collapse toggle */}
        <IconButton
          edge="start"
          onClick={onToggleCollapse}
          sx={{ mr: 2, display: { xs: 'none', md: 'inline-flex' } }}
        >
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* Alerts badge */}
        <IconButton onClick={() => navigate(PATHS.ALERTS)} sx={{ mr: 1 }}>
          <Badge badgeContent={activeAlertCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* User avatar + menu */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{user?.username || 'User'}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role || 'Member'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate(PATHS.SETTINGS) }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
