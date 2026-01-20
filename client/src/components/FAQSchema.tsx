import { Helmet } from "react-helmet-async";

export default function FAQSchema() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is your turnaround time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our standard turnaround is 2-3 business days for most packages. We also offer a 1-day express service for urgent needs (available with Premium package). Rush orders may incur additional fees. Once we receive your completed questionnaire and payment, we'll confirm your delivery date."
        }
      },
      {
        "@type": "Question",
        "name": "How many revisions do I get?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We work with you until you're 100% satisfied. Your package includes revisions. Most clients are happy after 1-2 rounds of feedback. We want you to feel confident submitting your resume, so we'll refine it until it's perfect."
        }
      },
      {
        "@type": "Question",
        "name": "What is ATS optimisation and why does it matter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ATS (Applicant Tracking System) is software used by 98% of Fortune 500 companies and many Australian employers to scan and filter resumes before a human sees them. Our ATS-optimised resumes use proper formatting, relevant keywords, and clean structure to ensure your application passes these systems and reaches hiring managers. Without ATS optimisation, your resume may be automatically rejected regardless of your qualifications."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and direct bank transfer. Payment is required upfront before we begin work. All transactions are secure and processed through encrypted payment gateways. You'll receive a tax invoice upon payment."
        }
      },
      {
        "@type": "Question",
        "name": "Do you write resumes for all industries and career levels?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We have 18+ years of experience writing resumes for professionals across all industries—from entry-level graduates to C-suite executives. Whether you're in healthcare, IT, mining, government, education, or any other sector, we tailor your resume to your specific industry standards and career goals."
        }
      },
      {
        "@type": "Question",
        "name": "What information do you need from me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "After you place your order, we'll send you a comprehensive questionnaire covering your work history, education, skills, achievements, and career goals. The more detail you provide, the better we can showcase your strengths. We'll also ask for your current resume (if you have one) and any job descriptions you're targeting. The questionnaire typically takes 30-45 minutes to complete."
        }
      },
      {
        "@type": "Question",
        "name": "Can you help me if I'm changing careers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Career transitions require special attention to transferable skills and reframing your experience. We're experts at highlighting how your background applies to your new field, even if your previous roles seem unrelated. We'll emphasise relevant skills, achievements, and qualifications that align with your target industry."
        }
      },
      {
        "@type": "Question",
        "name": "Will my resume be written by AI or a real person?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every resume is personally written by our experienced professional writers—real humans with deep expertise in recruitment and career development. While we use technology to optimise formatting and keyword placement, the strategy, content, and storytelling are 100% human-crafted and tailored to your unique background."
        }
      },
      {
        "@type": "Question",
        "name": "Do you guarantee I'll get a job?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While we can't guarantee employment (as hiring depends on many factors beyond the resume), we do guarantee a professionally written, ATS-optimised resume that significantly improves your chances. Our 96% interview success rate speaks to the effectiveness of our approach. If you're not satisfied with your resume, we'll revise it until you are."
        }
      },
      {
        "@type": "Question",
        "name": "What file formats will I receive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You'll receive your resume in both Microsoft Word (.docx) and PDF formats. The Word version allows you to make minor updates yourself in the future, while the PDF is perfect for submitting applications. Both formats are ATS-compatible and professionally formatted."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer LinkedIn profile writing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our Premium package includes professional LinkedIn profile writing and optimization. We'll craft a compelling headline, summary, and experience descriptions that align with your resume and attract recruiters. LinkedIn optimization is also available as a standalone service."
        }
      },
      {
        "@type": "Question",
        "name": "Can you write selection criteria responses for government jobs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we specialize in selection criteria responses for Australian government positions (federal, state, and local). We use the STAR method (Situation, Task, Action, Result) to craft compelling responses that demonstrate your suitability. This service is available as an add-on or included in our Senior & Leadership package."
        }
      },
      {
        "@type": "Question",
        "name": "What if I need updates to my resume in the future?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer discounted rates for returning clients who need updates. Since we'll already have your information on file, updates are typically faster and more affordable. Many of our clients have been with us for 5+ years, updating their resumes as they progress in their careers."
        }
      },
      {
        "@type": "Question",
        "name": "How confidential is my information?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your privacy is our top priority. All information you provide is kept strictly confidential and never shared with third parties. We use secure systems to store your data and comply with Australian privacy laws. Your resume and personal details are protected at all times."
        }
      },
      {
        "@type": "Question",
        "name": "What makes you different from other resume writing services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We combine 18+ years of experience with a proven track record (96% interview success rate), personalised service, and deep understanding of Australian recruitment practices. Unlike template-based services or AI generators, we craft each resume from scratch based on your unique background. We also offer unlimited revisions and work with you until you're completely satisfied—not just until we deliver a first draft."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}
