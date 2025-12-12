import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "What is your turnaround time?",
      answer: "Our standard turnaround is 2-3 business days for most packages. We also offer a 1-day express service for urgent needs (available with Premium package). Rush orders may incur additional fees. Once we receive your completed questionnaire and payment, we'll confirm your delivery date."
    },
    {
      question: "How many revisions do I get?",
      answer: "We work with you until you're 100% satisfied. Your package includes unlimited revisions within reason. Most clients are happy after 1-2 rounds of feedback. We want you to feel confident submitting your resume, so we'll refine it until it's perfect."
    },
    {
      question: "What is ATS optimization and why does it matter?",
      answer: "ATS (Applicant Tracking System) is software used by 98% of Fortune 500 companies and many Australian employers to scan and filter resumes before a human sees them. Our ATS-optimized resumes use proper formatting, relevant keywords, and clean structure to ensure your application passes these systems and reaches hiring managers. Without ATS optimization, your resume may be automatically rejected regardless of your qualifications."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and direct bank transfer. Payment is required upfront before we begin work. All transactions are secure and processed through encrypted payment gateways. You'll receive a tax invoice upon payment."
    },
    {
      question: "Do you write resumes for all industries and career levels?",
      answer: "Yes! We have 17+ years of experience writing resumes for professionals across all industries—from entry-level graduates to C-suite executives. Whether you're in healthcare, IT, mining, government, education, or any other sector, we tailor your resume to your specific industry standards and career goals."
    },
    {
      question: "What information do you need from me?",
      answer: "After you place your order, we'll send you a comprehensive questionnaire covering your work history, education, skills, achievements, and career goals. The more detail you provide, the better we can showcase your strengths. We'll also ask for your current resume (if you have one) and any job descriptions you're targeting. The questionnaire typically takes 30-45 minutes to complete."
    },
    {
      question: "Can you help me if I'm changing careers?",
      answer: "Absolutely! Career transitions require special attention to transferable skills and reframing your experience. We're experts at highlighting how your background applies to your new field, even if your previous roles seem unrelated. We'll emphasize relevant skills, achievements, and qualifications that align with your target industry."
    },
    {
      question: "Will my resume be written by AI or a real person?",
      answer: "Every resume is personally written by our experienced professional writers—real humans with deep expertise in recruitment and career development. While we use technology to optimize formatting and keyword placement, the strategy, content, and storytelling are 100% human-crafted and tailored to your unique background."
    },
    {
      question: "Do you guarantee I'll get a job?",
      answer: "While we can't guarantee employment (as hiring depends on many factors beyond the resume), we do guarantee a professionally written, ATS-optimized resume that significantly improves your chances. Our 96% interview success rate speaks to the effectiveness of our approach. If you're not satisfied with your resume, we'll revise it until you are."
    },
    {
      question: "What file formats will I receive?",
      answer: "You'll receive your resume in both Microsoft Word (.docx) and PDF formats. The Word version allows you to make minor updates yourself in the future, while the PDF is perfect for submitting applications. Both formats are ATS-compatible and professionally formatted."
    },
    {
      question: "Do you offer LinkedIn profile writing?",
      answer: "Yes! Our Premium package includes professional LinkedIn profile writing and optimization. We'll craft a compelling headline, summary, and experience descriptions that align with your resume and attract recruiters. LinkedIn optimization is also available as a standalone service."
    },
    {
      question: "Can you write selection criteria responses for government jobs?",
      answer: "Yes, we specialize in selection criteria responses for Australian government positions (federal, state, and local). We use the STAR method (Situation, Task, Action, Result) to craft compelling responses that demonstrate your suitability. This service is available as an add-on or included in our Senior & Leadership package."
    },
    {
      question: "What if I need updates to my resume in the future?",
      answer: "We offer discounted rates for returning clients who need updates. Since we'll already have your information on file, updates are typically faster and more affordable. Many of our clients have been with us for 5+ years, updating their resumes as they progress in their careers."
    },
    {
      question: "How confidential is my information?",
      answer: "Your privacy is our top priority. All information you provide is kept strictly confidential and never shared with third parties. We use secure systems to store your data and comply with Australian privacy laws. Your resume and personal details are protected at all times."
    },
    {
      question: "What makes you different from other resume writing services?",
      answer: "We combine 17+ years of experience with a proven track record (96% interview success rate), personalized service, and deep understanding of Australian recruitment practices. Unlike template-based services or AI generators, we craft each resume from scratch based on your unique background. We also offer unlimited revisions and work with you until you're completely satisfied—not just until we deliver a first draft."
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers. Find everything you need to know about our services, process, and guarantees.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border rounded-lg px-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
