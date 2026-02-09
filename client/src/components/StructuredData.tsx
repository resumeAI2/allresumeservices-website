import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'homepage' | 'service';
  serviceName?: string;
  serviceDescription?: string;
  servicePrice?: string;
}

export default function StructuredData({ type, serviceName, serviceDescription, servicePrice }: StructuredDataProps) {
  useEffect(() => {
    const siteUrl = window.location.origin;
    
    // Remove existing structured data
    const existingScript = document.getElementById('structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    let schema: any;

    if (type === 'homepage') {
      // LocalBusiness schema for homepage
      schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "All Résumé Services",
        "description": "Expert ATS-Optimised Resumes & Cover Letters, LinkedIn profiles, and selection criteria for government and public sector roles that help Australians land interviews and secure their dream jobs. 96% Interview Success Rate.",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "image": `${siteUrl}/og-image.png`,
        "telephone": "0410 934 371",
        "email": "admin@allresumeservices.com.au",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "AU",
          "addressRegion": "Australia"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "addressCountry": "AU"
        },
        "priceRange": "$55 - $355",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "60",
          "bestRating": "5",
          "worstRating": "1"
        },
        "sameAs": [
          "https://www.linkedin.com/company/all-resume-services",
          "https://www.youtube.com/@AllResumeServices",
          "https://www.facebook.com/allresumeservices",
          "https://www.instagram.com/allresumeservices"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Resume Writing Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Resume Writing",
                "description": "Professional ATS-optimised resume writing service"
              },
              "price": "125",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cover Letter Writing",
                "description": "Compelling cover letters tailored to your target role"
              },
              "price": "145",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "LinkedIn Optimization",
                "description": "Professional LinkedIn profile optimization"
              },
              "price": "185",
              "priceCurrency": "AUD"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Selection Criteria",
                "description": "Government job selection criteria responses"
              },
              "price": "255",
              "priceCurrency": "AUD"
            }
          ]
        }
      };
    } else if (type === 'service' && serviceName) {
      // Service schema for individual service pages
      schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": serviceName,
        "description": serviceDescription || `Professional ${serviceName} service by All Résumé Services`,
        "provider": {
          "@type": "ProfessionalService",
          "name": "All Résumé Services",
          "url": siteUrl,
          "telephone": "0410 934 371",
          "email": "admin@allresumeservices.com.au",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "60"
          }
        },
        "areaServed": {
          "@type": "Country",
          "name": "Australia"
        },
        "offers": servicePrice ? {
          "@type": "Offer",
          "price": servicePrice,
          "priceCurrency": "AUD",
          "availability": "https://schema.org/InStock"
        } : undefined
      };
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.getElementById('structured-data');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, serviceName, serviceDescription, servicePrice]);

  return null;
}
