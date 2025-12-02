import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: {
    slug: string;
    published: number;
    category: string;
  };
}

export default function BlogSchedule() {
  const [, navigate] = useLocation();
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft" | "scheduled">("all");

  const { data: allPosts, isLoading } = trpc.blog.getAll.useQuery({ publishedOnly: false });

  // Transform posts into calendar events
  const events: CalendarEvent[] = useMemo(() => {
    if (!allPosts) return [];

    return allPosts
      .filter((post) => {
        if (filterStatus === "all") return true;
        if (filterStatus === "published") return post.published === 1 && !post.scheduledPublishDate;
        if (filterStatus === "draft") return post.published === 0;
        if (filterStatus === "scheduled") return post.scheduledPublishDate !== null;
        return true;
      })
      .map((post) => {
        const eventDate = post.scheduledPublishDate
          ? new Date(post.scheduledPublishDate)
          : new Date(post.createdAt);

        return {
          id: post.id,
          title: post.title,
          start: eventDate,
          end: eventDate,
          resource: {
            slug: post.slug,
            published: post.published,
            category: post.category,
          },
        };
      });
  }, [allPosts, filterStatus]);

  const handleSelectEvent = (event: CalendarEvent) => {
    navigate(`/admin/blog/edit/${event.id}`);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3b82f6"; // blue for published
    
    if (event.resource.published === 0) {
      backgroundColor = "#94a3b8"; // gray for draft
    } else if (allPosts?.find(p => p.id === event.id)?.scheduledPublishDate) {
      backgroundColor = "#f59e0b"; // orange for scheduled
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading calendar...</p>
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
              <h1 className="text-3xl font-bold mb-2">Blog Post Schedule</h1>
              <p className="text-muted-foreground">
                Visual calendar view of all blog posts and scheduled publications
              </p>
            </div>
            <Link href="/admin/blog/new">
              <Button>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Filter:</span>
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All Posts
            </Button>
            <Button
              variant={filterStatus === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("published")}
            >
              <Badge className="mr-2 bg-blue-500">●</Badge>
              Published
            </Button>
            <Button
              variant={filterStatus === "scheduled" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("scheduled")}
            >
              <Badge className="mr-2 bg-orange-500">●</Badge>
              Scheduled
            </Button>
            <Button
              variant={filterStatus === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("draft")}
            >
              <Badge className="mr-2 bg-gray-500">●</Badge>
              Drafts
            </Button>
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-sm font-medium">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-sm">Published</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500"></div>
              <span className="text-sm">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-500"></div>
              <span className="text-sm">Draft</span>
            </div>
          </div>
        </Card>

        {/* Calendar */}
        <Card className="p-6">
          <div style={{ height: "700px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              popup
              views={["month", "week", "day", "agenda"]}
              style={{ height: "100%" }}
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{allPosts?.length || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">
                  {allPosts?.filter((p) => p.published === 1 && !p.scheduledPublishDate).length || 0}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">
                  {allPosts?.filter((p) => p.scheduledPublishDate !== null).length || 0}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-500/10 rounded-lg">
                <Edit className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold">
                  {allPosts?.filter((p) => p.published === 0).length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
