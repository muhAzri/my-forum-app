import type { ReactNode } from 'react';

import type { IBaseCard } from '../../types/ICard';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

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