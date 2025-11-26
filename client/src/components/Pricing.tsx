import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export default function Pricing() {
  const packages = [
    {
      name: "Basic Resume",
      price: 95,
      popular: false,
      features: [
        "Professionally written résumé tailored to your career goals",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "Unlimited revisions until you're satisfied",
        "3-5 day turnaround"
      ]
    },
    {
      name: "Standard Package",
      price: 145,
      popular: true,
      features: [
        "Professionally written résumé",
        "Cover letter tailored to applications",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "Unlimited revisions until you're satisfied",
        "3-5 day turnaround",
        "Priority support"
      ]
    },
    {
      name: "Premium Package",
      price: 205,
      popular: false,
      features: [
        "Professionally written résumé",
        "Cover letter tailored to applications",
        "LinkedIn profile professionally written and optimised",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "Unlimited revisions until you're satisfied",
        "2-3 day express turnaround",
        "Priority support"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Resume Writing Services & Prices
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. Choose the package that best fits your career goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className={`relative bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all ${
                pkg.popular ? 'ring-2 ring-secondary scale-105 md:scale-110' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-4 py-1 rounded-bl-lg font-semibold text-sm flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-card-foreground mb-2">
                  {pkg.name}
                </h3>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-primary">${pkg.price}</span>
                  <span className="text-muted-foreground ml-2">AUD</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <Check className="h-5 w-5 text-secondary" />
                      </div>
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    pkg.popular 
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  size="lg"
                  onClick={() => {
                    window.open('mailto:admin@allresumeservices.com.au?subject=Package Inquiry: ' + pkg.name, '_blank');
                  }}
                >
                  Choose Package
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Need a custom solution or have questions about our services?
          </p>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.open('mailto:admin@allresumeservices.com.au?subject=Custom Package Inquiry', '_blank')}
          >
            Contact Us for Custom Quote
          </Button>
        </div>
      </div>
    </section>
  );
}
