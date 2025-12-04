import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileSearch, DollarSign, ClipboardList, PenTool, CheckCircle, ChevronDown, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Services",
    question: "What resume writing services do you offer?",
    answer: "We offer comprehensive resume writing services including professional resume writing, cover letter writing, LinkedIn profile optimisation, selection criteria responses, and career consultation. Each service is tailored to your industry, experience level, and career goals to maximize your chances of landing interviews."
  },
  {
    category: "Services",
    question: "Do you write resumes for all industries and career levels?",
    answer: "Yes, we have 17+ years of experience writing resumes for professionals across all industries including healthcare, IT, finance, education, engineering, hospitality, and more. We work with entry-level candidates, mid-career professionals, senior executives, and career changers."
  },
  {
    category: "Services",
    question: "What makes your resume writing service different?",
    answer: "Our service stands out with a 96% interview success rate, 17+ years of industry experience, and personalized one-on-one consultations. We don't use templates—every resume is custom-written to highlight your unique strengths and achievements. We work with you until you're 100% satisfied with your documents."
  },
  {
    category: "Pricing",
    question: "How much do your services cost?",
    answer: "We offer three packages: Basic Package at $125 (professional resume writing), Standard Package at $185 (resume + cover letter + LinkedIn optimisation), and Premium Package at $255 (everything in Standard plus selection criteria and career consultation). We work with you until you're 100% satisfied."
  },
  {
    category: "Pricing",
    question: "Do you offer any discounts or package deals?",
    answer: "Yes, our Standard and Premium packages offer significant savings compared to purchasing services individually. We also occasionally run promotional offers—contact us to inquire about current discounts for students, veterans, or bulk orders for outplacement services."
  },
  {
    category: "Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and direct bank transfer. Payment is required upfront to begin work on your resume. All transactions are secure and encrypted."
  },
  {
    category: "Process",
    question: "How does the resume writing process work?",
    answer: "Our 5-step process begins with a free assessment where we review your current resume. After you choose a package and make payment, we conduct a detailed consultation to understand your goals. Our expert writers then create your custom resume, which we deliver for your review. We then work with you to refine your documents based on your feedback."
  },
  {
    category: "Process",
    question: "How long does it take to receive my resume?",
    answer: "Standard turnaround time is 3-5 business days from the completion of your consultation. If you need your resume sooner, we offer expedited service with 24-48 hour delivery for an additional fee. Rush orders are subject to writer availability."
  },
  {
    category: "Process",
    question: "Will I have a consultation with a writer?",
    answer: "Yes, absolutely! Every client receives a one-on-one consultation with their assigned writer. This can be conducted via phone, video call, or email questionnaire based on your preference. The consultation typically takes 30-45 minutes and helps us understand your career history, achievements, and goals."
  },
  {
    category: "Process",
    question: "How does the revision process work?",
    answer: "After we complete your first draft, we email it to you for review. This gives you the opportunity to provide all your feedback and requested changes at once. We then refine your documents based on your input. We work with you until you're 100% satisfied with the final result."
  },
  {
    category: "Process",
    question: "What information do you need from me to get started?",
    answer: "We'll need your current resume (if you have one), a job description or target role you're applying for, your LinkedIn profile URL (if applicable), and details about your career goals. During the consultation, we'll discuss your work history, key achievements, skills, and what makes you stand out."
  },
  {
    category: "Results",
    question: "Do you guarantee interview results?",
    answer: "While we cannot guarantee specific interview outcomes (as hiring decisions depend on many factors), we have a 96% interview success rate among our clients. We guarantee that your resume will be professionally written, ATS-optimised, and tailored to your target role. If you're not satisfied with our work, we'll revise it until you are."
  },
  {
    category: "Results",
    question: "Are your resumes ATS-friendly?",
    answer: "Yes, all our resumes are optimised for Applicant Tracking Systems (ATS). We use proper formatting, relevant keywords, and industry-standard section headings to ensure your resume passes ATS screening and reaches human recruiters. We avoid graphics, tables, and formatting that can confuse ATS software."
  },
  {
    category: "Results",
    question: "Can you help me if I'm changing careers?",
    answer: "Absolutely! Career change resumes are one of our specialties. We know how to highlight transferable skills, reframe your experience for a new industry, and position you as a strong candidate despite lacking direct experience. We'll emphasize relevant achievements and skills that align with your target role."
  },
  {
    category: "General",
    question: "Do you work with clients outside Australia?",
    answer: "Yes, while we're based in Australia and specialise in Australian resume formats, we work with clients worldwide. We're familiar with international resume standards including US, UK, Canadian, and European formats. Let us know your target country during consultation."
  },
  {
    category: "General",
    question: "Is my information kept confidential?",
    answer: "Yes, we take your privacy seriously. All personal information and career documents are kept strictly confidential and secure. We never share your information with third parties. Your documents are stored securely and deleted upon request after service completion."
  },
  {
    category: "General",
    question: "What if I'm not satisfied with my resume?",
    answer: "Your satisfaction is our priority. We work with you until you're 100% satisfied with your documents. After receiving your first draft, you can provide all your feedback at once, and we'll refine everything accordingly. We stand behind the quality of our work and are committed to delivering documents you're proud to submit."
  }
];

export default function OurProcess() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logSearchMutation = trpc.faq.logSearch.useMutation();

  const steps = [
    {
      icon: FileSearch,
      title: "Free Assessment",
      description: "Send us your current resume for a complimentary evaluation. We'll assess its effectiveness and identify areas for improvement."
    },
    {
      icon: DollarSign,
      title: "Tailored Quote",
      description: "Receive a personalised quote outlining services, pricing and turnaround time based on your specific needs and career goals."
    },
    {
      icon: ClipboardList,
      title: "Information Gathering",
      description: "Complete our easy online data form to ensure we capture every relevant detail about your experience, skills, and achievements."
    },
    {
      icon: PenTool,
      title: "Writing & Review",
      description: "We craft your documents and provide a draft for your feedback. We work together to refine until you're satisfied."
    },
    {
      icon: CheckCircle,
      title: "Final Delivery",
      description: "Receive polished, ready-to-use files in Word and PDF that showcase your professional value and get results."
    }
  ];

  const categories = ["All", ...Array.from(new Set(faqData.map(item => item.category)))];
  
  // Filter by category first
  let filteredFAQs = activeCategory === "All" 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);
  
  // Then filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredFAQs = filteredFAQs.filter(item => 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }

  // Generate JSON-LD schema for FAQ
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    // Add schema to page head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Track search queries with debouncing
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only log if there's a search query
    if (searchQuery.trim()) {
      // Debounce for 1.5 seconds to avoid logging every keystroke
      searchTimeoutRef.current = setTimeout(() => {
        logSearchMutation.mutate({
          query: searchQuery.trim(),
          resultsCount: filteredFAQs.length,
        });
      }, 1500);
    }

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, filteredFAQs.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our Process & FAQs
              </h1>
              <p className="text-xl text-muted-foreground">
                Learn how we create professional resumes that get results, and find answers to your questions.
              </p>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-accent">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
                Our Simple 5-Step Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From initial assessment to final delivery, we make the process smooth and stress-free so you can focus on preparing for interviews.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;
                
                return (
                  <div key={index} className="relative">
                    <div className="flex gap-6 items-start mb-8">
                      {/* Step Number and Icon */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-bold text-sm shadow-md">
                          {index + 1}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold text-card-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Connecting Line */}
                    {!isLast && (
                      <div className="absolute left-8 top-16 w-0.5 h-8 bg-primary/30" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-muted-foreground mb-6">
                Each step is designed to give you the confidence to sell yourself—because, let's face it, talking about yourself is HARD! And first impressions matter!
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our services, pricing, and process.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search FAQs by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 py-6 text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-center text-sm text-muted-foreground mt-3">
                  Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-12 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-accent text-accent-foreground hover:bg-accent/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No FAQs found matching your search. Try different keywords or browse all categories.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-secondary/20 text-secondary-foreground mb-2">
                          {faq.category}
                        </span>
                        <h3 className="font-semibold text-lg text-card-foreground">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                          openIndex === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openIndex === index && (
                      <div className="px-6 py-4 bg-accent/30 border-t border-border">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
