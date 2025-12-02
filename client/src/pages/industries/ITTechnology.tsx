import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { CheckCircle2, Code, Cloud, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ITTechnology() {
  const benefits = [
    {
      icon: Code,
      title: "Tech Industry Expertise",
      description: "Deep understanding of IT roles, tech stacks, and industry trends across Australia"
    },
    {
      icon: Cloud,
      title: "Technical Skills Showcase",
      description: "Highlight your programming languages, frameworks, and cloud platforms effectively"
    },
    {
      icon: Database,
      title: "Project & Achievement Focus",
      description: "Emphasise your technical projects, system implementations, and measurable outcomes"
    }
  ];

  const keywords = [
    "Software Development", "Full Stack", "DevOps", "Cloud Computing", "AWS", "Azure",
    "Kubernetes", "Docker", "CI/CD", "Agile", "Scrum", "Python", "JavaScript",
    "React", "Node.js", "Java", "C#", ".NET", "SQL", "NoSQL", "MongoDB",
    "Microservices", "API Development", "System Architecture", "Cybersecurity",
    "Network Administration", "IT Support", "Help Desk", "ITIL", "ServiceNow"
  ];

  const roles = [
    "Software Engineers", "Full Stack Developers", "DevOps Engineers",
    "Cloud Architects", "Data Engineers", "Business Analysts",
    "IT Project Managers", "Scrum Masters", "Product Owners",
    "Cybersecurity Specialists", "Network Engineers", "System Administrators",
    "IT Support Specialists", "Database Administrators", "QA Engineers"
  ];

  return (
    <>
      <Helmet>
        <title>IT & Technology Resume Writing | All Résumé Services</title>
        <meta name="description" content="Professional resume writing for IT and technology professionals. Software engineers, developers, DevOps, cloud architects, and IT specialists." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              IT & Technology Resume Writing
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Specialist resume writing for IT professionals, software engineers, and technology specialists seeking roles across Australia's tech sector
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link href="/contact">Get Your Free Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-900">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Tech Professionals Choose Us</h2>
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
            <h2 className="text-3xl font-bold text-center mb-6">Technology Keywords We Use</h2>
            <p className="text-center text-muted-foreground mb-8">
              We strategically incorporate tech industry keywords to ensure your resume passes ATS screening and reaches hiring managers
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
            <h2 className="text-3xl font-bold text-center mb-6">IT Roles We Specialise In</h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">What's Included in Your Tech Resume</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Skills Matrix</h3>
                <p className="text-muted-foreground mb-4">
                  We create a clear, scannable technical skills section showcasing your programming languages, frameworks, tools, and platforms.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Programming languages and frameworks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Cloud platforms and DevOps tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Databases, methodologies, and certifications</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Project Achievements</h3>
                <p className="text-muted-foreground mb-4">
                  Clear presentation of your technical projects, system implementations, and quantifiable business outcomes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>System architecture and design decisions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Performance improvements and optimisations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Business impact and ROI metrics</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Agile & Collaboration</h3>
                <p className="text-muted-foreground mb-4">
                  Emphasise your experience with Agile methodologies, cross-functional collaboration, and modern development practices.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Scrum, Kanban, and Agile practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Cross-functional team collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Code reviews and mentoring experience</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">ATS Optimisation for Tech Companies</h3>
                <p className="text-muted-foreground mb-4">
                  Formatted to pass applicant tracking systems used by tech companies, startups, and enterprise organisations.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Tech-specific keywords and terminology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>Clean formatting that ATS can parse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span>GitHub/portfolio links integration</span>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your Tech Career?</h2>
            <p className="text-lg mb-8 opacity-90">
              Let our tech industry specialists create a resume that showcases your technical skills, projects, and achievements to stand out to hiring managers.
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
