import { useState, useMemo } from "react";
import { Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import fullReviews from "@/data/full_reviews.json";

export default function ReviewsArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const reviews = fullReviews.google_reviews;

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    reviews.forEach(review => {
      review.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [reviews]);

  // Filter reviews based on search and tags
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.review.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => review.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [reviews, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen">
      <div className="container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Client Reviews Archive</h1>
            <p className="text-lg text-muted-foreground">
              Browse all {reviews.length} verified Google reviews. Filter by service type, industry, or search for specific feedback.
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search reviews by name or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg"
                />
              </div>
            </div>

            {/* Tag Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Filter by Category</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                    className="capitalize"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(searchQuery || selectedTags.length > 0) && (
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredReviews.length} of {reviews.length} reviews
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>

          {/* Reviews Grid */}
          {filteredReviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredReviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.timeframe}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-foreground/90 mb-4 leading-relaxed">
                    "{review.review}"
                  </p>

                  {/* Author */}
                  <p className="font-semibold text-foreground mb-3">
                    - {review.name}
                  </p>

                  {/* Tags */}
                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No reviews found matching your filters.
              </p>
              <Button onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
