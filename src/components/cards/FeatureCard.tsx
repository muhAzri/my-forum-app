import { BaseCard } from '@/components/base/BaseCard';
import type { IActionableCard, IContentCard } from '@/components/interfaces/ICard';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface FeatureCardData extends IActionableCard, IContentCard {
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
}

interface FeatureCardProps {
  data: FeatureCardData
}

export function FeatureCard({ data }: FeatureCardProps) {
  const { title, description, content, buttonText, buttonVariant = 'default', onButtonClick } = data;

  const footer = (
    <CardFooter>
      <Button onClick={onButtonClick} variant={buttonVariant}>
        {buttonText}
      </Button>
    </CardFooter>
  );

  return (
    <BaseCard description={description} footer={footer} title={title}>
      <p>{content}</p>
    </BaseCard>
  );
}