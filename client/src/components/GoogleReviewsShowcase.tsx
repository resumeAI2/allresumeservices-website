import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import fullReviews from "@/data/full_reviews.json";
import featuredNames from "@/data/featured_reviews.json";

export default function GoogleReviewsShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  // Filter full reviews to get only featured ones
  const reviews = fullReviews.google_reviews.filter(review =>
    featuredNames.featured_reviews.includes(review.name)
  );

  // Auto-rotate reviews every 6 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <span className="text-sm font-semibold">5.0 Rating on Google</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say on Google
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real reviews from real clients who landed their dream jobs with our professional resume writing services.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Review Card */}
            <div className="bg-card border-2 border-border rounded-2xl p-8 md:p-12 shadow-xl min-h-[320px] flex flex-col justify-between">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-6 flex-grow">
                "{reviews[currentIndex].review}"
              </blockquote>

              {/* Author & Timeframe */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-bold text-lg text-foreground">
                    {reviews[currentIndex].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {reviews[currentIndex].timeframe}
                  </p>
                </div>

                {/* Tags */}
                {reviews[currentIndex].tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {reviews[currentIndex].tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-accent text-accent-foreground rounded-full capitalize font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-background border-2 border-border rounded-full p-3 hover:bg-accent transition-colors shadow-lg"
              aria-label="Previous review"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-background border-2 border-border rounded-full p-3 hover:bg-accent transition-colors shadow-lg"
              aria-label="Next review"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-border hover:bg-primary/50"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a
              href="https://g.page/ALLRESUMESERVICES-REVIEWS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Read all {reviews.length}+ verified Google reviews
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
