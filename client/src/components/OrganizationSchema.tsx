import { useEffect } from 'react';

/**
 * OrganizationSchema Component
 * 
 * Generates comprehensive Organization schema markup (JSON-LD) for the homepage
 * following Google's structured data guidelines for enhanced brand visibility.
 * 
 * Benefits:
 * - Knowledge Panel eligibility in Google search
 * - Enhanced brand visibility with logo and contact info
 * - Social profile links displayed in search results
 * - Local business information for Australian searches
 * - Service area and offerings clearly defined
 */
export function OrganizationSchema() {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://allresumeservices.com.au';

  useEffect(() => {
    // Remove any existing organization schema
    const existingSchema = document.getElementById('organization-schema-org');
    if (existingSchema) {
      existingSchema.remove();
    }

    // Comprehensive Organization schema following Google's guidelines
    // https://developers.google.com/search/docs/appearance/structured-data/organization
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#organization`,
      
      // Core business information
      "name": "All Resume Services",
      "alternateName": "All Résumé Services",
      "legalName": "All Resume Services Pty Ltd",
      "description": "Australia's leading professional resume writing service with 18+ years of experience. We help job seekers land interviews with ATS-optimized resumes, cover letters, LinkedIn profiles, and selection criteria. 96% interview success rate.",
      
      // URLs and identifiers
      "url": siteUrl,
      "mainEntityOfPage": siteUrl,
      
      // Logo and images
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo-v2.svg`,
        "width": 200,
        "height": 60,
        "caption": "All Resume Services Logo"
      },
      "image": [
        `${siteUrl}/og-image.png`,
        `${siteUrl}/logo-v2.svg`
      ],
      
      // Contact information
      "telephone": "+61-410-934-371",
      "email": "enquiries@allresumeservices.com",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+61-410-934-371",
          "contactType": "customer service",
          "email": "admin@allresumeservices.com.au",
          "areaServed": "AU",
          "availableLanguage": ["English"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "17:00"
          }
        },
        {
          "@type": "ContactPoint",
          "telephone": "+61-410-934-371",
          "contactType": "sales",
          "email": "enquiries@allresumeservices.com",
          "areaServed": "AU",
          "availableLanguage": ["English"]
        }
      ],
      
      // Location and service area
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AU",
        "addressRegion": "Australia"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Australia"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": -25.2744,
          "longitude": 133.7751
        },
        "geoRadius": "4000000"
      },
      
      // Social media profiles
      "sameAs": [
        "https://www.linkedin.com/company/all-resume-services/",
        "https://www.facebook.com/allresumeservices",
        "https://www.youtube.com/@AllResumeServices",
        "https://www.instagram.com/allresumeservices/"
      ],
      
      // Business details
      "foundingDate": "2006",
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "minValue": 5,
        "maxValue": 15
      },
      "slogan": "Get Noticed, Get Hired",
      "knowsAbout": [
        "Resume Writing",
        "CV Writing",
        "Cover Letter Writing",
        "LinkedIn Profile Optimization",
        "Selection Criteria Writing",
        "Career Coaching",
        "ATS Optimization",
        "Executive Resume Writing",
        "Government Resume Writing",
        "Mining Industry Resumes",
        "Healthcare Resumes",
        "IT & Technology Resumes"
      ],
      
      // Services offered
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Resume Writing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Professional Resume Writing",
              "description": "ATS-optimized professional resume writing service for all career levels"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Cover Letter Writing",
              "description": "Compelling cover letters tailored to specific job applications"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "LinkedIn Profile Optimization",
              "description": "Professional LinkedIn profile writing and optimization for recruiters"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Selection Criteria Writing",
              "description": "Expert selection criteria responses for government and public sector jobs"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Executive Resume Writing",
              "description": "Premium executive-level resume writing for senior professionals"
            }
          }
        ]
      },
      
      // Aggregate rating
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "60",
        "reviewCount": "60"
      },
      
      // Founder information
      "founder": {
        "@type": "Person",
        "name": "Sonia Lynch",
        "jobTitle": "Founder & CEO",
        "image": `${siteUrl}/team/sonia-lynch.png`,
        "sameAs": [
          "https://www.linkedin.com/company/all-resume-services/"
        ]
      },
      
      // Additional business attributes
      "priceRange": "$$",
      "currenciesAccepted": "AUD",
      "paymentAccepted": ["Credit Card", "PayPal", "Bank Transfer"],
      "isAccessibleForFree": false,
      
      // Awards and recognition
      "award": [
        "96% Interview Success Rate",
        "18+ Years of Professional Excellence",
        "5.0 Google Rating with 60+ Reviews"
      ]
    };

    // Website schema for site-wide search features
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "name": "All Resume Services",
      "alternateName": "All Résumé Services Australia",
      "url": siteUrl,
      "description": "Professional resume writing services in Australia. Expert CV writers with 18+ years experience and 96% interview success rate.",
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "inLanguage": "en-AU",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/blog?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    // Local Business schema for local SEO
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      "name": "All Resume Services",
      "image": `${siteUrl}/og-image.png`,
      "telephone": "+61-410-934-371",
      "email": "admin@allresumeservices.com.au",
      "url": siteUrl,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -33.8688,
        "longitude": 151.2093
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      ],
      "sameAs": [
        "https://www.linkedin.com/company/all-resume-services/",
        "https://www.facebook.com/allresumeservices",
        "https://www.youtube.com/@AllResumeServices",
        "https://www.instagram.com/allresumeservices/"
      ]
    };

    // Create combined schema with @graph
    const combinedSchema = {
      "@context": "https://schema.org",
      "@graph": [
        organizationSchema,
        websiteSchema,
        localBusinessSchema
      ]
    };

    // Create and inject the schema script
    const script = document.createElement('script');
    script.id = 'organization-schema-org';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(combinedSchema, null, 0);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const schemaScript = document.getElementById('organization-schema-org');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [siteUrl]);

  return null;
}

export default OrganizationSchema;
