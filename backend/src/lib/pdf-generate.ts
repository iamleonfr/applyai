import PDFDocument from "pdfkit";

const MARGIN = 72;
const PRIMARY_COLOR = "#1e293b";
const ACCENT_COLOR = "#3b82f6";
const MUTED_COLOR = "#64748b";

/**
 * Generates a professional PDF containing the optimized CV and cover letter.
 * Returns a Buffer with the complete PDF binary.
 */
export function generateApplicationPDF(
  optimizedCV: string,
  coverLetter: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
      info: {
        Title: "ApplyAI – Optimized Application",
        Author: "ApplyAI",
        Subject: "AI-Optimized CV and Cover Letter for German Job Market",
      },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - MARGIN * 2;

    // ── Title header ──────────────────────────────────────────────────────────
    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(26)
      .font("Helvetica-Bold")
      .text("ApplyAI", { align: "center" });

    doc
      .fillColor(MUTED_COLOR)
      .fontSize(10)
      .font("Helvetica")
      .text("AI-Optimized Application · German Job Market", { align: "center" });

    doc.moveDown(1.2);

    // Divider
    doc
      .moveTo(MARGIN, doc.y)
      .lineTo(MARGIN + pageWidth, doc.y)
      .strokeColor(ACCENT_COLOR)
      .lineWidth(2)
      .stroke();

    doc.moveDown(1.5);

    // ── Optimized CV section ──────────────────────────────────────────────────
    drawSectionHeader(doc, "Optimized CV", pageWidth);

    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(10.5)
      .font("Helvetica")
      .text(optimizedCV.trim(), {
        lineGap: 3,
        paragraphGap: 6,
      });

    // ── Cover Letter section (new page) ───────────────────────────────────────
    doc.addPage();

    // Compact page header
    doc
      .fillColor(MUTED_COLOR)
      .fontSize(8)
      .font("Helvetica")
      .text("ApplyAI – Optimized Application", MARGIN, MARGIN - 30, {
        align: "right",
        width: pageWidth,
      });

    doc.y = MARGIN;

    drawSectionHeader(doc, "Cover Letter (Anschreiben)", pageWidth);

    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(10.5)
      .font("Helvetica")
      .text(coverLetter.trim(), {
        lineGap: 3,
        paragraphGap: 6,
      });

    doc.end();
  });
}

function drawSectionHeader(
  doc: InstanceType<typeof PDFDocument>,
  title: string,
  pageWidth: number,
): void {
  doc
    .fillColor(ACCENT_COLOR)
    .fontSize(14)
    .font("Helvetica-Bold")
    .text(title);

  doc.moveDown(0.3);

  doc
    .moveTo(MARGIN, doc.y)
    .lineTo(MARGIN + pageWidth, doc.y)
    .strokeColor("#e2e8f0")
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);
}
