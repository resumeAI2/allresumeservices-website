import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function PricingCTA() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-full border border-secondary/20">
                <img 
                  src="/5-star-logo.png" 
                  alt="5 Star Rating" 
                  className="h-10 w-10 object-contain"
                  loading="lazy"
                />
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">5.0 Rating</div>
                  <div className="text-xs text-muted-foreground">60+ verified reviews</div>
                </div>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Professional Resume & Cover Letter Services
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Resumes and cover letters, LinkedIn profiles, and selection criteria for government and public sector roles. Transparent pricing from $155 AUD.
            </p>
          </div>

          {/* Package Deals */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Package Deals <span className="text-secondary">(Best Value)</span></h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <a href="/packages#services" className="block">
              <div className="bg-white rounded-lg p-6 border-2 border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                <h3 className="text-xl font-bold text-foreground mb-2">Basic</h3>
                <div className="text-3xl font-bold text-primary mb-3">$155</div>
                <p className="text-sm text-gray-700">Resume + Cover Letter</p>
              </div>
            </a>
            <a href="/packages#services" className="block">
              <div className="bg-white rounded-lg p-6 border-2 border-primary shadow-lg relative cursor-pointer h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Standard</h3>
                <div className="text-3xl font-bold text-primary mb-3">$255</div>
                <p className="text-sm text-gray-700">Resume + Cover Letter + LinkedIn</p>
              </div>
            </a>
            <a href="/packages#services" className="block">
              <div className="bg-white rounded-lg p-6 border-2 border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
                <h3 className="text-xl font-bold text-foreground mb-2">Premium</h3>
                <div className="text-3xl font-bold text-primary mb-3">$355</div>
                <p className="text-sm text-gray-700">Executive Resume + Cover + LinkedIn</p>
              </div>
            </a>
          </div>

          {/* Individual Services */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Or Choose Individual Services</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <a href="/packages#services" className="block">
              <div className="bg-white rounded-lg p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="text-xl font-bold text-primary mb-1">$125</div>
                <p className="text-xs text-gray-700">Entry Level Resume</p>
              </div>
            </a>
            <a href="/packages#services" className="block">
              <div className="bg-white rounded-lg p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="text-xl font-bold text-primary mb-1">$185</div>
                <p className="text-xs text-gray-700">Professional Resume</p>
              </div>
            </a>
            <a href="/packages#services" className="block">
              <div className="bg-white rounded-lg p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="text-xl font-bold text-primary mb-1">$55</div>
                <p className="text-xs text-gray-700">Cover Letter</p>
              </div>
            </a>
            <a href="/packages#services" className="block">
              <div className="bg-white rounded-lg p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer text-center">
                <div className="text-xl font-bold text-primary mb-1">$125</div>
                <p className="text-xs text-gray-700">LinkedIn Profile</p>
              </div>
            </a>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground">ATS-Optimised Formatting</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground">Fast 1-3 Day Turnaround</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground">100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
              <span className="text-sm text-foreground">Unlimited Revisions</span>
            </div>
          </div>

          {/* CTA Button */}
          <a href="/packages#services">
            <button className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              Browse All Services & Add to Cart
              <ArrowRight className="h-5 w-5" />
            </button>
          </a>

          {/* Custom Quote */}
          <p className="mt-6 text-sm text-gray-700">
            Need a custom solution? <Link href="/contact" className="text-primary hover:underline font-semibold">Contact us</Link> for a personalized quote
          </p>
        </div>
      </div>
    </section>
  );
}
