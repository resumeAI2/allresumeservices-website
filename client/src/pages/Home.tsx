import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FeaturedCaseStudies from "@/components/FeaturedCaseStudies";
import FreeReview from "@/components/FreeReview";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SchemaMarkup type="homepage" />
      <Header />
      <Hero />
      <Stats />
      <Services />
      <Process />
      <Pricing />
      <Testimonials />
      <FeaturedCaseStudies />
      <FreeReview />
      <Footer />
    </div>
  );
}
