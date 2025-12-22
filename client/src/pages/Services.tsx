import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { FileText, Mail, Linkedin, FileCheck, Users, Award, TrendingUp, Target } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      icon: FileText,
      title: "Resume Writing",
      description: "Professional, ATS-optimised resumes that highlight your achievements and get you noticed by hiring managers. Tailored to your industry and career level.",
      features: [
        "ATS-friendly formatting",
        "Achievement-focused content",
        "Industry-specific keywords",
        "Professional design",
        "Delivered in Word & PDF"
      ],
      link: "/services/resume-writing"
    },
    {
      icon: Mail,
      title: "Cover Letter Writing",
      description: "Compelling cover letters that complement your resume and demonstrate your enthusiasm and fit for the role. Customized for each application.",
      features: [
        "Tailored to job description",
        "Highlights key qualifications",
        "Professional tone",
        "Persuasive storytelling",
        "Ready to customize"
      ],
      link: "/services/cover-letters"
    },
    {
      icon: Linkedin,
      title: "LinkedIn Profile Optimisation",
      description: "Transform your LinkedIn profile into a powerful personal brand. Optimised for searchability and designed to attract recruiters and opportunities.",
      features: [
        "Keyword-optimised headline",
        "Compelling summary",
        "Achievement-based experience",
        "Skills optimization",
        "Recruiter-friendly format"
      ],
      link: "/services/linkedin-optimisation"
    },
    {
      icon: FileCheck,
      title: "Selection Criteria",
      description: "Detailed responses to government and corporate selection criteria. We help you demonstrate how you meet each requirement with concrete examples.",
      features: [
        "STAR method responses",
        "Evidence-based examples",
        "Addresses all criteria",
        "Professional formatting",
        "Government job ready"
      ],
      link: "/services/selection-criteria"
    },
    {
      icon: Users,
      title: "Career Consultation",
      description: "One-on-one guidance from experienced career advisors. Get personalized advice on your career direction, job search strategy, and interview preparation.",
      features: [
        "Personalized career advice",
        "Job search strategy",
        "Interview preparation",
        "Career transition support",
        "Industry insights"
      ],
      link: "/services/career-consultation"
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "18+ Years Experience",
      description: "Decades of expertise crafting resumes across all industries and career levels"
    },
    {
      icon: Target,
      title: "96% Interview Success",
      description: "Our clients consistently land interviews and secure their dream roles"
    },
    {
      icon: TrendingUp,
      title: "ATS-Optimised",
      description: "Every document is formatted to pass applicant tracking systems"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Services - Professional Resume & Career Services | All Resume Services</title>
        <meta name="description" content="Professional resume writing, cover letters, LinkedIn optimization, selection criteria, and career consultation services. 18+ years experience, 96% interview success rate." />
        <meta name="keywords" content="resume writing services, cover letter writing, LinkedIn profile, selection criteria, career consultation, professional resume" />
      </Helmet>
      <Header />
      <Breadcrumb items={[{ label: "Services" }]} />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
                Professional Career Services
              </h1>
              <p className="text-xl text-white mb-8">
                Expert resume writing, cover letters, LinkedIn optimization, and career guidance to help you land your dream job.
              </p>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-3 rounded-lg transition-all">
                View Pricing & Packages
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white border-b">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                      <Icon className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose from our range of professional career services, or combine them in a package for the best value.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all border border-border relative"
                  >
                    {/* Satisfaction Guarantee Badge */}
                    <div className="absolute top-4 right-4">
                      <img 
                        src="/satisfaction-badge.png" 
                        alt="100% Satisfaction Guarantee" 
                        className="w-16 h-16"
                        title="100% Satisfaction Guarantee - We work with you until you're 100% satisfied"
                      />
                    </div>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-secondary/10 mb-4">
                      <Icon className="h-7 w-7 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-secondary mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={service.link} className="text-primary hover:text-primary/80 font-semibold text-sm">
                      Learn More →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Choose a package that fits your needs or get a free resume review to see how we can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-3 rounded-lg transition-all">
                  View Pricing & Packages
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-foreground font-semibold px-8 py-3 rounded-lg border-2 border-border transition-all">
                  Get Free Resume Review
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
