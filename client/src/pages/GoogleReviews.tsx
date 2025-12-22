import { Helmet } from "react-helmet-async";
import fullReviews from "@/data/full_reviews.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";

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
      <Header />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Google Reviews</h1>
            <p className="text-xl text-white max-w-2xl">
              Read what our clients say about our professional resume writing services.
              All reviews are from verified Google customers.
            </p>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullReviews.google_reviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-card rounded-lg p-6 border border-border shadow-sm"
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">{review.timeframe}</span>
                    </div>
                    <p className="text-card-foreground mb-4 text-sm leading-relaxed">
                      "{review.review.length > 300 ? review.review.substring(0, 300) + "..." : review.review}"
                    </p>
                    <p className="font-semibold text-card-foreground">{review.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
