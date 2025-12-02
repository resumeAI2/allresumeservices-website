import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { CheckCircle2, Heart, Users, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import IndustryPricingTable from '@/components/IndustryPricingTable';

export default function Healthcare() {
  const pricingTiers = [
    {
      level: 'Entry to Mid-Level',
      price: '$185',
      turnaround: '3-5 business days',
      features: [
        'Enrolled nurse, registered nurse, or allied health roles',
        'AHPRA registration prominently featured',
        'Clinical skills and patient care experience highlighted',
        'Specialty certifications and continuing education showcased',
        'Cover letter emphasising compassionate care',
        'LinkedIn profile optimisation',
        'Professional revisions included'
      ]
    },
    {
      level: 'Senior & Leadership',
      price: '$255',
      turnaround: '5-7 business days',
      features: [
        'Clinical nurse consultant, nurse manager, or senior allied health roles',
        'Executive-level resume with clinical leadership achievements',
        'Quality improvement initiatives and patient outcomes highlighted',
        'Team management and mentoring experience showcased',
        'Research, publications, and presentations featured',
        'Selection criteria responses (for public hospital roles)',
        'LinkedIn executive profile optimisation',
        'Professional revisions included'
      ],
      popular: true
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Healthcare Expertise",
      description: "Specialist knowledge of nursing, allied health, and medical roles across Australia"
    },
    {
      icon: Users,
      title: "AHPRA Registration Focus",
      description: "Highlight your registration, specialisations, and continuing professional development"
    },
    {
      icon: Shield,
      title: "Patient-Centred Approach",
      description: "Showcase your clinical skills, patient outcomes, and compassionate care"
    }
  ];

  const keywords = [
    "AHPRA", "Registered Nurse", "Enrolled Nurse", "Clinical Nurse", "Nurse Practitioner",
    "Allied Health", "Physiotherapy", "Occupational Therapy", "Speech Pathology",
    "Patient Care", "Clinical Assessment", "Medication Administration", "Wound Care",
    "Aged Care", "Mental Health", "Emergency Department", "ICU", "Theatre Nursing",
    "Infection Control", "NDIS", "Medicare", "Private Practice"
  ];

  const roles = [
    "Registered Nurses", "Enrolled Nurses", "Nurse Practitioners",
    "Midwives", "Physiotherapists", "Occupational Therapists",
    "Speech Pathologists", "Dietitians", "Radiographers",
    "Sonographers", "Paramedics", "Mental Health Nurses",
    "Aged Care Nurses", "Practice Managers", "Clinical Coordinators"
  ];

  return (
    <>
      <Helmet>
        <title>Healthcare Resume Writing | All Résumé Services</title>
        <meta name="description" content="Professional resume writing for healthcare professionals. Nurses, allied health, and medical staff. AHPRA-registered specialists across Australia." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Healthcare Resume Writing
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Specialist resume writing for nurses, allied health professionals, and medical staff seeking roles across Australia's healthcare sector
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link href="/contact">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Healthcare Professionals Choose Us</h2>
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
            <h2 className="text-3xl font-bold text-center mb-6">Healthcare Keywords We Use</h2>
            <p className="text-center text-muted-foreground mb-8">
              We strategically incorporate healthcare industry keywords to ensure your resume passes ATS screening and reaches hiring managers
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
            <h2 className="text-3xl font-bold text-center mb-6">Healthcare Roles We Specialise In</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">What's Included in Your Healthcare Resume</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">AHPRA Registration & Credentials</h3>
                <p className="text-muted-foreground mb-4">
                  We prominently feature your AHPRA registration, specialisations, and professional credentials—essential for healthcare employers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>AHPRA registration number and status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Specialisations and endorsements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Continuing professional development</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Clinical Skills & Experience</h3>
                <p className="text-muted-foreground mb-4">
                  Clear presentation of your clinical competencies, patient care experience, and specialised procedures.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Clinical assessment and intervention skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Patient outcomes and quality improvements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Specialised procedures and certifications</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Patient-Centred Care</h3>
                <p className="text-muted-foreground mb-4">
                  Emphasise your compassionate approach, patient advocacy, and ability to deliver high-quality care in diverse settings.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Patient satisfaction and feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Multidisciplinary team collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Cultural competency and diversity awareness</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">ATS Optimisation for Healthcare</h3>
                <p className="text-muted-foreground mb-4">
                  Formatted to pass applicant tracking systems used by public and private hospitals, aged care facilities, and healthcare organisations.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Healthcare-specific keywords and terminology</span>
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
              <h2 className="text-3xl font-bold mb-4">Pricing for Healthcare Professionals</h2>
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
              <h2 className="text-3xl font-bold mb-4">Success Story: Healthcare</h2>
              <p className="text-lg text-muted-foreground">See how we helped a registered nurse advance to a clinical leadership role</p>
            </div>
            <Card className="p-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
                  Healthcare Success
                </span>
                <h3 className="text-2xl font-bold mb-4">Registered Nurse Secures Clinical Nurse Consultant Role in Major Hospital</h3>
                <p className="text-muted-foreground mb-4">
                  Sarah was an experienced RN with 12 years in acute care but her applications for Clinical Nurse Consultant roles weren't getting through to interview stage. Her resume read like a job description rather than showcasing her clinical leadership and quality improvement initiatives.
                </p>
                <p className="text-muted-foreground mb-6">
                  We restructured Sarah's resume to emphasise her clinical leadership achievements, including a falls prevention program that reduced patient falls by 40%. We prominently featured her AHPRA registration and specialty certifications. Within five weeks, she received three CNC interview invitations and accepted a role with a $115,000 salaryu2014a $20,000 increase.
                </p>
                <blockquote className="border-l-4 border-secondary pl-4 italic text-lg mb-6">
                  "I'd been applying for CNC roles for over a year with no success. After working with All Resume Services, I had three interviews within a month. They knew exactly how to present my clinical leadership experience."
                  <footer className="text-sm text-muted-foreground mt-2">u2014 Sarah, Clinical Nurse Consultant</footer>
                </blockquote>
                <Button asChild>
                  <Link href="/case-studies/registered-nurse-clinical-consultant-role">
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
            <h2 className="text-3xl font-bold mb-4">Ready to Advance Your Healthcare Career?</h2>
            <p className="text-lg mb-8 opacity-90">
              Let our healthcare specialists create a resume that showcases your clinical skills, patient care experience, and professional credentials to stand out to employers.
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
