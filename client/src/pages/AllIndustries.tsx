import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { CheckCircle2, Building2, Briefcase, Users, TrendingUp, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AllIndustries() {
  const featuredIndustries = [
    {
      title: "Mining & Resources",
      icon: Building2,
      description: "FIFO, DIDO, operators, engineers, and supervisors across Australia's resources sector",
      link: "/industries/mining-resources",
      highlights: ["Safety & Compliance", "ATS Optimisation", "FIFO/DIDO Experience"]
    },
    {
      title: "Healthcare",
      icon: Briefcase,
      description: "Nurses, doctors, allied health, and healthcare administrators at all career levels",
      link: "/industries/healthcare",
      highlights: ["AHPRA Registration", "Clinical Experience", "Patient Care Focus"]
    },
    {
      title: "Government & Public Sector",
      icon: Users,
      description: "Selection criteria, capability statements, and public service applications",
      link: "/industries/government",
      highlights: ["Selection Criteria", "STAR Method", "Capability Statements"]
    },
    {
      title: "IT & Technology",
      icon: TrendingUp,
      description: "Software engineers, developers, IT managers, and tech professionals",
      link: "/industries/it-technology",
      highlights: ["Technical Skills", "Project Portfolio", "Certifications"]
    }
  ];

  const otherIndustries = [
    "Accounting & Finance", "Construction & Engineering", "Education & Training",
    "Hospitality & Tourism", "Legal Services", "Manufacturing",
    "Marketing & Communications", "Real Estate & Property", "Retail & Customer Service",
    "Sales & Business Development", "Supply Chain & Logistics", "Trades & Services"
  ];

  const benefits = [
    {
      icon: Award,
      title: "17+ Years Experience",
      description: "We've successfully served professionals across every industry imaginable, from entry-level to C-suite executives."
    },
    {
      icon: CheckCircle2,
      title: "96% Interview Success Rate",
      description: "Our proven resume writing process delivers results regardless of your industry or career level."
    },
    {
      icon: TrendingUp,
      title: "Industry-Specific Keywords",
      description: "We research and incorporate the right keywords for your specific field to pass ATS screening."
    }
  ];

  return (
    <>
      <Helmet>
        <title>All Industries Resume Writing Services | All Résumé Services</title>
        <meta name="description" content="Professional resume writing for all industries and career levels. From mining to healthcare, IT to government, we help Australian professionals across every sector land interviews." />
      </Helmet>

      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Professional Resume Writing for All Industries
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              With 17+ years of experience, we've helped Australian professionals across every industry and career level land their dream jobs. No matter your field, we have the expertise to showcase your unique value.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link href="/about">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1e3a5f]">
                <Link href="/services">View Services & Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Serve All Industries */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Your Industry Expertise Meets Our Resume Expertise</h2>
            <p className="text-lg text-muted-foreground">
              While we have deep knowledge in specific sectors, our core strength lies in understanding what makes a resume effective—regardless of industry. We combine your industry expertise with our resume writing mastery to create documents that get results.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 text-center">
                  <Icon className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compare Industries CTA */}
      <section className="py-12 bg-gradient-to-r from-secondary/10 to-primary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Compare Our Industry Approaches</h2>
            <p className="text-lg text-muted-foreground mb-6">
              See how we tailor our resume writing approach across different sectors. Understand the unique strategies we use for Mining, Healthcare, Government, and IT professionals.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/industries/compare">
                View Industry Comparison
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Industries */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Industry Expertise</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We've developed specialized knowledge in these high-demand sectors, with dedicated pages showcasing our industry-specific approach.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredIndustries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{industry.title}</h3>
                      <p className="text-muted-foreground mb-4">{industry.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {industry.highlights.map((highlight, idx) => (
                          <span key={idx} className="text-xs px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                            {highlight}
                          </span>
                        ))}
                      </div>
                      <Link href={industry.link}>
                        <Button variant="link" className="p-0 h-auto text-secondary">
                          Learn More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other Industries */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">And Many More Industries</h2>
              <p className="text-lg text-muted-foreground">
                We've successfully served professionals in virtually every industry. Here are just some of the sectors we work with regularly:
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {otherIndustries.map((industry, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="font-medium">{industry}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-muted-foreground italic">
                Don't see your industry listed? Don't worry—we've worked with professionals from countless other fields. Our expertise is in creating compelling resumes, not just industry knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Universal Approach */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Universal Resume Writing Approach</h2>
              <p className="text-lg text-muted-foreground">
                Regardless of your industry, every resume we create follows these proven principles:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-3xl text-secondary">01</span>
                  ATS Optimisation
                </h3>
                <p className="text-muted-foreground">
                  We ensure your resume passes Applicant Tracking Systems used across all industries by incorporating relevant keywords and proper formatting.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-3xl text-secondary">02</span>
                  Achievement-Focused
                </h3>
                <p className="text-muted-foreground">
                  We highlight quantifiable achievements and results, not just responsibilities—a principle that works in every field.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-3xl text-secondary">03</span>
                  Industry Research
                </h3>
                <p className="text-muted-foreground">
                  We research your specific industry to understand current trends, required skills, and the language that resonates with hiring managers.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="text-3xl text-secondary">04</span>
                  Personal Branding
                </h3>
                <p className="text-muted-foreground">
                  We craft a compelling professional narrative that showcases your unique value proposition—essential in any competitive job market.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white">
        <div className="container max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Stand Out in Your Industry?</h2>
          <p className="text-xl text-blue-100 mb-8">
            No matter your field, we'll create a resume that showcases your expertise and opens doors to your next opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
              <Link href="/about">Get Free Consultation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#1e3a5f]">
              <Link href="/services">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
