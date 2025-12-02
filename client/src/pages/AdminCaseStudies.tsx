import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminCaseStudies() {
  const [showDrafts, setShowDrafts] = useState(false);
  
  const { data: caseStudies, isLoading, refetch } = trpc.caseStudies.getAll.useQuery({ 
    publishedOnly: !showDrafts 
  });
  
  const deleteMutation = trpc.caseStudies.delete.useMutation({
    onSuccess: () => {
      toast.success("Case study deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete case study: ${error.message}`);
    },
  });

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-12">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Case Studies Management</h1>
              <p className="text-muted-foreground">Create and manage client success stories</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowDrafts(!showDrafts)}
              >
                {showDrafts ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Show All
                  </>
                )}
              </Button>
              <Link href="/admin/case-studies/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Case Study
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading case studies...</p>
            </div>
          ) : caseStudies && caseStudies.length > 0 ? (
            <div className="grid gap-4">
              {caseStudies.map((study) => (
                <Card key={study.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-semibold">{study.title}</h2>
                        <span className={`px-2 py-1 text-xs rounded ${
                          study.published === 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {study.published === 1 ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                          {study.category}
                        </span>
                        {study.featured === 1 && (
                          <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        <strong>Client:</strong> {study.clientName}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {study.challenge.substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <span>Views: {study.viewCount || 0}</span>
                        <span>Created: {new Date(study.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link href={`/admin/case-studies/edit/${study.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(study.id, study.title)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No case studies found</p>
              <Link href="/admin/case-studies/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Case Study
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
