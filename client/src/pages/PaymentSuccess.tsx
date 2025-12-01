import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
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
  const { clearCart } = useCart();
  const captureOrderMutation = trpc.payment.captureOrder.useMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const token = params.get("token"); // PayPal order ID

    if (!orderId || !token) {
      setError("Invalid payment parameters");
      setProcessing(false);
      return;
    }

    // Capture the payment
    captureOrderMutation
      .mutateAsync({
        orderId: parseInt(orderId),
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
                  Payment Successful!
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Thank you for your purchase! We'll be in touch shortly to begin working on
                  your professional documents.
                </p>
                <div className="bg-accent rounded-lg p-6 mb-8">
                  <h2 className="font-semibold text-card-foreground mb-3">What Happens Next?</h2>
                  <ul className="text-left space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>You'll receive a confirmation email with next steps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>We'll send you a questionnaire to gather your information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>Our team will begin crafting your professional documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>You'll receive your completed documents within the specified timeframe</span>
                    </li>
                  </ul>
                </div>
                <Button onClick={() => setLocation("/")}>Return to Home</Button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
