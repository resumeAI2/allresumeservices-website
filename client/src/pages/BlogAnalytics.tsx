import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, Eye, FileText, Search, Calendar } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function BlogAnalytics() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const { data: allPosts, isLoading: postsLoading } = trpc.blog.getAll.useQuery({ publishedOnly: false });
  const { data: popularPosts = [] } = trpc.blog.getPopularPosts.useQuery({ limit: 10 });
  const { data: faqSearches = [] } = trpc.faq.getTopSearches.useQuery({ limit: 10 });

  // Calculate statistics
  const totalPosts = allPosts?.length || 0;
  const publishedPosts = allPosts?.filter(p => p.published === 1).length || 0;
  const draftPosts = allPosts?.filter(p => p.published === 0).length || 0;
  const scheduledPosts = allPosts?.filter(p => p.scheduledPublishDate !== null).length || 0;
  const totalViews = allPosts?.reduce((sum, post) => sum + (post.viewCount || 0), 0) || 0;

  // Category distribution data
  const categoryData = allPosts?.reduce((acc: { [key: string]: number }, post) => {
    const category = post.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = categoryData
    ? Object.entries(categoryData).map(([name, value]) => ({ name, value }))
    : [];

  // Top posts by views
  const topPostsData = popularPosts.slice(0, 5).map(post => ({
    title: post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title,
    views: post.viewCount || 0,
  }));

  // Recent search terms
  const searchTermsData = faqSearches.slice(0, 8).map(search => ({
    term: search.query.length > 25 ? search.query.substring(0, 25) + "..." : search.query,
    count: search.count,
  }));

  if (postsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading analytics...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Management
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Blog Analytics</h1>
              <p className="text-muted-foreground">
                Performance metrics and insights for your blog content
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={dateRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("7d")}
              >
                7 Days
              </Button>
              <Button
                variant={dateRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("30d")}
              >
                30 Days
              </Button>
              <Button
                variant={dateRange === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("90d")}
              >
                90 Days
              </Button>
              <Button
                variant={dateRange === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange("all")}
              >
                All Time
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-3xl font-bold">{totalPosts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-3xl font-bold">{publishedPosts}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Eye className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-3xl font-bold">{scheduledPosts}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Posts by Views */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Posts by Views
            </h2>
            {topPostsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPostsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No view data available yet</p>
            )}
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Posts by Category
            </h2>
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-8">No category data available</p>
            )}
          </Card>
        </div>

        {/* Search Terms */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Popular Search Terms (from FAQ)
          </h2>
          {searchTermsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={searchTermsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="term" type="category" width={150} fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-center py-8">No search data available yet</p>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            💡 Tip: Use popular search terms to create new blog content that addresses your audience's questions
          </p>
        </Card>

        {/* Detailed Post List */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">All Posts Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Title</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-center py-3 px-2">Status</th>
                  <th className="text-center py-3 px-2">Views</th>
                  <th className="text-left py-3 px-2">Published</th>
                </tr>
              </thead>
              <tbody>
                {popularPosts.slice(0, 15).map((post) => (
                  <tr key={post.id} className="border-b hover:bg-accent/50">
                    <td className="py-3 px-2">
                      <Link href={`/blog/${post.slug}`}>
                        <span className="hover:text-primary cursor-pointer">{post.title}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        post.published === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.published === 1 ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="text-center py-3 px-2 font-semibold">
                      {post.viewCount || 0}
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
