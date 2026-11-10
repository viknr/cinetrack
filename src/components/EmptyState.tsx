import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  role?: 'status' | 'alert'
  className?: string
}

export function EmptyState({ title, description, icon, action, role, className = '' }: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`.trim()} role={role}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}
