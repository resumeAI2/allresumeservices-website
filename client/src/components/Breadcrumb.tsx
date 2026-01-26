import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItemType[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Build schema.org BreadcrumbList
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.allresumeservices.com.au/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href && { "item": `https://www.allresumeservices.com.au${item.href}` })
      }))
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      
      <div className="w-full bg-[#e0f2fe] dark:bg-[#0c4a6e]/30 border-b border-[#bae6fd] dark:border-blue-800/30">
        <div className="container py-3 sm:py-4">
          <BreadcrumbRoot>
            <BreadcrumbList className="text-xs sm:text-sm">
              {/* Home Link */}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1.5 group">
                    <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              <BreadcrumbSeparator />

              {/* Dynamic Breadcrumb Items */}
              {items.map((item, index) => {
                const isLast = index === items.length - 1;
                
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.href && !isLast ? (
                        <BreadcrumbLink asChild>
                          <Link 
                            href={item.href}
                            className="font-medium hover:text-primary"
                          >
                            {item.label}
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-semibold">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </BreadcrumbRoot>
        </div>
      </div>
    </>
  );
}
