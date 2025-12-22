import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Users, Briefcase, FileText, Target } from "lucide-react";
import { Link } from "wouter";

interface ContentTopic {
  month: string;
  quarter: string;
  topics: {
    title: string;
    category: string;
    targetAudience: string;
    keywords: string[];
    priority: "high" | "medium" | "low";
  }[];
}

const contentCalendar2025_2026: ContentTopic[] = [
  {
    month: "January 2025",
    quarter: "Q1 2025",
    topics: [
      {
        title: "New Year Career Reset: How to Update Your Resume for 2025",
        category: "Resume Tips",
        targetAudience: "Career changers, job seekers",
        keywords: ["resume update", "2025 resume trends", "career reset"],
        priority: "high"
      },
      {
        title: "Top 10 Resume Mistakes That Cost You Interviews in 2025",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["resume mistakes", "interview tips", "ATS optimization"],
        priority: "high"
      },
      {
        title: "How to Write a Resume for Remote Work Opportunities",
        category: "Industry Insights",
        targetAudience: "Remote workers",
        keywords: ["remote work resume", "work from home", "digital skills"],
        priority: "medium"
      }
    ]
  },
  {
    month: "February 2025",
    quarter: "Q1 2025",
    topics: [
      {
        title: "LinkedIn Profile Optimization: Complete Guide for Australian Professionals",
        category: "LinkedIn",
        targetAudience: "All professionals",
        keywords: ["LinkedIn optimization", "professional networking", "personal branding"],
        priority: "high"
      },
      {
        title: "How to Quantify Your Achievements on Your Resume",
        category: "Resume Tips",
        targetAudience: "Mid-career professionals",
        keywords: ["resume achievements", "quantifiable results", "impact statements"],
        priority: "high"
      },
      {
        title: "Cover Letter Templates for Australian Job Applications",
        category: "Cover Letters",
        targetAudience: "All job seekers",
        keywords: ["cover letter", "Australian job market", "application templates"],
        priority: "medium"
      }
    ]
  },
  {
    month: "March 2025",
    quarter: "Q1 2025",
    topics: [
      {
        title: "End of Financial Year Career Planning: Resume Refresh Guide",
        category: "Career Advice",
        targetAudience: "All professionals",
        keywords: ["career planning", "EOFY", "professional development"],
        priority: "high"
      },
      {
        title: "How to Address Employment Gaps in Your Resume",
        category: "Resume Tips",
        targetAudience: "Career returners",
        keywords: ["employment gaps", "career break", "resume gaps"],
        priority: "high"
      },
      {
        title: "Mining & Resources Resume Guide: What Recruiters Look For",
        category: "Industry Insights",
        targetAudience: "Mining professionals",
        keywords: ["mining resume", "resources sector", "FIFO jobs"],
        priority: "medium"
      }
    ]
  },
  {
    month: "April 2025",
    quarter: "Q2 2025",
    topics: [
      {
        title: "Graduate Resume Guide: Landing Your First Professional Role",
        category: "Career Levels",
        targetAudience: "Graduates",
        keywords: ["graduate resume", "entry level", "first job"],
        priority: "high"
      },
      {
        title: "ATS-Friendly Resume Formatting: Complete Technical Guide",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["ATS resume", "applicant tracking system", "resume formatting"],
        priority: "high"
      },
      {
        title: "Healthcare Professional Resumes: Compliance and Best Practices",
        category: "Industry Insights",
        targetAudience: "Healthcare workers",
        keywords: ["healthcare resume", "nursing resume", "medical professionals"],
        priority: "medium"
      }
    ]
  },
  {
    month: "May 2025",
    quarter: "Q2 2025",
    topics: [
      {
        title: "Mid-Year Career Review: Is It Time to Update Your Resume?",
        category: "Career Advice",
        targetAudience: "All professionals",
        keywords: ["career review", "professional growth", "job search timing"],
        priority: "high"
      },
      {
        title: "Selection Criteria Responses: Government Job Application Guide",
        category: "Selection Criteria",
        targetAudience: "Government job seekers",
        keywords: ["selection criteria", "government jobs", "public sector"],
        priority: "high"
      },
      {
        title: "Executive Resume Writing: C-Suite and Senior Leadership",
        category: "Career Levels",
        targetAudience: "Executives",
        keywords: ["executive resume", "leadership resume", "C-suite"],
        priority: "medium"
      }
    ]
  },
  {
    month: "June 2025",
    quarter: "Q2 2025",
    topics: [
      {
        title: "EOFY Career Transitions: Making Your Move in 2025",
        category: "Career Advice",
        targetAudience: "Career changers",
        keywords: ["career change", "EOFY", "job transition"],
        priority: "high"
      },
      {
        title: "IT & Technology Resume Trends: What Tech Recruiters Want",
        category: "Industry Insights",
        targetAudience: "IT professionals",
        keywords: ["IT resume", "technology jobs", "tech skills"],
        priority: "high"
      },
      {
        title: "How to Tailor Your Resume for Different Job Applications",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["resume customization", "job applications", "targeted resume"],
        priority: "medium"
      }
    ]
  },
  {
    month: "July 2025",
    quarter: "Q3 2025",
    topics: [
      {
        title: "New Financial Year, New Career: Resume Strategies for July",
        category: "Career Advice",
        targetAudience: "All job seekers",
        keywords: ["new financial year", "job search", "career goals"],
        priority: "high"
      },
      {
        title: "Professional Summary vs Objective: What Works in 2025",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["resume summary", "career objective", "resume opening"],
        priority: "high"
      },
      {
        title: "Career Change Resume: Transferable Skills Guide",
        category: "Career Advice",
        targetAudience: "Career changers",
        keywords: ["career change", "transferable skills", "pivot careers"],
        priority: "medium"
      }
    ]
  },
  {
    month: "August 2025",
    quarter: "Q3 2025",
    topics: [
      {
        title: "Resume Keywords: How to Beat ATS and Get Noticed",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["resume keywords", "ATS optimization", "job description matching"],
        priority: "high"
      },
      {
        title: "Government & Public Sector Resume Requirements",
        category: "Industry Insights",
        targetAudience: "Public sector job seekers",
        keywords: ["government resume", "public sector", "selection criteria"],
        priority: "high"
      },
      {
        title: "How to Showcase Soft Skills on Your Resume",
        category: "Resume Tips",
        targetAudience: "All professionals",
        keywords: ["soft skills", "interpersonal skills", "communication skills"],
        priority: "medium"
      }
    ]
  },
  {
    month: "September 2025",
    quarter: "Q3 2025",
    topics: [
      {
        title: "Spring Career Refresh: Resume Update Checklist",
        category: "Career Advice",
        targetAudience: "All professionals",
        keywords: ["resume update", "career refresh", "professional development"],
        priority: "high"
      },
      {
        title: "How to Write a Resume When You're Overqualified",
        category: "Resume Tips",
        targetAudience: "Senior professionals",
        keywords: ["overqualified", "senior professionals", "resume strategy"],
        priority: "medium"
      },
      {
        title: "Project Management Resume: Certifications and Achievements",
        category: "Industry Insights",
        targetAudience: "Project managers",
        keywords: ["project management", "PM resume", "certifications"],
        priority: "medium"
      }
    ]
  },
  {
    month: "October 2025",
    quarter: "Q4 2025",
    topics: [
      {
        title: "End of Year Job Search Strategy: Resume Preparation",
        category: "Career Advice",
        targetAudience: "All job seekers",
        keywords: ["year end job search", "Q4 hiring", "resume preparation"],
        priority: "high"
      },
      {
        title: "How to Include Volunteer Work on Your Resume",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["volunteer work", "community service", "unpaid experience"],
        priority: "medium"
      },
      {
        title: "Sales & Marketing Resume: Metrics That Matter",
        category: "Industry Insights",
        targetAudience: "Sales professionals",
        keywords: ["sales resume", "marketing resume", "performance metrics"],
        priority: "medium"
      }
    ]
  },
  {
    month: "November 2025",
    quarter: "Q4 2025",
    topics: [
      {
        title: "2026 Resume Trends: What's Changing in the New Year",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["2026 resume trends", "future of resumes", "hiring trends"],
        priority: "high"
      },
      {
        title: "How to Prepare Your Resume for January Hiring Rush",
        category: "Career Advice",
        targetAudience: "All job seekers",
        keywords: ["January hiring", "new year jobs", "resume preparation"],
        priority: "high"
      },
      {
        title: "Education Section: How to List Degrees and Certifications",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["education section", "qualifications", "certifications"],
        priority: "medium"
      }
    ]
  },
  {
    month: "December 2025",
    quarter: "Q4 2025",
    topics: [
      {
        title: "Year-End Resume Review: 2025 Achievements Update",
        category: "Career Advice",
        targetAudience: "All professionals",
        keywords: ["year end review", "achievements", "resume update"],
        priority: "high"
      },
      {
        title: "New Year Career Goals: Resume Preparation for 2026",
        category: "Career Advice",
        targetAudience: "All job seekers",
        keywords: ["new year goals", "2026 career", "resume planning"],
        priority: "high"
      },
      {
        title: "Holiday Job Search: Should You Apply During December?",
        category: "Career Advice",
        targetAudience: "Active job seekers",
        keywords: ["holiday job search", "December hiring", "year end applications"],
        priority: "medium"
      }
    ]
  },
  {
    month: "January 2026",
    quarter: "Q1 2026",
    topics: [
      {
        title: "2026 Resume Format Guide: Modern Layouts That Work",
        category: "Resume Tips",
        targetAudience: "All job seekers",
        keywords: ["resume format", "modern resume", "2026 design"],
        priority: "high"
      },
      {
        title: "AI and Automation Skills: How to Showcase Them on Your Resume",
        category: "Industry Insights",
        targetAudience: "Tech professionals",
        keywords: ["AI skills", "automation", "emerging technologies"],
        priority: "high"
      },
      {
        title: "First Quarter Hiring Trends: What Employers Want in 2026",
        category: "Career Advice",
        targetAudience: "All job seekers",
        keywords: ["hiring trends", "employer expectations", "2026 job market"],
        priority: "medium"
      }
    ]
  }
];

const getPriorityColor = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
  }
};

const getCategoryIcon = (category: string) => {
  if (category.includes("Resume")) return <FileText className="h-4 w-4" />;
  if (category.includes("Career")) return <TrendingUp className="h-4 w-4" />;
  if (category.includes("Industry")) return <Briefcase className="h-4 w-4" />;
  if (category.includes("LinkedIn")) return <Users className="h-4 w-4" />;
  return <Target className="h-4 w-4" />;
};

export default function ContentCalendar() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 bg-gradient-to-br from-background via-accent/5 to-background">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-secondary" />
              <h1 className="text-4xl font-bold">Blog Content Calendar 2025-2026</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Strategic content planning for All Resume Services blog. This calendar outlines trending topics, 
              target audiences, and SEO keywords for consistent publishing momentum across the Australian job market.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{contentCalendar2025_2026.reduce((acc, month) => acc + month.topics.length, 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Topics</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{contentCalendar2025_2026.length}</p>
                  <p className="text-sm text-muted-foreground">Months Planned</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {contentCalendar2025_2026.reduce((acc, month) => 
                      acc + month.topics.filter(t => t.priority === "high").length, 0
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">3-4</p>
                  <p className="text-sm text-muted-foreground">Posts/Month</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Content Calendar */}
          <div className="space-y-8">
            {contentCalendar2025_2026.map((monthData, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{monthData.month}</h2>
                    <Badge variant="outline" className="mt-2">{monthData.quarter}</Badge>
                  </div>
                  <Badge className="bg-secondary text-primary">
                    {monthData.topics.length} Topics
                  </Badge>
                </div>

                <div className="space-y-4">
                  {monthData.topics.map((topic, topicIdx) => (
                    <Card key={topicIdx} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getCategoryIcon(topic.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-semibold text-lg">{topic.title}</h3>
                            <Badge className={getPriorityColor(topic.priority)}>
                              {topic.priority}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                              <Badge variant="outline">{topic.category}</Badge>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">Target Audience</p>
                              <p className="text-sm">{topic.targetAudience}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">SEO Keywords</p>
                              <div className="flex flex-wrap gap-1">
                                {topic.keywords.slice(0, 3).map((keyword, kIdx) => (
                                  <Badge key={kIdx} variant="secondary" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex gap-4 justify-center">
            <Link href="/admin/blog">
              <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90">
                Create New Post
              </Button>
            </Link>
            <Link href="/admin/blog/schedule">
              <Button size="lg" variant="outline">
                View Calendar View
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
