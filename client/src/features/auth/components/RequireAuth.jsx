import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../authSlice.js'
import { PATHS } from '../../../routes/pathConstants.js'

export default function RequireAuth() {
  const token = useSelector(selectCurrentToken)
  const location = useLocation()

  if (!token) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
