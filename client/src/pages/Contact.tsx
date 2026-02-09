import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, Upload, FileText, Loader2 } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [formMountTime] = useState(() => Date.now());
  const [isUploading, setIsUploading] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setIsUploading(false);
      
      // Show detailed success message
      const hasResume = resumeFile !== null;
      const successMessage = hasResume 
        ? "✓ Message sent successfully! Your resume has been uploaded. We'll review it and get back to you within 24 hours with a personalised quote."
        : "✓ Message sent successfully! We'll get back to you within 24 hours.";
      
      toast.success(successMessage, {
        duration: 6000,
      });
      
      // Reset form
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

    // Spam protection: check honeypot
    if (honeypot) {
      toast.error("Invalid submission detected");
      return;
    }

    // Spam protection: check submission time (min 3 seconds)
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

    // Set loading state
    setIsUploading(true);

    // Upload resume file if provided
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

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Us - Free Resume Consultation | All Résumé Services</title>
        <meta name="description" content="Contact All Résumé Services for a free resume, cover letter, or LinkedIn profile consultation. Phone, email, or upload your resume. 18+ years experience, 96% interview success rate. Australia-wide." />
        <meta name="keywords" content="contact resume writer, free resume review, resume consultation Australia, cover letter, LinkedIn profile" />
        <link rel="canonical" href="https://allresumeservices.com.au/contact" />
      </Helmet>
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8f] to-[#1e3a5f] text-white py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
          </div>
          <div className="container max-w-6xl relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <p className="inline-block px-4 py-1.5 rounded-full bg-[#D4AF37]/25 text-[#D4AF37] font-semibold tracking-wide uppercase text-base mb-4 border border-[#D4AF37]/40">Free consultation</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
              <p className="text-lg text-blue-100">
                Ready to take the next step? Contact us for a free consultation about your resume, cover letter, or LinkedIn profile and we&apos;ll discuss how we can help you land your dream job.
              </p>
            </div>
          </div>
        </section>

        <div className="container max-w-6xl -mt-6 relative z-20 px-4 pb-16">
          {/* Contact cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center border-2 border-transparent hover:border-[#D4AF37]/30 hover:shadow-lg transition-all duration-300 bg-white shadow-md">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#1e3a5f] text-[#D4AF37] mb-4">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Phone</h3>
              <a href="tel:0410934371" className="text-gray-700 hover:text-[#1e3a5f] font-medium transition-colors">
                0410 934 371
              </a>
            </Card>

            <Card className="p-6 text-center border-2 border-transparent hover:border-[#D4AF37]/30 hover:shadow-lg transition-all duration-300 bg-white shadow-md">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#1e3a5f] text-[#D4AF37] mb-4">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Email</h3>
              <a href="mailto:admin@allresumeservices.com.au" className="text-gray-700 hover:text-[#1e3a5f] font-medium break-all transition-colors">
                admin@allresumeservices.com.au
              </a>
            </Card>

            <Card className="p-6 text-center border-2 border-transparent hover:border-[#D4AF37]/30 hover:shadow-lg transition-all duration-300 bg-white shadow-md">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#1e3a5f] text-[#D4AF37] mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] mb-2">Business Hours</h3>
              <p className="text-gray-700 text-sm">
                Mon–Fri: 9am – 6pm<br />
                <span className="text-muted-foreground">Sat–Sun: By appointment</span>
              </p>
            </Card>
          </div>

          <Card id="enquiry-form" className="p-8 md:p-12 shadow-lg border-2 border-[#1e3a5f]/10 scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Send Us a Message</h2>
            <p className="text-muted-foreground mb-6">We typically respond within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users, bots will fill it */}
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
                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("File size must be less than 5MB");
                          e.target.value = "";
                          return;
                        }
                        // Validate file type
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
                  className="mt-2 w-full min-h-[150px] px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
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
                className="w-full md:w-auto bg-[#1e3a5f] hover:bg-[#2d5a8f] text-white"
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

          <section className="mt-16 py-12 px-6 rounded-2xl bg-gradient-to-br from-[#1e3a5f]/5 via-[#D4AF37]/5 to-[#1e3a5f]/5 border border-[#1e3a5f]/10 text-center">
            <h3 className="text-xl font-bold text-[#1e3a5f] mb-2">Prefer to Call?</h3>
            <p className="text-gray-700 mb-6 max-w-md mx-auto">
              Speak directly with one of our resume experts for immediate assistance.
            </p>
            <a href="tel:0410934371">
              <Button size="lg" className="bg-[#D4AF37] hover:bg-[#B8860B] text-[#1e3a5f] font-semibold shadow-md">
                <Phone className="w-4 h-4 mr-2" />
                Call 0410 934 371
              </Button>
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
