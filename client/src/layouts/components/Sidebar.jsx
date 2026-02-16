import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import navConfig from '../../routes/navConfig.js'

const DRAWER_WIDTH = 260
const DRAWER_COLLAPSED = 72

export { DRAWER_WIDTH, DRAWER_COLLAPSED }

export default function Sidebar({ open, collapsed, onClose }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const width = collapsed && !isMobile ? DRAWER_COLLAPSED : DRAWER_WIDTH

  const drawerContent = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar sx={{ px: collapsed && !isMobile ? 1.5 : 2, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start' }}>
        {(!collapsed || isMobile) ? (
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            Dragon Sovereign
          </Typography>
        ) : (
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            DS
          </Typography>
        )}
      </Toolbar>

      {navConfig.map((section) => (
        <List
          key={section.group}
          subheader={
            !collapsed || isMobile ? (
              <ListSubheader
                sx={{
                  bgcolor: 'transparent',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  color: 'text.disabled',
                  lineHeight: 3,
                }}
              >
                {section.group}
              </ListSubheader>
            ) : (
              <Box sx={{ height: 12 }} />
            )
          }
          disablePadding
        >
          {section.items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <ListItemButton
                key={item.path}
                selected={isActive}
                onClick={() => {
                  navigate(item.path)
                  if (isMobile) onClose()
                }}
                sx={{
                  mx: 1,
                  borderRadius: 1.5,
                  mb: 0.3,
                  minHeight: 44,
                  justifyContent: collapsed && !isMobile ? 'center' : 'initial',
                  px: collapsed && !isMobile ? 1.5 : 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.dark',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed && !isMobile ? 0 : 2,
                    justifyContent: 'center',
                    color: isActive ? 'primary.light' : 'text.secondary',
                  }}
                >
                  <Icon fontSize="small" />
                </ListItemIcon>
                {(!collapsed || isMobile) && (
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                )}
              </ListItemButton>
            )
          })}
        </List>
      ))}
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1)',
        '& .MuiDrawer-paper': {
          width,
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1)',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
