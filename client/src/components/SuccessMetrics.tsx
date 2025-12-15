import { TrendingUp, Users, DollarSign, Briefcase } from 'lucide-react';
import { Card } from './ui/card';
import { useCountUp } from '@/hooks/useCountUp';

function AnimatedMetric({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const { ref, count } = useCountUp({ end: value, duration: 2000, suffix, prefix });
  return <div ref={ref}>{count}</div>;
}

export default function SuccessMetrics() {
  const metrics = [
    {
      icon: Briefcase,
      label: "Professional Experience",
      value: "18+",
      suffix: " Years",
      trend: "Crafting career-defining resumes",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      label: "Satisfied Clients",
      value: "5,000+",
      suffix: "",
      trend: "Across all industries & career levels",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: TrendingUp,
      label: "Interview Success Rate",
      value: "96%",
      suffix: "",
      trend: "Clients securing interviews",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: DollarSign,
      label: "Average Salary Increase",
      value: "35%",
      suffix: "",
      trend: "Based on client feedback",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Proven Track Record of Success</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our commitment to excellence is reflected in our long-standing reputation and consistent results across thousands of successful career transitions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${metric.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${metric.color}`}>
                    {metric.value.includes('%') ? (
                      <AnimatedMetric value={parseInt(metric.value)} suffix="%" />
                    ) : metric.value.includes('+') ? (
                      <>{metric.value}</>
                    ) : (
                      <AnimatedMetric value={parseInt(metric.value)} suffix={metric.suffix} />
                    )}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.trend}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground italic">
            * Statistics based on historical client feedback, surveys, and success tracking. Individual results may vary based on industry, experience level, and market conditions.
          </p>
        </div>
      </div>
    </section>
  );
}
