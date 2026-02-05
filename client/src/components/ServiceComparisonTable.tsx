import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ServiceFeature {
  name: string;
  basic: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
}

const features: ServiceFeature[] = [
  {
    name: "Professional Resume Writing",
    basic: true,
    standard: true,
    premium: true
  },
  {
    name: "ATS Optimization",
    basic: true,
    standard: true,
    premium: true
  },
  {
    name: "Cover Letter",
    basic: false,
    standard: true,
    premium: true
  },
  {
    name: "LinkedIn Profile Optimization",
    basic: false,
    standard: false,
    premium: true
  },
  {
    name: "Selection Criteria (per criterion)",
    basic: false,
    standard: "Add-on available",
    premium: "2 included"
  },
  {
    name: "Career Consultation (30 min)",
    basic: false,
    standard: false,
    premium: true
  },
  {
    name: "Revisions",
    basic: "1 round",
    standard: "2 rounds",
    premium: "Unlimited"
  },
  {
    name: "Turnaround Time",
    basic: "3-5 days",
    standard: "2-3 days",
    premium: "1-2 days"
  },
  {
    name: "Express Service Available",
    basic: "+$50",
    standard: "+$30",
    premium: "Included"
  },
  {
    name: "Interview Preparation Guide",
    basic: false,
    standard: false,
    premium: true
  },
  {
    name: "60-Day Guarantee",
    basic: true,
    standard: true,
    premium: true
  }
];

const tiers = [
  {
    name: "Basic",
    price: "$199",
    description: "Perfect for entry-level professionals",
    highlighted: false
  },
  {
    name: "Standard",
    price: "$349",
    description: "Most popular for mid-career professionals",
    highlighted: true
  },
  {
    name: "Premium",
    price: "$549",
    description: "Complete package for senior executives",
    highlighted: false
  }
];

export default function ServiceComparisonTable() {
  const [highlightedTier, setHighlightedTier] = useState<string | null>("Standard");

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-secondary mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground mx-auto" />
      );
    }
    return <span className="text-sm text-foreground">{value}</span>;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[768px]">
        {/* Header Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="col-span-1"></div>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`col-span-1 text-center p-6 rounded-t-lg transition-all cursor-pointer ${
                highlightedTier === tier.name
                  ? "bg-secondary/10 border-2 border-secondary scale-105 shadow-lg"
                  : "bg-card border border-border hover:border-secondary/50"
              }`}
              onMouseEnter={() => setHighlightedTier(tier.name)}
              onMouseLeave={() => setHighlightedTier("Standard")}
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
              <p className="text-3xl font-bold font-gold-brand mb-2">{tier.price}</p>
              <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
              <Button
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => window.location.href = "/#pricing"}
              >
                Choose {tier.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Rows */}
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid grid-cols-4 gap-4 items-center py-4 px-2 rounded-lg ${
                index % 2 === 0 ? "bg-muted/30" : "bg-background"
              }`}
            >
              <div className="col-span-1 font-medium text-foreground">
                {feature.name}
              </div>
              <div className={`col-span-1 text-center ${highlightedTier === "Basic" ? "bg-secondary/5 rounded" : ""}`}>
                {renderFeatureValue(feature.basic)}
              </div>
              <div className={`col-span-1 text-center ${highlightedTier === "Standard" ? "bg-secondary/5 rounded" : ""}`}>
                {renderFeatureValue(feature.standard)}
              </div>
              <div className={`col-span-1 text-center ${highlightedTier === "Premium" ? "bg-secondary/5 rounded" : ""}`}>
                {renderFeatureValue(feature.premium)}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="col-span-1"></div>
          {tiers.map((tier) => (
            <div key={tier.name} className="col-span-1 text-center">
              <Button
                variant="outline"
                className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                onClick={() => window.location.href = "/#pricing"}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
