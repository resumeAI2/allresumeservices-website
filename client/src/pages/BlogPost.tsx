import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import SocialShare from "@/components/SocialShare";
import SEOHead from "@/components/SEOHead";
import { getImageUrl } from "@/lib/imageUtils";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;
  
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug! });
  const { data: relatedPosts = [] } = trpc.blog.getSmartRelatedPosts.useQuery(
    { postId: post?.id || 0, limit: 3 },
    { enabled: !!post?.id }
  );
  const incrementViewMutation = trpc.blog.incrementViewCount.useMutation();

  // Track page view
  useEffect(() => {
    if (post && slug) {
      incrementViewMutation.mutate({ slug });
    }
  }, [post?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentUrl = `/blog/${post.slug}`;
  const fullUrl = `${window.location.origin}${currentUrl}`;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={post.title}
        description={post.metaDescription || post.excerpt}
        image={post.image || undefined}
        url={currentUrl}
        type="article"
        publishedTime={new Date(post.createdAt).toISOString()}
        keywords={`${post.category}, resume writing, career advice, job search`}
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container">
            <Link href="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <div className="max-w-4xl">
              <div className="inline-block px-4 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm font-medium mb-4">
                {post.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <span>{post.readTime || '5 min read'}</span>
                </div>
                <SocialShare 
                  url={fullUrl}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.image && (
          <section className="py-8">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={getImageUrl(post.image, 'large')}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Section */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:mb-6 prose-ul:mb-6 prose-li:mb-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* CTA Section */}
              <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Resume?</h3>
                <p className="text-muted-foreground mb-6">
                  Get professional help from our expert resume writers. With 17+ years of experience and a 96% interview success rate, we'll help you stand out.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/#pricing">
                    <Button size="lg">View Our Packages</Button>
                  </Link>
                  <Link href="/#free-review">
                    <Button size="lg" variant="outline">Get Free Resume Review</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-accent">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                  >
                    <div className="aspect-video bg-accent relative overflow-hidden">
                      <img 
                        src={getImageUrl(relatedPost.image, 'small')} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                          {relatedPost.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(relatedPost.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>

                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {relatedPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {relatedPost.readTime || '5 min read'}
                        </span>
                        <Link href={`/blog/${relatedPost.slug}`}>
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
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
