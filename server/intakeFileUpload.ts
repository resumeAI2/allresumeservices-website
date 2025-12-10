import { storagePut } from "./storage";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const intakeFileUploadRouter = router({
  /**
   * Upload resume or supporting document for client intake
   */
  uploadFile: publicProcedure
    .input(z.object({
      filename: z.string(),
      contentType: z.string(),
      base64Data: z.string(),
      email: z.string().email(), // To organize files by client
    }))
    .mutation(async ({ input }) => {
      // Decode base64 data
      const buffer = Buffer.from(input.base64Data, 'base64');
      
      // Check file size
      if (buffer.length > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds 10MB limit`);
      }
      
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      
      if (!allowedTypes.includes(input.contentType)) {
        throw new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
      }
      
      // Generate unique file path
      const timestamp = Date.now();
      const sanitizedEmail = input.email.replace(/[^a-zA-Z0-9]/g, '_');
      const sanitizedFilename = input.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const relKey = `client-intake/${sanitizedEmail}/${timestamp}_${sanitizedFilename}`;
      
      // Upload to S3
      const result = await storagePut(relKey, buffer, input.contentType);
      
      return {
        success: true,
        url: result.url,
        key: result.key,
        filename: input.filename,
      };
    }),
});
