import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { getImageUrl } from "@/lib/imageUtils";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";

export default function Blog() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeTagId, setActiveTagId] = useState<number | null>(null);
  const [postsToShow, setPostsToShow] = useState(6);
  
  const { data: allPosts, isLoading } = trpc.blog.getAll.useQuery({ publishedOnly: true });
  const { data: categories = [] } = trpc.blog.getAllCategories.useQuery();
  const { data: tags = [] } = trpc.blog.getAllTags.useQuery();
  
  // Filter posts by category and tag
  const filteredPosts = useMemo(() => {
    let posts = allPosts || [];
    
    if (activeCategoryId) {
      posts = posts.filter(post => post.categoryId === activeCategoryId);
    }
    
    // Note: Tag filtering would require fetching tags for each post
    // For now, we'll just show the tag filter UI
    
    return posts;
  }, [allPosts, activeCategoryId, activeTagId]);
  
  // Get posts to display based on postsToShow limit
  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, postsToShow);
  }, [filteredPosts, postsToShow]);
  
  // Check if there are more posts to load
  const hasMorePosts = filteredPosts.length > postsToShow;
  
  // Load more handler
  const handleLoadMore = () => {
    setPostsToShow(prev => prev + 6);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Breadcrumb items={[{ label: "Career Advice Blog" }]} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">
              Career Advice Blog
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Expert insights, practical tips, and proven strategies to advance your career in the Australian job market.
            </p>
          </div>
        </div>
      </section>

      {/* Categories and Tags Filter */}
      <section className="bg-accent py-6 border-b">
        <div className="container space-y-4">
          {/* Categories */}
          <div>
            <p className="text-sm font-medium mb-2">Filter by Category:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategoryId === null ? "default" : "outline"}
                size="sm"
                className={activeCategoryId === null ? "" : "bg-background"}
                onClick={() => setActiveCategoryId(null)}
              >
                All Categories
              </Button>
              {categories.map((category: any) => (
                <Button
                  key={category.id}
                  variant={category.id === activeCategoryId ? "default" : "outline"}
                  size="sm"
                  className={category.id === activeCategoryId ? "" : "bg-background"}
                  onClick={() => setActiveCategoryId(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Filter by Tag:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeTagId === null ? "default" : "outline"}
                  size="sm"
                  className={activeTagId === null ? "" : "bg-background"}
                  onClick={() => setActiveTagId(null)}
                >
                  All Tags
                </Button>
                {tags.map((tag: any) => (
                  <Button
                    key={tag.id}
                    variant={tag.id === activeTagId ? "default" : "outline"}
                    size="sm"
                    className={tag.id === activeTagId ? "" : "bg-background"}
                    onClick={() => setActiveTagId(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post) => (          <article
                key={post.id}
                className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-video bg-accent relative overflow-hidden">
                  <img 
                    src={getImageUrl(post.image, 'small')} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.readTime || '5 min read'}
                    </span>
                    <Link href={`/blog/${post.slug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 group/btn"
                      >
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {hasMorePosts && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" onClick={handleLoadMore}>
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-secondary">
              Get Career Tips Delivered to Your Inbox
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Subscribe to our newsletter for weekly career advice, resume tips, and job search strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-foreground"
              />
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
