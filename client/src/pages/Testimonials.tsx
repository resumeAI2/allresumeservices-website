import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Star, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import GoogleReviews from "@/components/GoogleReviews";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Testimonials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(12);

  const { data: testimonials, isLoading } = trpc.testimonials.getAll.useQuery({
    approvedOnly: true,
  });

  // Filter and search testimonials
  const filteredTestimonials = useMemo(() => {
    if (!testimonials) return [];

    let filtered = [...testimonials];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.clientName.toLowerCase().includes(query) ||
          t.testimonialText.toLowerCase().includes(query) ||
          (t.serviceUsed && t.serviceUsed.toLowerCase().includes(query))
      );
    }

    // Service filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter((t) => t.serviceUsed === serviceFilter);
    }

    // Rating filter
    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter((t) => t.rating >= minRating);
    }

    return filtered;
  }, [testimonials, searchQuery, serviceFilter, ratingFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!testimonials || testimonials.length === 0) {
      return { total: 0, avgRating: 0, fiveStars: 0 };
    }

    const total = testimonials.length;
    const avgRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / total;
    const fiveStars = testimonials.filter((t) => t.rating === 5).length;

    return { total, avgRating: avgRating.toFixed(1), fiveStars };
  }, [testimonials]);

  // Get unique services for filter dropdown
  const services = useMemo(() => {
    if (!testimonials) return [];
    const uniqueServices = new Set(
      testimonials.map((t) => t.serviceUsed).filter((s): s is string => !!s)
    );
    return Array.from(uniqueServices).sort();
  }, [testimonials]);

  const displayedTestimonials = filteredTestimonials.slice(0, displayCount);
  const hasMore = displayCount < filteredTestimonials.length;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Client Testimonials</h1>
          <p className="text-xl text-white max-w-2xl">
            Read what our satisfied clients have to say about their experience with All Resume Services
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-primary/10">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">{stats.total}+</div>
              <div className="text-gray-600 font-medium">Total Reviews</div>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-primary/10">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">{stats.avgRating}</div>
              <div className="text-gray-600 font-medium mb-3">Average Rating</div>
              <div className="flex justify-center">{renderStars(Math.round(parseFloat(String(stats.avgRating))))}</div>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-primary/10">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-3">{stats.fiveStars}</div>
              <div className="text-gray-600 font-medium">5-Star Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Service Filter */}
            <div className="w-full md:w-64">
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="w-full md:w-48">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <Star className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {displayedTestimonials.length} of {filteredTestimonials.length} testimonials
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading testimonials...</p>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No testimonials found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setServiceFilter("all");
                  setRatingFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedTestimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                    {/* Rating */}
                    <div className="mb-4">{renderStars(testimonial.rating)}</div>

                    {/* Testimonial Text */}
                    <p className="text-muted-foreground mb-4 line-clamp-6">
                      "{testimonial.testimonialText}"
                    </p>

                    {/* Client Info */}
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-3 mb-2">
                        {testimonial.clientPhoto ? (
                          <img
                            src={testimonial.clientPhoto}
                            alt={testimonial.clientName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                            <span className="text-primary font-bold text-sm">
                              {testimonial.clientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-foreground">{testimonial.clientName}</div>
                          {testimonial.clientTitle && (
                            <div className="text-sm text-muted-foreground">{testimonial.clientTitle}</div>
                          )}
                        </div>
                      </div>
                      {testimonial.serviceUsed && (
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {testimonial.serviceUsed}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    size="lg"
                    onClick={() => setDisplayCount((prev) => prev + 12)}
                  >
                    Load More Testimonials
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let our expert team help you create a resume that opens doors to your dream career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="/services">View Our Services</a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <a href="/contact">Get Started Today</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
