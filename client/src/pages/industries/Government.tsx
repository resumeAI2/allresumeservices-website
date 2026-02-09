import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Link } from 'wouter';
import { CheckCircle2, Building2, FileText, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import IndustryPricingTable from '@/components/IndustryPricingTable';

export default function Government() {
  const pricingTiers = [
    {
      level: 'Entry to Mid-Level (APS 1-6)',
      price: '$215',
      turnaround: '5-7 business days',
      features: [
        'APS 1-6 or state government equivalent roles',
        'Resume aligned with capability frameworks',
        'Up to 3 selection criteria responses using STAR method',
        'Government-specific keywords and terminology',
        'Cover letter for public sector applications',
        'LinkedIn profile optimisation',
        'We work with you until you\'re 100% satisfied'
      ]
    },
    {
      level: 'Executive Level (EL1-SES)',
      price: '$315',
      turnaround: '7-10 business days',
      features: [
        'EL1, EL2, SES, or senior state government roles',
        'Executive-level resume with strategic achievements',
        'Up to 5 selection criteria responses with detailed STAR examples',
        'Leadership capability and policy impact highlighted',
        'Stakeholder management and change leadership showcased',
        'Cover letter for executive applications',
        'LinkedIn executive profile optimisation',
        'We work with you until you\'re 100% satisfied'
      ],
      popular: true
    }
  ];

  const benefits = [
    {
      icon: Building2,
      title: "Public Sector Expertise",
      description: "Deep understanding of government recruitment processes and selection criteria"
    },
    {
      icon: FileText,
      title: "STAR Method Specialists",
      description: "Expert writers in crafting compelling STAR-format selection criteria responses"
    },
    {
      icon: Award,
      title: "Compliance & Standards",
      description: "Resumes and applications that meet strict public sector requirements"
    }
  ];

  const keywords = [
    "Public Service", "APS", "State Government", "Local Council", "Selection Criteria",
    "STAR Method", "Policy Development", "Stakeholder Engagement", "Project Management",
    "Governance", "Compliance", "Risk Management", "Budget Management",
    "Strategic Planning", "Change Management", "Service Delivery", "Community Engagement",
    "Procurement", "Contract Management", "Performance Reporting", "Legislative Compliance"
  ];

  const roles = [
    "Policy Officers", "Project Officers", "Program Managers",
    "Executive Officers", "Administrative Officers", "Compliance Officers",
    "Community Engagement Officers", "Strategic Planners", "Budget Analysts",
    "Procurement Specialists", "HR Advisors", "Communications Officers",
    "Environmental Officers", "Urban Planners", "Infrastructure Managers"
  ];

  return (
    <>
      <Helmet>
        <title>Government & Public Sector Resume Writing | All Résumé Services</title>
        <meta name="description" content="Specialist resume and selection criteria writing for government and public sector roles. APS, state government, and local council applications." />
        <link rel="canonical" href="https://allresumeservices.com.au/industries/government" />
      </Helmet>
      <Header />
      
      <div className="container">
        <Breadcrumb items={[
          { label: 'Industries', href: '/industries' },
          { label: 'Government & Public Sector' }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Government & Public Sector Resume Writing
            </h1>
            <p className="text-xl text-emerald-100 mb-8">
              Specialist resume and selection criteria writing for government roles across federal, state, and local levels
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link href="/contact">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-900">
                <Link href="/services">View Services &amp; Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Disclaimer */}
      <section className="py-8 bg-secondary/5 border-y border-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Serving All Industries:</strong> While we have deep expertise in Government & Public Sector, we successfully serve professionals across all sectors and career levels. Our proven resume writing process delivers results regardless of your industry.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Public Sector Professionals Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6">
                  <Icon className="h-12 w-12 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Keywords */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Public Sector Keywords We Use</h2>
            <p className="text-center text-muted-foreground mb-8">
              We strategically incorporate government sector keywords to ensure your application passes screening and reaches selection panels
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {keywords.map((keyword, index) => (
                <span key={index} className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roles We Support */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Government Roles We Specialise In</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {roles.map((role, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Include */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What's Included in Your Government Application</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">STAR-Format Selection Criteria</h3>
                <p className="text-muted-foreground mb-4">
                  We craft compelling selection criteria responses using the STAR method (Situation, Task, Action, Result) that demonstrate your capabilities.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Detailed examples from your work history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Quantifiable results and outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Alignment with position requirements</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Capability Framework Alignment</h3>
                <p className="text-muted-foreground mb-4">
                  Your resume and responses are aligned with relevant capability frameworks (APS, state government, or local council).
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>APS Integrated Leadership System capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>State government capability frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Local government competency standards</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Policy & Governance Experience</h3>
                <p className="text-muted-foreground mb-4">
                  Emphasise your policy development, stakeholder engagement, and governance experience relevant to public sector roles.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Policy analysis and development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Stakeholder consultation and engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Legislative compliance and governance</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Public Sector Standards</h3>
                <p className="text-muted-foreground mb-4">
                  Applications formatted to meet strict public sector requirements and selection panel expectations.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Professional formatting and structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Appropriate length and detail level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Clear evidence of required capabilities</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pricing for Government & Public Sector Professionals</h2>
              <p className="text-lg text-muted-foreground">Choose the package that matches your career level</p>
            </div>
            <IndustryPricingTable tiers={pricingTiers} />
            <div className="mt-8 text-center">
              <Button asChild size="lg">
                <Link href="/contact">Get Your Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Success Story: Government & Public Sector</h2>
              <p className="text-lg text-muted-foreground">See how we helped an APS officer advance to executive level</p>
            </div>
            <Card className="p-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
                  Government Application Success
                </span>
                <h3 className="text-2xl font-bold mb-4">APS Officer Promoted to Executive Level 1 in Federal Government</h3>
                <p className="text-muted-foreground mb-4">
                  Michael had been an APS6 policy officer for 6 years but his EL1 applications were consistently unsuccessful. His selection criteria responses were too generic and didn't use the STAR method effectively.
                </p>
                <p className="text-muted-foreground mb-6">
                  We completely rewrote Michael's selection criteria using the STAR method with specific, measurable examples. We aligned his resume with the APS Integrated Leadership System capability framework. He was shortlisted for two EL1 positions and secured his preferred role with a $135,000 salary—a $25,000 increase.
                </p>
                <blockquote className="border-l-4 border-secondary pl-4 italic text-lg mb-6">
                  "After years of unsuccessful EL1 applications, I finally understood what selection panels were looking for. The STAR method examples and capability framework alignment made all the difference."
                  <footer className="text-sm text-muted-foreground mt-2">— Michael, Executive Level 1 Officer</footer>
                </blockquote>
                <Button asChild>
                  <Link href="/case-studies/aps-officer-executive-level-promotion">
                    Read Full Success Story <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Government Role?</h2>
            <p className="text-lg mb-8 opacity-90">
              Let our public sector specialists create a resume and selection criteria responses that demonstrate your capabilities and stand out to selection panels.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" variant="outline" className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
                <Link href="/contact">Get Your Free Quote <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
                <Link href="/case-studies">View Success Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
