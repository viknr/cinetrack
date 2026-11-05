import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

type ProtectedRouteProps = {
  isAuthenticated: boolean
  children: ReactNode
}

export function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
  const location = useLocation()
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" state={{ from: location }} replace />
}
