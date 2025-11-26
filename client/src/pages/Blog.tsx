import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Transform Your Resume with Powerful Action Verbs",
      excerpt: "Transform your resume into a powerful tool with action verbs that capture attention. Elevate your language and stand out in the job market today!",
      category: "Resume Tips",
      date: "November 19, 2025",
      readTime: "5 min read",
      slug: "transform-resume-action-verbs",
      image: "/api/placeholder/800/400"
    },
    {
      id: 2,
      title: "Stand Out with Top-notch Senior Management Resume Services",
      excerpt: "Revamp your career with our senior management resume services. Create a standout leadership resume that showcases your executive skills and achievements.",
      category: "Resume Writing",
      date: "November 19, 2025",
      readTime: "6 min read",
      slug: "senior-management-resume-services",
      image: "/api/placeholder/800/400"
    },
    {
      id: 3,
      title: "Elevate Your Career with Expert Resume Services",
      excerpt: "Boost your career prospects with expert resume services. Craft a powerful resume that highlights your strengths and sets you apart from the competition.",
      category: "Resume Services",
      date: "November 17, 2025",
      readTime: "5 min read",
      slug: "expert-resume-services",
      image: "/api/placeholder/800/400"
    },
    {
      id: 4,
      title: "Unlock Opportunities with Expert Mid-Career Resume Help",
      excerpt: "Unlock new job opportunities with our expert mid-career resume help. Tailored drafts enhance your experienced or professional resume for impactful applications.",
      category: "Career Advice",
      date: "November 12, 2025",
      readTime: "6 min read",
      slug: "mid-career-resume-help",
      image: "/api/placeholder/800/400"
    },
    {
      id: 5,
      title: "Affordable Basic Resume Writing – Stand Out in Your Job Hunt",
      excerpt: "Stand out in your job hunt with an affordable basic resume. Master entry-level applications and impress employers without breaking the bank. Get started now!",
      category: "Resume Writing",
      date: "November 12, 2025",
      readTime: "5 min read",
      slug: "affordable-basic-resume-writing",
      image: "/api/placeholder/800/400"
    },
    {
      id: 6,
      title: "Write Winning Selection Criteria for Government Roles Today!",
      excerpt: "Craft persuasive selection criteria for government roles to stand out. Enhance your public service applications with our expert tips and strategies for success.",
      category: "Selection Criteria",
      date: "November 10, 2025",
      readTime: "7 min read",
      slug: "winning-selection-criteria-government",
      image: "/api/placeholder/800/400"
    },
    {
      id: 7,
      title: "Effective CV Writing Strategies for Career Success",
      excerpt: "Unlock your career potential with effective CV writing strategies. Learn how to craft a standout CV that impresses employers and secures interviews.",
      category: "CV Writing",
      date: "October 6, 2025",
      readTime: "6 min read",
      slug: "effective-cv-writing-strategies",
      image: "/api/placeholder/800/400"
    },
    {
      id: 8,
      title: "Expert CV Help for Crafting Winning Resumes Effortlessly",
      excerpt: "Unlock the secrets to crafting a winning resume effortlessly. Get expert CV help and transform your job applications into interview opportunities.",
      category: "CV Writing",
      date: "September 26, 2025",
      readTime: "6 min read",
      slug: "expert-cv-help-winning-resumes",
      image: "/api/placeholder/800/400"
    },
    {
      id: 9,
      title: "Why do you need CV services",
      excerpt: "Introduction: Turning Job Search Blues into a Beacon of Success. Ever felt like you're chasing your tail in the job search process?",
      category: "CV Services",
      date: "December 12, 2024",
      readTime: "5 min read",
      slug: "why-need-cv-services",
      image: "/api/placeholder/800/400"
    }
  ];

  const categories = ["All", "Resume Tips", "Resume Writing", "Resume Services", "Career Advice", "Selection Criteria", "CV Writing", "CV Services"];

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
