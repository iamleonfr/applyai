import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { extractTextFromPDF } from "../lib/pdf-extract";
import { generateCVAndCoverLetter } from "../services/ai";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter(_req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

router.post(
  "/analyze",
  upload.single("cv"),
  async (req: Request, res: Response): Promise<void> => {
    const jobDescription = req.body?.jobDescription;

    if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim() === "") {
      res.status(400).json({ error: "jobDescription is required" });
      return;
    }

    let cvText = "";

    if (req.file) {
      try {
        cvText = await extractTextFromPDF(req.file.buffer);
      } catch (err) {
        req.log.error({ err }, "Failed to parse PDF");
        res.status(400).json({ error: "Could not read the uploaded PDF. Please ensure it is a valid PDF file." });
        return;
      }
    }

    try {
      const result = await generateCVAndCoverLetter(cvText, jobDescription);
      res.json(result);
    } catch (err) {
      req.log.error({ err }, "AI service error");
      const e = err as { code?: string; status?: number };
      if (e.code === "insufficient_quota" || e.status === 429) {
        res.status(503).json({ error: "OpenAI quota exceeded. Please add billing credits to your OpenAI account at platform.openai.com/settings/billing and try again." });
      } else if (e.code === "invalid_api_key" || e.status === 401) {
        res.status(503).json({ error: "Invalid OpenAI API key. Please check the OPENAI_API_KEY environment variable." });
      } else {
        res.status(500).json({ error: "Failed to generate optimized CV. Please try again." });
      }
    }
  },
);

export default router;
