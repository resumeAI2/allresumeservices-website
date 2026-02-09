import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Star, Upload, Loader2 } from "lucide-react";

export default function AdminTestimonials() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [clientPhoto, setClientPhoto] = useState("");
  const [rating, setRating] = useState("5");
  const [testimonialText, setTestimonialText] = useState("");
  const [serviceUsed, setServiceUsed] = useState("");
  const [featured, setFeatured] = useState("0");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { data: testimonials, isLoading, refetch } = trpc.testimonials.getAll.useQuery({});
  const uploadImageMutation = trpc.blog.uploadImage.useMutation();

  const createMutation = trpc.testimonials.create.useMutation({
    onSuccess: () => {
      toast.success("Testimonial added successfully");
      refetch();
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to add testimonial: ${error.message}`);
    },
  });

  const updateMutation = trpc.testimonials.update.useMutation({
    onSuccess: () => {
      toast.success("Testimonial updated successfully");
      refetch();
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update testimonial: ${error.message}`);
    },
  });

  const deleteMutation = trpc.testimonials.delete.useMutation({
    onSuccess: () => {
      toast.success("Testimonial deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete testimonial: ${error.message}`);
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setClientName("");
    setClientTitle("");
    setClientPhoto("");
    setRating("5");
    setTestimonialText("");
    setServiceUsed("");
    setFeatured("0");
  };

  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    setClientName(testimonial.clientName);
    setClientTitle(testimonial.clientTitle || "");
    setClientPhoto(testimonial.clientPhoto || "");
    setRating(testimonial.rating.toString());
    setTestimonialText(testimonial.testimonialText);
    setServiceUsed(testimonial.serviceUsed || "");
    setFeatured(testimonial.featured.toString());
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      toast.error("Please enter client name");
      return;
    }
    if (!testimonialText.trim() || testimonialText.length < 10) {
      toast.error("Please enter testimonial text (at least 10 characters)");
      return;
    }

    const data = {
      clientName: clientName.trim(),
      clientTitle: clientTitle.trim() || undefined,
      clientPhoto: clientPhoto.trim() || undefined,
      rating: parseInt(rating),
      testimonialText: testimonialText.trim(),
      serviceUsed: serviceUsed || undefined,
      featured: parseInt(featured),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingPhoto(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const result = await uploadImageMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64Data: base64.split(',')[1], // Remove data:image/...;base64, prefix
          altText: `${clientName} photo`,
        });
        setClientPhoto(result.url);
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Testimonials Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage client testimonials and success stories
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "Add"} Testimonial</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientTitle">Client Title/Position</Label>
                    <Input
                      id="clientTitle"
                      value={clientTitle}
                      onChange={(e) => setClientTitle(e.target.value)}
                      placeholder="Senior Marketing Manager"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="clientPhoto">Client Photo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="clientPhoto"
                      value={clientPhoto}
                      onChange={(e) => setClientPhoto(e.target.value)}
                      placeholder="https://... or upload below"
                      className="flex-1"
                    />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={uploadingPhoto}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingPhoto}
                        asChild
                      >
                        <span>
                          {uploadingPhoto ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          <span className="ml-2">{uploadingPhoto ? 'Uploading...' : 'Upload'}</span>
                        </span>
                      </Button>
                    </label>
                  </div>
                  {clientPhoto && (
                    <div className="mt-2 border rounded p-2">
                      <img
                        src={clientPhoto}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover mx-auto"
                      />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating *</Label>
                    <Select value={rating} onValueChange={setRating}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars - Excellent</SelectItem>
                        <SelectItem value="4">4 Stars - Very Good</SelectItem>
                        <SelectItem value="3">3 Stars - Good</SelectItem>
                        <SelectItem value="2">2 Stars - Fair</SelectItem>
                        <SelectItem value="1">1 Star - Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="serviceUsed">Service Used</Label>
                    <Select value={serviceUsed} onValueChange={setServiceUsed}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Resume Writing">Resume Writing</SelectItem>
                        <SelectItem value="Cover Letter">Cover Letter</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn Profile</SelectItem>
                        <SelectItem value="Selection Criteria">Selection Criteria</SelectItem>
                        <SelectItem value="Career Consultation">Career Consultation</SelectItem>
                        <SelectItem value="Complete Package">Complete Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="testimonialText">Testimonial Text *</Label>
                  <textarea
                    id="testimonialText"
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                    placeholder="Share your experience..."
                    className="mt-2 w-full min-h-[120px] px-3 py-2 border border-input rounded-md"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="featured">Featured on Homepage</Label>
                  <Select value={featured} onValueChange={setFeatured}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yes - Feature on homepage</SelectItem>
                      <SelectItem value="0">No - Regular testimonial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1"
                  >
                    {editingId ? "Update" : "Add"} Testimonial
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading testimonials...</div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-start gap-4">
                  {testimonial.clientPhoto && (
                    <img
                      src={testimonial.clientPhoto}
                      alt={testimonial.clientName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{testimonial.clientName}</h3>
                        {testimonial.clientTitle && (
                          <p className="text-sm text-muted-foreground">{testimonial.clientTitle}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-3 text-muted-foreground">{testimonial.testimonialText}</p>
                    <div className="flex gap-4 mt-3 text-sm">
                      {testimonial.serviceUsed && (
                        <span className="text-muted-foreground">
                          Service: <strong>{testimonial.serviceUsed}</strong>
                        </span>
                      )}
                      {testimonial.featured === 1 && (
                        <span className="text-primary font-medium">⭐ Featured</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No testimonials yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Testimonial
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
