import { TrendingUp, Users, Award, Target } from 'lucide-react';
import { Card } from './ui/card';

export default function IndustryStatistics() {
  const statistics = [
    {
      icon: TrendingUp,
      value: "96%",
      label: "Interview Success Rate",
      description: "Of our clients secure interviews within 3 weeks",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      value: "5,000+",
      label: "Professionals Helped",
      description: "Across all industries and career levels",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Award,
      value: "35%",
      label: "Average Salary Increase",
      description: "Reported by clients after securing new roles",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Target,
      value: "2-3 Days",
      label: "Average Turnaround",
      description: "Fast, professional service without compromising quality",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const industryBreakdown = [
    { industry: "Mining & Resources", percentage: 28, clients: "1,400+" },
    { industry: "Banking & Finance", percentage: 22, clients: "1,100+" },
    { industry: "Healthcare", percentage: 18, clients: "900+" },
    { industry: "Government & Public Sector", percentage: 15, clients: "750+" },
    { industry: "IT & Technology", percentage: 12, clients: "600+" },
    { industry: "Other Industries", percentage: 5, clients: "250+" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Industry-Leading Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our data-driven approach delivers measurable results across Australia's top industries. 
            Here's what our clients achieve with professionally crafted resumes.
          </p>
        </div>

        {/* Key Statistics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Industry Breakdown */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Our Clients by Industry
          </h3>
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="space-y-6">
              {industryBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">{item.industry}</span>
                    <span className="text-muted-foreground">{item.clients} clients</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-primary">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">Total Clients Served</span>
                <span className="text-2xl font-bold text-primary">5,000+</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Since 2008, we've helped professionals across all industries achieve their career goals
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-12 max-w-4xl mx-auto">
          * Statistics based on client feedback surveys, testimonials, and follow-up communications from 2020-2024. 
          Interview success rate calculated from clients who reported interview outcomes within 90 days of receiving their resume. 
          Salary increase data based on self-reported information from clients who secured new positions. 
          Individual results may vary based on qualifications, experience, market conditions, and industry demand.
        </p>
      </div>
    </section>
  );
}
