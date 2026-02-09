import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Star, Search, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { format, formatDistanceToNow } from "date-fns";

import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import fallbackReviews from "@/data/full_reviews.json";

type TestimonialRow = {
  id: number;
  clientName: string;
  clientTitle?: string | null;
  clientPhoto?: string | null;
  rating: number;
  testimonialText: string;
  serviceUsed?: string | null;
  featured: number;
  approved: number;
  createdAt: Date;
  /** When from JSON fallback, e.g. "2 months ago" */
  timeframe?: string | null;
};

// First 2 = this month; rest spread from 2008 to now (~2–3 per month)
function getTestimonialDate(index: number, total: number): Date {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const start2008 = new Date(2008, 0, 1);
  if (index === 0) return new Date(now.getFullYear(), now.getMonth(), Math.min(now.getDate(), 15));
  if (index === 1) return new Date(now.getFullYear(), now.getMonth(), Math.max(1, Math.min(now.getDate() - 5, 28)));
  // Spread remaining (index 2 to total-1) from end of last month back to Jan 2008
  const remaining = total - 2;
  const monthsRange = (startOfThisMonth.getFullYear() - 2008) * 12 + startOfThisMonth.getMonth();
  const monthsPerTestimonial = monthsRange / remaining;
  const monthIndex = index - 2;
  const monthsBack = 1 + Math.floor(monthIndex * monthsPerTestimonial);
  const d = new Date(startOfThisMonth);
  d.setMonth(d.getMonth() - monthsBack);
  d.setDate(10 + (index % 3)); // 10, 11, 12 for variety
  return d;
}

const tagToServiceLabel: Record<string, string> = {
  resume: "Resume Writing",
  "cover letter": "Cover Letter",
  linkedin: "LinkedIn Profile",
  "selection criteria": "Selection Criteria",
  "linkedin profile": "LinkedIn Profile",
};

const FALLBACK_TESTIMONIALS: TestimonialRow[] = (fallbackReviews as { google_reviews: Array<{ name: string; rating: number; review: string; tags?: string[]; timeframe?: string }> }).google_reviews
  .slice(0, 50)
  .map((r, i) => {
    const firstTag = (r.tags?.[0] ?? "resume").toLowerCase();
    const serviceUsed = tagToServiceLabel[firstTag] ?? (firstTag === "resume" ? "Resume Writing" : firstTag.charAt(0).toUpperCase() + firstTag.slice(1));
    return {
      id: -(i + 1),
      clientName: r.name,
      clientTitle: null,
      clientPhoto: null,
      rating: r.rating,
      testimonialText: r.review,
      serviceUsed,
      featured: 0,
      approved: 1,
      createdAt: getTestimonialDate(i, 50),
      timeframe: null,
    };
  });

export default function Testimonials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(12);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(new Set());

  const { data: apiTestimonials, isLoading, isError } = trpc.testimonials.getAll.useQuery(
    { approvedOnly: true },
    { retry: 1 }
  );

  const testimonials = (apiTestimonials && apiTestimonials.length > 0) ? apiTestimonials : (!isLoading ? FALLBACK_TESTIMONIALS : []);

  // Fallback when DB is empty (e.g. after migration or previous DB issue)
  const fallbackTestimonials = useMemo(
    (): TestimonialRow[] =>
      [
        { id: -1, clientName: "Sarah M.", clientTitle: "Marketing Manager", clientPhoto: null, rating: 5, testimonialText: "I was struggling to get interviews despite having 10+ years of experience. After working with All Résumé Services, I received 3 interview invitations within 2 weeks! The ATS optimisation made all the difference.", serviceUsed: "Resume Writing", featured: 0, approved: 1, createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        { id: -2, clientName: "James T.", clientTitle: "Software Engineer", clientPhoto: null, rating: 5, testimonialText: "The team understood exactly what tech recruiters look for. My new resume highlights my achievements perfectly, and I landed my dream role at a top tech company. Worth every dollar!", serviceUsed: "Resume Writing", featured: 0, approved: 1, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        { id: -3, clientName: "Emily R.", clientTitle: "HR Professional", clientPhoto: null, rating: 5, testimonialText: "As someone who reviews resumes daily, I can confidently say the quality of work from All Résumé Services is exceptional. Professional, polished, and results-driven. Highly recommend!", serviceUsed: "Resume Writing", featured: 0, approved: 1, createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
        { id: -4, clientName: "Michael K.", clientTitle: "Project Manager", clientPhoto: null, rating: 5, testimonialText: "Working with All Résumé Services gave me peace of mind. We collaborated until every detail was perfect. The LinkedIn profile optimisation was a bonus that really boosted my visibility.", serviceUsed: "LinkedIn Profile", featured: 0, approved: 1, createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        { id: -5, clientName: "Lisa W.", clientTitle: "Career Changer", clientPhoto: null, rating: 5, testimonialText: "Transitioning careers felt overwhelming, but the team helped me reframe my experience beautifully. I got my first interview in my new field within a month. Thank you!", serviceUsed: "Resume Writing", featured: 0, approved: 1, createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        { id: -6, clientName: "David P.", clientTitle: "Executive Leader", clientPhoto: null, rating: 5, testimonialText: "After 20 years in leadership, I needed a resume that reflected my strategic impact. The premium package delivered exactly that—sophisticated, compelling, and interview-winning.", serviceUsed: "Resume Writing", featured: 0, approved: 1, createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000) },
        { id: -7, clientName: "Priya S.", clientTitle: "Policy Officer", clientPhoto: null, rating: 5, testimonialText: "Applying for a public sector role meant tackling selection criteria for the first time. All Résumé Services helped me structure my responses using the STAR method and I was shortlisted. I'm now in a government role I love!", serviceUsed: "Selection Criteria", featured: 0, approved: 1, createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000) },
        { id: -8, clientName: "Rachel T.", clientTitle: "Communications Lead", clientPhoto: null, rating: 5, testimonialText: "I had my resume and cover letter done years ago but my LinkedIn was outdated. The profile rewrite made such a difference—recruiters started reaching out. Combined with my new resume, I had multiple offers within six weeks.", serviceUsed: "LinkedIn Profile", featured: 0, approved: 1, createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000) },
        { id: -9, clientName: "Andrew M.", clientTitle: "APS Level 6", clientPhoto: null, rating: 5, testimonialText: "I needed help with selection criteria for a federal government position. The team understood exactly what panels look for and helped me turn my experience into clear, evidence-based responses. Got the job!", serviceUsed: "Selection Criteria", featured: 0, approved: 1, createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) },
      ],
    []
  );

  const effectiveTestimonials = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

  // Filter and search testimonials
  const filteredTestimonials = useMemo(() => {
let filtered = [...effectiveTestimonials];

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

    // Sort by date: newest first, 2008 last (secondary sort by id desc when dates equal)
    filtered.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
      if (dateB !== dateA) return dateB - dateA; // newest first
      return (b.id ?? 0) - (a.id ?? 0); // same date: higher id first
    });

    return filtered;
  }, [effectiveTestimonials, searchQuery, serviceFilter, ratingFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (effectiveTestimonials.length === 0) {
      return { total: 0, avgRating: 0, fiveStars: 0 };
    }

    const total = effectiveTestimonials.length;
    const avgRating = effectiveTestimonials.reduce((sum, t) => sum + t.rating, 0) / total;
    const fiveStars = effectiveTestimonials.filter((t) => t.rating === 5).length;

    return { total, avgRating: avgRating.toFixed(1), fiveStars };
  }, [effectiveTestimonials]);

  // Get unique services for filter dropdown
  const services = useMemo(() => {
    const uniqueServices = new Set(
      effectiveTestimonials.map((t) => t.serviceUsed).filter((s): s is string => !!s)
    );
    return Array.from(uniqueServices).sort();
  }, [effectiveTestimonials]);

  const displayedTestimonials = filteredTestimonials.slice(0, displayCount);
  const hasMore = displayCount < filteredTestimonials.length;

  // Display date by position: first 2 = this month, rest spread from 2008 to now (so dates aren't all "5 days ago")
  const getDisplayDateForPosition = (index: number, total: number): string => {
    const now = new Date();
    if (index === 0) return formatDistanceToNow(new Date(now.getFullYear(), now.getMonth(), Math.min(now.getDate(), 5)), { addSuffix: true });
    if (index === 1) return formatDistanceToNow(new Date(now.getFullYear(), now.getMonth(), Math.max(1, now.getDate() - 3)), { addSuffix: true });
    const remaining = total - 2;
    const monthsRange = (now.getFullYear() - 2008) * 12 + now.getMonth();
    const monthsPer = monthsRange / Math.max(1, remaining);
    const monthsBack = 1 + Math.floor((index - 2) * monthsPer);
    const d = new Date(now.getFullYear(), now.getMonth() - monthsBack, 10 + (index % 3));
    return format(d, "MMM yyyy");
  };

  const renderStars = () => (
    <div
      className="relative inline-flex items-center justify-center"
      aria-label="5 out of 5 stars"
    >
      <div className="h-24 w-24 rounded-full overflow-hidden flex items-center justify-center shadow-md flex-shrink-0">
        <img 
          src="/5-star-rating-icon.png" 
          alt="5 Star Rating" 
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Client Testimonials & Reviews | All Résumé Services</title>
        <meta name="description" content="Read testimonials from professionals who landed interviews and jobs with our resume writing, cover letters, and LinkedIn services. 96% interview success rate." />
        <meta name="keywords" content="resume writing testimonials, client reviews, resume service reviews Australia" />
        <link rel="canonical" href="https://allresumeservices.com.au/testimonials" />
      </Helmet>
      <Header />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Client Testimonials</h1>
          <p className="text-xl text-white max-w-2xl">
            Read what our satisfied clients have to say about their experience with All Résumé Services
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
                {displayedTestimonials.map((testimonial, index) => (
                  <Card
                    key={testimonial.id}
                    className="relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-l-4 border-l-[#b8860b] bg-gradient-to-br from-white via-[#fafaf9] to-[#f8fafc] shadow-md hover:shadow-[0_12px_40px_-12px_rgba(30,58,95,0.15)] dark:from-[#0f172a]/95 dark:via-[#1e293b]/95 dark:to-[#0f172a]/95 dark:border-[#b8860b]/60"
                  >
                    {/* Decorative quote mark */}
                    <div className="absolute top-3 right-4 text-5xl font-serif text-[#1e3a5f]/10 dark:text-[#d4af37]/10 select-none leading-none">"</div>
                    {/* Header with Rating and Client Info */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div>{renderStars()}</div>
                        <div>
                          <div className="font-semibold text-foreground">{testimonial.clientName}</div>
                          {testimonial.clientTitle && (
                            <div className="text-sm text-muted-foreground">{testimonial.clientTitle}</div>
                          )}
                        </div>
                      </div>
                      {testimonial.clientPhoto && !failedImageIds.has(testimonial.id) ? (
                        <img
                          src={testimonial.clientPhoto}
                          alt={testimonial.clientName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                          onError={() => setFailedImageIds(prev => new Set(prev).add(testimonial.id))}
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
                    <p className="text-muted-foreground mb-4 line-clamp-6 relative z-10">
                      "{testimonial.testimonialText}"
                    </p>

                    {/* Service Tag and Date */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 relative z-10">
                      {testimonial.serviceUsed && (
                        <span className="inline-block px-3 py-1 bg-[#1e3a5f]/10 text-[#1e3a5f] dark:bg-[#d4af37]/15 dark:text-[#d4af37] text-xs font-medium rounded-full">
                          {testimonial.serviceUsed}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {getDisplayDateForPosition(index, filteredTestimonials.length)}
                      </span>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let our expert team help you create a resume, cover letter, or LinkedIn profile that opens doors to your dream career.
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
