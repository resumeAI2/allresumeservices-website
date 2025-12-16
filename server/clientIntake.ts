import { z } from "zod";
import { getDb } from "./db";
import { client_intake_records, employment_history, draft_intake_records } from "../drizzle/schema";
import { publicProcedure, router } from "./_core/trpc";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";
import { sendClientConfirmationEmail, sendAdminNotificationEmail } from "./intakeEmails";

// Validation schema for employment history entry (all fields optional now)
const employmentHistorySchema = z.object({
  jobTitle: z.string().optional().default(""),
  employer: z.string().optional().default(""),
  location: z.string().optional(),
  startDate: z.string().optional().default(""),
  endDate: z.string().optional().default(""),
  employmentType: z.enum(["full_time", "part_time", "casual", "contract"]).optional(),
  keyResponsibilities: z.string().optional(),
  keyAchievements: z.string().optional(),
});

// Validation schema for referee entry
const refereeSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
});

// Validation schema for client intake form
// Only identity fields (firstName, lastName, email, phone) are required
const clientIntakeSchema = z.object({
  // Link to order
  orderId: z.number().optional(),
  paypalTransactionId: z.string().optional(),
  purchasedService: z.string().optional(),
  
  // Section 1: Personal Details (REQUIRED: name, email, phone)
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  cityState: z.string().optional(), // Now optional
  bestContactTime: z.string().optional(),
  
  // Section 2: LinkedIn Profile (NEW)
  linkedinUrl: z.string().optional(),
  
  // Section 3: Current Situation (all optional)
  employmentStatus: z.enum([
    "employed_full_time",
    "employed_part_time",
    "casual",
    "contractor",
    "unemployed",
    "student",
    "other"
  ]).optional(),
  currentJobTitle: z.string().optional(),
  currentEmployer: z.string().optional(),
  currentRoleOverview: z.string().optional(),
  
  // Section 4: Target Roles (all optional)
  targetRoles: z.string().optional(),
  preferredIndustries: z.string().optional(),
  locationPreferences: z.string().optional(),
  workArrangements: z.array(z.string()).optional(),
  jobAdLink1: z.string().url().optional().or(z.literal("")),
  jobAdLink2: z.string().url().optional().or(z.literal("")),
  jobAdLink3: z.string().url().optional().or(z.literal("")),
  
  // Section 5: Employment History (optional)
  employmentHistory: z.array(employmentHistorySchema).optional(),
  
  // Section 6: Education (all optional)
  highestQualification: z.string().optional(),
  institution: z.string().optional(),
  yearCompleted: z.string().optional(),
  additionalQualifications: z.string().optional(),
  
  // Section 7: Licences (all optional)
  driversLicence: z.string().optional(),
  highRiskLicences: z.string().optional(),
  siteInductions: z.string().optional(),
  securityClearances: z.string().optional(),
  
  // Section 8: Skills (all optional)
  technicalSkills: z.string().optional(),
  interpersonalStrengths: z.string().optional(),
  languageSkills: z.string().optional(), // NEW
  
  // Section 8.1: Professional Development (NEW - all optional)
  shortCoursesTraining: z.string().optional(),
  professionalMemberships: z.string().optional(),
  volunteerWork: z.string().optional(),
  awardsRecognition: z.string().optional(),
  publications: z.string().optional(),
  
  // Section 9: Additional Info (all optional)
  employmentGaps: z.string().optional(),
  keyAchievements: z.string().optional(),
  preferredStyle: z.string().optional(),
  hearAboutUs: z.string().optional(),
  
  // Section 10: Referees (NEW - optional)
  referees: z.array(refereeSchema).optional(),
  
  // File uploads (all optional)
  resumeFileUrl: z.string().optional(),
  supportingDocsUrls: z.array(z.string()).optional(),
});

export const clientIntakeRouter = router({
  /**
   * Submit client intake form
   */
  submitIntake: publicProcedure
    .input(clientIntakeSchema)
    .mutation(async ({ input }) => {
      // Extract employment history and referees from input
      const { employmentHistory: jobs, workArrangements, supportingDocsUrls, referees, ...intakeData } = input;
      
      // Convert arrays to JSON strings for storage
      const workArrangementsJson = workArrangements ? JSON.stringify(workArrangements) : null;
      const supportingDocsJson = supportingDocsUrls ? JSON.stringify(supportingDocsUrls) : null;
      const refereesJson = referees ? JSON.stringify(referees) : null;
      
      // Insert main intake record
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [intakeRecord] = await db.insert(client_intake_records).values({
        ...intakeData,
        workArrangements: workArrangementsJson,
        supportingDocsUrls: supportingDocsJson,
        referees: refereesJson,
      });
      
      const intakeRecordId = intakeRecord.insertId;
      
      // Insert employment history entries
      if (jobs && jobs.length > 0) {
        const employmentEntries = jobs.map((job, index) => ({
          intakeRecordId: intakeRecordId,
          jobTitle: job.jobTitle || "",
          employer: job.employer || "",
          location: job.location,
          startDate: job.startDate || "",
          endDate: job.endDate || "",
          employmentType: job.employmentType || "full_time",
          keyResponsibilities: job.keyResponsibilities,
          keyAchievements: job.keyAchievements,
          sortOrder: index,
        }));
        
        await db.insert(employment_history).values(employmentEntries);
      }
      
      // Send confirmation email to client
      try {
        await sendClientConfirmationEmail(
          input.email,
          `${input.firstName} ${input.lastName}`,
          input.purchasedService
        );
      } catch (error) {
        console.error("Failed to send client confirmation email:", error);
      }
      
      // Send notification email to admin
      try {
        await sendAdminNotificationEmail(
          `${input.firstName} ${input.lastName}`,
          input.email,
          input.purchasedService,
          input.paypalTransactionId,
          intakeRecordId
        );
      } catch (error) {
        console.error("Failed to send admin notification email:", error);
      }
      
      return {
        success: true,
        intakeRecordId,
        message: "Thank you! Your information has been submitted successfully.",
      };
    }),
  
  /**
   * Get all intake records (admin)
   */
  getAllIntakes: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const intakes = await db
      .select()
      .from(client_intake_records)
      .orderBy(desc(client_intake_records.submittedAt));
    
    return intakes;
  }),
  
  /**
   * Get single intake record with employment history (admin)
   */
  getIntakeById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [intake] = await db
        .select()
        .from(client_intake_records)
        .where(eq(client_intake_records.id, input.id));
      
      if (!intake) {
        throw new Error("Intake record not found");
      }
      
      const jobs = await db
        .select()
        .from(employment_history)
        .where(eq(employment_history.intakeRecordId, input.id))
        .orderBy(employment_history.sortOrder);
      
      return {
        ...intake,
        employmentHistory: jobs,
        workArrangements: intake.workArrangements ? JSON.parse(intake.workArrangements) : [],
        supportingDocsUrls: intake.supportingDocsUrls ? JSON.parse(intake.supportingDocsUrls) : [],
      };
    }),
  
  /**
   * Update intake status (admin)
   */
  updateIntakeStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "in_progress", "completed"]),
      adminNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .update(client_intake_records)
        .set({
          status: input.status,
          adminNotes: input.adminNotes,
        })
        .where(eq(client_intake_records.id, input.id));
      
      return { success: true };
    }),
  
  /**
   * Get intake by PayPal transaction ID
   */
  getIntakeByTransaction: publicProcedure
    .input(z.object({ transactionId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [intake] = await db
        .select()
        .from(client_intake_records)
        .where(eq(client_intake_records.paypalTransactionId, input.transactionId));
      
      return intake || null;
    }),
  
  /**
   * Save draft (autosave)
   */
  saveDraft: publicProcedure
    .input(z.object({
      email: z.string().email(),
      paypalTransactionId: z.string().optional(),
      formData: z.any(), // JSON object of form data
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Check if draft already exists
      const existing = await db
        .select()
        .from(draft_intake_records)
        .where(eq(draft_intake_records.email, input.email))
        .limit(1);
      
      const formDataJson = JSON.stringify(input.formData);
      
      if (existing.length > 0) {
        // Update existing draft
        await db
          .update(draft_intake_records)
          .set({
            formData: formDataJson,
            paypalTransactionId: input.paypalTransactionId,
          })
          .where(eq(draft_intake_records.email, input.email));
        
        return { success: true, resumeToken: existing[0].resumeToken };
      } else {
        // Create new draft with unique token
        const resumeToken = crypto.randomBytes(32).toString('hex');
        
        await db.insert(draft_intake_records).values({
          email: input.email,
          paypalTransactionId: input.paypalTransactionId,
          formData: formDataJson,
          resumeToken,
          completed: 0,
          reminderSent: 0,
        });
        
        return { success: true, resumeToken };
      }
    }),
  
  /**
   * Get draft by token (resume-later)
   */
  getDraftByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [draft] = await db
        .select()
        .from(draft_intake_records)
        .where(eq(draft_intake_records.resumeToken, input.token));
      
      if (!draft) {
        return null;
      }
      
      return {
        email: draft.email,
        paypalTransactionId: draft.paypalTransactionId,
        formData: JSON.parse(draft.formData),
      };
    }),
  
  /**
   * Mark draft as completed
   */
  completeDraft: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .update(draft_intake_records)
        .set({ completed: 1 })
        .where(eq(draft_intake_records.email, input.email));
      
      return { success: true };
    }),
  
  /**
   * Get incomplete drafts (for sending reminders)
   */
  getIncompleteDrafts: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const drafts = await db
      .select()
      .from(draft_intake_records)
      .where(eq(draft_intake_records.completed, 0));
    
    return drafts;
  }),
  
  /**
   * Request resume-later email with link to continue form
   */
  requestResumeLater: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string(),
      paypalTransactionId: z.string().optional(),
      formData: z.any(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // First save the draft
      const existing = await db
        .select()
        .from(draft_intake_records)
        .where(eq(draft_intake_records.email, input.email))
        .limit(1);
      
      const formDataJson = JSON.stringify(input.formData);
      let resumeToken: string;
      
      if (existing.length > 0) {
        // Update existing draft
        await db
          .update(draft_intake_records)
          .set({
            formData: formDataJson,
            paypalTransactionId: input.paypalTransactionId,
          })
          .where(eq(draft_intake_records.email, input.email));
        
        resumeToken = existing[0].resumeToken || crypto.randomBytes(32).toString('hex');
      } else {
        // Create new draft with unique token
        resumeToken = crypto.randomBytes(32).toString('hex');
        
        await db.insert(draft_intake_records).values({
          email: input.email,
          paypalTransactionId: input.paypalTransactionId,
          formData: formDataJson,
          resumeToken,
          completed: 0,
          reminderSent: 0,
        });
      }
      
      // Send resume-later email
      try {
        const { sendResumeLaterEmail } = await import('./intakeEmails');
        await sendResumeLaterEmail(input.email, input.name, resumeToken);
        return { success: true, resumeToken };
      } catch (error) {
        console.error("Failed to send resume-later email:", error);
        throw new Error("Failed to send email. Please try again.");
      }
    }),
});

