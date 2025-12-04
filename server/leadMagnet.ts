import { leadMagnetService } from "./services/leadMagnetService";

export interface LeadMagnetInput {
  name: string;
  email: string;
  downloadedTemplate: string;
  sourcePost?: string;
}

export async function captureLeadMagnetEmail(input: LeadMagnetInput) {
  // Validate input
  if (!input.name || !input.email || !input.downloadedTemplate) {
    throw new Error("Name, email, and template name are required");
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    throw new Error("Invalid email address");
  }

  // Save to database
  await leadMagnetService.createSubscriber({
    name: input.name,
    email: input.email,
    downloadedTemplate: input.downloadedTemplate,
    sourcePost: input.sourcePost || null,
    createdAt: new Date(),
  });

  return {
    success: true,
    message: "Thank you! Check your email for the download link.",
  };
}

export async function getAllLeadMagnetSubscribers() {
  return await leadMagnetService.getAllSubscribers();
}
