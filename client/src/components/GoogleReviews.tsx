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

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
          <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">100%</div>
            <p className="text-gray-700 font-medium">5-Star Reviews</p>
          </Card>
          <Card className="p-8 text-center bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-3">18+</div>
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
