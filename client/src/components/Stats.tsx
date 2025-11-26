import { Award, TrendingUp, Clock } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: Award,
      value: "17+ Years",
      label: "Professional Experience",
      description: "Crafting résumés, cover letters, and LinkedIn profiles for clients at all career stages",
      image: "/consultation.jpg"
    },
    {
      icon: TrendingUp,
      value: "96%",
      label: "Interview Success Rate",
      description: "Our clients consistently land interviews and secure their dream roles",
      image: "/success-image.jpg"
    },
    {
      icon: Clock,
      value: "3-5 Days",
      label: "Average Turnaround",
      description: "Fast delivery without compromising quality. Express options available",
      image: "/team-work.webp"
    }
  ];

  return (
    <section className="py-20 bg-accent">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
            Proven Results That Speak for Themselves
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We don't just write résumés—we create career-changing documents that get you noticed by hiring managers and recruiters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={stat.image} 
                    alt={stat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 text-white">
                      <div className="bg-secondary p-2 rounded-lg">
                        <Icon className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
