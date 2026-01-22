import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Star, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

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
    // Use custom 5-star logo for 5-star ratings
    if (rating === 5) {
      return (
        <div className="rounded-lg shadow-sm">
          <img 
            src="/5-star-logo.png" 
            alt="5 Star Rating" 
            className="h-16 w-16 object-contain animate-in fade-in duration-700"
          />
        </div>
      );
    }
    
    // Fallback to individual stars for non-5-star ratings
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

      {/* Statistics Section - Premium Badge Style */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-6">
            {/* Primary Badge - Total Reviews */}
            <div className="flex items-center gap-4 px-8 py-5 bg-white rounded-full border-2 border-[#D9A514] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-[#D9A514]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-[#141E32]">{stats.total}+</div>
                <div className="text-sm text-[#71717B] font-medium">Client Reviews</div>
              </div>
            </div>

            {/* Secondary Badge - Perfect Rating */}
            <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-full border-2 border-[#D9A514] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-[#D9A514]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-[#141E32]">{stats.avgRating} Rating</div>
                <div className="text-sm text-[#71717B] font-medium">Perfect Score</div>
              </div>
            </div>

            {/* Secondary Badge - 5-Star Reviews */}
            <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-full border-2 border-[#D9A514] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-[#D9A514]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-[#141E32]">{stats.fiveStars}+ Five-Star</div>
                <div className="text-sm text-[#71717B] font-medium">Excellence Certified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8">
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
                    {/* Header with Rating and Client Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div>{renderStars(testimonial.rating)}</div>
                        <div>
                          <div className="font-semibold text-foreground">{testimonial.clientName}</div>
                          {testimonial.clientTitle && (
                            <div className="text-sm text-muted-foreground">{testimonial.clientTitle}</div>
                          )}
                        </div>
                      </div>
                      {testimonial.clientPhoto ? (
                        <img
                          src={testimonial.clientPhoto}
                          alt={testimonial.clientName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-sm text-white ${
                          // Generate consistent color based on name
                          (() => {
                            const colors = [
                              'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-300',
                              'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-300',
                              'bg-gradient-to-br from-pink-500 to-pink-600 border-pink-300',
                              'bg-gradient-to-br from-green-500 to-green-600 border-green-300',
                              'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-300',
                              'bg-gradient-to-br from-teal-500 to-teal-600 border-teal-300',
                              'bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-300',
                              'bg-gradient-to-br from-rose-500 to-rose-600 border-rose-300',
                              'bg-gradient-to-br from-cyan-500 to-cyan-600 border-cyan-300',
                              'bg-gradient-to-br from-amber-500 to-amber-600 border-amber-300',
                            ];
                            const hash = testimonial.clientName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            return colors[hash % colors.length];
                          })()
                        }`}>
                          <span>
                            {testimonial.clientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-muted-foreground mb-4 line-clamp-6">
                      "{testimonial.testimonialText}"
                    </p>

                    {/* Service Tag */}
                    {testimonial.serviceUsed && (
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {testimonial.serviceUsed}
                        </span>
                      </div>
                    )}
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
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
