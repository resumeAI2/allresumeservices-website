import { useState, useEffect } from 'react';

export interface ABTestVariant {
  id: string;
  text: string;
  color?: string;
  className?: string;
}

export interface ABTestConfig {
  testName: string;
  variants: ABTestVariant[];
  defaultVariantId?: string;
}

/**
 * A/B Testing Hook for CTA buttons and other UI elements
 * 
 * Usage:
 * const variant = useABTest({
 *   testName: 'hero-cta',
 *   variants: [
 *     { id: 'a', text: 'Get Free Quote' },
 *     { id: 'b', text: 'Start Your Career Transformation' }
 *   ]
 * });
 */
export function useABTest(config: ABTestConfig): ABTestVariant {
  const { testName, variants, defaultVariantId } = config;
  
  const [selectedVariant, setSelectedVariant] = useState<ABTestVariant>(() => {
    // Check if user already has an assigned variant in localStorage
    const storageKey = `ab_test_${testName}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      const variant = variants.find(v => v.id === stored);
      if (variant) return variant;
    }
    
    // Assign a random variant or use default
    if (defaultVariantId) {
      const defaultVariant = variants.find(v => v.id === defaultVariantId);
      if (defaultVariant) return defaultVariant;
    }
    
    return variants[Math.floor(Math.random() * variants.length)];
  });

  useEffect(() => {
    // Persist the selected variant
    const storageKey = `ab_test_${testName}`;
    localStorage.setItem(storageKey, selectedVariant.id);
    
    // Track variant assignment (in production, send to analytics)
    console.log(`A/B Test: ${testName} - Variant: ${selectedVariant.id}`);
    
    // In production, you would send this to your analytics service:
    // trackEvent('ab_test_assigned', {
    //   test_name: testName,
    //   variant_id: selectedVariant.id,
    // });
  }, [testName, selectedVariant.id]);

  return selectedVariant;
}

/**
 * Track A/B test conversion (e.g., button click)
 */
export function trackABTestConversion(testName: string, variantId: string, conversionType: string = 'click') {
  console.log(`A/B Test Conversion: ${testName} - Variant: ${variantId} - Type: ${conversionType}`);
  
  // In production, send to analytics service:
  // trackEvent('ab_test_conversion', {
  //   test_name: testName,
  //   variant_id: variantId,
  //   conversion_type: conversionType,
  // });
}
