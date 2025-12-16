import { Button } from "@/components/ui/button";
import { Upload, ArrowRight, Star, ExternalLink } from "lucide-react";
import { useABTest, trackABTestConversion } from "@/hooks/useABTest";

export default function Hero() {
  // A/B test for primary CTA button text
  const ctaVariant = useABTest({
    testName: 'hero-primary-cta',
    variants: [
      { id: 'a', text: 'Get FREE Resume Review' },
      { id: 'b', text: 'Start Your Career Transformation' },
      { id: 'c', text: 'Get Your Free Quote Now' }
    ]
  });

  const handleCTAClick = () => {
    trackABTestConversion('hero-primary-cta', ctaVariant.id);
    document.getElementById('free-review')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[600px] flex items-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      
      <div className="container relative z-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              ✨ 18+ Years of Professional Excellence
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Get Noticed,<br />
              Get Hired with</span><br />
              <span className="text-secondary">All Resume Services</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-xl">
              Expert ATS-Optimised Resumes & Cover Letters that help Australians land interviews and secure their dream jobs. 96% Interview Success Rate.
            </p>

            {/* Google Reviews Badge */}
            <a 
              href="https://g.page/ALLRESUMESERVICES-REVIEWS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all rounded-full px-5 py-3 border border-white/20 group"
            >
              <img 
                src="/5-star-logo.png" 
                alt="5 Star Rating" 
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">5.0 on Google</span>
                <span className="text-xs text-primary-foreground/80">60+ verified reviews</span>
              </div>
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={handleCTAClick}
              >
                <Upload className="mr-2 h-5 w-5" />
                {ctaVariant.text}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span>ATS Optimisation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span>Professional Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span>2-3 Day Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image Card */}
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <img 
                  src="/success-image.jpg" 
                  alt="Professional success" 
                  className="rounded-xl w-full h-auto shadow-lg"
                />
                <div className="mt-6 text-center">
                  <p className="text-lg font-semibold italic">
                    "The key to landing the interview is having a Resume that Stands Out"
                  </p>
                  <p className="text-sm mt-2 text-primary-foreground/80">
                    ...and that's exactly what we can do for you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
