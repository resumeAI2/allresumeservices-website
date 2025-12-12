import { TrendingUp, Users, DollarSign, Briefcase } from 'lucide-react';
import { Card } from './ui/card';
import { useCountUp } from '@/hooks/useCountUp';

function AnimatedMetric({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const { ref, count } = useCountUp({ end: value, duration: 2000, suffix, prefix });
  return <div ref={ref}>{count}</div>;
}

export default function SuccessMetrics() {
  // Simulated real-time metrics (in production, these would come from your database)
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  const metrics = [
    {
      icon: Briefcase,
      label: `Resumes Written in ${currentMonth}`,
      value: "127",
      trend: "+23% from last month",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: DollarSign,
      label: "Average Salary Increase",
      value: "35%",
      trend: "Based on client feedback",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: TrendingUp,
      label: "Interview Success Rate",
      value: "96%",
      trend: "Clients securing interviews",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Users,
      label: "Active Clients This Week",
      value: "43",
      trend: "Currently in progress",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Real Results, Real Time</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our commitment to transparency means sharing our success metrics with you. These numbers update regularly and reflect our ongoing client work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${metric.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  <div className={`text-4xl font-bold mb-2 ${metric.color}`}>
                    {metric.value.includes('%') ? (
                      <AnimatedMetric value={parseInt(metric.value)} suffix="%" />
                    ) : (
                      <AnimatedMetric value={parseInt(metric.value)} />
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
            * Metrics based on client feedback, surveys, and project tracking. Individual results may vary based on industry, experience level, and market conditions.
          </p>
        </div>
      </div>
    </section>
  );
}
