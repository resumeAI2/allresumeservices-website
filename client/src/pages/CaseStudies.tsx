import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: caseStudies, isLoading } = trpc.caseStudies.getAll.useQuery({ publishedOnly: true });

  // Get unique categories
  const categories = caseStudies
    ? Array.from(new Set(caseStudies.map(study => study.category)))
    : [];

  // Filter case studies by category
  const filteredStudies = selectedCategory
    ? caseStudies?.filter(study => study.category === selectedCategory)
    : caseStudies;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">Client Success Stories</h1>
              <p className="text-xl text-muted-foreground">
                Real transformations, real results. Discover how we've helped professionals like you achieve their career goals through expertly crafted resumes and career documents.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        {categories.length > 0 && (
          <section className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="container py-4">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-sm font-medium whitespace-nowrap">Filter by Category:</span>
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Case Studies Grid */}
        <section className="py-16 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading success stories...</p>
              </div>
            ) : filteredStudies && filteredStudies.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {filteredStudies.map((study) => (
                  <Card key={study.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {study.image && (
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img
                          src={study.image}
                          alt={study.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {study.category}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {study.viewCount || 0}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-3">{study.title}</h2>
                      <p className="text-muted-foreground mb-2">
                        <strong>Client:</strong> {study.clientName}
                      </p>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {study.challenge.substring(0, 200)}...
                      </p>
                      <Link href={`/case-studies/${study.slug}`}>
                        <Button variant="outline" className="w-full group">
                          Read Full Story
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {selectedCategory
                    ? `No case studies found in "${selectedCategory}" category`
                    : "No case studies available yet"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who have transformed their careers with our professional resume writing services.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">Get Started Today</Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline">View Our Services</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
