import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import { CheckCircle, Clock, Shield, Sparkles } from "lucide-react";

export default function PricingPage() {
  const benefits = [
    {
      icon: CheckCircle,
      title: "ATS-Optimized",
      description: "Get past applicant tracking systems and into human hands"
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "1-3 day delivery depending on package selected"
    },
    {
      icon: Shield,
      title: "100% Satisfaction",
      description: "Unlimited revisions until you're completely happy"
    },
    {
      icon: Sparkles,
      title: "Expert Writers",
      description: "18+ years experience across all industries"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Professional Resume Writing Services | All Resume Services</title>
        <meta name="description" content="Transparent pricing for professional resume writing services. Packages from $125 AUD. ATS-optimized resumes, cover letters, and LinkedIn profiles. Fast turnaround, 100% satisfaction guarantee." />
        <meta name="keywords" content="resume writing prices, resume service cost, professional resume pricing, cover letter pricing, LinkedIn profile cost" />
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                Professional Resume Writing Packages
              </h1>
              <p className="text-xl text-white">
                Transparent pricing with no hidden fees. Choose the package that best fits your career goals.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white border-b">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-3">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Packages */}
        <Pricing />

        {/* Additional Info */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Need a Custom Solution?
              </h2>
              <p className="text-muted-foreground mb-6">
                If you have specific requirements or need additional services, we're happy to create a custom package tailored to your needs.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Contact Us for Custom Quote
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What's included in each package?</h3>
                  <p className="text-muted-foreground">
                    All packages include professionally written documents tailored to your career goals, ATS-friendly formatting, and delivery in both Word and PDF formats. Higher-tier packages include additional documents and faster turnaround times.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How long does it take?</h3>
                  <p className="text-muted-foreground">
                    Basic and Standard packages are delivered within 2-3 business days. Premium package includes express 1-day turnaround.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
                  <p className="text-muted-foreground">
                    We accept all major credit cards and PayPal for secure online payments.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Do you offer refunds?</h3>
                  <p className="text-muted-foreground">
                    We offer unlimited revisions to ensure 100% satisfaction. If you're not happy with the final result, we'll work with you until you are.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
