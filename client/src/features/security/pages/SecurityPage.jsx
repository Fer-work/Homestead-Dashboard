import ShieldIcon from '@mui/icons-material/Shield'
import ComingSoonPage from '../../../components/ComingSoonPage.jsx'

export default function SecurityPage() {
  return (
    <ComingSoonPage
      title="Defense"
      subtitle="Sensor mesh, deterrence systems, autonomous patrol, aerial recon"
      icon={ShieldIcon}
      features={[
        'Perimeter sensor mesh monitoring',
        'Motion detection event log',
        'Deterrence system controls',
        'Autonomous patrol rover status',
        'Aerial recon drone feeds',
        'Hardened core access management',
      ]}
    />
  )
}
