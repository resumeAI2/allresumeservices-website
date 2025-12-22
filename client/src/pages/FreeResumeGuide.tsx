import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Download, FileText, TrendingUp, Target, Award } from "lucide-react";

import SEOHead from "@/components/SEOHead";

export default function FreeResumeGuide() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const captureMutation = trpc.leadMagnet.capture.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: () => {
      alert("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      alert("Please enter your name and email address.");
      return;
    }

    captureMutation.mutate({
      name,
      email,
      downloadedTemplate: "ats-resume-mistakes",
      sourcePost: "direct-landing-page",
    });
  };

  return (
    <>
      <SEOHead
        title="Free Download: 10 ATS Resume Mistakes Costing You Interviews"
        description="Download our free guide revealing the 10 most common ATS resume mistakes that cost job seekers interviews—and exactly how to fix them. Expert tips from professional resume writers with 18+ years experience."
        keywords="free resume guide, ATS resume mistakes, resume optimization, job search tips, resume writing guide, ATS optimization"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="container py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Download className="h-4 w-4" />
              Free Download - No Credit Card Required
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              10 ATS Resume Mistakes{" "}
              <span className="text-primary">Costing You Interviews</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              98% of Fortune 500 companies use Applicant Tracking Systems to screen resumes. 
              If yours isn't optimized, it's rejected before a human ever sees it.
            </p>

            <div className="mb-12 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">18+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">96% Interview Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">10,000+ Resumes Reviewed</span>
              </div>
            </div>

            {/* Lead Capture Form */}
            {!isSuccess ? (
              <Card className="mx-auto max-w-md p-8">
                <div className="mb-6 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h2 className="mb-2 text-2xl font-bold">Get Your Free Guide</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter your details below and we'll email you the guide instantly
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full text-base"
                    disabled={captureMutation.isPending}
                  >
                    {captureMutation.isPending ? "Sending..." : "Download Free Guide"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </form>
              </Card>
            ) : (
              <Card className="mx-auto max-w-md bg-primary/5 p-8">
                <div className="text-center">
                  <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-primary" />
                  <h2 className="mb-2 text-2xl font-bold">Check Your Email!</h2>
                  <p className="mb-6 text-muted-foreground">
                    We've sent the guide to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Don't see it? Check your spam folder or{" "}
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-primary underline hover:no-underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* What's Inside Section */}
        <section className="border-t bg-muted/30 py-16">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-3xl font-bold">
                What You'll Discover Inside
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <Target className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">
                    The Formatting Mistakes That Trigger Automatic Rejection
                  </h3>
                  <p className="text-muted-foreground">
                    Learn which fonts, layouts, and design choices cause ATS systems to reject your resume instantly.
                  </p>
                </Card>

                <Card className="p-6">
                  <FileText className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">
                    How to Incorporate Keywords the Right Way
                  </h3>
                  <p className="text-muted-foreground">
                    Discover the proven method for adding keywords naturally without triggering spam filters.
                  </p>
                </Card>

                <Card className="p-6">
                  <TrendingUp className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">
                    The File Format That Gets You Rejected
                  </h3>
                  <p className="text-muted-foreground">
                    Find out which file formats ATS systems prefer and which ones cause parsing errors.
                  </p>
                </Card>

                <Card className="p-6">
                  <Award className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">
                    The Section Heading Rules You Must Follow
                  </h3>
                  <p className="text-muted-foreground">
                    Understand why creative headings confuse ATS and which standard headings you should use instead.
                  </p>
                </Card>
              </div>

              <div className="mt-12 rounded-lg bg-primary/10 p-8 text-center">
                <h3 className="mb-4 text-2xl font-bold">
                  Plus: Your Complete ATS Resume Checklist
                </h3>
                <p className="text-muted-foreground">
                  A practical checklist you can use before submitting every job application to ensure your resume passes ATS screening.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="border-t py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-8 text-3xl font-bold">
                Trusted by Thousands of Job Seekers
              </h2>
              <p className="mb-12 text-lg text-muted-foreground">
                Our clients achieve a 96% interview success rate because we combine ATS optimization 
                with compelling storytelling, professional formatting, and industry-specific expertise.
              </p>

              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <div className="mb-2 text-4xl font-bold text-primary">18+</div>
                  <div className="text-sm font-medium text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="mb-2 text-4xl font-bold text-primary">96%</div>
                  <div className="text-sm font-medium text-muted-foreground">Interview Success Rate</div>
                </div>
                <div>
                  <div className="mb-2 text-4xl font-bold text-primary">10,000+</div>
                  <div className="text-sm font-medium text-muted-foreground">Resumes Reviewed</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-primary py-16 text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold">
                Ready to Stop Wasting Job Applications?
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Download the free guide now and start getting more interviews
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-base"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Get Your Free Guide
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
