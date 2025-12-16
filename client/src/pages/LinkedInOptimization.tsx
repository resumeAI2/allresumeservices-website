import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ServiceComparisonTable from "@/components/ServiceComparisonTable";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Linkedin, Users, Search, TrendingUp } from "lucide-react";

export default function LinkedInOptimization() {
  const benefits = [
    "Compelling headline that captures attention",
    "Keyword-optimised summary and experience sections",
    "Achievement-focused content that demonstrates value",
    "Professional tone appropriate for your industry",
    "Strategic use of LinkedIn's features and sections",
    "Guidance on profile photo and banner selection",

  ];

  const features = [
    {
      icon: Search,
      title: "Search Optimization",
      description: "We strategically incorporate keywords so recruiters can easily find you when searching for candidates with your skills."
    },
    {
      icon: Users,
      title: "Network Building",
      description: "An optimised profile attracts connections, opportunities, and engagement from your professional network."
    },
    {
      icon: TrendingUp,
      title: "Personal Branding",
      description: "We craft a compelling narrative that positions you as an expert and thought leader in your field."
    },
    {
      icon: Linkedin,
      title: "Complete Profile",
      description: "We optimise every section of your LinkedIn profile to maximize visibility and credibility."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container">
        <Breadcrumb items={[
          { label: "Services", href: "/services" },
          { label: "LinkedIn Optimization" }
        ]} />
      </div>
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#1e3a5f] text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
              LinkedIn Profile Optimisation
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Transform your LinkedIn profile into a powerful personal brand that attracts recruiters, opportunities, and professional connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => window.location.href = '/#free-review'}
              >
                Optimize My Profile
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
              Why LinkedIn Optimisation Matters
            </h2>
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-muted-foreground leading-relaxed">
                LinkedIn isn't just a digital resume—it's your professional storefront, networking hub, and personal brand all in one. With over 900 million users and recruiters actively searching for candidates daily, an optimised LinkedIn profile can dramatically increase your visibility and career opportunities.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                However, most professionals struggle to present themselves effectively on LinkedIn. Generic headlines, keyword-poor summaries, and incomplete profiles mean missed opportunities. Our LinkedIn optimisation service ensures your profile stands out, ranks high in recruiter searches, and compellingly communicates your professional value.
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
                What's Included in LinkedIn Optimisation
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

            {/* Key Sections We Optimize */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Key Sections We Optimize
              </h3>
              <div className="space-y-4">
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Headline</h4>
                  <p className="text-muted-foreground">Your headline appears in search results and is the first thing people see. We craft a compelling, keyword-rich headline that captures attention.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">About/Summary</h4>
                  <p className="text-muted-foreground">We write a compelling summary that tells your professional story, highlights your expertise, and includes strategic keywords for searchability.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Experience</h4>
                  <p className="text-muted-foreground">We reframe your work history to emphasize achievements and impact, using language that resonates with your target audience.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Skills & Endorsements</h4>
                  <p className="text-muted-foreground">We identify and prioritize the most relevant skills for your industry and career goals, improving your search ranking.</p>
                </div>
                <div className="bg-card rounded-lg p-6">
                  <h4 className="font-semibold text-card-foreground mb-2">Featured Section</h4>
                  <p className="text-muted-foreground">We help you showcase your best work, articles, projects, or media to demonstrate your expertise and accomplishments.</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-secondary/10 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                The LinkedIn Advantage
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">87%</div>
                  <p className="text-muted-foreground">of recruiters use LinkedIn to find candidates</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">40x</div>
                  <p className="text-muted-foreground">more likely to receive opportunities with a complete profile</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">3x</div>
                  <p className="text-muted-foreground">more profile views with professional optimisation</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Boost Your LinkedIn Presence?
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Let us transform your LinkedIn profile into a powerful tool for career advancement and professional networking.
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
      {/* Service Comparison Table */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Compare Our Service Packages
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose the package that best fits your career goals and budget
              </p>
            </div>
            <ServiceComparisonTable />
          </div>
        </div>
      </section>

      {/* Frequently Bought Together */}
      <FrequentlyBoughtTogether currentService="linkedin" />



      <Footer />
    </div>
  );
}
