import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, FileText, ExternalLink, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminIntakeRecordDetail() {
  const [, params] = useRoute("/admin/intake-records/:id");
  const [, navigate] = useLocation();

  const intakeId = params?.id ? parseInt(params.id) : 0;

  const { data: intake, isLoading, refetch } = trpc.clientIntake.getIntakeById.useQuery(
    { id: intakeId },
    { enabled: intakeId > 0 }
  );

  const [status, setStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");

  const updateStatusMutation = trpc.clientIntake.updateIntakeStatus.useMutation({
    onSuccess: () => {
      toast.success("Intake record has been updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Initialize status and notes when data loads
  if (intake && !status) {
    setStatus(intake.status);
    setAdminNotes(intake.adminNotes || "");
  }

  const handleSaveStatus = async () => {
    await updateStatusMutation.mutateAsync({
      id: intakeId,
      status: status as any,
      adminNotes,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  if (!intake) {
    return (
      <DashboardLayout>
        <div className="text-center p-12">
          <p className="text-gray-500">Intake record not found</p>
          <Button onClick={() => navigate("/admin/intake-records")} className="mt-4">
            Back to List
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/intake-records")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-navy">
                {intake.firstName} {intake.lastName}
              </h1>
              <p className="text-gray-600 mt-1">
                Submitted on {new Date(intake.submittedAt).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <Badge variant={intake.status === "completed" ? "default" : "secondary"}>
              {intake.status}
            </Badge>
          </div>
        </div>

        {/* Status Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Status Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Admin Notes</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Add internal notes about this submission..."
              />
            </div>
            <div>
              <Button
                onClick={handleSaveStatus}
                disabled={updateStatusMutation.isPending}
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Purchased Service</dt>
              <dd className="mt-1">{intake.purchasedService || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">PayPal Transaction ID</dt>
              <dd className="mt-1 font-mono text-sm">{intake.paypalTransactionId || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Order ID</dt>
              <dd className="mt-1">#{intake.orderId || "N/A"}</dd>
            </div>
          </dl>
        </div>

        {/* Personal Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Personal Details</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${intake.email}`} className="text-blue-600 hover:underline">
                  {intake.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Phone</dt>
              <dd className="mt-1">{intake.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Location</dt>
              <dd className="mt-1">{intake.cityState}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Best Contact Time</dt>
              <dd className="mt-1">{intake.bestContactTime || "Not specified"}</dd>
            </div>
          </dl>
        </div>

        {/* Current Employment */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Current Employment</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Employment Status</dt>
              <dd className="mt-1 capitalize">{intake.employmentStatus?.replace(/_/g, ' ') || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Current Job Title</dt>
              <dd className="mt-1">{intake.currentJobTitle || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Current Employer</dt>
              <dd className="mt-1">{intake.currentEmployer || "N/A"}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-600">Role Overview</dt>
              <dd className="mt-1 whitespace-pre-wrap">{intake.currentRoleOverview || "N/A"}</dd>
            </div>
          </dl>
        </div>

        {/* Target Roles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Target Roles & Career Goals</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Target Roles</dt>
              <dd className="mt-1 whitespace-pre-wrap">{intake.targetRoles}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Preferred Industries</dt>
              <dd className="mt-1">{intake.preferredIndustries || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Location Preferences</dt>
              <dd className="mt-1">{intake.locationPreferences || "Not specified"}</dd>
            </div>
            {intake.workArrangements && intake.workArrangements.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Work Arrangements</dt>
                <dd className="mt-1">
                  {intake.workArrangements.map((arr: string, i: number) => (
                    <Badge key={i} variant="outline" className="mr-2">
                      {arr}
                    </Badge>
                  ))}
                </dd>
              </div>
            )}
            {(intake.jobAdLink1 || intake.jobAdLink2 || intake.jobAdLink3) && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Job Advertisement Links</dt>
                <dd className="mt-1 space-y-1">
                  {intake.jobAdLink1 && (
                    <div>
                      <a
                        href={intake.jobAdLink1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        {intake.jobAdLink1}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                  {intake.jobAdLink2 && (
                    <div>
                      <a
                        href={intake.jobAdLink2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        {intake.jobAdLink2}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                  {intake.jobAdLink3 && (
                    <div>
                      <a
                        href={intake.jobAdLink3}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        {intake.jobAdLink3}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Employment History */}
        {intake.employmentHistory && intake.employmentHistory.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Employment History</h2>
            <div className="space-y-6">
              {intake.employmentHistory.map((job: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                  <p className="text-gray-600">{job.employer}</p>
                  <p className="text-sm text-gray-500">
                    {job.startDate} - {job.endDate} • {job.employmentType.replace(/_/g, ' ')}
                    {job.location && ` • ${job.location}`}
                  </p>
                  {job.keyResponsibilities && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Key Responsibilities:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.keyResponsibilities}</p>
                    </div>
                  )}
                  {job.keyAchievements && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Key Achievements:</p>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.keyAchievements}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Education & Training</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Highest Qualification</dt>
              <dd className="mt-1">{intake.highestQualification || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Institution</dt>
              <dd className="mt-1">{intake.institution || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600">Year Completed</dt>
              <dd className="mt-1">{intake.yearCompleted || "Not specified"}</dd>
            </div>
            {intake.additionalQualifications && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Additional Qualifications</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.additionalQualifications}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Licences & Clearances */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Licences, Tickets & Clearances</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-600">Driver's Licence</dt>
              <dd className="mt-1">{intake.driversLicence || "Not specified"}</dd>
            </div>
            {intake.highRiskLicences && (
              <div>
                <dt className="text-sm font-medium text-gray-600">High-Risk Licences</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.highRiskLicences}</dd>
              </div>
            )}
            {intake.siteInductions && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Site Inductions</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.siteInductions}</dd>
              </div>
            )}
            {intake.securityClearances && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Security Clearances</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.securityClearances}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Skills */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Skills & Strengths</h2>
          <dl className="space-y-4">
            {intake.technicalSkills && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Technical Skills</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.technicalSkills}</dd>
              </div>
            )}
            {intake.interpersonalStrengths && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Interpersonal Strengths</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.interpersonalStrengths}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
          <dl className="space-y-4">
            {intake.employmentGaps && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Employment Gaps</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.employmentGaps}</dd>
              </div>
            )}
            {intake.keyAchievements && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Key Achievements</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.keyAchievements}</dd>
              </div>
            )}
            {intake.preferredStyle && (
              <div>
                <dt className="text-sm font-medium text-gray-600">Preferred Style</dt>
                <dd className="mt-1 whitespace-pre-wrap">{intake.preferredStyle}</dd>
              </div>
            )}
            {intake.hearAboutUs && (
              <div>
                <dt className="text-sm font-medium text-gray-600">How They Heard About Us</dt>
                <dd className="mt-1">{intake.hearAboutUs}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* File Uploads */}
        {(intake.resumeFileUrl || (intake.supportingDocsUrls && intake.supportingDocsUrls.length > 0)) && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Uploaded Files</h2>
            <div className="space-y-3">
              {intake.resumeFileUrl && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Resume</span>
                  </div>
                  <a
                    href={intake.resumeFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Download
                  </a>
                </div>
              )}
              {intake.supportingDocsUrls && intake.supportingDocsUrls.length > 0 && (
                <>
                  <p className="text-sm font-medium text-gray-600 mt-4">Supporting Documents:</p>
                  {intake.supportingDocsUrls.map((url: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Document {index + 1}</span>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
