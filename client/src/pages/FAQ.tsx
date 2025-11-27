import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, Search, X } from "lucide-react";
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
    answer: "We offer comprehensive resume writing services including professional resume writing, cover letter writing, LinkedIn profile optimization, selection criteria responses, and career consultation. Each service is tailored to your industry, experience level, and career goals to maximize your chances of landing interviews."
  },
  {
    category: "Services",
    question: "Do you write resumes for all industries and career levels?",
    answer: "Yes, we have 17+ years of experience writing resumes for professionals across all industries including healthcare, IT, finance, education, engineering, hospitality, and more. We work with entry-level candidates, mid-career professionals, senior executives, and career changers."
  },
  {
    category: "Services",
    question: "What makes your resume writing service different?",
    answer: "Our service stands out with a 96% interview success rate, 17+ years of industry experience, and personalized one-on-one consultations. We don't use templates—every resume is custom-written to highlight your unique strengths and achievements. We also provide unlimited revisions within 7 days to ensure your complete satisfaction."
  },
  {
    category: "Pricing",
    question: "How much do your services cost?",
    answer: "We offer three packages: Basic Package at $125 (professional resume writing), Standard Package at $185 (resume + cover letter + LinkedIn optimization), and Premium Package at $255 (everything in Standard plus selection criteria and career consultation). All packages include unlimited revisions within 7 days."
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
    answer: "Our 5-step process begins with a free assessment where we review your current resume. After you choose a package and make payment, we conduct a detailed consultation to understand your goals. Our expert writers then create your custom resume, which we deliver for your review. Finally, we offer unlimited revisions within 7 days to perfect your documents."
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
    question: "How many revisions are included?",
    answer: "We include unlimited revisions within 7 days of delivering your first draft. We're committed to your satisfaction and will work with you until you're completely happy with your resume. After the 7-day period, additional revisions can be made for a small fee."
  },
  {
    category: "Process",
    question: "What information do you need from me to get started?",
    answer: "We'll need your current resume (if you have one), a job description or target role you're applying for, your LinkedIn profile URL (if applicable), and details about your career goals. During the consultation, we'll discuss your work history, key achievements, skills, and what makes you stand out."
  },
  {
    category: "Results",
    question: "Do you guarantee interview results?",
    answer: "While we cannot guarantee specific interview outcomes (as hiring decisions depend on many factors), we have a 96% interview success rate among our clients. We guarantee that your resume will be professionally written, ATS-optimized, and tailored to your target role. If you're not satisfied with our work, we'll revise it until you are."
  },
  {
    category: "Results",
    question: "Are your resumes ATS-friendly?",
    answer: "Yes, all our resumes are optimized for Applicant Tracking Systems (ATS). We use proper formatting, relevant keywords, and industry-standard section headings to ensure your resume passes ATS screening and reaches human recruiters. We avoid graphics, tables, and formatting that can confuse ATS software."
  },
  {
    category: "Results",
    question: "Can you help me if I'm changing careers?",
    answer: "Absolutely! Career change resumes are one of our specialties. We know how to highlight transferable skills, reframe your experience for a new industry, and position you as a strong candidate despite lacking direct experience. We'll emphasize relevant achievements and skills that align with your target role."
  },
  {
    category: "General",
    question: "Do you work with clients outside Australia?",
    answer: "Yes, while we're based in Australia and specialize in Australian resume formats, we work with clients worldwide. We're familiar with international resume standards including US, UK, Canadian, and European formats. Let us know your target country during consultation."
  },
  {
    category: "General",
    question: "Is my information kept confidential?",
    answer: "Yes, we take your privacy seriously. All personal information and career documents are kept strictly confidential and secure. We never share your information with third parties. Your documents are stored securely and deleted upon request after service completion."
  },
  {
    category: "General",
    question: "What if I'm not satisfied with my resume?",
    answer: "Your satisfaction is our priority. We offer unlimited revisions within 7 days to ensure you're completely happy with your resume. If you're still not satisfied after revisions, we'll work with you to understand your concerns and make it right. We stand behind the quality of our work."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? `<mark class="bg-yellow-200 dark:bg-yellow-800">${part}</mark>`
        : part
    ).join('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground">
                Find answers to common questions about our resume writing services, pricing, process, and results.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container max-w-4xl">
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
                  onClick={() => {
                    setActiveCategory(category);
                    setOpenIndex(null);
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-accent text-accent-foreground hover:bg-accent/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No FAQs match "${searchQuery}". Try different keywords or browse by category.`
                    : "No FAQs available in this category."}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-2">
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-semibold text-card-foreground">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}

            {/* Still Have Questions CTA */}
            <div className="mt-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our friendly team is here to help. 
                Get in touch and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:0410934371"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Call Us: 0410 934 371
                </a>
                <a
                  href="mailto:admin@allresumeservices.com.au"
                  className="inline-flex items-center justify-center px-6 py-3 bg-card border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
