import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Pricing page now redirects to /packages where customers can browse and add to cart.
 * This keeps old /pricing links working.
 */
export default function PricingPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to packages page, preserving any hash
    const hash = window.location.hash;
    setLocation(`/packages${hash}`);
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting to packages...</p>
    </div>
  );
}
