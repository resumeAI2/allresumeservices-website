import { TestimonialsGrid } from "@/components/GoogleTestimonials";
import { Helmet } from "react-helmet-async";
import fullReviews from "@/data/full_reviews.json";

export default function GoogleReviewsPage() {
  // Generate JSON-LD schema for aggregate rating and reviews
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "All Resume Services",
    "url": "https://allresumeservices.com.au",
    "logo": "https://allresumeservices.com.au/logo.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": fullReviews.google_reviews.length,
      "bestRating": "5",
      "worstRating": "5"
    },
    "review": fullReviews.google_reviews.slice(0, 10).map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.review,
      "datePublished": review.timeframe
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Client Reviews</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Read what our clients say about our professional resume writing services.
          All reviews are from verified Google customers.
        </p>
        
        <TestimonialsGrid />
      </div>
    </div>
    </>
  );
}
