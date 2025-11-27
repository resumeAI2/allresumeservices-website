import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Copy, Check, Edit2, Save, X } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/imageUtils";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MediaLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editAltText, setEditAltText] = useState("");
  
  const { data: images = [], isLoading } = trpc.blog.getAllImages.useQuery();
  const updateImageMutation = trpc.blog.updateImageAltText.useMutation({
    onSuccess: () => {
      toast.success("Alt text updated successfully!");
      setEditingImageId(null);
      setEditAltText("");
    },
    onError: (error: any) => {
      toast.error("Failed to update alt text: " + error.message);
    },
  });
  const utils = trpc.useUtils();

  const filteredImages = images.filter(img =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success("Image URL copied to clipboard!");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const startEditingAltText = (imageId: number, currentAltText: string | null) => {
    setEditingImageId(imageId);
    setEditAltText(currentAltText || "");
  };

  const saveAltText = async (imageId: number) => {
    await updateImageMutation.mutateAsync({ id: imageId, altText: editAltText });
    await utils.blog.getAllImages.invalidate();
  };

  const cancelEditingAltText = () => {
    setEditingImageId(null);
    setEditAltText("");
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Link href="/admin/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Media Library</h1>
          <p className="text-muted-foreground">
            Browse and manage all uploaded images
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search images by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No images found matching your search." : "No images uploaded yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredImages.length} of {images.length} images
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img
                      src={getOptimizedImageUrl(image, 'thumbnail')}
                      alt={image.altText || image.filename}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-sm truncate mb-2" title={image.filename}>
                      {image.filename}
                    </h3>
                    
                    <div className="space-y-1 text-xs text-muted-foreground mb-3">
                      <p>Size: {formatFileSize(image.size)}</p>
                      <p>Uploaded: {formatDate(image.uploadedAt)}</p>
                      <p className="truncate" title={image.contentType}>
                        Type: {image.contentType}
                      </p>
                    </div>

                    {editingImageId === image.id ? (
                      <div className="mb-3 space-y-2">
                        <Input
                          value={editAltText}
                          onChange={(e) => setEditAltText(e.target.value)}
                          placeholder="Enter alt text"
                          className="text-xs"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => saveAltText(image.id)}
                            disabled={updateImageMutation.isPending}
                          >
                            <Save className="mr-1 h-3 w-3" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEditingAltText}
                            disabled={updateImageMutation.isPending}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Alt Text:</p>
                            <p className="text-xs text-foreground break-words">
                              {image.altText || <span className="italic text-muted-foreground">Not set</span>}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={() => startEditingAltText(image.id, image.altText)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => copyToClipboard(image.url)}
                    >
                      {copiedUrl === image.url ? (
                        <>
                          <Check className="mr-2 h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-3 w-3" />
                          Copy URL
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
