import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Briefcase, 
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  Lightbulb,
  Trophy
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { data: caseStudies, isLoading } = trpc.caseStudies.getAll.useQuery({ publishedOnly: true });

  // Get unique categories
  const categories = caseStudies
    ? Array.from(new Set(caseStudies.map(study => study.category)))
    : [];

  // Filter case studies by category
  const filteredStudies = selectedCategory
    ? caseStudies?.filter(study => study.category === selectedCategory)
    : caseStudies;

  // Stats for the hero section
  const stats = [
    { icon: Award, value: "500+", label: "Success Stories" },
    { icon: TrendingUp, value: "95%", label: "Interview Rate" },
    { icon: Briefcase, value: "85%", label: "Job Placement" },
    { icon: Star, value: "4.9/5", label: "Client Rating" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy/95 to-primary py-24">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Real Results, Real Transformations</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Client Success Stories
              </h1>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Discover how we've helped professionals like you achieve their career goals through expertly crafted resumes and career documents.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors"
                  >
                    <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
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

        {/* Category Filter - Enhanced */}
        {categories.length > 0 && (
          <section className="py-8 bg-white border-b sticky top-0 z-20 shadow-sm">
            <div className="container">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={selectedCategory === null ? "bg-navy hover:bg-navy/90" : ""}
                >
                  All Stories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-navy hover:bg-navy/90" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Case Studies Grid - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container">
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  <span>Loading success stories...</span>
                </div>
              </div>
            ) : filteredStudies && filteredStudies.length > 0 ? (
              <>
                {/* Featured Case Study (First One) */}
                {filteredStudies.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-2 mb-8">
                      <Star className="w-5 h-5 text-gold fill-gold" />
                      <h2 className="text-2xl font-bold text-navy">Featured Success Story</h2>
                    </div>
                    <Card className="overflow-hidden bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                      <div className="grid lg:grid-cols-2">
                        {filteredStudies[0].image && (
                          <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                            <img
                              src={filteredStudies[0].image}
                              alt={filteredStudies[0].title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r" />
                            <Badge className="absolute top-4 left-4 bg-gold text-navy font-semibold">
                              Featured
                            </Badge>
                          </div>
                        )}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <Badge variant="outline" className="w-fit mb-4 border-primary text-primary">
                            {filteredStudies[0].category}
                          </Badge>
                          <h3 className="text-3xl font-bold text-navy mb-4">{filteredStudies[0].title}</h3>
                          <p className="text-lg text-muted-foreground mb-2">
                            <span className="font-medium text-foreground">Client:</span> {filteredStudies[0].clientName}
                          </p>
                          
                          {/* Preview or Expanded Content */}
                          {!isExpanded ? (
                            <>
                              <div className="relative my-6 pl-6 border-l-4 border-gold">
                                <Quote className="absolute -left-3 -top-2 w-6 h-6 text-gold bg-white" />
                                <p className="text-muted-foreground italic">
                                  {filteredStudies[0].challenge.substring(0, 250)}...
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsExpanded(true)}
                                className="text-primary hover:text-primary mb-4 w-fit"
                              >
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Read More
                              </Button>
                            </>
                          ) : (
                            <div className="my-6 space-y-6">
                              {/* The Challenge */}
                              <div className="bg-red-50 rounded-lg p-5 border border-red-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <Target className="w-5 h-5 text-red-600" />
                                  <h4 className="font-semibold text-red-700">The Challenge</h4>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {filteredStudies[0].challenge}
                                </p>
                              </div>
                              
                              {/* Our Solution */}
                              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <Lightbulb className="w-5 h-5 text-blue-600" />
                                  <h4 className="font-semibold text-blue-700">Our Solution</h4>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {filteredStudies[0].solution}
                                </p>
                              </div>
                              
                              {/* The Result */}
                              <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <Trophy className="w-5 h-5 text-green-600" />
                                  <h4 className="font-semibold text-green-700">The Result</h4>
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {filteredStudies[0].result}
                                </p>
                              </div>
                              
                              {/* Testimonial */}
                              {filteredStudies[0].testimonialQuote && (
                                <div className="relative pl-6 border-l-4 border-gold bg-gold/5 rounded-r-lg p-4">
                                  <Quote className="absolute -left-3 top-3 w-6 h-6 text-gold bg-white" />
                                  <p className="text-muted-foreground italic mb-2">
                                    "{filteredStudies[0].testimonialQuote}"
                                  </p>
                                  <p className="text-sm font-medium text-navy">— {filteredStudies[0].clientName}</p>
                                </div>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsExpanded(false)}
                                className="text-primary hover:text-primary w-fit"
                              >
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Show Less
                              </Button>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Eye className="w-4 h-4" />
                              {filteredStudies[0].viewCount || 0} views
                            </div>
                          </div>
                          <Link href={`/case-studies/${filteredStudies[0].slug}`}>
                            <Button size="lg" className="bg-navy hover:bg-navy/90 group">
                              View Full Case Study
                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Rest of Case Studies */}
                {filteredStudies.length > 1 && (
                  <>
                    <div className="flex items-center gap-2 mb-8">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-bold text-navy">More Success Stories</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredStudies.slice(1).map((study, index) => (
                        <Card 
                          key={study.id} 
                          className="group overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            {study.image ? (
                              <img
                                src={study.image}
                                alt={study.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-navy/10 to-primary/10 flex items-center justify-center">
                                <Briefcase className="w-16 h-16 text-navy/30" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <Badge className="bg-white/90 text-navy hover:bg-white">
                                {study.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-navy mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {study.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              <span className="font-medium">Client:</span> {study.clientName}
                            </p>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                              {study.challenge.substring(0, 150)}...
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Eye className="w-3 h-3" />
                                {study.viewCount || 0}
                              </div>
                              <Link href={`/case-studies/${study.slug}`}>
                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary group/btn">
                                  Read More
                                  <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-2">
                  {selectedCategory
                    ? `No stories in "${selectedCategory}"`
                    : "No case studies available yet"}
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for inspiring success stories!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Testimonial Banner */}
        <section className="py-16 relative overflow-hidden bg-[#1e3a5f]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
          </div>
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="w-12 h-12 mx-auto mb-6 text-[#d4a853]" />
              <blockquote className="text-2xl md:text-3xl font-light italic mb-8 leading-relaxed text-white">
                "The team at All Résumé Services transformed my career. Within two weeks of using my new resume, I landed three interviews and received two job offers!"
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(212,168,83,0.2)]">
                  <span className="font-bold text-lg text-[#d4a853]">JM</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">James Mitchell</div>
                  <div className="text-sm text-white/60">Senior Project Manager</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-primary/5 relative">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Your Success Story Starts Here</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join hundreds of satisfied clients who have transformed their careers with our professional resume writing services.
              </p>
              
              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                {["Expert Writers", "Fast Turnaround", "100% Satisfaction", "ATS-Optimized"].map((benefit, i) => (
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
