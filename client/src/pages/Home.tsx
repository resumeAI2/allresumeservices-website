import { Helmet } from 'react-helmet-async';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import SuccessMetrics from "@/components/SuccessMetrics";
import Services from "@/components/Services";
import Process from "@/components/Process";
import PricingCTA from "@/components/PricingCTA";
import Testimonials from "@/components/Testimonials";

import GoogleReviewsShowcase from "@/components/GoogleReviewsShowcase";
import FeaturedCaseStudies from "@/components/FeaturedCaseStudies";
import FAQ from "@/components/FAQ";
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
        <meta name="description" content="Expert ATS-optimised resume, cover letter, and LinkedIn profile writing services with 96% interview success rate. Professional writers helping Australians land their dream jobs. 18+ years experience. Free consultation today!" />
        <meta name="keywords" content="resume writing services, professional resume writer, ATS resume, resume writing Australia, cover letter writing, LinkedIn optimisation, executive resume" />
        <link rel="canonical" href="https://allresumeservices.com.au/" />
      </Helmet>
      <SchemaMarkup type="homepage" />
      <StructuredData type="homepage" />
      <FAQSchema />
      <OrganizationSchema />
      <Header />
      <Hero />
      <Stats />
      <SuccessMetrics />
      <Services />
      <Process />
      <PricingCTA />
      <Testimonials />
      <GoogleReviewsShowcase />
      <FeaturedCaseStudies />
      <FAQ />
      <FreeReview />
      <ClientLogos />
      <Footer />
      <StickyGetStarted />
      <BackToTop />
    </div>
  );
}
