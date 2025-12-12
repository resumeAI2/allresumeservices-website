import { Helmet } from 'react-helmet-async';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import SuccessMetrics from "@/components/SuccessMetrics";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import { TestimonialSlider } from "@/components/GoogleTestimonials";
import GoogleReviewsShowcase from "@/components/GoogleReviewsShowcase";
import FeaturedCaseStudies from "@/components/FeaturedCaseStudies";
import FAQ from "@/components/FAQ";
import FreeReview from "@/components/FreeReview";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import ClientLogos from "@/components/ClientLogos";
import EmailCapturePopup from "@/components/EmailCapturePopup";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Professional Resume Writing Services Australia | All Resume Services</title>
        <meta name="description" content="Expert ATS-optimized resume writing services with 96% interview success rate. Professional resume writers helping Australians land their dream jobs. 17+ years experience. Get your free resume review today!" />
        <meta name="keywords" content="resume writing services, professional resume writer, ATS resume, resume writing Australia, cover letter writing, LinkedIn optimization, executive resume" />
      </Helmet>
      <SchemaMarkup type="homepage" />
      <Header />
      <Hero />
      <Stats />
      <ClientLogos />
      <SuccessMetrics />
      <Services />
      <Process />
      <Pricing />
      <Testimonials />
      <TestimonialSlider />
      <GoogleReviewsShowcase />
      <FeaturedCaseStudies />
      <FAQ />
      <FreeReview />
      <Footer />
      <EmailCapturePopup />
    </div>
  );
}
