import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from 'react-helmet-async';
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import ResumeWriting from "./pages/ResumeWriting";
import CoverLetters from "./pages/CoverLetters";
import LinkedInOptimization from "./pages/LinkedInOptimization";
import SelectionCriteria from "./pages/SelectionCriteria";
import CareerConsultation from "./pages/CareerConsultation";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlog from "./pages/AdminBlog";
import BlogEditor from "./pages/BlogEditor";
import MediaLibrary from "./pages/MediaLibrary";
import FAQ from "./pages/FAQ";
import FaqAnalytics from "./pages/FaqAnalytics";
import Contact from "./pages/Contact";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminCategories from "./pages/AdminCategories";
import AdminTags from "./pages/AdminTags";
import BlogSchedule from "./pages/BlogSchedule";
import BlogAnalytics from "./pages/BlogAnalytics";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContacts from "./pages/AdminContacts";
import Services from "./pages/Services";
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AboutUs from './pages/AboutUs';
import Testimonials from './pages/Testimonials';
import SeoSetup from './pages/SeoSetup';
import CaseStudies from './pages/CaseStudies';
import CaseStudy from './pages/CaseStudy';
import AdminCaseStudies from './pages/AdminCaseStudies';
import CaseStudyEditor from './pages/CaseStudyEditor';
import MiningResources from './pages/industries/MiningResources';
import Healthcare from './pages/industries/Healthcare';
import Government from './pages/industries/Government';
import ITTechnology from './pages/industries/ITTechnology';
import ExitIntentPopup from './components/ExitIntentPopup';

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services/resume-writing"} component={ResumeWriting} />
      <Route path={"/services/cover-letters"} component={CoverLetters} />
      <Route path={"/services/linkedin-optimisation"} component={LinkedInOptimization} />
      <Route path={"/services/selection-criteria"} component={SelectionCriteria} />
      <Route path={"/services/career-consultation"} component={CareerConsultation} />
      <Route path={"/payment/success"} component={PaymentSuccess} />
      <Route path={"/payment/cancel"} component={PaymentCancel} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path="/faq" component={FAQ} />
      <Route path={"/about"} component={AboutUs} />
      <Route path={"/testimonials"} component={Testimonials} />
      <Route path={"/case-studies"} component={CaseStudies} />
      <Route path={"/case-studies/:slug"} component={CaseStudy} />
      <Route path={"/industries/mining-resources"} component={MiningResources} />
      <Route path={"/industries/healthcare"} component={Healthcare} />
      <Route path={"/industries/government"} component={Government} />
      <Route path={"/industries/it-technology"} component={ITTechnology} />
      <Route path="/contact" component={Contact} />
      <Route path="/services" component={Services} />
      <Route path="/seo-setup" component={SeoSetup} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/blog"} component={AdminBlog} />
      <Route path={"/admin/blog/new"} component={BlogEditor} />
      <Route path={"/admin/blog/edit/:id"} component={BlogEditor} />
      <Route path={"/admin/blog/schedule"} component={BlogSchedule} />
      <Route path={"/admin/blog/analytics"} component={BlogAnalytics} />
      <Route path={"/admin/media"} component={MediaLibrary} />
      <Route path={"/admin/faq-analytics"} component={FaqAnalytics} />
      <Route path={"/admin/testimonials"} component={AdminTestimonials} />
      <Route path={"/admin/contacts"} component={AdminContacts} />
      <Route path={"/admin/categories"} component={AdminCategories} />
      <Route path={"/admin/tags"} component={AdminTags} />
      <Route path={"/admin/case-studies"} component={AdminCaseStudies} />
      <Route path={"/admin/case-studies/new"} component={CaseStudyEditor} />
      <Route path={"/admin/case-studies/edit/:id"} component={CaseStudyEditor} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <CartProvider>
          <TooltipProvider>
            <HelmetProvider>
              <Toaster />
              <ExitIntentPopup />
              <Router />
            </HelmetProvider>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
