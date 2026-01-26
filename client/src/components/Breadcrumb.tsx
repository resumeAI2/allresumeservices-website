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
      
      <div className="bg-primary text-primary-foreground border-b border-primary-foreground/10">
        <div className="container py-2 sm:py-3">
          <BreadcrumbRoot>
            <BreadcrumbList className="text-xs sm:text-sm text-primary-foreground/80">
              {/* Home Link */}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1.5 group text-primary-foreground/80 hover:text-secondary transition-colors">
                    <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              
              <BreadcrumbSeparator className="text-primary-foreground/50" />

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
                            className="font-medium text-primary-foreground/80 hover:text-secondary transition-colors"
                          >
                            {item.label}
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-semibold text-primary-foreground">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    
                    {!isLast && <BreadcrumbSeparator className="text-primary-foreground/50" />}
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
