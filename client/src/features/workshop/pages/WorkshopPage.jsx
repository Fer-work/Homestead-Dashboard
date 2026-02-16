import HandymanIcon from '@mui/icons-material/Handyman'
import ComingSoonPage from '../../../components/ComingSoonPage.jsx'

export default function WorkshopPage() {
  return (
    <ComingSoonPage
      title="Workshop"
      subtitle="3D printing, CNC, electronics lab, welding, fabrication"
      icon={HandymanIcon}
      features={[
        '3D printer queue and status monitoring',
        'CNC job tracking',
        'Electronics lab inventory',
        'Tool checkout and maintenance logs',
        'Welding station usage',
        'Parts and material inventory management',
      ]}
    />
  )
}
