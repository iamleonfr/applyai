import { createRequire } from "module";
import { pathToFileURL } from "url";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

// Resolve the worker file path for Node.js worker_threads usage.
// createRequire(import.meta.url) resolves relative to the built bundle location.
const _require = createRequire(import.meta.url);
const workerPath = _require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

/**
 * Extracts plain text from a PDF file buffer.
 * Uses pdfjs-dist legacy build (Node.js compatible, no DOM required).
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = new Uint8Array(buffer);

  const loadingTask = getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n");
}
