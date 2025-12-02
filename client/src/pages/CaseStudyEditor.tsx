import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CaseStudyEditor() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const isEditing = !!params.id;
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [clientName, setClientName] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState("");
  const [testimonialQuote, setTestimonialQuote] = useState("");
  const [image, setImage] = useState("");
  const [beforeResumeImage, setBeforeResumeImage] = useState("");
  const [afterResumeImage, setAfterResumeImage] = useState("");
  const [published, setPublished] = useState(0);
  const [featured, setFeatured] = useState(0);

  // Fetch existing case study if editing
  const { data: existingStudy } = trpc.caseStudies.getById.useQuery(
    { id: parseInt(params.id || "0") },
    { enabled: isEditing }
  );

  useEffect(() => {
    if (existingStudy) {
      setTitle(existingStudy.title);
      setSlug(existingStudy.slug);
      setCategory(existingStudy.category);
      setClientName(existingStudy.clientName);
      setChallenge(existingStudy.challenge);
      setSolution(existingStudy.solution);
      setResult(existingStudy.result);
      setTestimonialQuote(existingStudy.testimonialQuote || "");
      setImage(existingStudy.image || "");
      setBeforeResumeImage(existingStudy.beforeResumeImage || "");
      setAfterResumeImage(existingStudy.afterResumeImage || "");
      setPublished(existingStudy.published);
      setFeatured(existingStudy.featured);
    }
  }, [existingStudy]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [title, isEditing]);

  const createMutation = trpc.caseStudies.create.useMutation({
    onSuccess: () => {
      toast.success("Case study created successfully");
      setLocation("/admin/case-studies");
    },
    onError: (error) => {
      toast.error(`Failed to create case study: ${error.message}`);
    },
  });

  const updateMutation = trpc.caseStudies.update.useMutation({
    onSuccess: () => {
      toast.success("Case study updated successfully");
      setLocation("/admin/case-studies");
    },
    onError: (error) => {
      toast.error(`Failed to update case study: ${error.message}`);
    },
  });

  const handleSave = (publishNow: boolean = false) => {
    if (!title || !slug || !category || !clientName || !challenge || !solution || !result) {
      toast.error("Please fill in all required fields");
      return;
    }

    const studyData = {
      title,
      slug,
      category,
      clientName,
      challenge,
      solution,
      result,
      testimonialQuote: testimonialQuote || undefined,
      image: image || undefined,
      beforeResumeImage: beforeResumeImage || undefined,
      afterResumeImage: afterResumeImage || undefined,
      published: publishNow ? 1 : published,
      featured,
    };

    if (isEditing) {
      updateMutation.mutate({ id: parseInt(params.id!), ...studyData });
    } else {
      createMutation.mutate(studyData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-12">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/admin/case-studies")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case Studies
            </Button>
            <h1 className="text-4xl font-bold">
              {isEditing ? "Edit Case Study" : "New Case Study"}
            </h1>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Transforming a Career Path into Mining Opportunities"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="transforming-career-path-mining"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  URL: /case-studies/{slug || "your-slug-here"}
                </p>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Career Change Success, Executive Promotion, Graduate Entry"
                />
              </div>

              {/* Client Name */}
              <div>
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g., Howard, Mark, Elizabeth"
                />
              </div>

              {/* Challenge */}
              <div>
                <Label htmlFor="challenge">Challenge / Problem *</Label>
                <Textarea
                  id="challenge"
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Describe the client's situation and the challenges they faced..."
                  rows={6}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {challenge.length} characters
                </p>
              </div>

              {/* Solution */}
              <div>
                <Label htmlFor="solution">Solution / What We Did *</Label>
                <Textarea
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Explain what you did to help the client..."
                  rows={6}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {solution.length} characters
                </p>
              </div>

              {/* Result */}
              <div>
                <Label htmlFor="result">Result / Outcome *</Label>
                <Textarea
                  id="result"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Describe the successful outcome and results achieved..."
                  rows={6}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {result.length} characters
                </p>
              </div>

              {/* Testimonial Quote */}
              <div>
                <Label htmlFor="testimonialQuote">Testimonial Quote (Optional)</Label>
                <Textarea
                  id="testimonialQuote"
                  value={testimonialQuote}
                  onChange={(e) => setTestimonialQuote(e.target.value)}
                  placeholder="Optional: Add a client testimonial quote..."
                  rows={3}
                />
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="image">Featured Image URL (Optional)</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Before Resume Image */}
              <div>
                <Label htmlFor="beforeResumeImage">Before Resume Image URL (Optional)</Label>
                <Input
                  id="beforeResumeImage"
                  value={beforeResumeImage}
                  onChange={(e) => setBeforeResumeImage(e.target.value)}
                  placeholder="https://example.com/before-resume.jpg"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload the client's original resume screenshot to show the transformation
                </p>
              </div>

              {/* After Resume Image */}
              <div>
                <Label htmlFor="afterResumeImage">After Resume Image URL (Optional)</Label>
                <Input
                  id="afterResumeImage"
                  value={afterResumeImage}
                  onChange={(e) => setAfterResumeImage(e.target.value)}
                  placeholder="https://example.com/after-resume.jpg"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload the improved resume screenshot to demonstrate the results
                </p>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured === 1}
                  onChange={(e) => setFeatured(e.target.checked ? 1 : 0)}
                  className="h-4 w-4"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Feature this case study on homepage
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => handleSave(false)}
                  variant="outline"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {published === 1 ? "Update & Keep Published" : "Publish Now"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
