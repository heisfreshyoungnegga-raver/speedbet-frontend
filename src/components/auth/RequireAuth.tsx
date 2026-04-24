import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface RequireAuthProps {
  children: React.ReactNode
  roles?: ('USER' | 'ADMIN' | 'SUPER_ADMIN')[]
}

export default function RequireAuth({ children, roles }: RequireAuthProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
