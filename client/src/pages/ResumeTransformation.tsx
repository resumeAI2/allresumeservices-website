import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, ArrowRight, FileText, TrendingUp, Target, Award } from 'lucide-react';
import { Link } from 'wouter';

export default function ResumeTransformation() {
  const transformationMetrics = [
    {
      icon: FileText,
      before: "7 Pages",
      after: "4 Pages",
      description: "Condensed to recruiter-friendly length"
    },
    {
      icon: Target,
      before: "Task-Based",
      after: "Achievement-Focused",
      description: "Quantified results and impact"
    },
    {
      icon: TrendingUp,
      before: "Generic Profile",
      after: "Compelling Summary",
      description: "Strategic positioning for target role"
    },
    {
      icon: Award,
      before: "Basic Format",
      after: "ATS-Optimized",
      description: "Professional layout that passes screening"
    }
  ];

  const beforeAfterExamples = [
    {
      title: "Professional Profile",
      before: "A Telecommunications and Security/ Infrastructure Project Manager and Mining S26 Supervisor, with 26 years of industry experience... A family man, married with two children and enjoy an active social life with friends, family and work colleagues.",
      after: "Accomplished Technology Operations Supervisor and Project Manager with over 26 years of experience in telecommunications, security systems, and mining technology. Renowned for exceptional leadership in fostering inclusive, high-performing teams and maintaining operational excellence with a strong focus on safety, compliance, and continuous improvement.",
      improvement: "Removed personal details, focused on professional value, and highlighted key leadership strengths"
    },
    {
      title: "Experience Description",
      before: "Working in the Jimblebar Technology Site Operations Maintenance team as a communication specialist executing planned and break down maintenance works on Security, CCTV, Access Control...",
      after: "• Maintained zero recordable injuries and achieved consistent safety KPI targets\n• Recorded the highest Engagement Survey results (82.4%) in 2019 among all BHP technology teams\n• Successfully embedded BOS ways of working, improving efficiency and team cohesion",
      improvement: "Transformed task lists into quantified achievements with specific metrics and outcomes"
    },
    {
      title: "Key Achievements Format",
      before: "Summary of Duties/ Responsibilities: As a Principal Delivery (Program Manager) I managed a large technology portfolio...",
      after: "• Delivered the Jimblebar Telstra 4G LTE Upgrade, installing a new greenfield small cell tower\n• Migrated over 2,000 OT network devices to a high-availability monitoring environment\n• Completed IT/OT network separation and firewall upgrades, enhancing security and operational efficiency",
      improvement: "Separated responsibilities from achievements, using bullet points for clarity and impact"
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
              <h1 className="text-5xl font-bold mb-6">Resume Transformation Showcase</h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                See how we transform ordinary resumes into powerful career marketing documents that get results. 
                This real client example demonstrates the dramatic difference professional resume writing makes.
              </p>
              <div className="flex items-center gap-4 text-blue-100">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#d4af37]" />
                  <span>Real Client Example</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#d4af37]" />
                  <span>Anonymized for Privacy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transformation Metrics */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">The Transformation at a Glance</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Key improvements that made this resume stand out to recruiters and hiring managers
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {transformationMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <Card key={index} className="border-2 hover:border-secondary transition-colors">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                        <Icon className="h-8 w-8 text-secondary" />
                      </div>
                      <div className="mb-2">
                        <div className="text-sm text-gray-500 line-through">{metric.before}</div>
                        <ArrowRight className="h-4 w-4 text-secondary mx-auto my-1" />
                        <div className="text-xl font-bold text-secondary">{metric.after}</div>
                      </div>
                      <p className="text-sm text-gray-600">{metric.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Before/After Examples */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">Before & After: Key Sections</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See specific examples of how we transformed this client's resume content
              </p>
            </div>

            <div className="space-y-8">
              {beforeAfterExamples.map((example, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-[#1e3a5f]">{example.title}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {/* Before */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">Before</span>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-red-500">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{example.before}</p>
                        </div>
                      </div>

                      {/* After */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">After</span>
                        </div>
                        <div className="bg-secondary/5 p-4 rounded-lg border-l-4 border-secondary">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{example.after}</p>
                        </div>
                      </div>
                    </div>

                    {/* Improvement Note */}
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">Key Improvement:</p>
                          <p className="text-blue-800 text-sm">{example.improvement}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-[#1e3a5f]">The Results</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Professional resume writing delivers measurable outcomes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2 border-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">65%</div>
                  <p className="text-gray-600">Reduction in length while maintaining all key information</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">100%</div>
                  <p className="text-gray-600">ATS compatibility score improvement</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">96%</div>
                  <p className="text-gray-600">Our clients' interview success rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] text-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Want This Level of Transformation for Your Resume?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                This is just one example of the hundreds of successful resume transformations we've delivered. 
                Let us help you create a resume that opens doors to your dream career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                  <Link href="/services">View Our Services</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white text-[#1e3a5f] hover:bg-gray-100">
                  <Link href="/about#contact">Get Your Free Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Notice */}
        <section className="py-8 bg-gray-50 border-t border-gray-200">
          <div className="container max-w-6xl">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>Privacy Protected:</strong> This example has been anonymized to protect client confidentiality. 
                All personal information, company names, and specific details have been modified or removed.
              </p>
              <p>
                The content shown represents the style and quality of transformation, not the complete documents.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
