import { Star } from "lucide-react";
import { Card } from "./ui/card";

export default function GoogleReviews() {
  return (
    <div className="bg-muted/30 py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say on Google</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it—read authentic reviews from our satisfied clients on Google Business Profile
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-lg font-semibold">5.0 Rating</span>
            <span className="text-muted-foreground">• 100+ Reviews</span>
          </div>
        </div>

        {/* Google Reviews Embed */}
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

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">100%</div>
            <p className="text-gray-700 font-medium">5-Star Reviews</p>
          </Card>
          <Card className="p-8 text-center bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-3">17+</div>
            <p className="text-gray-700 font-medium">Years Experience</p>
          </Card>
          <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">96%</div>
            <p className="text-gray-700 font-medium">Interview Success Rate</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
