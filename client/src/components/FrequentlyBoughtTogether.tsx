import { Button } from "@/components/ui/button";
import { FileText, Mail, Linkedin, ClipboardList, Briefcase, Plus } from "lucide-react";
import { Link } from "wouter";

interface RelatedService {
  icon: typeof FileText;
  name: string;
  description: string;
  price: string;
  href: string;
}

interface FrequentlyBoughtTogetherProps {
  currentService: string;
}

const allServices: Record<string, RelatedService> = {
  resume: {
    icon: FileText,
    name: "Resume Writing",
    description: "Professional ATS-optimized resume",
    price: "$199",
    href: "/services/resume-writing"
  },
  cover: {
    icon: Mail,
    name: "Cover Letter",
    description: "Compelling, job-specific cover letter",
    price: "$99",
    href: "/services/cover-letters"
  },
  linkedin: {
    icon: Linkedin,
    name: "LinkedIn Optimization",
    description: "Complete profile transformation",
    price: "$149",
    href: "/services/linkedin-optimisation"
  },
  selection: {
    icon: ClipboardList,
    name: "Selection Criteria",
    description: "Government job applications",
    price: "$120/criterion",
    href: "/services/selection-criteria"
  },
  career: {
    icon: Briefcase,
    name: "Career Consultation",
    description: "30-minute strategy session",
    price: "$99",
    href: "/services/career-consultation"
  }
};

const relatedServicesMap: Record<string, string[]> = {
  resume: ["cover", "linkedin", "career"],
  cover: ["resume", "linkedin", "selection"],
  linkedin: ["resume", "cover", "career"],
  selection: ["resume", "cover", "linkedin"],
  career: ["resume", "cover", "linkedin"]
};

export default function FrequentlyBoughtTogether({ currentService }: FrequentlyBoughtTogetherProps) {
  const relatedServiceKeys = relatedServicesMap[currentService] || [];
  const relatedServices = relatedServiceKeys.map(key => allServices[key]).slice(0, 3);

  if (relatedServices.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Frequently Bought Together
            </h2>
            <p className="text-lg text-muted-foreground">
              Maximize your job search success with these complementary services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-all border border-border hover:border-secondary group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                      <Icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-card-foreground mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {service.description}
                      </p>
                      <p className="text-xl font-bold font-gold-brand">
                        {service.price}
                      </p>
                    </div>
                  </div>
                  
                  <Link href={service.href}>
                    <Button
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Package
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center bg-accent/50 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Save More with Our Packages
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              Get better value by choosing one of our bundled packages that include multiple services
            </p>
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => window.location.href = "/pricing#packages"}
            >
              View Package Pricing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
