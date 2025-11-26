import { FileSearch, DollarSign, ClipboardList, PenTool, CheckCircle } from "lucide-react";

export default function Process() {
  const steps = [
    {
      icon: FileSearch,
      title: "Free Assessment",
      description: "Send us your current résumé for a complimentary evaluation. We'll assess its effectiveness and identify areas for improvement."
    },
    {
      icon: DollarSign,
      title: "Tailored Quote",
      description: "Receive a personalised quote outlining services, pricing and turnaround time based on your specific needs and career goals."
    },
    {
      icon: ClipboardList,
      title: "Information Gathering",
      description: "Complete our easy online data form to ensure we capture every relevant detail about your experience, skills, and achievements."
    },
    {
      icon: PenTool,
      title: "Writing & Review",
      description: "We craft your documents and provide a draft for your feedback. Unlimited revisions ensure you're completely satisfied."
    },
    {
      icon: CheckCircle,
      title: "Final Delivery",
      description: "Receive polished, ready-to-use files in Word and PDF that showcase your professional value and get results."
    }
  ];

  return (
    <section id="process" className="py-20 bg-accent">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
            Our Simple 5-Step Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From initial assessment to final delivery, we make the process smooth and stress-free so you can focus on preparing for interviews.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={index} className="relative">
                <div className="flex gap-6 items-start mb-8">
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-primary/30" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Each step is designed to give you the confidence to sell yourself—because, let's face it, talking about yourself is HARD! And first impressions matter!
          </p>
        </div>
      </div>
    </section>
  );
}
