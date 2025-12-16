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
import IndustryStatistics from "@/components/IndustryStatistics";
import EmailCapturePopup from "@/components/EmailCapturePopup";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Professional Resume Writing Services Australia | All Resume Services</title>
        <meta name="description" content="Expert ATS-optimised resume writing services with 96% interview success rate. Professional resume writers helping Australians land their dream jobs. 18+ years experience. Get your free resume review today!" />
        <meta name="keywords" content="resume writing services, professional resume writer, ATS resume, resume writing Australia, cover letter writing, LinkedIn optimisation, executive resume" />
      </Helmet>
      <SchemaMarkup type="homepage" />
      <FAQSchema />
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
      <IndustryStatistics />
      <ClientLogos />
      <Footer />
      <EmailCapturePopup />
    </div>
  );
}
