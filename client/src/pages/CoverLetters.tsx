import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Target, Sparkles, TrendingUp } from "lucide-react";
import { TrustQuote } from "@/components/GoogleTestimonials";

export default function CoverLetters() {
  const benefits = [
    "Customized to the specific job and company",
    "Compelling opening that captures attention",
    "Clear demonstration of your value proposition",
    "Professional tone tailored to your industry",
    "ATS-friendly formatting",
    "Delivered in Word and PDF formats",

  ];

  const clientReview = <div className="mb-12 bg-card rounded-lg p-8 border-l-4 border-secondary"><TrustQuote tag="cover letter" /></div>;

  const features = [
    {
      icon: Target,
      title: "Job-Specific Targeting",
      description: "Each cover letter is tailored to the specific role and company, demonstrating your genuine interest and fit."
    },
    {
      icon: Sparkles,
      title: "Compelling Storytelling",
      description: "We craft a narrative that connects your experience to the employer's needs, making you memorable."
    },
    {
      icon: TrendingUp,
      title: "Value Demonstration",
      description: "We clearly articulate how you'll contribute to the organisation's success from day one."
    },
    {
      icon: Mail,
      title: "Professional Polish",
      description: "Perfect grammar, appropriate tone, and professional formatting that reflects your attention to detail."
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
              Professional Cover Letter Writing
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Make a powerful first impression with a compelling cover letter that showcases your personality, passion, and perfect fit for the role.
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
              Why Your Cover Letter Matters
            </h2>
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground leading-relaxed">
                While your resume lists your qualifications, your cover letter tells your story. It's your opportunity to demonstrate your enthusiasm for the role, explain why you're the perfect fit, and show the hiring manager the person behind the credentials. A well-crafted cover letter can be the difference between getting an interview and being overlooked.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Many job seekers struggle with cover letters—they either write generic templates that fail to engage, or they ramble without making a clear point. Our professional writers know how to strike the perfect balance: personalized, concise, and compelling content that makes hiring managers want to learn more about you.
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
                What's Included in Our Cover Letter Service
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

            {/* Client Review */}
            {clientReview}

            {/* When You Need a Cover Letter */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                When Do You Need a Cover Letter?
              </h3>
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Job Applications</h4>
                  <p className="text-muted-foreground">Even when not required, a strong cover letter sets you apart from candidates who only submit a resume.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Career Transitions</h4>
                  <p className="text-muted-foreground">Explain your career change and demonstrate how your transferable skills apply to the new role.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Employment Gaps</h4>
                  <p className="text-muted-foreground">Address gaps in your work history proactively and positively, focusing on what you learned during that time.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Networking Opportunities</h4>
                  <p className="text-muted-foreground">Introduce yourself to potential employers or contacts with a professional, engaging letter.</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Make a Lasting Impression?
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Let us craft a cover letter that opens doors and gets you noticed by hiring managers.
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
