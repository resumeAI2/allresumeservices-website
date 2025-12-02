import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { CheckCircle2, Briefcase, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MiningResources() {
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
        <title>Mining & Resources Resume Writing | All Résumé Services</title>
        <meta name="description" content="Specialist resume writing for mining and resources professionals. FIFO, DIDO, operators, engineers, and supervisors. ATS-optimised for major mining companies." />
      </Helmet>

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
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
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
