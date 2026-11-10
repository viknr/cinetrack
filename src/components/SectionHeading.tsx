import type { ReactNode } from 'react'

type SectionHeadingProps = {
  kicker: string
  title: string
  action?: ReactNode
}

export function SectionHeading({ kicker, title, action }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div><p className="section-kicker">{kicker}</p><h2>{title}</h2></div>
      {action && <div className="section-actions">{action}</div>}
    </div>
  )
}
