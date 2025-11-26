import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Resume Mistakes That Cost You Job Interviews",
      excerpt: "Learn about the most common resume errors that hiring managers notice immediately and how to avoid them to increase your chances of landing interviews.",
      category: "Resume Tips",
      date: "November 20, 2024",
      readTime: "5 min read",
      slug: "resume-mistakes-cost-interviews",
      image: "/api/placeholder/800/400"
    },
    {
      id: 2,
      title: "How to Beat Applicant Tracking Systems (ATS) in 2024",
      excerpt: "Discover proven strategies to optimize your resume for ATS software and ensure your application reaches human recruiters.",
      category: "ATS Optimization",
      date: "November 15, 2024",
      readTime: "7 min read",
      slug: "beat-ats-systems-2024",
      image: "/api/placeholder/800/400"
    },
    {
      id: 3,
      title: "The Perfect Cover Letter Formula for Australian Jobs",
      excerpt: "Master the art of writing compelling cover letters that grab attention and showcase your value to Australian employers.",
      category: "Cover Letters",
      date: "November 10, 2024",
      readTime: "6 min read",
      slug: "perfect-cover-letter-formula",
      image: "/api/placeholder/800/400"
    },
    {
      id: 4,
      title: "LinkedIn Profile Optimization: A Complete Guide",
      excerpt: "Transform your LinkedIn profile into a powerful career tool with these expert tips for Australian professionals.",
      category: "LinkedIn",
      date: "November 5, 2024",
      readTime: "8 min read",
      slug: "linkedin-profile-optimization-guide",
      image: "/api/placeholder/800/400"
    },
    {
      id: 5,
      title: "Career Change Resume: How to Pivot Successfully",
      excerpt: "Transitioning to a new industry? Learn how to position your transferable skills and experience for a successful career change.",
      category: "Career Change",
      date: "October 30, 2024",
      readTime: "6 min read",
      slug: "career-change-resume-guide",
      image: "/api/placeholder/800/400"
    },
    {
      id: 6,
      title: "Selection Criteria Responses That Get You Shortlisted",
      excerpt: "Master the STAR method and learn how to write compelling selection criteria responses for government and corporate roles.",
      category: "Selection Criteria",
      date: "October 25, 2024",
      readTime: "7 min read",
      slug: "selection-criteria-responses-guide",
      image: "/api/placeholder/800/400"
    }
  ];

  const categories = ["All", "Resume Tips", "ATS Optimization", "Cover Letters", "LinkedIn", "Career Change", "Selection Criteria"];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground py-20">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Career Advice Blog
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Expert insights, practical tips, and proven strategies to advance your career in the Australian job market.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="bg-accent py-6 border-b">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className={category === "All" ? "" : "bg-background"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-video bg-accent relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-6xl opacity-20">📝</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
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
                      {post.readTime}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80 group/btn"
                    >
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
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
