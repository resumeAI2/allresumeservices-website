import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { blogPosts } from "@/data/blogPosts";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;
  
  const post = blogPosts.find(p => p.slug === slug);

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

  return (
    <div className="min-h-screen flex flex-col">
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
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </section>

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
      </main>
      <Footer />
    </div>
  );
}
