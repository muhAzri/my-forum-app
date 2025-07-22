import type { ReactNode } from 'react';

import type { IBaseCard } from '@/components/interfaces/ICard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  );
}