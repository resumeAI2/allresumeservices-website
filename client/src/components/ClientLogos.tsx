export default function ClientLogos() {
  const companies = [
    { 
      name: "BHP", 
      category: "Mining & Resources",
      logo: "/company-logos/bhp-logo.jpg",
      alt: "BHP logo - Mining & Resources company"
    },
    { 
      name: "Commonwealth Bank", 
      category: "Banking & Finance",
      logo: "/company-logos/commonwealth-bank-logo.png",
      alt: "Commonwealth Bank logo - Banking & Finance"
    },
    { 
      name: "Woolworths", 
      category: "Retail",
      logo: "/company-logos/woolworths-logo.png",
      alt: "Woolworths logo - Retail company"
    },
    { 
      name: "Telstra", 
      category: "Telecommunications",
      logo: "/company-logos/telstra-logo.png",
      alt: "Telstra logo - Telecommunications company"
    },
    { 
      name: "Qantas", 
      category: "Aviation",
      logo: "/company-logos/qantas-logo.png",
      alt: "Qantas logo - Aviation company"
    },
    { 
      name: "Australian Government", 
      category: "Public Sector",
      logo: "/company-logos/australian-government-logo.png",
      alt: "Australian Government logo - Public Sector"
    },
    { 
      name: "Rio Tinto", 
      category: "Mining & Resources",
      logo: "/company-logos/rio-tinto-logo.png",
      alt: "Rio Tinto logo - Mining & Resources company"
    },
    { 
      name: "Westpac", 
      category: "Banking & Finance",
      logo: "/company-logos/westpac-logo.png",
      alt: "Westpac logo - Banking & Finance"
    },
    { 
      name: "ANZ", 
      category: "Banking & Finance",
      logo: "/company-logos/anz-logo.png",
      alt: "ANZ Bank logo - Banking & Finance"
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Trusted by Professionals at Leading Organisations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our clients have successfully landed roles at Australia's most prestigious companies across diverse industries
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all group"
            >
              {/* Company Logo Image */}
              <div className="h-20 w-full flex items-center justify-center mb-3">
                <img 
                  src={company.logo} 
                  alt={company.alt}
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>
              
              {/* Company Category */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {company.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted-foreground mt-12 max-w-3xl mx-auto">
          * Company names represent organisations where our clients have successfully secured employment. 
          We are not affiliated with or endorsed by these companies. Results may vary based on individual 
          qualifications, experience, and market conditions.
        </p>
      </div>
    </section>
  );
}
