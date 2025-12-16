import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Check } from "lucide-react";
import { getOptimisedImageUrl } from "@/lib/imageUtils";

interface ImageGalleryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function ImageGalleryModal({ open, onClose, onSelect }: ImageGalleryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data: images = [], isLoading } = trpc.blog.getAllImages.useQuery(undefined, {
    enabled: open,
  });

  const filteredImages = images.filter(img =>
    img.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      setSelectedImage(null);
      setSearchQuery("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image from Library</DialogTitle>
          <DialogDescription>
            Choose an image from your media library to insert
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
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

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading images...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "No images found matching your search." : "No images in library yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image.url
                      ? "border-primary shadow-lg scale-105"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={getOptimisedImageUrl(image, 'thumbnail')}
                    alt={image.altText || image.filename}
                    className="w-full h-full object-cover"
                    title={image.altText || image.filename}
                    loading="lazy"
                  />
                  {selectedImage === image.url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Check className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                    <div className="truncate font-medium">{image.filename}</div>
                    {image.altText && (
                      <div className="truncate text-gray-300 mt-0.5" title={image.altText}>
                        Alt: {image.altText}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedImage}>
            Insert Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
