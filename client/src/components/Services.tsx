import { Award, MapPin, Users, FileCheck, Briefcase } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Award,
      title: "Extensive Expertise",
      description: "Over 17 years' experience writing résumés, cover letters, LinkedIn profiles and selection criteria responses for clients at all career stages across diverse industries."
    },
    {
      icon: MapPin,
      title: "Australian Focus",
      description: "We understand local recruitment practices and tailor each document to meet Australian standards, ensuring your application resonates with local employers."
    },
    {
      icon: Users,
      title: "Personalised Service",
      description: "Every résumé is built from a detailed briefing and comprehensive questionnaire, capturing your unique skills, achievements and career goals."
    },
    {
      icon: FileCheck,
      title: "ATS-Friendly Formatting",
      description: "Our résumés are optimised for Applicant Tracking Systems (ATS) to ensure your application is seen by decision-makers, not filtered out by software."
    },
    {
      icon: Briefcase,
      title: "Range of Documents",
      description: "Résumés, cover letters, expressions of interest, professional portfolios and LinkedIn makeovers—all in one place for a cohesive professional brand."
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-background to-accent">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose All Résumé Services?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Are you ready to stand out in a crowded job market? With decades of experience crafting professional résumés and application documents, we help Australians land interviews and secure roles across industries. Our tailored approach ensures your strengths are highlighted, your accomplishments shine, and your application aligns with the expectations of recruiters and Applicant Tracking Systems (ATS).
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all group"
              >
                <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Unlimited Revisions Until You Hit <span className="text-secondary">APPLY!</span>
            </h3>
            <p className="text-lg mb-6 opacity-90">
              We offer unlimited revisions until you are 100% confident to apply for the job. With a professional resume writer by your side, we'll collaborate to ensure your experience shines on paper, from highlighting achievements to crafting ATS keywords that recruiters are searching for right now!
            </p>
            <p className="text-base opacity-80">
              It doesn't matter if this is your first time applying for a job or if it has been years since your last interview—we have the expertise you need to ensure your application is ready to go out into the world!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
