import { useState, useEffect } from "react";
import { X, Download, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function EmailCapturePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

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
    setIsSubmitting(true);

    // Simulate API call to save email
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Integrate with email service (e.g., Mailchimp, SendGrid, or database)
    console.log("Email captured:", email);

    setSubmitSuccess(true);
    setIsSubmitting(false);

    // Store in localStorage to prevent showing again
    localStorage.setItem("emailCapturePopupSeen", "true");

    // Auto-close after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-lg p-8 md:p-12 pointer-events-auto animate-in zoom-in-95 duration-300 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close popup"
          >
            <X className="h-6 w-6" />
          </button>

          {!submitSuccess ? (
            <>
              {/* Icon */}
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="h-8 w-8 text-primary" />
              </div>

              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
                Wait! Before You Go...
              </h2>

              <p className="text-center text-muted-foreground mb-6">
                Download our <strong>FREE Resume Checklist:</strong> "10 ATS Mistakes Costing You Interviews"
              </p>

              {/* Benefits List */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Discover the top 10 resume mistakes that cause ATS systems to reject your application</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Learn how to optimize your resume for both ATS and human recruiters</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Get exclusive resume writing tips from our 18+ years of experience</span>
                </li>
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Download Free Checklist"}
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
                <div className="bg-green-50 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>

                <h2 className="text-2xl font-bold mb-4">
                  Check Your Email!
                </h2>

                <p className="text-muted-foreground mb-6">
                  We've sent your free "10 ATS Mistakes" checklist to <strong>{email}</strong>
                </p>

                <p className="text-sm text-muted-foreground">
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
