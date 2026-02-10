import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useMemo } from "react";
import SocialShare from "@/components/SocialShare";
import SEOHead from "@/components/SEOHead";
import { getImageUrl } from "@/lib/imageUtils";
import { BlogAuthor } from "@/components/BlogAuthor";
import { LeadMagnetForm } from "@/components/LeadMagnetForm";
import BlogContent from '@/components/BlogContent';
import { BlogFAQSchema } from '@/components/BlogFAQSchema';
import { extractFAQsFromMarkdown } from '@/lib/extractFAQs';
import { ArticleSchema, BreadcrumbSchema } from '@/components/ArticleSchema';
import { getFallbackPostBySlug, FALLBACK_BLOG_POSTS } from '@/data/fallbackBlogPosts';

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;
  
  const { data: apiPost, isLoading } = trpc.blog.getBySlug.useQuery(
    { slug: slug! },
    { retry: 1, enabled: !!slug }
  );
  const fallbackPost = slug ? getFallbackPostBySlug(slug) : undefined;
  const post = apiPost ?? fallbackPost;

  const { data: relatedPosts = [] } = trpc.blog.getSmartRelatedPosts.useQuery(
    { postId: post?.id || 0, limit: 3 },
    { enabled: !!post?.id && !!apiPost }
  );
  const relatedFromFallback = useMemo(() => {
    if (!post || apiPost) return [];
    return FALLBACK_BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  }, [post, apiPost]);
  const displayRelatedPosts = (relatedPosts?.length ? relatedPosts : relatedFromFallback) as typeof relatedPosts;

  const incrementViewMutation = trpc.blog.incrementViewCount.useMutation();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Generate structured data for tables
  const tableStructuredData = useMemo(() => {
    if (!post?.content || slug !== 'expert-cv-help-for-crafting-winning-resumes-effortlessly') return null;
    
    const currentUrl = `/blog/${slug}`;
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${currentUrl}` : currentUrl;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Table',
      'about': post.title,
      'url': fullUrl,
      'name': 'Recommended CV Length by Career Stage',
      'description': 'This table outlines the ideal CV length for different career stages in the Australian job market.',
      'columns': [
        { '@type': 'Text', 'name': 'Career Stage' },
        { '@type': 'Text', 'name': 'Ideal Length' },
        { '@type': 'Text', 'name': 'Why This Length Works' }
      ],
      'rows': [
        { '@type': 'TableRow', 'cells': ['Graduate / Entry Level', '1–2 pages', 'Focuses on education, internships, and foundational skills.'] },
        { '@type': 'TableRow', 'cells': ['Early to Mid-Career', '2–3 pages', 'Effectively balances detailed experience with demonstrated impact.'] },
        { '@type': 'TableRow', 'cells': ['Senior / Executive Level', '3–5 pages', 'Provides ample space to showcase leadership achievements.'] }
      ]
    };
  }, [post?.content, slug, post?.title]);

  // Extract FAQ data from post content - MUST be called before conditional returns
  const faqData = useMemo(() => {
    if (!post?.content) return [];
    return extractFAQsFromMarkdown(post.content);
  }, [post?.content]);

  // Add Table structured data to head
  useEffect(() => {
    if (!tableStructuredData) return;
    
    const script = document.createElement('script');
    script.id = 'table-schema-org';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(tableStructuredData);
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.getElementById('table-schema-org');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [tableStructuredData]);

  // Track page view (only for API-sourced posts)
  useEffect(() => {
    if (apiPost && slug) {
      incrementViewMutation.mutate({ slug });
    }
  }, [apiPost?.id]);

  // NOW we can have conditional returns after all hooks are called
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
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${currentUrl}` : currentUrl;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={(post as { metaTitle?: string }).metaTitle || post.title}
        description={(post as { metaDescription?: string }).metaDescription || post.excerpt}
        image={post.image || undefined}
        url={currentUrl}
        type="article"
        publishedTime={new Date(post.createdAt).toISOString()}
        keywords={`${post.category}, resume writing, career advice, job search`}
      />
      <BlogFAQSchema faqs={faqData} />
      
      {/* Comprehensive Article Schema for Google Rich Snippets */}
      <ArticleSchema
        title={post.title}
        description={post.metaDescription || post.excerpt}
        content={post.content}
        image={post.image || undefined}
        url={currentUrl}
        publishedTime={new Date(post.createdAt).toISOString()}
        modifiedTime={post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined}
        authorName="Sonia Lynch"
        authorTitle="Founder & CEO, All Résumé Services"
        authorImage="/team/sonia-lynch.png"
        category={post.category}
        readTime={post.readTime || '5 min read'}
      />
      
      {/* Breadcrumb Schema for Search Results */}
      <BreadcrumbSchema
        items={[
          { name: 'Blog', url: '/blog' },
          { name: post.title }
        ]}
      />

      <Header />
      
      <div className="container pt-4">
        <Breadcrumb items={[
          { label: 'Blog', href: '/blog' },
          { label: post.title }
        ]} />
      </div>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-8 md:py-12">
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
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">{post.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Published {new Date(post.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {post.updatedAt && new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime() + 86400000 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Updated {new Date(post.updatedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </>
                  )}
                  <span>•</span>
                  <span>{post.readTime || '5 min read'}</span>
                  {post.viewCount > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-secondary font-medium">{post.viewCount.toLocaleString()} readers found this helpful</span>
                    </>
                  )}
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
              <BlogContent content={post.content} />

              {/* Lead Magnet - Resume Template Download */}
              <div className="my-12">
                <LeadMagnetForm
                  templateName="ATS-Resume-Template.jpg"
                  templateUrl="/ATS-Resume-Template.jpg"
                  sourcePost={post.slug}
                />
              </div>

              {/* Author Bio */}
              <div className="mt-12">
                <BlogAuthor
                  name="Sonia Lynch"
                  title="Founder & CEO - 15+ years in industry"
                  bio="As the Founder and CEO of All Résumé Services, Sonia is a dynamic and results-driven professional with expertise in Resume Writing, Personal Branding, Curriculum Development, Selection Criteria, Cover Letters, Portfolios, Coaching, and Career Development. Her MBA in Business Administration and Management underpins a commitment to empowering clients, guiding them to excel in their career paths."
                  photo="/team/sonia-lynch.png"
                  expertise={["Resume Writing", "Personal Branding", "Selection Criteria", "Career Coaching"]}
                />
              </div>

              {/* CTA Section */}
              <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Resume?</h3>
                <p className="text-muted-foreground mb-6">
                  Get professional help from our expert resume writers. With 18+ years of experience and a 96% interview success rate, we'll help you stand out.
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
        {displayRelatedPosts.length > 0 && (
          <section className="py-16 bg-accent">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {displayRelatedPosts.map((relatedPost) => (
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
                      <div className="text-sm text-primary mb-2">{relatedPost.category}</div>
                      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <Button variant="link" className="p-0 h-auto">
                          Read More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
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
