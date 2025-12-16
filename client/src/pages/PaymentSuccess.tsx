import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const { clearCart } = useCart();
  const captureOrderMutation = trpc.payment.captureOrder.useMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get("orderId");
    const token = params.get("token"); // PayPal order ID

    setOrderId(orderIdParam);
    setPaypalOrderId(token);

    if (!orderIdParam || !token) {
      setError("Invalid payment parameters");
      setProcessing(false);
      return;
    }

    // Capture the payment
    captureOrderMutation
      .mutateAsync({
        orderId: parseInt(orderIdParam),
        paypalOrderId: token,
      })
      .then(() => {
        // Clear cart after successful payment
        clearCart();
        setProcessing(false);
      })
      .catch((err) => {
        console.error("Capture error:", err);
        setError("Failed to process payment. Please contact support.");
        setProcessing(false);
      });
  }, []);

  const handleContinueToForm = () => {
    // Redirect to client intake form with order details
    const params = new URLSearchParams();
    if (orderId) params.set("orderId", orderId);
    if (paypalOrderId) params.set("token", paypalOrderId);
    setLocation(`/thank-you-onboarding?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-accent py-20">
        <div className="container max-w-2xl">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {processing ? (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-card-foreground mb-4">
                  Processing Your Payment...
                </h1>
                <p className="text-muted-foreground">
                  Please wait while we confirm your payment with PayPal.
                </p>
              </>
            ) : error ? (
              <>
                <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h1 className="text-3xl font-bold text-card-foreground mb-4">Payment Error</h1>
                <p className="text-muted-foreground mb-8">{error}</p>
                <Button onClick={() => setLocation("/")}>Return to Home</Button>
              </>
            ) : (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-card-foreground mb-4">
                  Thank You for Your Purchase!
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Your payment has been successfully processed. To get started on your professional documents, please complete the information form below.
                </p>
                
                <div className="bg-secondary/10 border-2 border-secondary rounded-lg p-6 mb-8">
                  <h2 className="font-semibold text-card-foreground mb-3 text-lg">
                    Next Step: Complete Your Information Form
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    This form helps us understand your career history, goals, and preferences so we can create the perfect documents for you.
                  </p>
                  <ul className="text-left space-y-2 text-muted-foreground mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>Takes approximately 15-20 minutes to complete</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>You can save and resume later if needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>Upload your current resume and any supporting documents</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleContinueToForm}
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-6 px-8"
                    size="lg"
                  >
                    Complete Information Form
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mt-6">
                  You can also access this form later via the link in your confirmation email.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
