import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentCancel() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-accent py-20">
        <div className="container max-w-2xl">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-card-foreground mb-4">
              Payment Cancelled
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your payment was cancelled. No charges have been made to your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation("/#pricing")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
