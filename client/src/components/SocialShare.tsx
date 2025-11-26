import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Twitter } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : "";

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    window.open(link, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-colors"
          onClick={() => handleShare('linkedin')}
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
          onClick={() => handleShare('facebook')}
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors"
          onClick={() => handleShare('twitter')}
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
