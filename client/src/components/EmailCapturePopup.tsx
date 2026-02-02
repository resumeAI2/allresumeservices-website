import { useState, useEffect } from "react";
import { X, Download, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function EmailCapturePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const subscribeMutation = trpc.emailSubscribers.subscribe.useMutation({
    onSuccess: () => {
      setSubmitSuccess(true);
      localStorage.setItem("emailCapturePopupSeen", "true");
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    },
    onError: (error) => {
      toast.error(`Failed to subscribe: ${error.message}`);
    },
  });

  useEffect(() => {
    // Check if user has already seen or dismissed the popup
    const hasSeenPopup = localStorage.getItem("emailCapturePopupSeen");
    if (hasSeenPopup) {
      return;
    }

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isDismissed) {
        setIsVisible(true);
      }
    };

    // Timed trigger (30 seconds)
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 30000);

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, [isDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("emailCapturePopupSeen", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    subscribeMutation.mutate({
      email,
      source: 'email_capture_popup',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300 overflow-y-auto"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
        <Card className="w-full max-w-lg p-6 sm:p-8 md:p-12 pointer-events-auto animate-in zoom-in-95 duration-300 relative max-h-[90vh] overflow-y-auto my-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {!submitSuccess ? (
            <>
              {/* Icon */}
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Download className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4">
                Wait! Before You Go...
              </h2>

              <p className="text-sm sm:text-base text-center text-muted-foreground mb-4 sm:mb-6">
                Download our <strong>FREE Resume Checklist:</strong> "10 ATS Mistakes Costing You Interviews"
              </p>

              {/* Benefits List */}
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">Discover the top 10 resume mistakes that cause ATS systems to reject your application</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">Learn how to optimize your resume for both ATS and human recruiters</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">Get exclusive resume writing tips from our 18+ years of experience</span>
                </li>
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-9 sm:pl-10"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? "Sending..." : "Download Free Checklist"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  We respect your privacy. Unsubscribe anytime. No spam, ever.
                </p>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="bg-green-50 dark:bg-green-900/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                </div>

                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Check Your Email!
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  We've sent your free "10 ATS Mistakes" checklist to <strong>{email}</strong>
                </p>

                <p className="text-xs sm:text-sm text-muted-foreground">
                  Don't see it? Check your spam folder or promotions tab.
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
