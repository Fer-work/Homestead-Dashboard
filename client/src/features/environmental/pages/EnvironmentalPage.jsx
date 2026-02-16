import WaterDropIcon from '@mui/icons-material/WaterDrop'
import ComingSoonPage from '../../../components/ComingSoonPage.jsx'

export default function EnvironmentalPage() {
  return (
    <ComingSoonPage
      title="Water Management"
      subtitle="Rainwater harvesting, greywater recycling, biosand filtration"
      icon={WaterDropIcon}
      features={[
        'Rainwater collection volume tracking',
        'Cistern level monitoring',
        'Greywater recycling system status',
        'Biosand filter flow rate monitoring',
        'Atmospheric water generator output',
        'Water quality metrics (TDS, turbidity)',
      ]}
    />
  )
}
