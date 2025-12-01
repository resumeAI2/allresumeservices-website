import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, Award, Users, Target, Heart, TrendingUp } from 'lucide-react';

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Sonia Lynch",
      title: "Senior Resume Writer & Career Consultant",
      bio: "With over 15 years of experience in professional resume writing and career consulting, Sonia specializes in helping mid to senior-level professionals transition into executive roles. Her expertise in ATS optimization and personal branding has helped hundreds of clients secure interviews at top Australian companies.",
      expertise: ["Executive Resumes", "Career Transitions", "LinkedIn Optimization", "Personal Branding"]
    },
    {
      name: "Steven Jason",
      title: "Lead Resume Writer & Selection Criteria Specialist",
      bio: "Steven brings 12+ years of expertise in government and corporate recruitment. As a former HR manager, he understands exactly what hiring managers look for. He specializes in crafting compelling selection criteria responses and resumes that stand out in competitive application processes.",
      expertise: ["Selection Criteria", "Government Applications", "Cover Letters", "ATS Compliance"]
    },
    {
      name: "Jenna Atkinson",
      title: "Resume Writer & Entry-Level Career Specialist",
      bio: "Jenna focuses on helping recent graduates and career changers make their first impression count. With a background in recruitment and career counseling, she excels at highlighting transferable skills and creating compelling narratives for professionals at the start of their career journey.",
      expertise: ["Entry-Level Resumes", "Career Change", "Graduate Applications", "Skills Translation"]
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description: "We measure our success by your success. Our 96% interview success rate speaks to our commitment to delivering results that matter."
    },
    {
      icon: Heart,
      title: "Personalized Service",
      description: "Every client receives individual attention. We take the time to understand your unique career story and goals to create documents that truly represent you."
    },
    {
      icon: Award,
      title: "Professional Excellence",
      description: "Our team consists of certified professional resume writers with extensive experience across diverse industries and career levels."
    },
    {
      icon: TrendingUp,
      title: "Continuous Innovation",
      description: "We stay ahead of industry trends, ATS technology, and hiring practices to ensure your application materials meet current standards."
    }
  ];

  const milestones = [
    {
      year: "2007",
      title: "Founded in Australia",
      description: "All Résumé Services was established with a vision to help Australian job seekers stand out in an increasingly competitive market. Started as a small operation with a focus on personalized, quality service.",
      side: "left"
    },
    {
      year: "2010",
      title: "Expanded Service Offerings",
      description: "Introduced LinkedIn profile optimization and selection criteria writing services to meet evolving client needs. Built a team of specialized writers with expertise across various industries.",
      side: "right"
    },
    {
      year: "2015",
      title: "ATS Optimization Pioneer",
      description: "Became early adopters of ATS (Applicant Tracking System) optimization techniques, ensuring our clients' resumes passed automated screening systems. Achieved 90%+ interview success rate.",
      side: "left"
    },
    {
      year: "2018",
      title: "1,000+ Success Stories",
      description: "Celebrated helping over 1,000 Australians secure their dream jobs. Expanded our team to include senior career consultants and industry-specific resume writers.",
      side: "right"
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launched fully digital service delivery with enhanced online consultation capabilities. Supported thousands of Australians navigating career transitions during challenging times.",
      side: "left"
    },
    {
      year: "Today",
      title: "Industry Leaders",
      description: "With 17+ years of experience, a 96% interview success rate, and thousands of satisfied clients, we continue to innovate and adapt to the changing job market. Our commitment to excellence remains unwavering.",
      side: "right"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white py-20">
          <div className="container max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6">About All Résumé Services</h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                For over 17 years, we've been helping Australians land their dream jobs through 
                professionally crafted resumes, cover letters, and career documents. Our mission 
                is simple: to empower job seekers with the tools they need to stand out in today's 
                competitive job market.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-[#1e3a5f]">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  To provide exceptional, personalized resume writing services that help Australian 
                  professionals at every career stage achieve their employment goals. We believe 
                  everyone deserves a professionally written resume that showcases their unique 
                  value and opens doors to new opportunities.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We're committed to delivering high-quality, ATS-optimized documents that not only 
                  pass automated screening systems but also resonate with human recruiters and hiring managers.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-[#1e3a5f]">Why Choose Us</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#d4af37] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>17+ years of experience</strong> helping Australians secure interviews and job offers
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#d4af37] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>96% interview success rate</strong> from our professionally written resumes
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#d4af37] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Industry expertise</strong> across all sectors and career levels
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#d4af37] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>ATS-optimized documents</strong> that pass automated screening systems
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#d4af37] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Fast turnaround</strong> with 2-3 day standard delivery
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">Our Core Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide everything we do and ensure we deliver exceptional 
                service to every client.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="border-2 hover:border-[#d4af37] transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e3a5f] text-[#d4af37] mb-4">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Company History & Milestones */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">Our Journey</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From humble beginnings to becoming one of Australia's most trusted resume writing 
                services, our journey has been driven by a passion for helping people achieve their career goals.
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#d4af37]" />
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex flex-col md:flex-row items-center gap-8">
                    {milestone.side === "left" ? (
                      <>
                        <div className="md:w-1/2 md:text-right">
                          <Card className="inline-block">
                            <CardContent className="p-6">
                              <div className="text-3xl font-bold text-[#d4af37] mb-2">{milestone.year}</div>
                              <h3 className="text-xl font-bold mb-2 text-[#1e3a5f]">{milestone.title}</h3>
                              <p className="text-gray-600">{milestone.description}</p>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="hidden md:flex w-12 h-12 rounded-full bg-[#d4af37] items-center justify-center z-10 flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-white" />
                        </div>
                        <div className="md:w-1/2" />
                      </>
                    ) : (
                      <>
                        <div className="md:w-1/2" />
                        <div className="hidden md:flex w-12 h-12 rounded-full bg-[#d4af37] items-center justify-center z-10 flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-white" />
                        </div>
                        <div className="md:w-1/2">
                          <Card className="inline-block">
                            <CardContent className="p-6">
                              <div className="text-3xl font-bold text-[#d4af37] mb-2">{milestone.year}</div>
                              <h3 className="text-xl font-bold mb-2 text-[#1e3a5f]">{milestone.title}</h3>
                              <p className="text-gray-600">{milestone.description}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <Users className="h-8 w-8 text-[#d4af37]" />
                <h2 className="text-4xl font-bold text-[#1e3a5f]">Meet Our Expert Team</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our team of certified professional resume writers brings decades of combined 
                experience in recruitment, HR, and career development.
              </p>
            </div>
            
            <div className="space-y-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center text-white text-4xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#1e3a5f] mb-1">{member.name}</h3>
                        <p className="text-[#d4af37] font-semibold mb-4">{member.title}</p>
                        <p className="text-gray-700 leading-relaxed mb-4">{member.bio}</p>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2">Areas of Expertise:</p>
                          <div className="flex flex-wrap gap-2">
                            {member.expertise.map((skill, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-blue-50 text-[#1e3a5f] rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">Our Approach</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We combine industry expertise, recruitment insights, and personalized service 
                to create documents that get results.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-[#d4af37] mb-3">01</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Understanding You</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We start by learning about your career history, achievements, and goals. 
                    Your success story is unique, and we take the time to understand it fully.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-[#d4af37] mb-3">02</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Strategic Writing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our writers craft compelling narratives that highlight your value proposition, 
                    quantify achievements, and position you as the ideal candidate.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-[#d4af37] mb-3">03</div>
                  <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Optimization & Polish</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We ensure your documents are ATS-compliant, keyword-optimized, and formatted 
                    to professional standards that impress both systems and humans.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Let our expert team help you create a resume that opens doors to your dream career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/services">
                <button className="bg-[#d4af37] hover:bg-[#c49d2e] text-[#1e3a5f] font-bold px-8 py-3 rounded-lg transition-colors">
                  View Our Services
                </button>
              </a>
              <a href="/contact">
                <button className="bg-white hover:bg-gray-100 text-[#1e3a5f] font-bold px-8 py-3 rounded-lg transition-colors">
                  Get Free Consultation
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
