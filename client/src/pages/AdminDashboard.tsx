import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  FileText, 
  Mail, 
  MessageSquare, 
  Search, 
  Plus,
  ExternalLink,
  TrendingUp,
  Package,
  Tag,
  MailCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: metrics, isLoading } = trpc.dashboard.getMetrics.useQuery();
  const { data: recentContacts = [] } = trpc.dashboard.getRecentContacts.useQuery({ limit: 5 });
  const { data: recentPosts = [] } = trpc.dashboard.getRecentPosts.useQuery({ limit: 5 });
  const { data: popularPosts = [] } = trpc.blog.getPopularPosts.useQuery({ limit: 5 });
  const { data: scheduledPosts = [] } = trpc.dashboard.getScheduledPosts.useQuery({ limit: 5 });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Blog Posts',
      value: metrics?.blog.total || 0,
      description: `${metrics?.blog.published || 0} published, ${metrics?.blog.draft || 0} drafts`,
      icon: FileText,
      link: '/admin/blog',
      color: 'text-blue-600',
    },
    {
      title: 'Contact Submissions',
      value: metrics?.contacts.total || 0,
      description: `${metrics?.contacts.new || 0} new, ${metrics?.contacts.contacted || 0} contacted`,
      icon: Mail,
      link: '/admin/contacts',
      color: 'text-green-600',
    },
    {
      title: 'Testimonials',
      value: metrics?.testimonials.total || 0,
      description: `${metrics?.testimonials.featured || 0} featured, ${metrics?.testimonials.approved || 0} approved`,
      icon: MessageSquare,
      link: '/admin/testimonials',
      color: 'text-purple-600',
    },
    {
      title: 'FAQ Searches',
      value: metrics?.faq.totalSearches || 0,
      description: 'Total search queries',
      icon: Search,
      link: '/admin/faq-analytics',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your website's content and activity
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <Link href={stat.link}>
                  <Button variant="link" size="sm" className="px-0 mt-2">
                    View details
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/blog/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Blog Post
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline">
                Manage Categories
              </Button>
            </Link>
            <Link href="/admin/tags">
              <Button variant="outline">
                Manage Tags
              </Button>
            </Link>
            <Link href="/admin/testimonials">
              <Button variant="outline">
                Manage Testimonials
              </Button>
            </Link>
            <Link href="/admin/media">
              <Button variant="outline">
                Media Library
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline">
                <Package className="mr-2 h-4 w-4" />
                Manage Orders
              </Button>
            </Link>
            <Link href="/admin/promo-codes">
              <Button variant="outline">
                <Tag className="mr-2 h-4 w-4" />
                Promo Codes
              </Button>
            </Link>
            <Link href="/admin/email-logs">
              <Button variant="outline">
                <MailCheck className="mr-2 h-4 w-4" />
                Email Logs
              </Button>
            </Link>
            <Link href="/admin/email-test">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Test Email
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Popular Blog Posts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Most Popular Blog Posts
          </CardTitle>
          <CardDescription>Posts ranked by view count</CardDescription>
        </CardHeader>
        <CardContent>
          {popularPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No blog posts with views yet</p>
          ) : (
            <div className="space-y-4">
              {popularPosts.map((post: any, index: number) => (
                <div key={post.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <Link href={`/blog/${post.slug}`}>
                        <p className="font-medium hover:underline">{post.title}</p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">{post.viewCount}</span>
                    <span>views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Contact Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Submissions</CardTitle>
            <CardDescription>Latest inquiries from your website</CardDescription>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contact submissions yet</p>
            ) : (
              <div className="space-y-4">
                {recentContacts.map((contact: any) => (
                  <div key={contact.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {contact.serviceInterest || 'No service specified'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      contact.status === 'new' ? 'bg-green-100 text-green-800' :
                      contact.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>Latest updates to your blog</CardDescription>
          </CardHeader>
          <CardContent>
            {recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blog posts yet</p>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post: any) => (
                  <div key={post.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div className="flex-1">
                      <Link href={`/admin/blog/edit/${post.id}`}>
                        <p className="font-medium hover:underline">{post.title}</p>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {new Date(post.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.published === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.published === 1 ? 'Published' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Posts */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Scheduled Posts</CardTitle>
          <CardDescription>Upcoming blog posts ready to publish</CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scheduled posts</p>
          ) : (
            <div className="space-y-4">
              {scheduledPosts.map((post: any) => {
                const scheduledDate = new Date(post.scheduledPublishDate);
                const now = new Date();
                const hoursUntil = Math.floor((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60));
                const daysUntil = Math.floor(hoursUntil / 24);
                
                return (
                  <div key={post.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                    <div className="flex-1">
                      <Link href={`/admin/blog/edit/${post.id}`}>
                        <a className="font-medium hover:underline">{post.title}</a>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        Scheduled: {scheduledDate.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {daysUntil > 0 ? `${daysUntil} days` : `${hoursUntil} hours`} until publish
                      </p>
                    </div>
                    <Link href={`/admin/blog/edit/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {metrics?.contacts.total && metrics.contacts.total > 0
                  ? Math.round((metrics.contacts.converted / metrics.contacts.total) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-muted-foreground">
                {metrics?.contacts.converted || 0} of {metrics?.contacts.total || 0} contacts converted
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Content Engagement</p>
              <p className="text-2xl font-bold">{metrics?.faq.totalSearches || 0}</p>
              <p className="text-xs text-muted-foreground">
                Total FAQ searches performed
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Social Proof</p>
              <p className="text-2xl font-bold">{metrics?.testimonials.approved || 0}</p>
              <p className="text-xs text-muted-foreground">
                Approved testimonials displayed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
