import { useState, useEffect } from 'react';
import { X, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    // Simulate API call to save email
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, send email to your backend/email service
    console.log('Email captured:', email);

    setIsLoading(false);
    setIsSubmitted(true);

    // Auto-download PDF after submission
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/10-point-resume-checklist.pdf';
      link.download = '10-Point-Resume-Checklist.pdf';
      link.click();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-lg shadow-2xl p-8 relative mx-4">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close popup"
          >
            <X className="h-6 w-6" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Download className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Wait! Before You Go...
              </h2>

              {/* Subheading */}
              <p className="text-center text-gray-600 mb-6">
                Get your <span className="font-semibold text-primary">FREE 10-Point Resume Checklist</span> and discover what Australian employers really want to see.
              </p>

              {/* Benefits */}
              <ul className="space-y-2 mb-6 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span>ATS optimisation tips that get past automated screening</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
                  <span>Proven formatting strategies from 18+ years experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-secondary mr-2 flex-shrink-0 mt-0.5" />
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
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Download Free Checklist'}
                </Button>
              </form>

              {/* Privacy note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <>
              {/* Success state */}
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Check Your Email!
              </h2>

              <p className="text-center text-gray-600 mb-6">
                Your <strong>10-Point Resume Checklist</strong> is downloading now. We've also sent a copy to <strong>{email}</strong>.
              </p>

              <Button
                onClick={handleClose}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Continue Browsing
              </Button>

              <p className="text-sm text-center text-gray-600 mt-4">
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
