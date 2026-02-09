import { Helmet } from 'react-helmet-async';
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
