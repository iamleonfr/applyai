import { Router, type IRouter, type Request, type Response } from "express";
import { generateApplicationPDF } from "../lib/pdf-generate";

const router: IRouter = Router();

router.post(
  "/download-pdf",
  async (req: Request, res: Response): Promise<void> => {
    const { optimizedCV, coverLetter } = req.body as {
      optimizedCV?: unknown;
      coverLetter?: unknown;
    };

    if (typeof optimizedCV !== "string" || optimizedCV.trim() === "") {
      res.status(400).json({ error: "optimizedCV is required" });
      return;
    }

    if (typeof coverLetter !== "string" || coverLetter.trim() === "") {
      res.status(400).json({ error: "coverLetter is required" });
      return;
    }

    try {
      const pdf = await generateApplicationPDF(optimizedCV, coverLetter);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="applyai-application.pdf"',
      );
      res.setHeader("Content-Length", pdf.length);
      res.send(pdf);
    } catch (err) {
      req.log.error({ err }, "PDF generation failed");
      res.status(500).json({ error: "Failed to generate PDF. Please try again." });
    }
  },
);

export default router;
