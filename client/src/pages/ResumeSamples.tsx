import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResumeSamplesGallery from "@/components/ResumeSamplesGallery";

export default function ResumeSamples() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Resume Samples & Examples | All Resume Services</title>
        <meta name="description" content="View before and after resume transformations. See real examples of how our professional resume writing services help clients land interviews and secure their dream jobs." />
      </Helmet>
      <Header />
      <ResumeSamplesGallery />
      <Footer />
    </div>
  );
}
