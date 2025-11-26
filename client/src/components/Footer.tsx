import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-primary font-bold text-lg">AR</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">All Résumé Services</span>
                <span className="text-xs text-secondary">Expert Resume Writing</span>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              Professional resume writing services helping Australians land interviews and secure their dream jobs. With 17+ years of experience and a 96% interview success rate, we're your partner in career advancement.
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
                <a href="#services" className="hover:text-secondary transition-colors">Services</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-secondary transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#process" className="hover:text-secondary transition-colors">Our Process</a>
              </li>
              <li>
                <a href="/blog" className="hover:text-secondary transition-colors">Career Advice Blog</a>
              </li>
              <li>
                <a href="#about" className="hover:text-secondary transition-colors">About Us</a>
              </li>
              <li>
                <a href="#free-review" className="hover:text-secondary transition-colors">Free Review</a>
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
                <a href="/services/linkedin-optimization" className="hover:text-secondary transition-colors">LinkedIn Optimization</a>
              </li>
              <li>
                <a href="/services/selection-criteria" className="hover:text-secondary transition-colors">Selection Criteria</a>
              </li>
              <li>
                <a href="/services/career-consultation" className="hover:text-secondary transition-colors">Career Consultation</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm opacity-80">
              © {currentYear} All Résumé Services. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="YouTube">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
