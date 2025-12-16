import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";

export default function FeaturedCaseStudies() {
  const { data: allStudies = [] } = trpc.caseStudies.getAll.useQuery({ publishedOnly: true });
  
  // Get featured case studies (max 3)
  const featuredStudies = allStudies.filter(study => study.featured === 1).slice(0, 3);

  if (featuredStudies.length === 0) {
    return null; // Don't show section if no featured studies
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real transformations from clients who trusted us with their career journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredStudies.map((study) => (
            <Link key={study.id} href={`/case-studies/${study.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                {study.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      <Star className="h-3 w-3" />
                      {study.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {study.title}
                  </h3>

                  {/* Excerpt from challenge */}
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {study.challenge.substring(0, 150)}...
                  </p>

                  {/* Client Name */}
                  <p className="text-sm font-medium text-primary mb-4">
                    Client: {study.clientName}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    Read Full Story
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/case-studies">
              View All Case Studies
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
