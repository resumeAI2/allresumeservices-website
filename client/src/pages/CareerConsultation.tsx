import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Compass, Target, TrendingUp, Users } from "lucide-react";

export default function CareerConsultation() {
  const benefits = [
    "One-on-one consultation with career experts",
    "Personalised career strategy and action plan",
    "Industry insights and market trends analysis",
    "Job search strategy and techniques",
    "Interview preparation and coaching",
    "Salary negotiation guidance",
    "Ongoing support and follow-up"
  ];

  const features = [
    {
      icon: Compass,
      title: "Career Direction",
      description: "Clarify your career goals and identify the best path forward based on your skills, interests, and market opportunities."
    },
    {
      icon: Target,
      title: "Job Search Strategy",
      description: "Develop an effective job search plan that targets the right opportunities and maximises your chances of success."
    },
    {
      icon: TrendingUp,
      title: "Career Advancement",
      description: "Learn strategies to accelerate your career progression, whether through promotions, career changes, or skill development."
    },
    {
      icon: Users,
      title: "Personal Branding",
      description: "Build a compelling professional brand that differentiates you in the marketplace and attracts opportunities."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#1e3a5f] text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Career Consultation Services
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Get expert guidance to navigate your career journey, make strategic decisions, and achieve your professional goals with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => window.location.href = 'tel:0410934371'}
              >
                Book a Consultation
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => window.location.href = 'mailto:admin@allresumeservices.com.au'}
              >
                Email Us
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
              Why Career Consultation?
            </h2>
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground leading-relaxed">
                Navigating your career can be challenging, whether you're just starting out, considering a career change, seeking advancement, or facing unexpected transitions. Having an experienced career consultant in your corner can make the difference between feeling stuck and moving forward with clarity and confidence.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our career consultation services provide personalised guidance tailored to your unique situation, goals, and challenges. We combine industry expertise, market knowledge, and proven strategies to help you make informed decisions and take purposeful action toward your career aspirations.
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
                What's Included in Career Consultation
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

            {/* Who Benefits */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Who Benefits from Career Consultation?
              </h3>
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Career Changers</h4>
                  <p className="text-muted-foreground">Transitioning to a new industry or role? We'll help you identify transferable skills, position yourself effectively, and navigate the change successfully.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Job Seekers</h4>
                  <p className="text-muted-foreground">Struggling with your job search? We'll develop a targeted strategy, optimise your approach, and help you stand out to employers.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Career Advancers</h4>
                  <p className="text-muted-foreground">Ready to move up but not sure how? We'll create a roadmap for advancement, including skill development and positioning strategies.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Recent Graduates</h4>
                  <p className="text-muted-foreground">Starting your career? We'll help you understand the job market, develop your professional brand, and launch your career successfully.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Returning Professionals</h4>
                  <p className="text-muted-foreground">Re-entering the workforce after a break? We'll help you address gaps, update your skills, and position yourself competitively.</p>
                </div>
              </div>
            </div>

            {/* Consultation Topics */}
            <div className="bg-secondary/10 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Common Consultation Topics
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Career path planning and goal setting</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Job search strategies and techniques</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Resume and LinkedIn optimisation</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Interview preparation and practice</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Networking strategies</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Salary negotiation tactics</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Career transition planning</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Professional development planning</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Work-life balance strategies</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Personal branding and positioning</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How It Works */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                How Career Consultation Works
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Initial Contact</h4>
                    <p className="text-muted-foreground">Call or email us to schedule your consultation and discuss your specific needs and goals.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Preparation</h4>
                    <p className="text-muted-foreground">We'll ask you to share relevant documents and information to make the most of our time together.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Consultation Session</h4>
                    <p className="text-muted-foreground">We'll have an in-depth discussion about your situation, goals, and challenges, and develop actionable strategies.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Action Plan</h4>
                    <p className="text-muted-foreground">You'll receive a personalised action plan with specific steps to achieve your career goals.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Follow-Up Support</h4>
                    <p className="text-muted-foreground">We're available for follow-up questions and ongoing support as you implement your plan.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Take Control of Your Career?
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Schedule a consultation today and get expert guidance to achieve your professional goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  onClick={() => window.location.href = 'tel:0410934371'}
                >
                  Call 0410 934 371
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => window.location.href = 'mailto:admin@allresumeservices.com.au'}
                >
                  Email Us
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
