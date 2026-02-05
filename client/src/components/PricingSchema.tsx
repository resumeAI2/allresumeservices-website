import { Helmet } from "react-helmet-async";

export default function PricingSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization
      {
        "@type": "Organization",
        "@id": "https://allresumeservices.com.au/#organization",
        "name": "All Résumé Services",
        "url": "https://allresumeservices.com.au",
        "logo": "https://allresumeservices.com.au/logo.png",
        "description": "Professional resume writing services with 18+ years experience helping Australians land interviews and secure their dream jobs.",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "AU",
          "addressRegion": "Australia"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+61-410-934-371",
          "contactType": "Customer Service",
          "email": "admin@allresumeservices.com.au",
          "availableLanguage": "English"
        }
      },
      // Basic Package
      {
        "@type": "Product",
        "name": "Basic Resume Writing Package",
        "description": "Professional resume writing service for entry-level professionals. Includes professionally written resume and cover letter with ATS-friendly formatting.",
        "brand": {
          "@type": "Brand",
          "name": "All Résumé Services"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://allresumeservices.com.au/pricing",
          "priceCurrency": "AUD",
          "price": "125.00",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@id": "https://allresumeservices.com.au/#organization"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "107",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      // Standard Package
      {
        "@type": "Product",
        "name": "Standard Resume Writing Package",
        "description": "Professional resume and cover letter writing service for mid-level professionals. Includes professionally written resume, cover letter, ATS-friendly formatting, and priority support.",
        "brand": {
          "@type": "Brand",
          "name": "All Résumé Services"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://allresumeservices.com.au/pricing",
          "priceCurrency": "AUD",
          "price": "185.00",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@id": "https://allresumeservices.com.au/#organization"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "107",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      // Premium Package
      {
        "@type": "Product",
        "name": "Premium Resume Writing Package",
        "description": "Complete professional branding package for executives. Includes executive resume, cover letter, LinkedIn profile optimisation, ATS-friendly formatting, 1-day express turnaround, and priority support.",
        "brand": {
          "@type": "Brand",
          "name": "All Résumé Services"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://allresumeservices.com.au/pricing",
          "priceCurrency": "AUD",
          "price": "255.00",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@id": "https://allresumeservices.com.au/#organization"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "107",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      // Individual Services
      {
        "@type": "Service",
        "serviceType": "Entry Level Resume Writing",
        "provider": {
          "@id": "https://allresumeservices.com.au/#organization"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "125.00",
          "url": "https://allresumeservices.com.au/pricing"
        }
      },
      {
        "@type": "Service",
        "serviceType": "Professional Resume Writing",
        "provider": {
          "@id": "https://allresumeservices.com.au/#organization"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "185.00",
          "url": "https://allresumeservices.com.au/pricing"
        }
      },
      {
        "@type": "Service",
        "serviceType": "Executive Resume Writing",
        "provider": {
          "@id": "https://allresumeservices.com.au/#organization"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "355.00",
          "url": "https://allresumeservices.com.au/pricing"
        }
      },
      {
        "@type": "Service",
        "serviceType": "LinkedIn Profile Optimisation",
        "provider": {
          "@id": "https://allresumeservices.com.au/#organization"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "125.00",
          "url": "https://allresumeservices.com.au/pricing"
        }
      },
      {
        "@type": "Service",
        "serviceType": "Cover Letter Writing",
        "provider": {
          "@id": "https://allresumeservices.com.au/#organization"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "55.00",
          "url": "https://allresumeservices.com.au/pricing"
        }
      },
      {
        "@type": "Service",
        "serviceType": "Selection Criteria Response Writing",
        "provider": {
          "@id": "https://allresumeservices.com.au/#organization"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "AUD",
          "price": "100.00",
          "url": "https://allresumeservices.com.au/pricing"
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
