import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AdminEmailTest() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const configQuery = trpc.email.checkConfiguration.useQuery();
  const testMutation = trpc.email.testSES.useMutation();

  const handleTestEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes("@")) {
      setTestResult({
        success: false,
        message: "Please enter a valid email address",
      });
      return;
    }

    setTestResult(null);

    try {
      const result = await testMutation.mutateAsync({ recipientEmail });
      setTestResult({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || "Failed to send test email",
      });
    }
  };

  const isConfigured = configQuery.data?.configured ?? false;
  const isLoading = testMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Email Test - Admin | All Resume Services</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />

      <main className="flex-1 py-16 bg-muted/20">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Amazon SES Email Test</h1>
            <p className="text-muted-foreground">
              Test your Amazon SES integration and verify email delivery
            </p>
          </div>

          {/* Configuration Status */}
          <Card className="p-6 mb-6">
            <div className="flex items-start gap-3">
              {configQuery.isLoading ? (
                <>
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Checking Configuration...</h3>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we verify your SES setup
                    </p>
                  </div>
                </>
              ) : isConfigured ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-600 mb-1">
                      SES Configured ✓
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Amazon SES is properly configured with valid credentials
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-600 mb-1">
                      SES Not Configured
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Amazon SES credentials are missing. Please add the following
                      environment variables in the Secrets Panel:
                    </p>
                    <ul className="text-sm space-y-1 font-mono bg-muted p-3 rounded">
                      <li>• AWS_REGION</li>
                      <li>• AWS_ACCESS_KEY_ID</li>
                      <li>• AWS_SECRET_ACCESS_KEY</li>
                      <li>• SES_FROM_EMAIL</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Test Email Form */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Send Test Email</h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="recipientEmail">Recipient Email Address</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  disabled={!isConfigured || isLoading}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {isConfigured
                    ? "Enter the email address where you want to receive the test email"
                    : "Configure SES credentials first to enable testing"}
                </p>
              </div>

              <Button
                onClick={handleTestEmail}
                disabled={!isConfigured || isLoading || !recipientEmail}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send Test Email"}
              </Button>

              {/* Test Result */}
              {testResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    testResult.success
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {testResult.success ? (
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {testResult.success ? "Success!" : "Error"}
                      </p>
                      <p className="text-sm">{testResult.message}</p>
                      {testResult.success && (
                        <p className="text-xs mt-2 opacity-75">
                          Check your inbox (and spam folder) for the test email
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Important Notes */}
          <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Important Notes</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Verify your email:</strong> Make sure your sender email
                  (SES_FROM_EMAIL) is verified in the Amazon SES console
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Sandbox mode:</strong> If your SES account is in sandbox
                  mode, you can only send to verified email addresses
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Production mode:</strong> Request production access in AWS
                  to send emails to any address
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>
                  <strong>Check spam:</strong> Test emails may land in spam folder
                  initially until your domain reputation improves
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
