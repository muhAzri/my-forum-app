import { FeatureCard } from '@/components/cards/FeatureCard';
import { StatsCard } from '@/components/cards/StatsCard';
import { Button } from '@/components/ui/button';
import { actionButtons, featureCards, statsCard } from '@/config/homePageConfig';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Forum</h1>
        <p className="text-muted-foreground text-lg">
          Join our community and start meaningful conversations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featureCards.map((cardData) => (
          <FeatureCard key={cardData.title} data={cardData} />
        ))}
        <StatsCard data={statsCard} />
      </div>

      <div className="text-center">
        {actionButtons.map((button) => (
          <Button
            key={button.text}
            className={button.className}
            onClick={button.onClick}
            size={button.size}
            variant={button.variant}
          >
            {button.text}
          </Button>
        ))}
      </div>
    </div>
  );
}