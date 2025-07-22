import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { IBaseCard } from '@/components/interfaces/ICard'

interface BaseCardProps extends IBaseCard {
  children: ReactNode
  footer?: ReactNode
}

export function BaseCard({ title, description, children, footer }: BaseCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer}
    </Card>
  )
}