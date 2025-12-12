import { useState } from "react";
import { Lock, Mail, CheckCircle, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ResumeSample {
  id: string;
  title: string;
  industry: string;
  careerLevel: string;
  beforeImage?: string;
  afterImage?: string;
  description: string;
}

export default function ResumeSamplesGallery() {
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sample data - will be populated with actual resume examples
  const samples: ResumeSample[] = [
    {
      id: "1",
      title: "Senior Project Manager Resume",
      industry: "IT & Technology",
      careerLevel: "Senior Level",
      description: "Transformed a dense, text-heavy resume into an ATS-friendly, visually appealing document that secured 5 interviews in 2 weeks.",
    },
    {
      id: "2",
      title: "Mining Engineer Resume",
      industry: "Mining & Resources",
      careerLevel: "Mid-Level",
      description: "Restructured technical achievements and certifications to highlight safety record and project outcomes, resulting in immediate interview requests.",
    },
    {
      id: "3",
      title: "Career Change Resume",
      industry: "Healthcare to Corporate",
      careerLevel: "Mid-Level",
      description: "Repositioned transferable skills from nursing to corporate training role, emphasizing leadership and communication strengths.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call to save email
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Integrate with email service (e.g., Mailchimp, SendGrid, or database)
    console.log("Email captured:", email);

    setHasAccess(true);
    setSubmitSuccess(true);
    setIsSubmitting(false);
  };

  if (!hasAccess) {
    return (
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full mb-4">
                <Eye className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold">Exclusive Access</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See Real Resume Transformations
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get instant access to our before & after resume samples and see exactly how we transform ordinary resumes into interview-winning documents.
              </p>
            </div>

            {/* Preview Cards - Locked */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {samples.map((sample) => (
                <Card key={sample.id} className="p-6 relative overflow-hidden">
                  {/* Blur Overlay */}
                  <div className="absolute inset-0 backdrop-blur-sm bg-background/50 flex items-center justify-center z-10">
                    <Lock className="h-12 w-12 text-muted-foreground" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-lg">{sample.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                        {sample.industry}
                      </span>
                      <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                        {sample.careerLevel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {sample.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Email Gate Form */}
            <Card className="p-8 md:p-12 bg-card border-2 border-primary/20">
              <div className="max-w-md mx-auto text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  Unlock All Resume Samples
                </h3>

                <p className="text-muted-foreground mb-6">
                  Enter your email to get instant access to our complete gallery of before & after resume transformations, plus receive exclusive resume writing tips.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-center"
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Unlocking..." : "Get Instant Access"}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Unlocked View
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6 mb-12 flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-green-700 dark:text-green-400 mb-1">
                  Access Granted!
                </h3>
                <p className="text-green-600 dark:text-green-300">
                  Check your email for exclusive resume writing tips and resources.
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Before & After Resume Transformations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how we transform ordinary resumes into interview-winning documents
            </p>
          </div>

          {/* Resume Samples Grid */}
          <div className="space-y-12">
            {samples.map((sample) => (
              <Card key={sample.id} className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{sample.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-sm px-3 py-1 bg-accent text-accent-foreground rounded-full">
                      {sample.industry}
                    </span>
                    <span className="text-sm px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                      {sample.careerLevel}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{sample.description}</p>
                </div>

                {/* Before/After Images Placeholder */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 mb-3">
                      <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">❌ Before</h4>
                      <div className="aspect-[8.5/11] bg-white dark:bg-gray-900 border border-border rounded flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Resume image will be displayed here</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800 rounded-lg p-4 mb-3">
                      <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">✅ After</h4>
                      <div className="aspect-[8.5/11] bg-white dark:bg-gray-900 border border-border rounded flex items-center justify-center">
                        <p className="text-muted-foreground text-sm">Resume image will be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to transform your resume like these examples?
            </p>
            <Button size="lg" asChild>
              <a href="/services/resume-writing">Get Started Today</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
