import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { resolveCaseStudyImageUrl } from "@/lib/imageUtils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Quote, 
  Eye, 
  Calendar, 
  ArrowRight,
  Target,
  Lightbulb,
  Trophy,
  Sparkles,
  CheckCircle2,
  Briefcase
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { getFallbackCaseStudyBySlug, FALLBACK_CASE_STUDIES } from "@/data/fallbackCaseStudies";

export default function CaseStudy() {
  const params = useParams();
  const slug = params.slug;
  
  const { data: apiStudy, isLoading } = trpc.caseStudies.getBySlug.useQuery(
    { slug: slug! },
    { retry: 1, enabled: !!slug }
  );
  const { data: relatedStudies = [] } = trpc.caseStudies.getAll.useQuery({ publishedOnly: true });
  const incrementViewMutation = trpc.caseStudies.incrementViewCount.useMutation();

  const fallbackStudy = slug ? getFallbackCaseStudyBySlug(slug) : undefined;
  const study = apiStudy ?? fallbackStudy;
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  const [relatedImageFailedIds, setRelatedImageFailedIds] = useState<Set<number>>(new Set());
  const markRelatedImageFailed = useCallback((id: number) => {
    setRelatedImageFailedIds((prev) => new Set(prev).add(id));
  }, []);

  // Track page view (only for API study to avoid mutation on fallback)
  useEffect(() => {
    if (apiStudy && slug) {
      incrementViewMutation.mutate({ slug });
    }
  }, [apiStudy?.id]);

  // Get all other case studies (excluding current one) - include fallbacks when API is empty
  const allStudies = (relatedStudies.length > 0 ? relatedStudies : FALLBACK_CASE_STUDIES);
  const allOtherStudies = study
    ? allStudies.filter(s => s.id !== study.id)
    : [];

  if (isLoading && !fallbackStudy) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="flex-1 container py-20 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
            <span>Loading case study...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="flex-1 container py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">Case Study Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The case study you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="bg-navy hover:bg-navy/90">
            <Link href="/case-studies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case Studies
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Navy Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy/95 to-primary pt-8 pb-32">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container relative z-10">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb 
                items={[
                  { label: 'Case Studies', href: '/case-studies' },
                  { label: study.title }
                ]} 
              />
            </div>
            
            {/* Back Button */}
            <Button asChild variant="ghost" size="sm" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
              <Link href="/case-studies">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Case Studies
              </Link>
            </Button>
            
            <div className="max-w-4xl">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-gold text-navy font-semibold">
                  {study.category}
                </Badge>
                <span className="text-sm text-white/70 flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {study.viewCount || 0} views
                </span>
                <span className="text-sm text-white/70 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(study.createdAt).toLocaleDateString('en-AU', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {study.title}
              </h1>
              <p className="text-xl text-white/80">
                How we helped <span className="text-gold font-semibold">{study.clientName}</span> achieve their career goals
              </p>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.05"/>
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
            </svg>
          </div>
        </section>

        {/* Featured Image - Overlapping Hero */}
        {(resolveCaseStudyImageUrl(study.image) && !heroImageFailed) ? (
          <section className="container -mt-20 relative z-10 mb-12">
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={resolveCaseStudyImageUrl(study.image)!}
                  alt={study.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  onError={() => setHeroImageFailed(true)}
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* Introduction */}
        <section className="container py-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl leading-relaxed text-muted-foreground">
              Meet <strong className="text-navy">{study.clientName}</strong>, a dedicated professional who decided it was time for a bold career shift. Despite fervently applying for positions, they found themselves in the frustrating silence of rejection—no callbacks, no feedback.
            </p>
          </div>
        </section>

        {/* Challenge, Solution, Result Cards */}
        <section className="container pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* The Challenge */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">The Challenge</h2>
                </div>
              </div>
              <div className="p-8 bg-white">
                <div className="text-foreground whitespace-pre-line leading-relaxed text-lg">
                  {study.challenge}
                </div>
              </div>
            </Card>

            {/* Our Solution */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Our Solution</h2>
                </div>
              </div>
              <div className="p-8 bg-white">
                <div className="text-foreground whitespace-pre-line leading-relaxed text-lg">
                  {study.solution}
                </div>
              </div>
            </Card>

            {/* The Result */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">The Result</h2>
                </div>
              </div>
              <div className="p-8 bg-white">
                <div className="text-foreground whitespace-pre-line leading-relaxed text-lg">
                  {study.result}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Before/After Resume Comparison */}
        {(study.beforeResumeImage || study.afterResumeImage) && (
          <section className="py-16 bg-gradient-to-br from-purple-50 to-white">
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <Badge className="bg-purple-100 text-purple-700 mb-4">Resume Transformation</Badge>
                  <h2 className="text-3xl font-bold text-navy">The Visual Difference</h2>
                  <p className="text-muted-foreground mt-2">See the dramatic improvement in layout, content, and professional presentation</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {resolveCaseStudyImageUrl(study.beforeResumeImage) && (
                    <div className="group">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-bold text-sm">✕</span>
                        </div>
                        <h3 className="text-xl font-semibold text-red-600">Before</h3>
                      </div>
                      <div className="border-4 border-red-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                        <img 
                          src={resolveCaseStudyImageUrl(study.beforeResumeImage)!} 
                          alt="Before resume" 
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                  {resolveCaseStudyImageUrl(study.afterResumeImage) && (
                    <div className="group">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-green-600">After</h3>
                      </div>
                      <div className="border-4 border-green-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                        <img 
                          src={resolveCaseStudyImageUrl(study.afterResumeImage)!} 
                          alt="After resume" 
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonial Quote */}
        {study.testimonialQuote && (
          <section className="py-16 relative overflow-hidden" style={{ backgroundColor: '#1e3a5f' }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#d4a853' }} />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: '#3b82f6' }} />
            </div>
            <div className="container relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <Quote className="w-16 h-16 mx-auto mb-8" style={{ color: '#d4a853' }} />
                <blockquote className="text-2xl md:text-3xl font-light italic mb-8 leading-relaxed" style={{ color: '#ffffff' }}>
                  "{study.testimonialQuote}"
                </blockquote>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 168, 83, 0.2)' }}>
                    <span className="font-bold text-xl" style={{ color: '#d4a853' }}>
                      {study.clientName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-lg" style={{ color: '#ffffff' }}>{study.clientName}</div>
                    <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{study.category}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Case Studies */}
        {allOtherStudies.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-gold" />
                  <h2 className="text-3xl font-bold text-navy">More Success Stories</h2>
                </div>
                <Link href="/case-studies">
                  <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
                    View All Stories
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allOtherStudies.map((relatedStudy) => (
                  <Card 
                    key={relatedStudy.id} 
                    className="group overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {(resolveCaseStudyImageUrl(relatedStudy.image) && !relatedImageFailedIds.has(relatedStudy.id)) ? (
                        <img
                          src={resolveCaseStudyImageUrl(relatedStudy.image)!}
                          alt={relatedStudy.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          onError={() => markRelatedImageFailed(relatedStudy.id)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy/10 to-primary/10 flex items-center justify-center">
                          <Briefcase className="w-16 h-16 text-navy/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/90 text-navy hover:bg-white">
                          {relatedStudy.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-navy mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedStudy.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="font-medium">Client:</span> {relatedStudy.clientName}
                      </p>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {relatedStudy.challenge.substring(0, 100)}...
                      </p>
                      <Link href={`/case-studies/${relatedStudy.slug}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary group/btn p-0">
                          Read Story
                          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-primary/5">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Your Success Story Starts Here</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Like {study.clientName}, you too can achieve your career goals with the right tools and guidance. Let us help you craft a compelling resume that opens doors.
              </p>
              
              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                {["Expert Writers", "Fast Turnaround", "100% Satisfaction", "ATS-Optimised"].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-navy hover:bg-navy/90 text-lg px-8 py-6">
                    Get Started Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                    View Our Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      

    </div>
  );
}
