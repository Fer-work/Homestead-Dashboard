import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PATHS } from './pathConstants.js'

import AuthLayout from '../layouts/AuthLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import MinimalLayout from '../layouts/MinimalLayout.jsx'
import RequireAuth from '../features/auth/components/RequireAuth.jsx'

import LoginPage from '../features/auth/pages/LoginPage.jsx'
import OverviewDashboardPage from '../features/overview/pages/OverviewDashboardPage.jsx'
import PowerManagementPage from '../features/power/pages/PowerManagementPage.jsx'
import AquaponicsPage from '../features/aquaponics/pages/AquaponicsPage.jsx'
import EnvironmentalPage from '../features/environmental/pages/EnvironmentalPage.jsx'
import CommsPage from '../features/comms/pages/CommsPage.jsx'
import SecurityPage from '../features/security/pages/SecurityPage.jsx'
import WorkshopPage from '../features/workshop/pages/WorkshopPage.jsx'
import AlertsLogPage from '../features/alertsLog/pages/AlertsLogPage.jsx'
import DeviceManagementPage from '../features/deviceManagement/pages/DeviceManagementPage.jsx'
import DeviceDetailPage from '../features/deviceManagement/pages/DeviceDetailPage.jsx'
import VideoMonitoringPage from '../features/security/pages/VideoMonitoringPage.jsx'
import SettingsPage from '../features/settings/pages/SettingsPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: PATHS.LOGIN, element: <LoginPage /> },
      { path: PATHS.REGISTER, element: <LoginPage initialTab={1} /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: PATHS.OVERVIEW, element: <OverviewDashboardPage /> },
          { path: PATHS.ENERGY, element: <PowerManagementPage /> },
          { path: PATHS.AQUAPONICS, element: <AquaponicsPage /> },
          { path: PATHS.WATER, element: <EnvironmentalPage /> },
          { path: PATHS.COMMS, element: <CommsPage /> },
          { path: PATHS.DEFENSE, element: <SecurityPage /> },
          { path: PATHS.WORKSHOP, element: <WorkshopPage /> },
          { path: PATHS.ALERTS, element: <AlertsLogPage /> },
          { path: PATHS.DEVICES, element: <DeviceManagementPage /> },
          { path: PATHS.DEVICE_DETAIL, element: <DeviceDetailPage /> },
          { path: PATHS.VIDEO, element: <VideoMonitoringPage /> },
          { path: PATHS.SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <MinimalLayout />,
    children: [
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
