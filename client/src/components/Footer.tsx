import { Phone, Mail, MapPin, Award, CheckCircle2, Users, Shield } from 'lucide-react';


export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid md:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo-v2.svg" 
                alt="All Resume Services Logo" 
                className="h-16 w-auto object-contain drop-shadow-lg"
              />
              <div className="flex flex-col">
                <span className="text-xs text-secondary">Expert Resume Writing</span>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              Professional resume writing services helping Australians land interviews and secure their dream jobs. With 18+ years of experience and a 96% interview success rate, we're your partner in career advancement.
            </p>
            <div className="space-y-2">
              <a href="tel:0410934371" className="flex items-center gap-2 text-sm hover:text-secondary transition-colors">
                <Phone className="h-4 w-4" />
                <span>0410 934 371</span>
              </a>
              <a href="mailto:admin@allresumeservices.com.au" className="flex items-center gap-2 text-sm hover:text-secondary transition-colors">
                <Mail className="h-4 w-4" />
                <span>admin@allresumeservices.com.au</span>
              </a>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Australia-wide service</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/pricing" className="hover:text-secondary transition-colors">Services & Pricing</a>
              </li>
              <li>
                <a href="/process" className="hover:text-secondary transition-colors">Our Process</a>
              </li>
              <li>
                <a href="/blog" className="hover:text-secondary transition-colors">Career Advice Blog</a>
              </li>
            </ul>
          </div>

          {/* Success Stories */}
          <div>
            <h3 className="font-semibold mb-4">Success Stories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/testimonials" className="hover:text-secondary transition-colors">Client Reviews</a>
              </li>
              <li>
                <a href="/case-studies" className="hover:text-secondary transition-colors">Case Studies</a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-secondary transition-colors">About Us</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/resume-transformation" className="hover:text-secondary transition-colors">Resume Transformation</a>
              </li>
              <li>
                <a href="/blog" className="hover:text-secondary transition-colors">Career Advice Blog</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/services/resume-writing" className="hover:text-secondary transition-colors">Resume Writing</a>
              </li>
              <li>
                <a href="/services/cover-letters" className="hover:text-secondary transition-colors">Cover Letters</a>
              </li>
              <li>
                <a href="/services/linkedin-optimisation" className="hover:text-secondary transition-colors">LinkedIn Optimisation</a>
              </li>
              <li>
                <a href="/services/selection-criteria" className="hover:text-secondary transition-colors">Selection Criteria</a>
              </li>
              <li>
                <a href="/services/career-consultation" className="hover:text-secondary transition-colors">Career Consultation</a>
              </li>
            </ul>
          </div>

          {/* Industry Expertise */}
          <div>
            <h3 className="font-semibold mb-4">Industry Expertise</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/industries/mining-resources" className="hover:text-secondary transition-colors">Mining & Resources</a>
              </li>
              <li>
                <a href="/industries/healthcare" className="hover:text-secondary transition-colors">Healthcare</a>
              </li>
              <li>
                <a href="/industries/government" className="hover:text-secondary transition-colors">Government & Public Sector</a>
              </li>
              <li>
                <a href="/industries/it-technology" className="hover:text-secondary transition-colors">IT & Technology</a>
              </li>
            </ul>
            <p className="text-xs opacity-75 mt-3 italic">+ All industries & career levels</p>
          </div>
        </div>

        {/* Certification Badges */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="text-center">
            <h3 className="font-semibold mb-6 text-lg">Trusted & Certified</h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {/* 18+ Years Badge */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <p className="text-xs font-medium">18+ Years</p>
                <p className="text-xs opacity-75">Experience</p>
              </div>

              {/* 96% Success Rate Badge */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-8 w-8 text-secondary" />
                </div>
                <p className="text-xs font-medium">96% Success</p>
                <p className="text-xs opacity-75">Interview Rate</p>
              </div>

              {/* 5000+ Clients Badge */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <p className="text-xs font-medium">5,000+</p>
                <p className="text-xs opacity-75">Clients Served</p>
              </div>

              {/* Australian Owned Badge */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
                  <MapPin className="h-8 w-8 text-secondary" />
                </div>
                <p className="text-xs font-medium">Australian</p>
                <p className="text-xs opacity-75">Owned & Operated</p>
              </div>

              {/* 100% Satisfaction Badge */}
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center mb-2">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <p className="text-xs font-medium">100%</p>
                <p className="text-xs opacity-75">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-8 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-80">
              © {currentYear} All Résumé Services. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="https://au.linkedin.com/in/sonialynch" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@All-ResumeServices" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="YouTube">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/allresumeservices" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/allresumeservicesofficial/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
