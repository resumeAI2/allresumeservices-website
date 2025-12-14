import { Award, MapPin, Users, FileCheck, Briefcase, TrendingUp, Target, CheckCircle } from "lucide-react";

export default function Services() {
  const stats = [
    { number: "18+", label: "Years Experience", icon: Award },
    { number: "96%", label: "Interview Success Rate", icon: Target },
    { number: "5,000+", label: "Clients Served", icon: Users },
    { number: "100%", label: "Satisfaction Guarantee", icon: CheckCircle }
  ];

  const services = [
    {
      icon: Award,
      title: "Extensive Expertise",
      description: "Over 17 years' experience writing resumes, cover letters, LinkedIn profiles and selection criteria responses for clients at all career stages across diverse industries."
    },
    {
      icon: MapPin,
      title: "Australian Focus",
      description: "We understand local recruitment practices and tailor each document to meet Australian standards, ensuring your application resonates with local employers."
    },
    {
      icon: Users,
      title: "Personalised Service",
      description: "Every resume is built from a detailed briefing and comprehensive questionnaire, capturing your unique skills, achievements and career goals."
    },
    {
      icon: FileCheck,
      title: "ATS-Friendly Formatting",
      description: "Our resumes are optimised for Applicant Tracking Systems (ATS) to ensure your application is seen by decision-makers, not filtered out by software."
    },
    {
      icon: Briefcase,
      title: "Range of Documents",
      description: "Resumes, cover letters, expressions of interest, professional portfolios and LinkedIn makeovers—all in one place for a cohesive professional brand."
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#1e3a5f] text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-secondary/20 text-white border border-secondary/30 px-4 py-2 rounded-full text-sm font-semibold">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Why Choose <span className="text-secondary">All Resume Services</span>?
          </h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Are you ready to stand out in a crowded job market? With decades of experience crafting professional resumes and application documents, we help Australians land interviews and secure roles across industries. Our tailored approach ensures your strengths are highlighted, your accomplishments shine, and your application aligns with the expectations of recruiters and Applicant Tracking Systems (ATS).
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-secondary/20 to-white/10 backdrop-blur-sm border-2 border-secondary/30 rounded-xl p-6 text-center hover:from-secondary/30 hover:to-white/20 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                <div className="text-4xl font-bold text-secondary mb-2">{stat.number}</div>
                <div className="text-sm text-blue-100 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all group hover:scale-105"
              >
                <div className="mb-4 inline-block p-4 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                  <Icon className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
