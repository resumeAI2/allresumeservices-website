import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload, CheckCircle2, Save } from "lucide-react";
import { useAutosave } from "@/hooks/useAutosave";
import { FileUpload } from "@/components/FileUpload";

type EmploymentEntry = {
  jobTitle: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  employmentType: "full_time" | "part_time" | "casual" | "contract";
  keyResponsibilities: string;
  keyAchievements: string;
};

type FormData = {
  // Section 1: Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cityState: string;
  bestContactTime: string;
  
  // Section 3: Current Situation
  employmentStatus: string;
  currentJobTitle: string;
  currentEmployer: string;
  currentRoleOverview: string;
  
  // Section 4: Target Roles
  targetRoles: string;
  preferredIndustries: string;
  locationPreferences: string;
  workArrangements: string[];
  jobAdLink1: string;
  jobAdLink2: string;
  jobAdLink3: string;
  
  // Section 5: Employment History
  employmentHistory: EmploymentEntry[];
  
  // Section 6: Education
  highestQualification: string;
  institution: string;
  yearCompleted: string;
  additionalQualifications: string;
  
  // Section 7: Licences
  driversLicence: string;
  highRiskLicences: string;
  siteInductions: string;
  securityClearances: string;
  
  // Section 8: Skills
  technicalSkills: string;
  interpersonalStrengths: string;
  
  // Section 9: Additional Info
  employmentGaps: string;
  keyAchievements: string;
  preferredStyle: string;
  hearAboutUs: string;
  
  // Section 10: File Uploads
  resumeFile?: { url: string; filename: string };
  supportingDocs: Array<{ url: string; filename: string }>;
};

export default function ThankYouOnboarding() {
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [paypalTransactionId, setPaypalTransactionId] = useState<string>("");
  const [orderId, setOrderId] = useState<number | undefined>();
  const [purchasedService, setPurchasedService] = useState<string>("");
  const [resumeToken, setResumeToken] = useState<string | undefined>();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cityState: "",
    bestContactTime: "",
    employmentStatus: "",
    currentJobTitle: "",
    currentEmployer: "",
    currentRoleOverview: "",
    targetRoles: "",
    preferredIndustries: "",
    locationPreferences: "",
    workArrangements: [],
    jobAdLink1: "",
    jobAdLink2: "",
    jobAdLink3: "",
    employmentHistory: [{
      jobTitle: "",
      employer: "",
      location: "",
      startDate: "",
      endDate: "",
      employmentType: "full_time",
      keyResponsibilities: "",
      keyAchievements: "",
    }],
    highestQualification: "",
    institution: "",
    yearCompleted: "",
    additionalQualifications: "",
    driversLicence: "",
    highRiskLicences: "",
    siteInductions: "",
    securityClearances: "",
    technicalSkills: "",
    interpersonalStrengths: "",
    employmentGaps: "",
    keyAchievements: "",
    preferredStyle: "",
    hearAboutUs: "",
    resumeFile: undefined,
    supportingDocs: [],
  });

  const submitIntakeMutation = trpc.clientIntake.submitIntake.useMutation();
  const completeDraftMutation = trpc.clientIntake.completeDraft.useMutation();
  const { data: draftData } = trpc.clientIntake.getDraftByToken.useQuery(
    { token: resumeToken || "" },
    { enabled: !!resumeToken }
  );

  // Extract PayPal transaction ID and resume token from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("paypal_transaction_id") || params.get("token");
    const orderIdParam = params.get("order_id");
    const service = params.get("service");
    const token = params.get("resume_token");
    
    if (transactionId) {
      setPaypalTransactionId(transactionId);
    }
    if (orderIdParam) {
      setOrderId(parseInt(orderIdParam));
    }
    if (service) {
      setPurchasedService(service);
    }
    if (token) {
      setResumeToken(token);
    }
  }, []);
  
  // Restore draft data when loaded
  useEffect(() => {
    if (draftData?.formData) {
      setFormData(draftData.formData);
      if (draftData.paypalTransactionId) {
        setPaypalTransactionId(draftData.paypalTransactionId);
      }
    }
  }, [draftData]);
  
  // Enable autosave once email is entered
  const { isSaving } = useAutosave(
    formData,
    formData.email,
    paypalTransactionId,
    formData.email.length > 0 && !isSubmitted
  );

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEmploymentEntry = () => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: [
        ...prev.employmentHistory,
        {
          jobTitle: "",
          employer: "",
          location: "",
          startDate: "",
          endDate: "",
          employmentType: "full_time",
          keyResponsibilities: "",
          keyAchievements: "",
        },
      ],
    }));
  };

  const removeEmploymentEntry = (index: number) => {
    if (formData.employmentHistory.length > 1) {
      setFormData(prev => ({
        ...prev,
        employmentHistory: prev.employmentHistory.filter((_, i) => i !== index),
      }));
    }
  };

  const updateEmploymentEntry = (index: number, field: keyof EmploymentEntry, value: string) => {
    setFormData(prev => ({
      ...prev,
      employmentHistory: prev.employmentHistory.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const toggleWorkArrangement = (arrangement: string) => {
    setFormData(prev => ({
      ...prev,
      workArrangements: prev.workArrangements.includes(arrangement)
        ? prev.workArrangements.filter(a => a !== arrangement)
        : [...prev.workArrangements, arrangement],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.cityState) {
      toast.error("Please fill in all required personal details.");
      return;
    }

    if (!formData.employmentStatus) {
      toast.error("Please select your employment status.");
      return;
    }

    if (!formData.targetRoles) {
      toast.error("Please specify your target roles.");
      return;
    }

    if (formData.employmentHistory.length === 0 || !formData.employmentHistory[0].jobTitle) {
      toast.error("Please add at least one employment entry.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitIntakeMutation.mutateAsync({
        orderId,
        paypalTransactionId,
        purchasedService,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        cityState: formData.cityState,
        bestContactTime: formData.bestContactTime,
        employmentStatus: formData.employmentStatus as any,
        currentJobTitle: formData.currentJobTitle,
        currentEmployer: formData.currentEmployer,
        currentRoleOverview: formData.currentRoleOverview,
        targetRoles: formData.targetRoles,
        preferredIndustries: formData.preferredIndustries,
        locationPreferences: formData.locationPreferences,
        workArrangements: formData.workArrangements,
        jobAdLink1: formData.jobAdLink1,
        jobAdLink2: formData.jobAdLink2,
        jobAdLink3: formData.jobAdLink3,
        employmentHistory: formData.employmentHistory,
        highestQualification: formData.highestQualification,
        institution: formData.institution,
        yearCompleted: formData.yearCompleted,
        additionalQualifications: formData.additionalQualifications,
        driversLicence: formData.driversLicence,
        highRiskLicences: formData.highRiskLicences,
        siteInductions: formData.siteInductions,
        securityClearances: formData.securityClearances,
        technicalSkills: formData.technicalSkills,
        interpersonalStrengths: formData.interpersonalStrengths,
        employmentGaps: formData.employmentGaps,
        keyAchievements: formData.keyAchievements,
        preferredStyle: formData.preferredStyle,
        hearAboutUs: formData.hearAboutUs,
        resumeFileUrl: formData.resumeFile?.url,
        supportingDocsUrls: formData.supportingDocs.map(doc => doc.url).filter(Boolean),
      });
      
      // Mark draft as completed
      if (formData.email) {
        await completeDraftMutation.mutateAsync({ email: formData.email });
      }

      setIsSubmitted(true);
      
      toast.success("Thank you! Your information has been submitted successfully.");

      // Scroll to top to show confirmation message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 py-16">
          <div className="container max-w-3xl">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle2 className="w-20 h-20 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-navy mb-4">Thank You</h1>
              <p className="text-lg text-gray-700 mb-4">
                Your information has been received.
              </p>
              <p className="text-gray-600 mb-4">
                We have everything required to commence the process. A confirmation email has been sent to your inbox for your records.
              </p>
              <p className="text-gray-600 mb-8">
                If any clarification is needed, we will contact you directly. Otherwise, work will proceed within the advertised turnaround timeframe.
              </p>
              <Button onClick={() => navigate("/")} size="lg">
                Return to Homepage
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-navy">
                Thank you for your order
              </h1>
              {isSaving && (
                <div className="flex items-center text-sm text-gray-600">
                  <Save className="w-4 h-4 mr-2 animate-pulse" />
                  Saving...
                </div>
              )}
            </div>
            
            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700">
                Thank you for choosing All Résumé Services. Your payment has been successfully processed.
              </p>
              <p className="text-gray-700">
                To ensure your résumé and supporting documents are tailored accurately to your experience and the roles you are seeking, please provide the information requested below. This will allow us to commence the process without delay.
              </p>
              <p className="text-gray-700">
                Completing this form typically takes 5 to 10 minutes.
              </p>
              <p className="text-sm text-gray-600 italic">
                All information provided is confidential and used solely for the preparation of your professional documents.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Section 1: Personal Details */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile/Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="cityState">City/Suburb and State *</Label>
                    <Input
                      id="cityState"
                      value={formData.cityState}
                      onChange={(e) => updateField("cityState", e.target.value)}
                      placeholder="e.g., Perth, WA"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bestContactTime">Preferred Contact Method or Time</Label>
                    <Input
                      id="bestContactTime"
                      value={formData.bestContactTime}
                      onChange={(e) => updateField("bestContactTime", e.target.value)}
                      placeholder="e.g., Email preferred, or call after 5pm"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Current Employment */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Current Employment</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="employmentStatus">Employment Status *</Label>
                    <Select value={formData.employmentStatus} onValueChange={(value) => updateField("employmentStatus", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed_full_time">Employed Full Time</SelectItem>
                        <SelectItem value="employed_part_time">Employed Part Time</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="contractor">Contractor</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currentJobTitle">Current Job Title</Label>
                    <Input
                      id="currentJobTitle"
                      value={formData.currentJobTitle}
                      onChange={(e) => updateField("currentJobTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentEmployer">Current Employer</Label>
                    <Input
                      id="currentEmployer"
                      value={formData.currentEmployer}
                      onChange={(e) => updateField("currentEmployer", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentRoleOverview">Overview of Current Role and Responsibilities</Label>
                    <Textarea
                      id="currentRoleOverview"
                      value={formData.currentRoleOverview}
                      onChange={(e) => updateField("currentRoleOverview", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </section>

              {/* Section 4: Target Roles */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Target Roles and Career Direction</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="targetRoles">Target Role(s) and Job Titles *</Label>
                    <Textarea
                      id="targetRoles"
                      value={formData.targetRoles}
                      onChange={(e) => updateField("targetRoles", e.target.value)}
                      rows={3}
                      placeholder="e.g., Operations Manager, Project Coordinator"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredIndustries">Industry Preferences</Label>
                    <Input
                      id="preferredIndustries"
                      value={formData.preferredIndustries}
                      onChange={(e) => updateField("preferredIndustries", e.target.value)}
                      placeholder="e.g., Mining, Healthcare, IT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationPreferences">Location Preferences</Label>
                    <Input
                      id="locationPreferences"
                      value={formData.locationPreferences}
                      onChange={(e) => updateField("locationPreferences", e.target.value)}
                      placeholder="e.g., Perth metro, willing to relocate to Brisbane"
                    />
                  </div>
                  <div>
                    <Label className="mb-3 block">Work Arrangements</Label>
                    <div className="space-y-2">
                      {["FIFO", "DIDO", "Shift Work", "Remote Work"].map((arrangement) => (
                        <div key={arrangement} className="flex items-center space-x-2">
                          <Checkbox
                            id={arrangement}
                            checked={formData.workArrangements.includes(arrangement)}
                            onCheckedChange={() => toggleWorkArrangement(arrangement)}
                          />
                          <label htmlFor={arrangement} className="text-sm cursor-pointer">
                            {arrangement}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Job Advertisement Links</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      For best results, please include links to any job advertisements you are targeting.
                    </p>
                    <div className="space-y-3">
                      <Input
                        placeholder="Job Ad Link 1"
                        value={formData.jobAdLink1}
                        onChange={(e) => updateField("jobAdLink1", e.target.value)}
                        type="url"
                      />
                      <Input
                        placeholder="Job Ad Link 2"
                        value={formData.jobAdLink2}
                        onChange={(e) => updateField("jobAdLink2", e.target.value)}
                        type="url"
                      />
                      <Input
                        placeholder="Job Ad Link 3"
                        value={formData.jobAdLink3}
                        onChange={(e) => updateField("jobAdLink3", e.target.value)}
                        type="url"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Employment History */}
              <section className="border-t pt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-navy">Employment History</h2>
                  <Button type="button" onClick={addEmploymentEntry} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Job
                  </Button>
                </div>
                
                {formData.employmentHistory.map((entry, index) => (
                  <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg relative">
                    {formData.employmentHistory.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeEmploymentEntry(index)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <h3 className="font-semibold text-lg mb-4">Job {index + 1}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title *</Label>
                        <Input
                          value={entry.jobTitle}
                          onChange={(e) => updateEmploymentEntry(index, "jobTitle", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Employer *</Label>
                        <Input
                          value={entry.employer}
                          onChange={(e) => updateEmploymentEntry(index, "employer", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={entry.location}
                          onChange={(e) => updateEmploymentEntry(index, "location", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Employment Type *</Label>
                        <Select
                          value={entry.employmentType}
                          onValueChange={(value: any) => updateEmploymentEntry(index, "employmentType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full_time">Full Time</SelectItem>
                            <SelectItem value="part_time">Part Time</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Start Date (MM/YYYY) *</Label>
                        <Input
                          value={entry.startDate}
                          onChange={(e) => updateEmploymentEntry(index, "startDate", e.target.value)}
                          placeholder="e.g., 01/2020"
                          required
                        />
                      </div>
                      <div>
                        <Label>End Date (MM/YYYY or Current) *</Label>
                        <Input
                          value={entry.endDate}
                          onChange={(e) => updateEmploymentEntry(index, "endDate", e.target.value)}
                          placeholder="e.g., 12/2023 or Current"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Key Responsibilities</Label>
                        <Textarea
                          value={entry.keyResponsibilities}
                          onChange={(e) => updateEmploymentEntry(index, "keyResponsibilities", e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Key Achievements</Label>
                        <Textarea
                          value={entry.keyAchievements}
                          onChange={(e) => updateEmploymentEntry(index, "keyAchievements", e.target.value)}
                          rows={3}
                          placeholder="Focus on measurable results or key wins"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* Section 6: Education */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Education and Training</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="highestQualification">Highest Qualification</Label>
                    <Input
                      id="highestQualification"
                      value={formData.highestQualification}
                      onChange={(e) => updateField("highestQualification", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => updateField("institution", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearCompleted">Year Completed</Label>
                    <Input
                      id="yearCompleted"
                      value={formData.yearCompleted}
                      onChange={(e) => updateField("yearCompleted", e.target.value)}
                      placeholder="e.g., 2018"
                    />
                  </div>
                  <div>
                    <Label htmlFor="additionalQualifications">Additional Training and Certifications</Label>
                    <Textarea
                      id="additionalQualifications"
                      value={formData.additionalQualifications}
                      onChange={(e) => updateField("additionalQualifications", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </section>

              {/* Section 7: Licences */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Licences, Tickets, and Clearances</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="driversLicence">Driver's Licence</Label>
                    <Input
                      id="driversLicence"
                      value={formData.driversLicence}
                      onChange={(e) => updateField("driversLicence", e.target.value)}
                      placeholder="e.g., C Class, HR, HC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="highRiskLicences">High-Risk Licences or Tickets</Label>
                    <Textarea
                      id="highRiskLicences"
                      value={formData.highRiskLicences}
                      onChange={(e) => updateField("highRiskLicences", e.target.value)}
                      rows={3}
                      placeholder="e.g., Forklift, Dogging, Scaffolding, EWP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteInductions">Site Inductions</Label>
                    <Textarea
                      id="siteInductions"
                      value={formData.siteInductions}
                      onChange={(e) => updateField("siteInductions", e.target.value)}
                      rows={3}
                      placeholder="e.g., BHP, Rio Tinto, FMG"
                    />
                  </div>
                  <div>
                    <Label htmlFor="securityClearances">Security or Background Checks</Label>
                    <Textarea
                      id="securityClearances"
                      value={formData.securityClearances}
                      onChange={(e) => updateField("securityClearances", e.target.value)}
                      rows={3}
                      placeholder="e.g., Working with Children Check, Police Clearance"
                    />
                  </div>
                </div>
              </section>

              {/* Section 8: Skills */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Skills and Strengths</h2>
                <p className="text-sm text-gray-600 mb-4">
                  List the skills and strengths you would like highlighted in your résumé and cover letter.
                </p>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="technicalSkills">Technical Skills</Label>
                    <Textarea
                      id="technicalSkills"
                      value={formData.technicalSkills}
                      onChange={(e) => updateField("technicalSkills", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interpersonalStrengths">Interpersonal or Leadership Strengths</Label>
                    <Textarea
                      id="interpersonalStrengths"
                      value={formData.interpersonalStrengths}
                      onChange={(e) => updateField("interpersonalStrengths", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </section>

              {/* Section 9: Additional Information */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-navy mb-6">Additional Information</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="employmentGaps">Employment Gaps to Explain</Label>
                    <Textarea
                      id="employmentGaps"
                      value={formData.employmentGaps}
                      onChange={(e) => updateField("employmentGaps", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyAchievements">Achievements, Projects, or KPIs</Label>
                    <Textarea
                      id="keyAchievements"
                      value={formData.keyAchievements}
                      onChange={(e) => updateField("keyAchievements", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredStyle">Preferred Focus or Style</Label>
                    <Textarea
                      id="preferredStyle"
                      value={formData.preferredStyle}
                      onChange={(e) => updateField("preferredStyle", e.target.value)}
                      rows={3}
                      placeholder="e.g., Focus on management, highlight safety, emphasise customer service"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hearAboutUs">How did you hear about us?</Label>
                    <Input
                      id="hearAboutUs"
                      value={formData.hearAboutUs}
                      onChange={(e) => updateField("hearAboutUs", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Section 10: File Uploads */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-navy mb-6">File Uploads</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Please upload your current résumé and any supporting documents that may assist in preparing your new documents.
                </p>
                <div className="space-y-6">
                  <FileUpload
                    email={formData.email}
                    label="Upload Resume (PDF, DOC, DOCX)"
                    currentFile={formData.resumeFile}
                    onFileUploaded={(url, filename) => {
                      setFormData(prev => ({
                        ...prev,
                        resumeFile: { url, filename },
                      }));
                    }}
                    onFileRemoved={() => {
                      setFormData(prev => ({
                        ...prev,
                        resumeFile: undefined,
                      }));
                    }}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Supporting Documents (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      You may upload additional documents such as position descriptions, performance reviews, or certificates.
                    </p>
                    
                    {formData.supportingDocs.map((doc, index) => (
                      <div key={index} className="mb-3">
                        <FileUpload
                          email={formData.email}
                          label={`Document ${index + 1}`}
                          currentFile={doc}
                          onFileUploaded={(url, filename) => {
                            setFormData(prev => ({
                              ...prev,
                              supportingDocs: prev.supportingDocs.map((d, i) =>
                                i === index ? { url, filename } : d
                              ),
                            }));
                          }}
                          onFileRemoved={() => {
                            setFormData(prev => ({
                              ...prev,
                              supportingDocs: prev.supportingDocs.filter((_, i) => i !== index),
                            }));
                          }}
                        />
                      </div>
                    ))}
                    
                    {formData.supportingDocs.length < 5 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            supportingDocs: [...prev.supportingDocs, { url: "", filename: "" }],
                          }));
                        }}
                        disabled={!formData.email}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Supporting Document
                      </Button>
                    )}
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="border-t pt-8">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto px-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Information"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
