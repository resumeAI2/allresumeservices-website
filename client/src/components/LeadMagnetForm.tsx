import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Download, CheckCircle2 } from "lucide-react";
import { trpc } from "../lib/trpc";

interface LeadMagnetFormProps {
  templateName: string;
  templateUrl: string;
  sourcePost?: string;
}

export function LeadMagnetForm({ templateName, templateUrl, sourcePost }: LeadMagnetFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const captureMutation = trpc.leadMagnet.capture.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setError("");
      
      // Trigger download
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = templateName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (err) => {
      setError(err.message || "Something went wrong");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    captureMutation.mutate({
      name,
      email,
      downloadedTemplate: templateName,
      sourcePost,
    });
  };

  if (isSuccess) {
    return (
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
          <h3 className="text-2xl font-bold text-green-900">Download Started!</h3>
          <p className="text-green-700">
            Your resume template download should begin automatically. 
            Check your downloads folder!
          </p>
          <p className="text-sm text-green-600">
            We've also sent a copy to <strong>{email}</strong>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
      <div className="flex flex-col space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-amber-500 rounded-lg">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Download Your Free ATS-Friendly Resume Template
            </h3>
            <p className="text-gray-700">
              Get instant access to our professional resume template used by hundreds of successful job seekers. 
              Simply enter your details below to download.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <Input
              id="lead-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              required
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              className="w-full"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={captureMutation.isPending}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3"
          >
            {captureMutation.isPending ? (
              "Processing..."
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Free Template
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Your information will never be shared.
          </p>
        </form>
      </div>
    </Card>
  );
}
