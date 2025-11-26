import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileCheck, Target, Award, Briefcase } from "lucide-react";

export default function SelectionCriteria() {
  const benefits = [
    "Comprehensive responses to all selection criteria",
    "STAR method (Situation, Task, Action, Result) formatting",
    "Specific examples that demonstrate your capabilities",
    "Alignment with position requirements",
    "Professional language and tone",
    "Delivered in Word and PDF formats",
    "Unlimited revisions included"
  ];

  const features = [
    {
      icon: Target,
      title: "Targeted Responses",
      description: "Each criterion is addressed specifically and comprehensively, demonstrating exactly how you meet the requirements."
    },
    {
      icon: Award,
      title: "Evidence-Based",
      description: "We use concrete examples and achievements from your experience to prove your capabilities."
    },
    {
      icon: FileCheck,
      title: "STAR Framework",
      description: "Responses follow the proven STAR method that selection panels expect and value."
    },
    {
      icon: Briefcase,
      title: "Government Expertise",
      description: "We understand the specific requirements and expectations of government and corporate selection processes."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Selection Criteria Writing Services
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Master the art of addressing selection criteria with professionally written responses that demonstrate your perfect fit for government and corporate roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => window.location.href = '/#free-review'}
              >
                Get Expert Help
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => window.location.href = '/#pricing'}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              What Are Selection Criteria?
            </h2>
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground leading-relaxed">
                Selection criteria are specific requirements listed in job advertisements, particularly common in government, public sector, and large corporate roles. They outline the essential and desirable skills, knowledge, qualifications, and experience needed for the position. Applicants must address each criterion separately, providing evidence of how they meet the requirements.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Writing effective selection criteria responses is challenging—you need to be specific without being verbose, provide concrete examples without repeating your resume, and demonstrate your capabilities convincingly. Our expert writers understand what selection panels look for and how to present your experience in the most compelling way possible.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-lg p-6 shadow-md">
                  <feature.icon className="h-10 w-10 text-secondary mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* What's Included */}
            <div className="bg-accent/50 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                What's Included in Our Selection Criteria Service
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The STAR Method */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                The STAR Method We Use
              </h3>
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                      S
                    </div>
                    <h4 className="font-semibold text-card-foreground">Situation</h4>
                  </div>
                  <p className="text-muted-foreground ml-13">Set the context by describing the situation or challenge you faced.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                      T
                    </div>
                    <h4 className="font-semibold text-card-foreground">Task</h4>
                  </div>
                  <p className="text-muted-foreground ml-13">Explain your specific responsibility or objective in that situation.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                      A
                    </div>
                    <h4 className="font-semibold text-card-foreground">Action</h4>
                  </div>
                  <p className="text-muted-foreground ml-13">Detail the specific actions you took to address the task or challenge.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                      R
                    </div>
                    <h4 className="font-semibold text-card-foreground">Result</h4>
                  </div>
                  <p className="text-muted-foreground ml-13">Describe the positive outcomes and quantifiable results of your actions.</p>
                </div>
              </div>
            </div>

            {/* Common Selection Criteria */}
            <div className="bg-secondary/10 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Common Selection Criteria We Address
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Communication skills</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Leadership and management</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Problem-solving abilities</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Teamwork and collaboration</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Technical expertise</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Project management</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Change management</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Stakeholder engagement</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Ace Your Selection Criteria?
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Let our experts craft compelling responses that demonstrate your perfect fit for the role.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={() => window.location.href = '/#free-review'}
                >
                  Get Started Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => window.location.href = 'tel:0410934371'}
                >
                  Call 0410 934 371
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
