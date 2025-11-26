import { Button } from "@/components/ui/button";
import { Upload, CheckCircle2 } from "lucide-react";

export default function FreeReview() {
  const benefits = [
    {
      title: "Expert Resume Assessment",
      description: "We evaluate your resume's structure, clarity, and impact."
    },
    {
      title: "Career Progression Insights",
      description: "Gaps in your experience? We suggest ways to highlight your strengths."
    },
    {
      title: "ATS Optimisation Check",
      description: "Your resume must pass applicant tracking systems, and we'll ensure it does."
    },
    {
      title: "Cover Letter Feedback",
      description: "We'll recommend improvements to strengthen your application if needed."
    },
    {
      title: "Selection Criteria Advice",
      description: "Applying for government or corporate roles? We'll check that your cover letter aligns with key requirements."
    },
    {
      title: "Tailored Recommendations",
      description: "Need a LinkedIn profile update or other refinements? We'll provide guidance."
    }
  ];

  return (
    <section id="free-review" className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get a Free Resume Review – Your First Step Toward Your Dream Job
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Not sure if your resume is getting the attention it deserves? Send it to us for a free review! Our professional resume writers will assess its effectiveness, ensuring it showcases your career history, relevant skills, and achievements in a way that stands out in today's competitive job market.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
              onClick={() => window.open('mailto:admin@allresumeservices.com.au?subject=Free Resume Review Request', '_blank')}
            >
              <Upload className="mr-2 h-5 w-5" />
              Send Resume for Free Review
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6"
              onClick={() => window.open('tel:0410934371')}
            >
              Call Us: 0410 934 371
            </Button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-5xl mx-auto border border-white/20">
          <h3 className="text-2xl font-bold mb-8 text-center">
            What's Included in Your Free Review?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{benefit.title}</h4>
                  <p className="text-sm opacity-90">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-lg font-semibold mb-2">
              Ready to take the next step?
            </p>
            <p className="opacity-90">
              Our clients have achieved significant success—landing jobs faster, increasing interview rates, and securing industry roles. Send us your resume for a free review and get one step closer to your dream job!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
