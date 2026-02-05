import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PricingTier {
  level: string;
  price: string;
  turnaround: string;
  features: string[];
  popular?: boolean;
}

interface IndustryPricingTableProps {
  tiers: PricingTier[];
}

export default function IndustryPricingTable({ tiers }: IndustryPricingTableProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {tiers.map((tier, index) => (
        <Card 
          key={index} 
          className={`p-8 relative ${tier.popular ? 'border-secondary border-2 shadow-lg' : ''}`}
        >
          {tier.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{tier.level}</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold font-gold-brand">{tier.price}</span>
            </div>
            <p className="text-muted-foreground">Turnaround: {tier.turnaround}</p>
          </div>
          <ul className="space-y-3 mb-6">
            {tier.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
