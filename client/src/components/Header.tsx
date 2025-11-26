import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      {/* Top Bar with Contact Info */}
      <div className="bg-primary/90 py-2 text-sm">
        <div className="container flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a href="tel:0410934371" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="h-4 w-4" />
              <span>0410 934 371</span>
            </a>
            <a href="mailto:admin@allresumeservices.com.au" className="hidden sm:flex items-center gap-1 hover:text-secondary transition-colors">
              <Mail className="h-4 w-4" />
              <span>admin@allresumeservices.com.au</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
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

      {/* Main Navigation */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-primary font-bold text-lg">AR</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">All Résumé Services</span>
                <span className="text-xs text-secondary">Expert Resume Writing</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="hover:text-secondary transition-colors">Services</a>
            <a href="#pricing" className="hover:text-secondary transition-colors">Pricing</a>
            <a href="#process" className="hover:text-secondary transition-colors">Our Process</a>
            <a href="#about" className="hover:text-secondary transition-colors">About Us</a>
            <Button 
              variant="default" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => document.getElementById('free-review')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Free Resume Review
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3 pb-4">
            <a href="#services" className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#pricing" className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#process" className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Our Process</a>
            <a href="#about" className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <Button 
              variant="default" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('free-review')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Free Resume Review
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
