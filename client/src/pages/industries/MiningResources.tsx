import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Link } from 'wouter';
import { CheckCircle2, Briefcase, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import IndustryPricingTable from '@/components/IndustryPricingTable';

export default function MiningResources() {
  const pricingTiers = [
    {
      level: 'Entry to Mid-Level',
      price: '$185',
      turnaround: '3-5 business days',
      features: [
        'Operator, technician, or trades roles',
        'ATS-optimised resume highlighting tickets & certifications',
        'Safety record and compliance experience emphasised',
        'FIFO/DIDO roster experience showcased',
        'Cover letter tailored to mining operations',
        'LinkedIn profile optimisation',
        'We work with you until you\'re 100% satisfied'
      ]
    },
    {
      level: 'Senior & Leadership',
      price: '$255',
      turnaround: '5-7 business days',
      features: [
        'Supervisor, manager, engineer, or specialist roles',
        'Executive-level resume with leadership achievements',
        'Production metrics and cost savings highlighted',
        'Project management and team leadership showcased',
        'Strategic planning and operational excellence',
        'Selection criteria responses (for government mining)',
        'LinkedIn executive profile optimisation',
        'We work with you until you\'re 100% satisfied'
      ],
      popular: true
    }
  ];

  const benefits = [
    {
      icon: Briefcase,
      title: "Industry Expertise",
      description: "Deep understanding of mining, resources, and FIFO roles across Australia"
    },
    {
      icon: TrendingUp,
      title: "ATS Optimisation",
      description: "Resumes formatted to pass major mining company applicant tracking systems"
    },
    {
      icon: Award,
      title: "Safety & Compliance Focus",
      description: "Highlight certifications, safety records, and compliance experience"
    }
  ];

  const keywords = [
    "FIFO", "DIDO", "Underground Mining", "Open Cut", "Drill & Blast",
    "Heavy Mobile Equipment", "Haul Truck Operation", "Excavator Operation",
    "Shotfiring", "Geology", "Mine Planning", "Production Supervisor",
    "Safety Management", "Risk Assessment", "ISO 45001", "Coal Mining",
    "Iron Ore", "Gold Mining", "Lithium", "Rare Earth Elements"
  ];

  const roles = [
    "Mine Site Operators", "Drill & Blast Engineers", "Production Supervisors",
    "Heavy Equipment Operators", "Geologists", "Mine Planners",
    "Safety Officers", "Maintenance Technicians", "Shutdown Coordinators",
    "Project Managers", "Environmental Officers", "Metallurgists"
  ];

  return (
    <>
      <Helmet>
        <title>Mining & Resources Resume Writing | All Resume Services</title>
        <meta name="description" content="Specialist resume writing for mining and resources professionals. FIFO, DIDO, operators, engineers, and supervisors. ATS-optimised for major mining companies." />
      </Helmet>
      <Header />
      
      <div className="container">
        <Breadcrumb items={[
          { label: 'Industries', href: '/industries' },
          { label: 'Mining & Resources' }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Mining & Resources Resume Writing
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Specialist resume writing for mining professionals seeking FIFO, DIDO, and permanent roles across Australia's resources sector
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link href="/contact">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                <Link href="/services">View Services & Pricing</Link>
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
              <strong className="text-foreground">Serving All Industries:</strong> While we have deep expertise in Mining & Resources, we successfully serve professionals across all sectors and career levels. Our proven resume writing process delivers results regardless of your industry.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Mining Professionals Choose Us</h2>
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
            <h2 className="text-3xl font-bold text-center mb-6">Industry-Specific Keywords We Use</h2>
            <p className="text-center text-muted-foreground mb-8">
              We strategically incorporate mining industry keywords to ensure your resume passes ATS screening and reaches hiring managers
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
            <h2 className="text-3xl font-bold text-center mb-6">Mining Roles We Specialise In</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">What's Included in Your Mining Resume</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Safety & Compliance Showcase</h3>
                <p className="text-muted-foreground mb-4">
                  We prominently feature your safety certifications, clean safety record, and compliance experience—critical factors mining companies prioritise.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>High-risk work licences and tickets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Safety statistics and incident-free records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Relevant mining inductions and site access</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Skills & Equipment</h3>
                <p className="text-muted-foreground mb-4">
                  Clear presentation of your technical proficiencies, equipment operation experience, and production achievements.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Heavy mobile equipment operation hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Production targets and KPIs achieved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Technical certifications and training</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">FIFO/DIDO Experience</h3>
                <p className="text-muted-foreground mb-4">
                  Emphasise your adaptability to roster patterns, remote site experience, and ability to work in challenging environments.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Roster patterns and remote site experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Teamwork in isolated environments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Camp living and cultural awareness</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">ATS Optimisation for Mining Companies</h3>
                <p className="text-muted-foreground mb-4">
                  Formatted to pass applicant tracking systems used by BHP, Rio Tinto, Fortescue, Glencore, and other major mining employers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Industry-specific keywords and terminology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Clean formatting that ATS can parse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Proper section headings and structure</span>
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
              <h2 className="text-3xl font-bold mb-4">Pricing for Mining & Resources Professionals</h2>
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
              <h2 className="text-3xl font-bold mb-4">Success Story: Mining & Resources</h2>
              <p className="text-lg text-muted-foreground">See how we helped a mining professional land their dream FIFO role</p>
            </div>
            <Card className="p-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
                  Mining & Resources Success
                </span>
                <h3 className="text-2xl font-bold mb-4">Mining Engineer Lands $180K FIFO Role at Major Iron Ore Operation</h3>
                <p className="text-muted-foreground mb-4">
                  David had 8 years of underground coal mining experience but struggled to transition to lucrative iron ore FIFO roles. His resume wasn't highlighting transferable skills or his clean safety record effectively.
                </p>
                <p className="text-muted-foreground mb-6">
                  We restructured his resume to target iron ore operations, prominently featured his safety statistics (zero LTIs over 8 years), and optimised it for major mining company ATS systems. Within three weeks, David received interview invitations from three major iron ore operators and accepted a Production Supervisor role with a $180,000 package—a 35% salary increase.
                </p>
                <blockquote className="border-l-4 border-secondary pl-4 italic text-lg mb-6">
                  "The team at All Resume Services completely transformed how I presented my mining experience. Within weeks I had multiple FIFO offers, and I'm now earning significantly more while working fewer days per year."
                  <footer className="text-sm text-muted-foreground mt-2">— David, Production Supervisor</footer>
                </blockquote>
                <Button asChild>
                  <Link href="/case-studies/mining-engineer-180k-fifo-role">
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
            <h2 className="text-3xl font-bold mb-4">Ready to Land Your Next Mining Role?</h2>
            <p className="text-lg mb-8 opacity-90">
              Let our mining industry specialists create a resume that showcases your experience, safety record, and technical skills to stand out to major mining employers.
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
