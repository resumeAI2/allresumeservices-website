import { Helmet } from "react-helmet-async";
import fullReviews from "@/data/full_reviews.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleReviewsComponent from "@/components/GoogleReviews";
import { Card } from "@/components/ui/card";
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

        {/* Google Reviews Stats Component */}
        <GoogleReviewsComponent />

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

        {/* Google Reviews External Link - Bottom */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <Card className="p-8 max-w-4xl mx-auto">
              <div className="text-center space-y-6">
                <p className="text-lg">
                  View all our authentic client reviews and ratings on Google Business Profile
                </p>
                <a
                  href="https://g.page/ALLRESUMESERVICES-REVIEWS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Read Our Google Reviews
                </a>
                <p className="text-sm text-muted-foreground">
                  Click to see all verified reviews from our clients
                </p>
              </div>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
