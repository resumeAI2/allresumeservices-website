import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams, useRouter } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ImageGalleryModal from "@/components/ImageGalleryModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Eye, Upload, Loader2 } from "lucide-react";
import { Link } from "wouter";
import TiptapEditor from '@/components/TiptapEditor';

export default function BlogEditor() {
  const params = useParams();
  const [, navigate] = useLocation();
  const router = useRouter();
  const postId = params.id ? parseInt(params.id) : null;
  const isEditMode = postId !== null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Resume Tips");
  const [image, setImage] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [published, setPublished] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Fetch existing post if editing
  const { data: existingPost, isLoading } = trpc.blog.getById.useQuery(
    { id: postId! },
    { enabled: isEditMode }
  );

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt);
      setContent(existingPost.content);
      setCategory(existingPost.category);
      setImage(existingPost.image || "");
      setImageAltText(""); // Alt text not stored in blog_posts table yet
      setPublished(existingPost.published);
    }
  }, [existingPost]);

  const uploadImageMutation = trpc.blog.uploadImage.useMutation();

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      navigate("/admin/blog");
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });

  const updateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      navigate("/admin/blog");
    },
    onError: (error) => {
      toast.error(`Failed to update post: ${error.message}`);
    },
  });

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    // Auto-generate slug from title
    if (!isEditMode || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const result = await uploadImageMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64Data,
          altText: imageAltText || undefined,
        });

        setImage(result.url);
        toast.success('Image uploaded successfully!');
        setUploadingImage(false);
      };

      reader.onerror = () => {
        toast.error('Failed to read image file');
        setUploadingImage(false);
      };
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
      setUploadingImage(false);
    }
  };

  const handleSave = (isDraft: boolean) => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!slug.trim()) {
      toast.error("Please enter a slug");
      return;
    }
    if (!excerpt.trim()) {
      toast.error("Please enter an excerpt");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter content");
      return;
    }

    const postData = {
      title,
      slug,
      excerpt,
      content,
      category,
      image: image || "/blog/default.jpg",
      published: isDraft ? 0 : 1,
    };

    if (isEditMode) {
      updateMutation.mutate({ id: postId!, ...postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  const handleImageInsert = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const result = await uploadImageMutation.mutateAsync({
          filename: file.name,
          contentType: file.type,
          base64Data,
          altText: imageAltText || undefined,
        });

        // Insert image into editor content
        const imgTag = `<img src="${result.url}" alt="${imageAltText || ''}" class="max-w-full h-auto rounded-lg" />`;
        setContent(prev => prev + imgTag);

        toast.success('Image inserted successfully!');
        setUploadingImage(false);
      };

      reader.onerror = () => {
        toast.error('Failed to read image file');
        setUploadingImage(false);
      };
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
      setUploadingImage(false);
    }
  };

  // Tiptap handles toolbar and formatting internally

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background py-12">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <Link href="/admin/blog">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-6">
              {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>

            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  URL: /blog/{slug || 'post-slug'}
                </p>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Resume Tips">Resume Tips</SelectItem>
                    <SelectItem value="Cover Letters">Cover Letters</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="CV Writing">CV Writing</SelectItem>
                    <SelectItem value="Selection Criteria">Selection Criteria</SelectItem>
                    <SelectItem value="Interview Tips">Interview Tips</SelectItem>
                    <SelectItem value="Career Advice">Career Advice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">Featured Image</Label>
                <div className="space-y-3 mt-2">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Image URL or upload below"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowGalleryModal(true)}
                      >
                        Choose from Library
                      </Button>
                      <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingImage}
                        asChild
                      >
                        <span>
                          {uploadingImage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          <span className="ml-2">{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                        </span>
                      </Button>
                    </label>
                  </div>
                  <Input
                    id="imageAltText"
                    value={imageAltText}
                    onChange={(e) => setImageAltText(e.target.value)}
                    placeholder="Alt text for image (improves SEO and accessibility)"
                    className="w-full"
                  />
                  </div>
                  {image && (
                    <div className="border rounded-lg p-2">
                      <img
                        src={image}
                        alt="Preview"
                        className="max-h-40 object-contain mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the post (1-2 sentences)"
                  className="mt-2 w-full min-h-[100px] px-3 py-2 border border-input rounded-md"
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <div className="mt-2">
                  <TiptapEditor
                    value={content}
                    onChange={setContent}
                    onImageInsert={() => setShowGalleryModal(true)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  💡 Tip: You can drag & drop or paste images directly into the editor
                </p>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  onClick={() => handleSave(false)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update & Publish' : 'Publish'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSave(true)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                >
                  Save as Draft
                </Button>
                {slug && (
                  <Link href={`/blog/${slug}`} target="_blank">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>

      <ImageGalleryModal
        open={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        onSelect={(url) => setImage(url)}
      />

      <Footer />
    </div>
  );
}
