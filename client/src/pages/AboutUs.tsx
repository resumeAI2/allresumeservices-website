import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { CheckCircle, Award, Users, Target, Heart, TrendingUp, Mail, Phone, Clock, Send, Upload, FileText, Loader2 } from 'lucide-react';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import { trpc } from '../lib/trpc';

export default function AboutUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [formMountTime] = useState(() => Date.now());
  const [isUploading, setIsUploading] = useState(false);

  // Fetch testimonials from database
  const { data: dbTestimonials, isLoading } = trpc.services.getFeaturedTestimonials.useQuery();

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setIsUploading(false);
      
      const hasResume = resumeFile !== null;
      const successMessage = hasResume 
        ? "✓ Message sent successfully! Your resume has been uploaded. We'll review it and get back to you within 24 hours with a personalised quote."
        : "✓ Message sent successfully! We'll get back to you within 24 hours.";
      
      toast.success(successMessage, {
        duration: 6000,
      });
      
      setName("");
      setEmail("");
      setPhone("");
      setServiceInterest("");
      setMessage("");
      setResumeFile(null);
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(`Failed to submit: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) {
      toast.error("Invalid submission detected");
      return;
    }

    const submissionTime = Date.now();
    const timeDiff = (submissionTime - formMountTime) / 1000;
    if (timeDiff < 3) {
      toast.error("Please take your time to fill out the form");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!message.trim() || message.length < 10) {
      toast.error("Please enter a message (at least 10 characters)");
      return;
    }

    setIsUploading(true);

    let resumeFileUrl: string | undefined;
    if (resumeFile) {
      try {
        toast.info('Uploading your resume...');
        const formData = new FormData();
        formData.append('file', resumeFile);
        
        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload resume');
        }
        
        const uploadData = await uploadResponse.json();
        resumeFileUrl = uploadData.url;
        toast.success('Resume uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload resume file. Please try again.');
        setIsUploading(false);
        return;
      }
    }

    toast.info('Submitting your message...');
    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      serviceInterest: serviceInterest || undefined,
      message: message.trim(),
      resumeFileUrl: resumeFileUrl,
      honeypot: honeypot,
      submissionTime: formMountTime,
    });
  };
  
  // Transform database testimonials to match carousel format
  const testimonials = dbTestimonials?.map(t => ({
    name: t.clientName,
    role: t.clientTitle || '',
    company: '',
    text: t.testimonialText,
    rating: t.rating,
    photo: t.clientPhoto || undefined
  })) || [];
  const teamMembers = [
    {
      name: "Sonia Lynch",
      title: "Founder & CEO - 15+ years in industry",
      bio: "As the Founder and CEO of All Résumé Services, Sonia is a dynamic and results-driven professional with expertise in Resume Writing, Personal Branding, Curriculum Development, Selection Criteria, Cover Letters, Portfolios, Coaching, and Career Development. Her MBA in Business Administration and Management underpins a commitment to empowering clients, guiding them to excel in their career paths. Her holistic approach ensures clients are well-equipped for their job market journey, presenting as standout candidates in their respective fields.",
      expertise: ["Resume Writing", "Personal Branding", "Selection Criteria", "Career Coaching"],
      photo: "/team/sonia-lynch.png"
    },
    {
      name: "Steven Jason",
      title: "Professional Resume Writer",
      bio: "For over five years, Steven has been dedicated to enhancing the career prospects of job seekers through expertly crafted application documents. He has honed his ability to create resumes that capture the attention of employers and cover letters that effectively convey personal narratives. Steven specialises in optimising LinkedIn profiles and skilfully employs the STAR method when addressing selection criteria to highlight applicants' strengths and achievements with clarity and impact.",
      expertise: ["Resume Writing", "Cover Letters", "LinkedIn Optimisation", "STAR Method"],
      photo: "/team/steven-jason.png"
    },
    {
      name: "Jenna Atkinson",
      title: "Expert Resume Writer",
      bio: "Jenna has been a key member of the All Résumé Services team for several years, bringing a wealth of experience and a keen eye for detail to her role as a professional resume writer. She excels in creating persuasive cover letters and enhancing LinkedIn profiles. Jenna is particularly adept at responding to selection criteria using the CAR (Context, Action, Result) format, showcasing clients' skills and achievements in a clear and impactful way. Her professionalism, creativity, and thorough approach have earned her a reputation as a trusted member of the team.",
      expertise: ["Resume Writing", "Cover Letters", "LinkedIn Profiles", "CAR Method"],
      photo: "/team/jenna-atkinson.png"
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
      title: "Personalised Service",
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
      description: "All Résumé Services was established with a vision to help Australian job seekers stand out in an increasingly competitive market. Started as a small operation with a focus on personalised, quality service.",
      side: "left"
    },
    {
      year: "2010",
      title: "Expanded Service Offerings",
      description: "Introduced LinkedIn profile optimisation and selection criteria writing services to meet evolving client needs. Built a team of specialised writers with expertise across various industries.",
      side: "right"
    },
    {
      year: "2015",
      title: "ATS Optimisation Pioneer",
      description: "Became early adopters of ATS (Applicant Tracking System) optimisation techniques, ensuring our clients' resumes passed automated screening systems. Achieved 90%+ interview success rate.",
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
      description: "With 18+ years of experience, a 96% interview success rate, and thousands of satisfied clients, we continue to innovate and adapt to the changing job market. Our commitment to excellence remains unwavering.",
      side: "right"
    }
  ];



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>About Us - Professional Resume Writers | All Résumé Services</title>
        <meta name="description" content="Meet the team behind All Résumé Services. 18+ years helping Australians land interviews with ATS-optimised resumes, cover letters, LinkedIn profiles, and selection criteria for government and public sector roles. 96% success rate." />
        <meta name="keywords" content="about All Résumé Services, resume writers Australia, professional resume team, career experts" />
        <link rel="canonical" href="https://allresumeservices.com.au/about" />
      </Helmet>
      <Header />
      <Breadcrumb items={[{ label: "About Us" }]} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white py-20">
          <div className="container max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold mb-6 font-gold-brand">About All Résumé Services</h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                For over 18 years, we've been helping Australians land their dream jobs through 
                professionally crafted resumes and cover letters, plus LinkedIn profiles and selection criteria for government and public sector roles. Our mission 
                is simple: to empower job seekers with the tools they need to stand out in today's 
                competitive job market.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-secondary/5 border-y border-secondary/20">
          <div className="container max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-3">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">18+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-3">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">96%</div>
                <div className="text-sm text-muted-foreground">Interview Success Rate</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-3">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">5,000+</div>
                <div className="text-sm text-muted-foreground">Clients Served</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-3">
                  <CheckCircle className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Guarantee</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="pt-12 pb-8 bg-white">
          <div className="container max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-[#1e3a5f]">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  To provide exceptional, personalised resume and cover letter writing—plus LinkedIn profiles and selection criteria for government and public sector roles—that help Australian 
                  professionals at every career stage achieve their employment goals. We believe 
                  everyone deserves documents that showcase their unique 
                  value and open doors to new opportunities.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We're committed to delivering high-quality, ATS-optimised documents that not only 
                  pass automated screening systems but also resonate with human recruiters and hiring managers.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-[#1e3a5f]">Why Choose Us</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#B8860B] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>18+ years of experience</strong> helping Australians secure interviews and job offers
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#B8860B] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>96% interview success rate</strong> from our professionally written resumes, cover letters, and LinkedIn profiles
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#B8860B] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Industry expertise</strong> across all sectors and career levels
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#B8860B] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>ATS-optimised documents</strong> that pass automated screening systems
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#B8860B] flex-shrink-0 mt-1" />
                    <span className="text-gray-700">
                      <strong>Fast turnaround</strong> with 2-3 day standard delivery
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Comparison */}
        <section className="pt-8 pb-16 bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">Why Choose All Résumé Services?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Not all resume and LinkedIn profile services are created equal. See how we compare to DIY approaches and generic resume writers.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200">Feature</th>
                    <th className="p-4 text-center font-semibold text-gray-700 border-b-2 border-gray-200">DIY Resume</th>
                    <th className="p-4 text-center font-semibold text-gray-700 border-b-2 border-gray-200">Generic Resume Writer</th>
                    <th className="p-4 text-center font-semibold text-secondary border-b-2 border-secondary bg-secondary/5">All Résumé Services</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-700">ATS Optimisation</td>
                    <td className="p-4 text-center text-gray-500">❌ Limited</td>
                    <td className="p-4 text-center text-gray-500">✓ Basic</td>
                    <td className="p-4 text-center bg-secondary/5"><span className="text-secondary font-semibold">✓✓ Advanced</span></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-700">Industry Expertise</td>
                    <td className="p-4 text-center text-gray-500">❌ None</td>
                    <td className="p-4 text-center text-gray-500">✓ General</td>
                    <td className="p-4 text-center bg-secondary/5"><span className="text-secondary font-semibold">✓✓ All Industries</span></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-700">Personalized Consultation</td>
                    <td className="p-4 text-center text-gray-500">❌ Self-guided</td>
                    <td className="p-4 text-center text-gray-500">✓ Limited</td>
                    <td className="p-4 text-center bg-secondary/5"><span className="text-secondary font-semibold">✓✓ One-on-One</span></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-700">Achievement-Focused Writing</td>
                    <td className="p-4 text-center text-gray-500">❌ Task-based</td>
                    <td className="p-4 text-center text-gray-500">✓ Mixed</td>
                    <td className="p-4 text-center bg-secondary/5"><span className="text-secondary font-semibold">✓✓ Results-Driven</span></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-700">Unlimited Revisions</td>
                    <td className="p-4 text-center text-gray-500">✓ Self-edit</td>
                    <td className="p-4 text-center text-gray-500">❌ 1-2 rounds</td>
                    <td className="p-4 text-center bg-secondary/5"><span className="text-secondary font-semibold">✓✓ Until Satisfied</span></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-700">Interview Success Rate</td>
                    <td className="p-4 text-center text-gray-500">~40-50%</td>
                    <td className="p-4 text-center text-gray-500">~70-75%</td>
                    <td className="p-4 text-center bg-secondary/5"><span className="text-secondary font-semibold text-lg">96%</span></td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium text-gray-700">Experience</td>
                    <td className="p-4 text-center text-gray-500">Varies</td>
                    <td className="p-4 text-center text-gray-500">1-5 years</td>
                    <td className="p-4 text-center bg-secondary/5"><span className="text-secondary font-semibold">18+ years</span></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700">Turnaround Time</td>
                    <td className="p-4 text-center text-gray-500">Days-Weeks</td>
                    <td className="p-4 text-center text-gray-500">5-7 days</td>
                    <td className="p-4 text-center bg-secondary/5"><span className="text-secondary font-semibold">2-3 days</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-6">Ready to experience the All Résumé Services difference?</p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link href="/contact#enquiry-form">Get Your Free Quote</Link>
              </Button>
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
                From humble beginnings to becoming one of Australia's most trusted resume, cover letter, and LinkedIn profile writing 
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
                Our team of certified professional resume, cover letter, and LinkedIn profile writers brings decades of combined 
                experience in recruitment, HR, and career development.
              </p>
            </div>
            
            <div className="space-y-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-[#d4af37]/20"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center text-white text-4xl font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
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
                  <h3 className="text-xl font-bold mb-3 text-[#1e3a5f]">Optimisation & Polish</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We ensure your documents are ATS-compliant, keyword-optimised, and formatted 
                    to professional standards that impress both systems and humans.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">What Our Clients Say</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our satisfied clients have to say 
                about their experience with All Résumé Services.
              </p>
            </div>
            <TestimonialsCarousel testimonials={testimonials} />
            
            {/* Google Reviews Badge */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Google Reviews</div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">5.0</span>
                    </div>
                  </div>
                </div>
                <a 
                  href="https://www.google.com/search?q=All+Resume+Services+Australia+Google+Reviews&lqi=CixBbGwgUmVzdW1lIFNlcnZpY2VzIEF1c3RyYWxpYSBHb29nbGUgUmV2aWV3cyIFOAGIAQFI34WhsdqtgIAIWisQABABEAIYABgBGAIiHWFsbCByZXN1bWUgc2VydmljZXMgYXVzdHJhbGlhkgEOcmVzdW1lX3NlcnZpY2WaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVUTVjR1ZoVDIxM1JSQUL6AQUI4AEQMg#lkt=LocalPoiReviews&rlimm=8323594543034302132" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Read our Google Reviews →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">Get In Touch</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ready to take the next step in your career? Contact us today for a free consultation 
                and let's discuss how we can help you land your dream job.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <a href="tel:0410934371" className="text-muted-foreground hover:text-primary">
                  0410 934 371
                </a>
              </Card>

              <Card className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <a href="mailto:admin@allresumeservices.com.au" className="text-muted-foreground hover:text-primary break-all">
                  admin@allresumeservices.com.au
                </a>
              </Card>

              <Card className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-muted-foreground">
                  Mon-Fri: 9am - 6pm<br />
                  Sat-Sun: By appointment
                </p>
              </Card>
            </div>

            <Card className="p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6 text-[#1e3a5f]">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Smith"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0410 123 456"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceInterest">Service Interest</Label>
                    <Select value={serviceInterest} onValueChange={setServiceInterest}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resume-writing">Resume Writing</SelectItem>
                        <SelectItem value="cover-letter">Cover Letter Writing</SelectItem>
                        <SelectItem value="linkedin">LinkedIn Optimisation</SelectItem>
                        <SelectItem value="selection-criteria">Selection Criteria</SelectItem>
                        <SelectItem value="career-consultation">Career Consultation</SelectItem>
                        <SelectItem value="package">Complete Package</SelectItem>
                        <SelectItem value="other">Other / Not Sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="resume">Upload Your Resume (Optional)</Label>
                  <div className="mt-2">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("File size must be less than 5MB");
                            e.target.value = "";
                            return;
                          }
                          const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                          if (!validTypes.includes(file.type)) {
                            toast.error("Please upload a PDF, DOC, or DOCX file");
                            e.target.value = "";
                            return;
                          }
                          setResumeFile(file);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-input rounded-md cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      {resumeFile ? (
                        <>
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{resumeFile.name}</span>
                          <span className="text-xs text-muted-foreground">({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                        </>
                      )}
                    </label>
                    <p className="text-sm text-muted-foreground mt-2">
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your career goals and how we can help..."
                    className="mt-2 w-full min-h-[150px] px-3 py-2 border border-input rounded-md"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Minimum 10 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isUploading || submitMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {isUploading || submitMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isUploading ? "Uploading Resume..." : submitMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>

            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4 text-[#1e3a5f]">Prefer to Call?</h3>
              <p className="text-gray-600 mb-6">
                Speak directly with one of our resume, cover letter, and LinkedIn profile experts for immediate assistance
              </p>
              <a href="tel:0410934371">
                <Button size="lg" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 0410 934 371
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white">
          <div className="container max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Take the Next Step?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Let our expert team help you create a resume, cover letter, or LinkedIn profile that opens doors to your dream career.
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
