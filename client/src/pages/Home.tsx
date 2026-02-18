import { Helmet } from 'react-helmet-async';
import { Link } from "wouter";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import SuccessMetrics from "@/components/SuccessMetrics";
import Testimonials from "@/components/Testimonials";

import GoogleReviewsShowcase from "@/components/GoogleReviewsShowcase";
import FeaturedCaseStudies from "@/components/FeaturedCaseStudies";
import FreeReview from "@/components/FreeReview";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import FAQSchema from "@/components/FAQSchema";
import ClientLogos from "@/components/ClientLogos";
import StickyGetStarted from "@/components/StickyGetStarted";
import BackToTop from "@/components/BackToTop";
import StructuredData from "@/components/StructuredData";
import OrganizationSchema from "@/components/OrganizationSchema";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Professional Resume Writing Services Australia | All Résumé Services</title>
        <meta name="description" content="Expert ATS-optimised resume writing services with 96% interview success rate. Professional resume writers helping Australians land their dream jobs. 18+ years experience. Get your free resume review today!" />
        <meta name="keywords" content="resume writing services, professional resume writer, ATS resume, resume writing Australia, cover letter writing, LinkedIn optimisation, LinkedIn profiles, selection criteria, government jobs, executive resume" />
        <meta name="google-site-verification" content="N74NSKO9izBqhAbFndXvQ05EE6M7k9hNHx4C-lCzaHk" />
        <link rel="canonical" href="https://allresumeservices.com.au/" />
      </Helmet>
      <SchemaMarkup type="homepage" />
      <StructuredData type="homepage" />
      <FAQSchema />
      <OrganizationSchema />
      <Header />
      <Hero />
      {/* Internal links to key pages for discoverability and indexing (GSC "Discovered - not indexed") */}
      <section className="py-6 bg-primary/5 border-y border-primary/10">
        <div className="container">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" aria-label="Explore our services and success stories">
            <Link href="/services" className="font-medium text-primary hover:text-secondary transition-colors underline underline-offset-4">Our Services</Link>
            <span className="text-muted-foreground" aria-hidden="true">·</span>
            <Link href="/case-studies" className="font-medium text-primary hover:text-secondary transition-colors underline underline-offset-4">Case Studies</Link>
            <span className="text-muted-foreground" aria-hidden="true">·</span>
            <Link href="/testimonials" className="font-medium text-primary hover:text-secondary transition-colors underline underline-offset-4">Client Testimonials</Link>
          </nav>
        </div>
      </section>
      <Stats />
      <SuccessMetrics />
      <Testimonials />
      <GoogleReviewsShowcase />
      <FeaturedCaseStudies />
      <FreeReview />
      <ClientLogos />
      <Footer />
      <StickyGetStarted />
      <BackToTop />
    </div>
  );
}
