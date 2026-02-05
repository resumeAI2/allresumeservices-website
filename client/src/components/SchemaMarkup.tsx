import { useEffect } from "react";

interface SchemaMarkupProps {
  type?: "homepage" | "service" | "testimonial";
}

export default function SchemaMarkup({ type = "homepage" }: SchemaMarkupProps) {
  useEffect(() => {
    // Local Business Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "All Résumé Services",
      "image": "https://www.allresumeservices.com.au/logo.png",
      "@id": "https://www.allresumeservices.com.au",
      "url": "https://www.allresumeservices.com.au",
      "telephone": "+61410934371",
      "email": "admin@allresumeservices.com.au",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AU",
        "addressRegion": "Australia"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -25.2744,
        "longitude": 133.7751
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
        "https://www.facebook.com/allresumeservices",
        "https://au.linkedin.com/in/sonialynch",
        "https://www.instagram.com/allresumeservicesofficial/",
        "https://www.youtube.com/@All-ResumeServices"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5.0",
        "reviewCount": "100",
        "bestRating": "5",
        "worstRating": "1"
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "Australia"
        },
        {
          "@type": "State",
          "name": "New South Wales"
        },
        {
          "@type": "State",
          "name": "Victoria"
        },
        {
          "@type": "State",
          "name": "Queensland"
        },
        {
          "@type": "State",
          "name": "Western Australia"
        },
        {
          "@type": "State",
          "name": "South Australia"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Resume Writing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Professional Resume Writing",
              "description": "ATS-optimised resume writing service"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Cover Letter Writing",
              "description": "Customised cover letters tailored to job applications"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "LinkedIn Profile Optimisation",
              "description": "Professional LinkedIn profile enhancement"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Selection Criteria",
              "description": "Government job application selection criteria writing"
            }
          }
        ]
      }
    };

    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "All Résumé Services",
      "url": "https://www.allresumeservices.com.au",
      "logo": "https://www.allresumeservices.com.au/logo.png",
      "founder": {
        "@type": "Person",
        "name": "Sonia Lynch",
        "jobTitle": "Founder & Senior Resume Writer"
      },
      "foundingDate": "2008",
      "description": "Professional resume writing service helping Australians land interviews and secure their dream jobs with ATS-optimised resumes, cover letters, and LinkedIn profiles."
    };

    // Add schemas to head
    const script1 = document.createElement("script");
    script1.type = "application/ld+json";
    script1.text = JSON.stringify(localBusinessSchema);
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.type = "application/ld+json";
    script2.text = JSON.stringify(organizationSchema);
    document.head.appendChild(script2);

    // Cleanup
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [type]);

  return null;
}
