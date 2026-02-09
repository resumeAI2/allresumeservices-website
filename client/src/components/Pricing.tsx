import { Button } from "@/components/ui/button";
import { Check, Star, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Pricing() {
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const createOrderMutation = trpc.payment.createOrder.useMutation();

  const handleChoosePackage = async (pkg: typeof packages[0]) => {
    setLoadingPackage(pkg.name);

    try {
      const result = await createOrderMutation.mutateAsync({
        packageName: pkg.name,
        amount: pkg.price.replace("$", ""),
      });

      if (result.approvalUrl) {
        // Redirect to PayPal for payment
        window.location.href = result.approvalUrl;
      } else {
        toast.error("Failed to create payment. Please try again.");
        setLoadingPackage(null);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
      setLoadingPackage(null);
    }
  };

  const packages = [
    {
      name: "Basic Package",
      price: "$125",
      popular: false,
      features: [
        "Professionally written resume tailored to your career goals",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "2-3 day turnaround"
      ]
    },
    {
      name: "Standard Package",
      price: "$185",
      popular: true,
      features: [
        "Professionally written resume",
        "Cover letter tailored to applications",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "2-3 day turnaround",
        "Priority support"
      ]
    },
    {
      name: "Premium Package",
      price: "$255",
      popular: false,
      features: [
        "Professionally written resume",
        "Cover letter tailored to applications",
        "LinkedIn profile professionally written and optimised",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "1 day express turnaround",
        "Priority support"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-full border border-secondary/20">
              <div className="h-20 w-20 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                <img 
                  src="/5-star-rating-icon.png" 
                  alt="5 Star Rating" 
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">5.0 Rating</div>
                <div className="text-xs text-muted-foreground">60+ verified reviews</div>
              </div>
            </div>
          </div>
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
                  <span className="text-5xl font-bold text-primary">{pkg.price}</span>
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
                  onClick={() => handleChoosePackage(pkg)}
                  disabled={loadingPackage !== null}
                >
                  {loadingPackage === pkg.name ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Choose Package"
                  )}
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
