import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingSchema from "@/components/PricingSchema";
import Breadcrumb from "@/components/Breadcrumb";
import { CheckCircle, Clock, Shield, Sparkles, FileText, Mail, Linkedin, FileCheck, Zap } from "lucide-react";
import { Link } from "wouter";

export default function PricingPage() {
  const benefits = [
    {
      icon: CheckCircle,
      title: "ATS-Optimised",
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

  const packages = [
    {
      name: "Basic Package",
      price: "$125",
      originalPrice: "$148",
      savings: "$23",
      popular: false,
      features: [
        "Entry Level Resume ($99)",
        "Entry Level Cover Letter ($49)",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "2-3 day turnaround"
      ]
    },
    {
      name: "Standard Package",
      price: "$185",
      originalPrice: "$224",
      savings: "$39",
      popular: true,
      features: [
        "Professional Resume ($149)",
        "Professional Cover Letter ($75)",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "2-3 day turnaround",
        "Priority support"
      ]
    },
    {
      name: "Premium Package",
      price: "$255",
      originalPrice: "$324",
      savings: "$69",
      popular: false,
      features: [
        "Executive Resume ($255)",
        "Executive Cover Letter ($99)",
        "LinkedIn Profile Optimisation ($125)",
        "ATS-friendly formatting",
        "Delivered in Word & PDF",
        "1 day express turnaround",
        "Priority support"
      ]
    }
  ]

  const individualServices = [
    {
      category: "Resume Writing",
      icon: FileText,
      services: [
        { name: "Entry Level Resume", price: "$99", description: "Perfect for recent graduates and early career professionals" },
        { name: "Professional Resume", price: "$149", description: "For mid-level professionals with 3-10 years experience" },
        { name: "Executive Resume", price: "$255", description: "For senior leaders and C-suite executives" }
      ]
    },
    {
      category: "Cover Letters",
      icon: Mail,
      services: [
        { name: "Entry Level Cover Letter", price: "$49", description: "Tailored cover letter for entry-level positions" },
        { name: "Professional Cover Letter", price: "$75", description: "Strategic cover letter for professional roles" },
        { name: "Executive Cover Letter", price: "$99", description: "Executive-level cover letter for senior positions" }
      ]
    },
    {
      category: "LinkedIn & Other Services",
      icon: Linkedin,
      services: [
        { name: "LinkedIn Profile Optimisation", price: "$125", description: "Complete LinkedIn transformation for maximum visibility" },
        { name: "Selection Criteria Response", price: "$100", description: "Expert STAR method responses for government applications (up to 5 criteria)" }
      ]
    },
    {
      category: "Add-ons",
      icon: Zap,
      services: [
        { name: "Rush Delivery (24-48 hours)", price: "$50", description: "Expedited delivery for urgent needs" },
        { name: "Phone Consultation (30 min)", price: "$75", description: "One-on-one career consultation with expert" }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - Professional Resume Writing Services | All Resume Services</title>
        <meta name="description" content="Transparent pricing for professional resume writing services. Packages from $125 AUD. Individual services from $49. ATS-optimised resumes, cover letters, and LinkedIn profiles." />
        <meta name="keywords" content="resume writing prices, resume service cost, professional resume pricing, cover letter pricing, LinkedIn profile cost" />
      </Helmet>
      <PricingSchema />
      <Header />
      <Breadcrumb items={[{ label: "Pricing" }]} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                Transparent Pricing
              </h1>
              <p className="text-xl text-white">
                No hidden fees. Choose from packages or individual services to fit your needs and budget.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
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

        {/* Package Pricing */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Popular Packages</h2>
              <p className="text-lg text-muted-foreground">Save money with our bundled packages</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {packages.map((pkg, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl p-8 shadow-md border-2 ${pkg.popular ? 'border-secondary' : 'border-border'} relative`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <div className="mb-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-secondary">{pkg.price}</span>
                      <span className="text-muted-foreground">AUD</span>
                      <span className="text-lg text-muted-foreground line-through ml-2">{pkg.originalPrice}</span>
                    </div>
                    <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                      Save {pkg.savings}
                    </div>
                  </div>
                  <div className="mb-6"></div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/packages" className="block w-full text-center bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-3 rounded-lg transition-all">
                    Choose Package
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Individual Services Pricing */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Individual Services</h2>
              <p className="text-lg text-muted-foreground">Build your own custom solution</p>
            </div>
            <div className="max-w-5xl mx-auto space-y-8">
              {individualServices.map((category, catIndex) => {
                const Icon = category.icon;
                return (
                  <div key={catIndex} className="bg-white rounded-xl p-8 shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/10">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{category.category}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.services.map((service, sIndex) => (
                        <div key={sIndex} className="border border-border rounded-lg p-6">
                          <div className="flex items-baseline justify-between mb-3">
                            <h4 className="font-semibold text-foreground">{service.name}</h4>
                            <span className="text-2xl font-bold text-secondary">{service.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Link href="/packages" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition-all">
                View Full Catalog & Add to Cart
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Real Results from Real Clients</h2>
              <p className="text-lg text-muted-foreground">See how our services delivered ROI for job seekers</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-md border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary text-lg">
                    C
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Christina Paiva</h4>
                    <div className="flex text-secondary text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  "Every time I've applied for a job using the resume they crafted for me, I've landed an interview. Their professionalism and swift turnaround times are unparalleled. My resume looks fabulous and stands out in the competitive job market here in Australia."
                </p>
                <p className="text-xs text-muted-foreground font-semibold">Resume Writing Service</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-md border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary text-lg">
                    N
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Nrupa Shah</h4>
                    <div className="flex text-secondary text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  "I just accepted a position at SCE Group! The feedback I received from interviewers was overwhelmingly positive, and I am confident your resume played a significant role in helping me stand out. Your expertise in showcasing my skills and experience truly made a difference."
                </p>
                <p className="text-xs text-muted-foreground font-semibold">Resume & Cover Letter Package</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-md border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary text-lg">
                    T
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Tony</h4>
                    <div className="flex text-secondary text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  "Within one week I scored an interview and was hired in two weeks! Recently changed careers and needed to update my resume—Sonia and the team delivered a brand new resume and cover letter that was professionally done. They really know their stuff!"
                </p>
                <p className="text-xs text-muted-foreground font-semibold">Resume & Cover Letter Package</p>
              </div>
            </div>
          </div>
        </section>

        {/* Custom Solution */}
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
        <section className="py-12 bg-muted/30">
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
                  <h3 className="font-semibold text-foreground mb-2">Can I purchase individual services instead of a package?</h3>
                  <p className="text-muted-foreground">
                    Yes! All services are available individually. However, our packages offer better value if you need multiple services.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">How long does it take?</h3>
                  <p className="text-muted-foreground">
                    Most services are delivered within 2-5 business days. Premium packages include express 1-day turnaround. Rush delivery (24-48 hours) is available as an add-on for $50.
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
