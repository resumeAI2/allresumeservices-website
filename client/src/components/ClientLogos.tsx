export default function ClientLogos() {
  const companies = [
    { name: "BHP", category: "Mining & Resources" },
    { name: "Commonwealth Bank", category: "Banking & Finance" },
    { name: "Woolworths", category: "Retail" },
    { name: "Telstra", category: "Telecommunications" },
    { name: "Qantas", category: "Aviation" },
    { name: "Australian Government", category: "Public Sector" },
    { name: "Rio Tinto", category: "Mining & Resources" },
    { name: "Westpac", category: "Banking & Finance" },
    { name: "ANZ", category: "Banking & Finance" },
    { name: "Wesfarmers", category: "Retail & Services" },
    { name: "Fortescue Metals", category: "Mining & Resources" },
    { name: "Coles", category: "Retail" },
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
              <div className="text-center">
                <p className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {company.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {company.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-muted-foreground mt-12 max-w-3xl mx-auto">
          * Company names represent organizations where our clients have successfully secured employment. 
          We are not affiliated with or endorsed by these companies. Results may vary based on individual 
          qualifications, experience, and market conditions.
        </p>
      </div>
    </section>
  );
}
