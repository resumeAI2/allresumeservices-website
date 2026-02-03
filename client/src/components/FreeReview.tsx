import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Upload, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function FreeReview() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [fieldValid, setFieldValid] = useState<{[key: string]: boolean}>({});
  const [, setLocation] = useLocation();
  const [formMountTime] = useState(() => Date.now());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    file: null as File | null
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success('Your resume has been submitted for review! We\'ll get back to you within 24 hours.');
      setTimeout(() => {
        setLocation('/thank-you-review');
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Failed to submit: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PDF, DOC, or DOCX file');
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.file) {
        toast.error('Please fill in all required fields and upload your resume');
        setIsSubmitting(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      // Upload resume file first
      let resumeFileUrl: string | undefined;
      if (formData.file) {
        try {
          toast.info('Uploading your resume...');
          const uploadData = new FormData();
          uploadData.append('file', formData.file);
          
          const uploadResponse = await fetch('/api/upload-image', {
            method: 'POST',
            body: uploadData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload resume');
          }
          
          const uploadResult = await uploadResponse.json();
          resumeFileUrl = uploadResult.url;
          toast.success('Resume uploaded successfully!');
        } catch (error) {
          toast.error('Failed to upload resume file. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Submit the contact form via API
      toast.info('Submitting your request...');
      submitMutation.mutate({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        serviceInterest: 'free-review',
        message: formData.message.trim() || 'Free resume review request',
        resumeFileUrl: resumeFileUrl,
        honeypot: '',
        submissionTime: formMountTime,
      });

    } catch (error) {
      toast.error('Something went wrong. Please try again or email us directly.');
      console.error('Form submission error:', error);
      setIsSubmitting(false);
    }
  };

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
    <section id="free-review" className="py-20 bg-gradient-to-br from-[#C9A227] via-[#D4AF37] to-[#B8860B] text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get a Free Resume Review – Your First Step Toward Your Dream Job
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Not sure if your resume is getting the attention it deserves? Send it to us for a free review! Our professional resume writers will assess its effectiveness, ensuring it showcases your career history, relevant skills, and achievements in a way that stands out in today's competitive job market.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-primary/90 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-3xl mx-auto border border-primary/30 shadow-2xl mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">
            Submit Your Resume for Free Review
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">
                  Full Name <span className="text-yellow-300">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, name: value }));
                    if (value.trim().length >= 2) {
                      setFieldValid(prev => ({ ...prev, name: true }));
                      setFieldErrors(prev => ({ ...prev, name: '' }));
                    } else {
                      setFieldValid(prev => ({ ...prev, name: false }));
                      if (value.length > 0) {
                        setFieldErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
                      }
                    }
                  }}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition-all"
                />
                {fieldValid.name && (
                  <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Looks good!
                  </p>
                )}
                {fieldErrors.name && (
                  <p className="text-sm text-red-400 mt-1">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email Address <span className="text-yellow-300">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, email: value }));
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(value)) {
                      setFieldValid(prev => ({ ...prev, email: true }));
                      setFieldErrors(prev => ({ ...prev, email: '' }));
                    } else {
                      setFieldValid(prev => ({ ...prev, email: false }));
                      if (value.length > 0) {
                        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
                      }
                    }
                  }}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50 transition-all"
                />
                {fieldValid.email && (
                  <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Valid email address
                  </p>
                )}
                {fieldErrors.email && (
                  <p className="text-sm text-red-400 mt-1">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white font-medium">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0410 934 371"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white font-medium">
                Additional Information (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your career goals, target roles, or any specific concerns..."
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume-upload" className="text-white font-medium">
                Upload Your Resume <span className="text-yellow-300">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="bg-white/20 border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-primary file:font-semibold hover:file:bg-yellow-300 cursor-pointer"
                />
              </div>
              <p className="text-xs opacity-75 mt-1">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </p>
              {formData.file && (
                <p className="text-sm text-yellow-300 mt-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  File selected: {formData.file.name}
                </p>
              )}
            </div>

            <Button 
              type="submit"
              size="lg" 
              disabled={isSubmitting || submitMutation.isPending}
              className="w-full bg-primary text-white hover:bg-primary/90 text-lg py-6 shadow-xl font-semibold"
            >
              {isSubmitting || submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isSubmitting ? 'Uploading Resume...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Submit for Free Review
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm opacity-80">
            <p>Or call us directly: <a href="tel:0410934371" className="text-yellow-300 font-semibold hover:underline">0410 934 371</a></p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-primary/90 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-5xl mx-auto border border-primary/30 shadow-2xl">
          <h3 className="text-2xl font-bold mb-8 text-center text-[#D4AF37]">
            What's Included in Your Free Review?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-[#D4AF37]">{benefit.title}</h4>
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
