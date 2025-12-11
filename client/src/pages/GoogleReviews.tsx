import { TestimonialsGrid } from "@/components/GoogleTestimonials";

export default function GoogleReviewsPage() {
  return (
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
  );
}
