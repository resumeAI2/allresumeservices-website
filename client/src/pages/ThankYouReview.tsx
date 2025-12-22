import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Mail, Phone, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";

export default function ThankYouReview() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground py-20">
        <div className="container max-w-4xl">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary rounded-full mb-6 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Thank You for Your Submission!
            </h1>
            
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              We've received your resume and will provide you with a comprehensive free review within 24-48 hours.
            </p>
          </div>

          {/* What Happens Next */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">What Happens Next?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Expert Review</h3>
                  <p className="opacity-90">
                    Our professional resume writers will carefully analyze your resume, evaluating its structure, content, ATS compatibility, and overall effectiveness.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Detailed Feedback</h3>
                  <p className="opacity-90">
                    You'll receive personalized recommendations on how to improve your resume, including specific suggestions for content, formatting, and keyword optimization.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Custom Quote</h3>
                  <p className="opacity-90">
                    If you'd like us to professionally rewrite your resume, we'll provide a tailored quote based on your experience level and career goals.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Expected Timeline */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 mb-8">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-secondary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Expected Response Time</h3>
                <p className="opacity-90">
                  We typically respond within <strong className="text-secondary">24-48 hours</strong> during business days. 
                  If you submitted your resume on a weekend or public holiday, we'll get back to you on the next business day.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4 text-center">Need to Reach Us?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:0410934371" 
                className="flex items-center gap-2 justify-center hover:text-secondary transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>0410 934 371</span>
              </a>
              <a 
                href="mailto:admin@allresumeservices.com.au" 
                className="flex items-center gap-2 justify-center hover:text-secondary transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>admin@allresumeservices.com.au</span>
              </a>
            </div>
          </Card>

          {/* Helpful Resources */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">While You Wait...</h3>
            <p className="mb-6 opacity-90">
              Explore our resources to learn more about resume writing and career development
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Read Career Tips
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/services">
                <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90">
                  View Our Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
