import SettingsIcon from '@mui/icons-material/Settings'
import ComingSoonPage from '../../../components/ComingSoonPage.jsx'

export default function SettingsPage() {
  return (
    <ComingSoonPage
      title="Settings"
      subtitle="System configuration and user preferences"
      icon={SettingsIcon}
      features={[
        'User profile management',
        'Notification preferences',
        'System-wide alert thresholds',
        'Device auto-discovery settings',
        'Data retention policies',
        'API key management',
      ]}
    />
  )
}
