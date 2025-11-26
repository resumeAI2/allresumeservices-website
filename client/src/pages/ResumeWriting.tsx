import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Target, Zap, Award } from "lucide-react";
import { Link } from "wouter";

export default function ResumeWriting() {
  const benefits = [
    "Professionally written to highlight your strengths and achievements",
    "ATS-optimized formatting to pass applicant tracking systems",
    "Tailored to your target role and industry",
    "Clear, concise, and impactful language",
    "Delivered in both Word and PDF formats",

    "2-3 day standard turnaround (1-day express available)"
  ];

  const features = [
    {
      icon: Target,
      title: "Targeted Content",
      description: "We craft your resume to align with specific job descriptions and industry requirements, ensuring maximum relevance."
    },
    {
      icon: Zap,
      title: "ATS Optimization",
      description: "Your resume will be formatted to pass through Applicant Tracking Systems, the first hurdle in modern job applications."
    },
    {
      icon: Award,
      title: "Achievement Focus",
      description: "We emphasize quantifiable achievements and results rather than just listing duties, making your impact clear."
    },
    {
      icon: FileText,
      title: "Professional Formatting",
      description: "Clean, modern design that's easy to read while maintaining professional standards expected by recruiters."
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
              Professional Resume Writing Services
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Stand out from the competition with a professionally crafted resume that showcases your unique value and gets you noticed by employers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => window.location.href = '/#free-review'}
              >
                Get Free Resume Review
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
              Why Professional Resume Writing Matters
            </h2>
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground leading-relaxed">
                In today's competitive job market, your resume is often your first—and sometimes only—chance to make an impression. With recruiters spending an average of just 6-7 seconds reviewing each resume, and Applicant Tracking Systems (ATS) filtering out up to 75% of applications before they even reach human eyes, having a professionally written resume isn't just an advantage—it's essential.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our expert resume writers understand what employers are looking for and how to present your experience, skills, and achievements in a way that captures attention and demonstrates your value. We don't just list your job history; we tell your professional story in a compelling way that positions you as the ideal candidate.
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
                What's Included in Our Resume Writing Service
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

            {/* Process Overview */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Our Resume Writing Process
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Free Assessment</h4>
                    <p className="text-muted-foreground">We review your current resume and discuss your career goals to understand your needs.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Information Gathering</h4>
                    <p className="text-muted-foreground">We collect detailed information about your work history, achievements, and target roles.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Professional Writing</h4>
                    <p className="text-muted-foreground">Our expert writers craft your resume with compelling content and ATS-friendly formatting.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Review & Revisions</h4>
                    <p className="text-muted-foreground">You review the draft and we work together to refine it until it's perfect.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Final Delivery</h4>
                    <p className="text-muted-foreground">Receive your polished resume in Word and PDF formats, ready to send to employers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Resume?
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Get started with a free resume review and see how we can help you land more interviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={() => window.location.href = '/#free-review'}
                >
                  Get Free Resume Review
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
