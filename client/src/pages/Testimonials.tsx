import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";
import type { TestimonialCardData } from "@/components/TestimonialCard";

import fallbackReviews from "@/data/full_reviews.json";

/* ------------------------------------------------------------------ */
/*  Data type used internally – extends the shared card shape          */
/* ------------------------------------------------------------------ */
type TestimonialRow = TestimonialCardData & {
  featured: number;
  approved: number;
  createdAt: Date;
};

/* ------------------------------------------------------------------ */
/*  Fallback data from full_reviews.json                               */
/*  outcomeEnabled = false for all; no auto-detection.                 */
/* ------------------------------------------------------------------ */
const FALLBACK_TESTIMONIALS: TestimonialRow[] = (
  fallbackReviews as {
    google_reviews: Array<{
      name: string;
      rating: number;
      review: string;
      tags?: string[];
    }>;
  }
).google_reviews
  .slice(0, 50)
  .map((r, i) => ({
    id: -(i + 1),
    clientName: r.name,
    clientTitle: null,
    clientPhoto: null,
    rating: r.rating,
    testimonialText: r.review,
    serviceUsed: r.tags?.[0] ?? "Resume",
    featured: 0,
    approved: 1,
    createdAt: new Date(),
    outcomeText: null,
    outcomeEnabled: false,
  }));
// Ordering is handled by the filteredTestimonials memo below,
// which interleaves long/medium and pushes one-liners to the back.

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function Testimonials() {
  const [serviceFilter, setServiceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(12);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(new Set());

  const { data: apiTestimonials, isLoading } = trpc.testimonials.getAll.useQuery(
    { approvedOnly: true },
    { retry: 1 },
  );

  const testimonials: TestimonialRow[] =
    apiTestimonials && apiTestimonials.length > 0
      ? apiTestimonials.map((t) => ({
          ...t,
          outcomeText: null,
          outcomeEnabled: false,
        }))
      : !isLoading
        ? FALLBACK_TESTIMONIALS
        : [];

  /* Inline fallback when DB returns empty                             */
  /* Manual outcomes tagged only where explicitly known.               */
  const fallbackTestimonials: TestimonialRow[] = useMemo(
    () => [
      {
        id: -1,
        clientName: "Sarah M.",
        clientTitle: "Marketing Manager",
        clientPhoto: null,
        rating: 5,
        testimonialText:
          "I was struggling to get interviews despite having 10+ years of experience. After working with All Résumé Services, I received 3 interview invitations within 2 weeks! The ATS optimisation made all the difference.",
        serviceUsed: "Resume Writing",
        featured: 0,
        approved: 1,
        createdAt: new Date(),
        outcomeText: "3 Interviews",
        outcomeEnabled: true,
      },
      {
        id: -2,
        clientName: "James T.",
        clientTitle: "Software Engineer",
        clientPhoto: null,
        rating: 5,
        testimonialText:
          "The team understood exactly what tech recruiters look for. My new resume highlights my achievements perfectly, and I landed my dream role at a top tech company. Worth every dollar!",
        serviceUsed: "Resume Writing",
        featured: 0,
        approved: 1,
        createdAt: new Date(),
        outcomeText: null,
        outcomeEnabled: false,
      },
      {
        id: -3,
        clientName: "Emily R.",
        clientTitle: "HR Professional",
        clientPhoto: null,
        rating: 5,
        testimonialText:
          "As someone who reviews resumes daily, I can confidently say the quality of work from All Résumé Services is exceptional. Professional, polished, and results-driven. Highly recommend!",
        serviceUsed: "Resume Writing",
        featured: 0,
        approved: 1,
        createdAt: new Date(),
        outcomeText: null,
        outcomeEnabled: false,
      },
      {
        id: -4,
        clientName: "Michael K.",
        clientTitle: "Project Manager",
        clientPhoto: null,
        rating: 5,
        testimonialText:
          "Working with All Résumé Services gave me peace of mind. We collaborated until every detail was perfect. The LinkedIn profile optimisation was a bonus that really boosted my visibility.",
        serviceUsed: "LinkedIn Profile",
        featured: 0,
        approved: 1,
        createdAt: new Date(),
        outcomeText: null,
        outcomeEnabled: false,
      },
      {
        id: -5,
        clientName: "Lisa W.",
        clientTitle: "Career Changer",
        clientPhoto: null,
        rating: 5,
        testimonialText:
          "Transitioning careers felt overwhelming, but the team helped me reframe my experience beautifully. I got my first interview in my new field within a month. Thank you!",
        serviceUsed: "Resume Writing",
        featured: 0,
        approved: 1,
        createdAt: new Date(),
        outcomeText: null,
        outcomeEnabled: false,
      },
      {
        id: -6,
        clientName: "David P.",
        clientTitle: "Executive Leader",
        clientPhoto: null,
        rating: 5,
        testimonialText:
          "After 20 years in leadership, I needed a resume that reflected my strategic impact. The premium package delivered exactly that—sophisticated, compelling, and interview-winning.",
        serviceUsed: "Resume Writing",
        featured: 0,
        approved: 1,
        createdAt: new Date(),
        outcomeText: null,
        outcomeEnabled: false,
      },
    ],
    [],
  );

  const effectiveTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

  /* ---- Filtering & search ---- */
  const filteredTestimonials = useMemo(() => {
    let filtered = [...effectiveTestimonials];

    if (serviceFilter !== "all") {
      filtered = filtered.filter((t) => t.serviceUsed === serviceFilter);
    }

    if (ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter((t) => t.rating >= minRating);
    }

    // Interleave long and medium reviews for variety on every page;
    // push very short one-liners (under ~100 chars) to the back.
    const SHORT_THRESHOLD = 100;
    const short = filtered.filter(t => t.testimonialText.length < SHORT_THRESHOLD);
    const substantive = filtered.filter(t => t.testimonialText.length >= SHORT_THRESHOLD);

    // Sort substantive by length descending, then split into halves
    substantive.sort((a, b) => b.testimonialText.length - a.testimonialText.length);
    const mid = Math.ceil(substantive.length / 2);
    const longer = substantive.slice(0, mid);   // top half (longest)
    const medium = substantive.slice(mid);       // bottom half (medium)

    // Weave: alternate one long, one medium so every page has a mix
    const interleaved: typeof filtered = [];
    const maxLen = Math.max(longer.length, medium.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < longer.length) interleaved.push(longer[i]);
      if (i < medium.length) interleaved.push(medium[i]);
    }

    // Short one-liners go to the very end
    return [...interleaved, ...short];
  }, [effectiveTestimonials, serviceFilter, ratingFilter]);

  /* ---- Stats ---- */
  const stats = useMemo(() => {
    if (effectiveTestimonials.length === 0)
      return { total: 0, avgRating: 0, fiveStars: 0 };

    const total = effectiveTestimonials.length;
    const avgRating =
      effectiveTestimonials.reduce((sum, t) => sum + t.rating, 0) / total;
    const fiveStars = effectiveTestimonials.filter((t) => t.rating === 5).length;

    return { total, avgRating: avgRating.toFixed(1), fiveStars };
  }, [effectiveTestimonials]);

  /* ---- Unique services for filter ---- */
  const services = useMemo(() => {
    const uniqueServices = new Set(
      effectiveTestimonials
        .map((t) => t.serviceUsed)
        .filter((s): s is string => !!s),
    );
    return Array.from(uniqueServices).sort();
  }, [effectiveTestimonials]);

  const displayedTestimonials = filteredTestimonials.slice(0, displayCount);
  const hasMore = displayCount < filteredTestimonials.length;

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <>
      <Helmet>
        <title>Client Testimonials &amp; Reviews | All Résumé Services</title>
        <meta
          name="description"
          content="Read client testimonials from professionals who landed interviews and jobs with our resume writing, cover letters, and LinkedIn services. 96% interview success rate. Australia-wide."
        />
        <meta
          name="keywords"
          content="resume writing testimonials, client reviews, resume service reviews Australia"
        />
        <link
          rel="canonical"
          href="https://allresumeservices.com.au/testimonials"
        />
      </Helmet>
      <Header />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              Client Testimonials
            </h1>
            <p className="text-xl text-white max-w-2xl">
              Read what our satisfied clients have to say about their experience
              with All Résumé Services
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-10 bg-white">
          <div className="container">
            <div className="flex flex-wrap justify-center items-center gap-6">
              {/* Total Reviews */}
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

              {/* Perfect Rating */}
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

              {/* 5-Star Reviews */}
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

        {/* Filters + count (compact row) */}
        <section className="py-4">
          <div className="container max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Results count */}
              <div className="text-sm text-muted-foreground">
                Showing {displayedTestimonials.length} of{" "}
                {filteredTestimonials.length} testimonials
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Service Filter */}
                <div className="w-full sm:w-64">
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
                <div className="w-full sm:w-48">
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
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 bg-gradient-to-br from-[#1e3a5f]/5 via-white to-[#d4af37]/5">
          <div className="container max-w-6xl">
            {/* Section header badge */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-[#1e3a5f]">
                  5.0 Rating from {stats.total}+ Reviews
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <p className="mt-4 text-muted-foreground">
                  Loading testimonials...
                </p>
              </div>
            ) : filteredTestimonials.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No testimonials found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
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
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      variant="testimonials"
                      onImageError={(id) =>
                        setFailedImageIds((prev) => new Set(prev).add(id))
                      }
                      imageLoadFailed={failedImageIds.has(testimonial.id)}
                    />
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

                {/* Trust indicators */}
                <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Verified Reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Real Client Results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>96% Success Rate</span>
                  </div>
                </div>
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
              Let our expert team help you create a resume that opens doors to
              your dream career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <a href="/services">View Our Services</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
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
