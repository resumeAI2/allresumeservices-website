import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Quote, Eye, Calendar, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import EmailCaptureModal from "@/components/EmailCaptureModal";

export default function CaseStudy() {
  const params = useParams();
  const slug = params.slug;
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  const { data: study, isLoading } = trpc.caseStudies.getBySlug.useQuery({ slug: slug! });
  const { data: relatedStudies = [] } = trpc.caseStudies.getAll.useQuery({ publishedOnly: true });
  const incrementViewMutation = trpc.caseStudies.incrementViewCount.useMutation();

  // Track page view
  useEffect(() => {
    if (study && slug) {
      incrementViewMutation.mutate({ slug });
    }
  }, [study?.id]);

  // Get related case studies from the same category
  const related = study && relatedStudies
    ? relatedStudies
        .filter(s => s.category === study.category && s.id !== study.id)
        .slice(0, 2)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading case study...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!study) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The case study you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container pt-4">
        <Breadcrumb items={[
          { label: 'Case Studies', href: '/case-studies' },
          { label: study.title }
        ]} />
      </div>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-12">
          <div className="container">
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link href="/case-studies">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Case Studies
              </Link>
            </Button>
            
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                  {study.category}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {study.viewCount || 0} views
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(study.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{study.title}</h1>
              <p className="text-xl text-muted-foreground">
                How we helped {study.clientName} achieve their career goals
              </p>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {study.image && (
          <section className="container py-8">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {/* Case Study Content */}
        <section className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-lg leading-relaxed text-foreground">
                  Meet <strong>{study.clientName}</strong>, a dedicated professional who decided it was time for a bold career shift. Despite fervently applying for positions, they found themselves in the frustrating silence of rejection—no callbacks, no feedback.
                </p>
              </div>

              {/* The Challenge */}
              <Card className="p-8 mb-12 bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-red-600 dark:text-red-400">The Challenge</span>
                </h2>
                <div className="text-foreground whitespace-pre-line leading-relaxed">
                  {study.challenge}
                </div>
              </Card>

              {/* The Solution */}
              <Card className="p-8 mb-12 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">Our Solution</span>
                </h2>
                <div className="text-foreground whitespace-pre-line leading-relaxed">
                  {study.solution}
                </div>
              </Card>

              {/* The Result */}
              <Card className="p-8 mb-12 bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">The Result</span>
                </h2>
                <div className="text-foreground whitespace-pre-line leading-relaxed">
                  {study.result}
                </div>
              </Card>

              {/* Before/After Resume Comparison */}
              {(study.beforeResumeImage || study.afterResumeImage) && (
                <Card className="p-8 mb-12 bg-gradient-to-br from-purple-50/50 to-background dark:from-purple-950/20 border-purple-200 dark:border-purple-900">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-purple-600 dark:text-purple-400">The Transformation</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {study.beforeResumeImage && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">Before</h3>
                        <div className="border-2 border-red-200 dark:border-red-900 rounded-lg overflow-hidden">
                          <img 
                            src={study.beforeResumeImage} 
                            alt="Before resume" 
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                    {study.afterResumeImage && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">After</h3>
                        <div className="border-2 border-green-200 dark:border-green-900 rounded-lg overflow-hidden">
                          <img 
                            src={study.afterResumeImage} 
                            alt="After resume" 
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    See the dramatic improvement in layout, content, and professional presentation
                  </p>
                </Card>
              )}

              {/* Testimonial Quote */}
              {study.testimonialQuote && (
                <Card className="p-8 mb-12 bg-gradient-to-br from-primary/5 to-background border-primary/20">
                  <Quote className="h-12 w-12 text-primary/20 mb-4" />
                  <blockquote className="text-xl italic text-foreground leading-relaxed mb-4">
                    "{study.testimonialQuote}"
                  </blockquote>
                  <p className="text-muted-foreground font-medium">— {study.clientName}</p>
                </Card>
              )}
            </div>

            {/* Download PDF CTA */}
            <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900 text-center">
              <h3 className="text-xl font-bold mb-3">Want the Full Case Study?</h3>
              <p className="text-muted-foreground mb-4">
                Download this complete case study as a PDF to share with your team or save for later.
              </p>
              <Button onClick={() => setShowEmailModal(true)} size="lg" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {/* CTA */}
            <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-background rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Career?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Like {study.clientName}, you too can achieve your career goals with the right tools and guidance. Let us help you craft a compelling resume that opens doors.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Get Started Today</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">View Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Case Studies */}
        {related.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">More Success Stories</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                {related.map((relatedStudy) => (
                  <Card key={relatedStudy.id} className="p-6 hover:shadow-lg transition-shadow">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary inline-block mb-3">
                      {relatedStudy.category}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{relatedStudy.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {relatedStudy.challenge.substring(0, 150)}...
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/case-studies/${relatedStudy.slug}`}>Read Story</Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
      
      {/* Email Capture Modal */}
      {study && (
        <EmailCaptureModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          caseStudyId={study.id}
          caseStudyTitle={study.title}
        />
      )}
    </div>
  );
}
