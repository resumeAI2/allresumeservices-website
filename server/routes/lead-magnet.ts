import { Router } from "express";
import { captureLeadMagnetEmail } from "../leadMagnet";
import { sendLeadMagnetEmail } from "../emailService";

const router = Router();

router.post("/download", async (req, res) => {
  try {
    const { name, email, leadMagnetType } = req.body;

    if (!name || !email || !leadMagnetType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save to database
    await captureLeadMagnetEmail({
      name,
      email,
      downloadedTemplate: leadMagnetType,
      sourcePost: "direct-landing-page",
    });

    // Send email with PDF download link
    const pdfUrl = `${req.protocol}://${req.get("host")}/downloads/ats-resume-mistakes-guide.pdf`;
    await sendLeadMagnetEmail(name, email, pdfUrl);

    res.json({ success: true, message: "Guide sent to your email" });
  } catch (error) {
    console.error("Lead magnet download error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

export default router;
