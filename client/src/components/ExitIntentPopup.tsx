import { useState, useEffect } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subscribeMutation = trpc.emailSubscribers.subscribe.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      // Auto-download PDF after successful submission
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '/10-point-resume-checklist.pdf';
        link.download = '10-Point-Resume-Checklist.pdf';
        link.click();
      }, 500);
    },
    onError: (error) => {
      toast.error(`Failed to subscribe: ${error.message}`);
    },
  });

  useEffect(() => {
    // Check if popup has been shown in this session
    const hasShown = sessionStorage.getItem('exitPopupShown');
    if (hasShown) return;

    let exitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves viewport from top (user closing tab)
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        setIsVisible(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Add delay before activating exit intent (give user time to browse)
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // Activate after 5 seconds on site

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    subscribeMutation.mutate({
      email,
      source: 'exit_intent_popup',
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300 overflow-y-auto"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 sm:p-8 relative mx-auto my-auto max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 sm:p-4 rounded-full">
                  <Download className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Wait! Before You Go...
              </h2>

              {/* Subheading */}
              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                Get your <span className="font-semibold text-primary">FREE 10-Point Resume Checklist</span> and discover what Australian employers really want to see.
              </p>

              {/* Benefits */}
              <ul className="space-y-2 mb-6 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span>ATS optimisation tips that get past automated screening</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Proven formatting strategies from 18+ years experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Instant PDF download - no waiting</span>
                </li>
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? 'Sending...' : 'Download Free Checklist'}
                </Button>
              </form>

              {/* Privacy note */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-3 sm:p-4 rounded-full">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                Check Your Email!
              </h2>

              <p className="text-sm sm:text-base text-center text-gray-600 dark:text-gray-300 mb-6">
                Your <strong>10-Point Resume Checklist</strong> is downloading now. We've also sent a copy to <strong>{email}</strong>.
              </p>

              <Button
                onClick={handleClose}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Continue Browsing
              </Button>

              <p className="text-xs sm:text-sm text-center text-gray-600 dark:text-gray-300 mt-4">
                Ready to transform your resume?{' '}
                <a href="/services" className="text-primary hover:underline font-medium">
                  View our services
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
