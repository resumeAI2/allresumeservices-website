import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {/* Home Link */}
        <li className="flex items-center gap-2">
          <Link href="/">
            <a className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </a>
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </li>

        {/* Dynamic Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <>
                  <Link href={item.href}>
                    <a className="text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </a>
                  </Link>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </>
              ) : (
                <span className="text-foreground font-medium">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
