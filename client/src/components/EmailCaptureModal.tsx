import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseStudyId: number;
  caseStudyTitle: string;
  onSuccess?: () => void;
}

export default function EmailCaptureModal({
  isOpen,
  onClose,
  caseStudyId,
  caseStudyTitle,
  onSuccess,
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const subscribeMutation = trpc.emailSubscribers.subscribe.useMutation({
    onSuccess: (data) => {
      if (data.alreadySubscribed) {
        toast.success("You're already subscribed! Generating PDF...");
      } else {
        toast.success("Thank you for subscribing! Generating PDF...");
      }
      
      // Simulate PDF generation and download
      setTimeout(() => {
        toast.success("PDF download started!");
        onSuccess?.();
        onClose();
        setEmail("");
        setName("");
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Failed to subscribe: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    subscribeMutation.mutate({
      email,
      name: name || undefined,
      source: "case_study_download",
      caseStudyId,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-1rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Download Full Case Study
          </DialogTitle>
          <DialogDescription>
            Get the complete "{caseStudyTitle}" case study as a PDF. Enter your email to receive instant access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-2"
            />
          </div>

          <div className="bg-muted p-3 sm:p-4 rounded-lg text-sm">
            <p className="text-muted-foreground">
              By downloading, you'll also receive our career advice newsletter with expert tips and exclusive content. 
              You can unsubscribe anytime.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:flex-1"
              disabled={subscribeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1"
              disabled={subscribeMutation.isPending}
            >
              {subscribeMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
