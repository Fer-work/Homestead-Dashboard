import CellTowerIcon from '@mui/icons-material/CellTower'
import ComingSoonPage from '../../../components/ComingSoonPage.jsx'

export default function CommsPage() {
  return (
    <ComingSoonPage
      title="Comms / AI"
      subtitle="LoRa mesh network, local AI server, encrypted communications"
      icon={CellTowerIcon}
      features={[
        'LoRa mesh network topology visualization',
        'Node signal strength and battery levels',
        'Local AI inference server status',
        'Encrypted messaging system',
        'Offline knowledge library access',
        'Network traffic and bandwidth monitoring',
      ]}
    />
  )
}
