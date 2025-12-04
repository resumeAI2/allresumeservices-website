import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

export default function IndustryComparison() {
  const industries = [
    {
      name: 'Mining & Resources',
      color: 'from-slate-900 to-slate-700',
      approach: 'Emphasis on safety records, FIFO/DIDO experience, tickets & certifications, and production metrics',
      typicalClients: 'Operators, technicians, engineers, supervisors, and managers in mining, oil & gas, and resources',
      keyDeliverables: [
        'ATS-optimised resume highlighting tickets',
        'Safety record and compliance experience',
        'FIFO/DIDO roster experience showcased',
        'Production metrics and cost savings'
      ],
      successMetrics: '95% of clients receive interview requests within 4 weeks',
      link: '/industries/mining-resources'
    },
    {
      name: 'Healthcare',
      color: 'from-blue-900 to-blue-700',
      approach: 'AHPRA registration prominence, clinical skills showcase, patient outcomes, and compassionate care emphasis',
      typicalClients: 'Registered nurses, enrolled nurses, allied health professionals, and medical staff',
      keyDeliverables: [
        'AHPRA registration and specialisations featured',
        'Clinical assessment and intervention skills',
        'Patient outcomes and quality improvements',
        'Multidisciplinary team collaboration'
      ],
      successMetrics: '93% of healthcare clients secure interviews with major hospitals',
      link: '/industries/healthcare'
    },
    {
      name: 'Government & Public Sector',
      color: 'from-emerald-900 to-emerald-700',
      approach: 'Selection criteria responses using STAR method, capability frameworks alignment, and policy impact focus',
      typicalClients: 'APS officers, state government employees, local council staff, and public sector professionals',
      keyDeliverables: [
        'Resume aligned with capability frameworks',
        'Selection criteria responses using STAR method',
        'Policy development and stakeholder engagement',
        'Governance and compliance experience'
      ],
      successMetrics: '91% of government clients progress to interview stage',
      link: '/industries/government-public-sector'
    },
    {
      name: 'IT & Technology',
      color: 'from-purple-900 to-purple-700',
      approach: 'Tech stack prominence, GitHub/portfolio integration, technical projects showcase, and scalability achievements',
      typicalClients: 'Software engineers, developers, DevOps engineers, cloud architects, and IT specialists',
      keyDeliverables: [
        'Tech stack and programming languages featured',
        'Projects and technical achievements highlighted',
        'GitHub/portfolio links integrated',
        'System architecture and scalability projects'
      ],
      successMetrics: '94% of IT clients receive multiple interview offers',
      link: '/industries/it-technology'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Industry Comparison | All Resume Services</title>
        <meta name="description" content="Compare our tailored approach across Mining, Healthcare, Government, and IT industries. See how we customize resumes for each sector's unique requirements." />
      </Helmet>
      <Header />
      
      <div className="container">
        <Breadcrumb items={[
          { label: 'Industries', href: '/industries' },
          { label: 'Industry Comparison' }
        ]} />
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Industry-Specific Resume Approach
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              See how we tailor our resume writing approach to meet the unique requirements and expectations of each industry sector
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {industries.map((industry, index) => (
              <Card key={index} className="overflow-hidden">
                <div className={`bg-gradient-to-r ${industry.color} text-white p-6`}>
                  <h2 className="text-2xl font-bold">{industry.name}</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Approach */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Our Approach</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {industry.approach}
                    </p>
                  </div>

                  {/* Typical Clients */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Typical Clients</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {industry.typicalClients}
                    </p>
                  </div>

                  {/* Key Deliverables */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Key Deliverables</h3>
                    <ul className="space-y-2">
                      {industry.keyDeliverables.map((deliverable, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Success Metrics */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-secondary mb-1">Success Rate</p>
                    <p className="text-sm text-muted-foreground">{industry.successMetrics}</p>
                  </div>

                  {/* CTA */}
                  <Button asChild className="w-full" variant="outline">
                    <Link href={industry.link}>Learn More About {industry.name}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Industries Disclaimer */}
      <section className="py-16 bg-secondary/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">We Serve All Industries</h2>
            <p className="text-lg text-muted-foreground mb-8">
              While we showcase our expertise in Mining, Healthcare, Government, and IT, our proven resume writing process delivers exceptional results across <strong>all industries and career levels</strong>. Whether you're in finance, education, retail, hospitality, construction, or any other sector, we have the skills and experience to help you stand out.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/industries">View All Industries</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Get Your Free Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
