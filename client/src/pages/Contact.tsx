import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterest, setServiceInterest] = useState("");
  const [message, setMessage] = useState("");

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you! We'll get back to you within 24 hours.");
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setServiceInterest("");
      setMessage("");
    },
    onError: (error) => {
      toast.error(`Failed to submit: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      serviceInterest: serviceInterest || undefined,
      message: message.trim(),
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready to take the next step in your career? Contact us today for a free consultation 
              and let's discuss how we can help you land your dream job.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <a href="tel:0410934371" className="text-muted-foreground hover:text-primary">
                0410 934 371
              </a>
            </Card>

            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a href="mailto:admin@allresumeservices.com.au" className="text-muted-foreground hover:text-primary break-all">
                admin@allresumeservices.com.au
              </a>
            </Card>

            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-muted-foreground">
                Mon-Fri: 9am - 6pm<br />
                Sat-Sun: By appointment
              </p>
            </Card>
          </div>

          <Card className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      <SelectItem value="linkedin">LinkedIn Optimization</SelectItem>
                      <SelectItem value="selection-criteria">Selection Criteria</SelectItem>
                      <SelectItem value="career-consultation">Career Consultation</SelectItem>
                      <SelectItem value="package">Complete Package</SelectItem>
                      <SelectItem value="other">Other / Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your career goals and how we can help..."
                  className="mt-2 w-full min-h-[150px] px-3 py-2 border border-input rounded-md"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum 10 characters
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitMutation.isPending}
                className="w-full md:w-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-4">Prefer to Call?</h3>
            <p className="text-muted-foreground mb-6">
              Speak directly with one of our resume experts for immediate assistance
            </p>
            <a href="tel:0410934371">
              <Button size="lg" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call 0410 934 371
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
