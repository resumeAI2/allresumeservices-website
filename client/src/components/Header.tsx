import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "../contexts/CartContext";
import { Badge } from "./ui/badge";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

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
            <Link href="/services" className="hover:text-secondary transition-colors">Services</Link>
            <a href="#pricing" className="hover:text-secondary transition-colors">Pricing</a>
            <a href="#process" className="hover:text-secondary transition-colors">Our Process</a>
            <Link href="/blog" className="hover:text-secondary transition-colors">Career Advice Blog</Link>
            <Link href="/faq" className="hover:text-secondary transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link>
            <Link href="/about" className="hover:text-secondary transition-colors">About Us</Link>
            <Link href="/cart" className="relative hover:text-secondary transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Link>
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
            <Link href="/blog" className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Career Advice Blog</Link>
            <Link href="/faq" className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <Link href="/contact" className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link href="/about" className="hover:text-secondary transition-colors" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
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
