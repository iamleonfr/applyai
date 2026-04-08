import { useState, useRef, useEffect } from "react";
import { useAnalyzeCV } from "@/lib/api-client-react";
import { getApiUrl } from "@/lib/config";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  File,
  ArrowRight,
  Download,
  Loader2,
  Sparkles,
  RotateCcw,
  GraduationCap,
  Globe,
  Shield,
  Lock,
  Zap,
  X,
} from "lucide-react";

const STORAGE_KEY = "applyai_uses";
const FREE_LIMIT = 1;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const mutation = useAnalyzeCV();

  // Scroll to results as soon as they arrive
  useEffect(() => {
    if (mutation.data) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [mutation.data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f?.type === "application/pdf") setFile(f);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type === "application/pdf") setFile(f);
  };

  const handleSubmit = () => {
    if (!jobDescription.trim()) return;
    mutation.mutate({ data: { cv: file ?? undefined, jobDescription } });
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setDownloadError(null);
    mutation.reset();
  };

  const handleDownload = async () => {
    if (!mutation.data) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const apiUrl = getApiUrl();
      console.log('API URL being used:', apiUrl);
      const res = await fetch(`${apiUrl}/api/download-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optimizedCV: mutation.data.optimizedCV,
          coverLetter: mutation.data.coverLetter,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `PDF generation failed: ${res.status} ${errorText || res.statusText}`,
        );
      }
      const blob = await res.blob();
      if (blob.size === 0) {
        throw new Error("Generated PDF is empty");
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "applyai-application.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Could not generate PDF. Please try again.";
      setDownloadError(errorMessage);
      console.error("PDF download failed:", errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  const isProcessing = mutation.isPending;
  const canSubmit = !!jobDescription.trim() && !isProcessing;
  const showForm = !mutation.data;
  const showResults = !!mutation.data;

  return (
    <div className="min-h-screen bg-[#f5f6f8] font-sans">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1a1f36] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-[#1a1f36]">
              ApplyAI
            </span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <GraduationCap className="w-3.5 h-3.5" />
            Built for international students in Germany
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
        {/* ── Form ─────────────────────────────────────────────────── */}
        {showForm && (
          <div className="max-w-2xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 flex-wrap mb-5">
                <div className="inline-flex items-center gap-1.5 bg-[#1a1f36]/5 text-[#1a1f36] text-xs font-medium px-3 py-1.5 rounded-full border border-[#1a1f36]/10">
                  <Sparkles className="w-3 h-3" />
                  AI-powered CV optimization
                </div>
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                  <Globe className="w-3 h-3" />
                  GPT-4o
                </div>
              </div>
              <h1 className="text-[2rem] sm:text-[2.5rem] font-bold tracking-tight text-[#1a1f36] leading-[1.2] mb-4">
                Optimize your CV for jobs
                <br className="hidden sm:block" /> in Germany
              </h1>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                Upload your CV and paste a job description. We'll tailor your
                application to German market standards in seconds.
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-400">
                <GraduationCap className="w-3.5 h-3.5" />
                Built for international students in Germany
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-6">
              {/* Step 1 – Upload */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-sm font-medium text-[#1a1f36]">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1a1f36] text-white text-[10px] font-semibold">
                    1
                  </span>
                  Upload your CV
                  <span className="text-slate-400 font-normal">
                    (PDF · optional)
                  </span>
                </label>

                <div
                  className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 ${
                    isProcessing
                      ? "cursor-not-allowed opacity-50 border-slate-200 bg-slate-50/30"
                      : isDragging
                        ? "cursor-pointer border-blue-400 bg-blue-50/60"
                        : file
                          ? "cursor-pointer border-emerald-300 bg-emerald-50/40"
                          : "cursor-pointer border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                  }`}
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                  onDrop={(e) => !isProcessing && handleDrop(e)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!isProcessing) setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  data-testid="upload-dropzone"
                >
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    data-testid="input-cv"
                  />

                  {file ? (
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1a1f36]">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2 transition-colors"
                        data-testid="button-remove-file"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2.5 text-slate-400">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          Click to upload or drag & drop
                        </p>
                        <p className="text-xs mt-0.5">
                          PDF files only · max 10 MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Step 2 – Job description */}
              <div className="space-y-2.5">
                <label
                  htmlFor="jobDescription"
                  className="flex items-center gap-2 text-sm font-medium text-[#1a1f36]"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#1a1f36] text-white text-[10px] font-semibold">
                    2
                  </span>
                  Paste the job description
                  <span className="text-red-400 text-xs font-normal">
                    required
                  </span>
                </label>
                <textarea
                  id="jobDescription"
                  placeholder="Paste the full job description here — responsibilities, requirements, company info..."
                  className="w-full min-h-45 resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-[#1a1f36] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a1f36]/10 focus:border-slate-300 transition-all leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed disabled:resize-none"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isProcessing}
                  data-testid="input-job-description"
                />
              </div>

              {/* Error */}
              {mutation.isError && (
                <div
                  className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700"
                  data-testid="error-message"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {(mutation.error?.data as { error?: string } | null)
                      ?.error ??
                      mutation.error?.message ??
                      "Something went wrong. Please try again."}
                  </span>
                </div>
              )}

              {/* Submit */}
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full h-12 rounded-xl bg-[#1a1f36] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 hover:bg-[#262d4a] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm"
                  data-testid="button-submit"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      Optimize My Application
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                {isProcessing && (
                  <p
                    className="text-xs text-center text-slate-400 animate-pulse"
                    data-testid="loading-state"
                  >
                    Aligning your experience with German market expectations…
                  </p>
                )}
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-8 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                GDPR-safe processing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                German market standards
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                Free to use
              </span>
            </div>
          </div>
        )}

        {/* ── Results ───────────────────────────────────────────────── */}
        {showResults && (
          <div
            ref={resultsRef}
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            data-testid="results-container"
          >
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <h2 className="text-xl font-bold text-[#1a1f36] tracking-tight">
                  Your Application Documents
                </h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Tailored for the German job market
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {downloadError && (
                  <span className="text-xs text-red-500">{downloadError}</span>
                )}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1a1f36] text-white text-sm font-medium transition-all duration-150 hover:bg-[#262d4a] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  data-testid="button-download-pdf"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium transition-all duration-150 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] shadow-sm"
                  data-testid="button-start-over"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Start over
                </button>
              </div>
            </div>

            {/* Result cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* CV card */}
              <ResultCard
                icon={<File className="w-4 h-4 text-blue-500" />}
                title="Your Optimized CV"
                badge="Lebenslauf"
                content={mutation.data!.optimizedCV}
                testId="result-cv"
              />

              {/* Cover letter card */}
              <ResultCard
                icon={<FileText className="w-4 h-4 text-violet-500" />}
                title="Your Cover Letter"
                badge="Anschreiben"
                content={mutation.data!.coverLetter}
                testId="result-cover-letter"
              />
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-5 h-5 rounded-md bg-[#1a1f36] flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="font-medium text-[#1a1f36]">ApplyAI</span>
            <span>·</span>
            <span>Made for students in Germany 🇩🇪</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Privacy-first
            </span>
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              International students
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Result card sub-component ─────────────────────────────────────────── */
function ResultCard({
  icon,
  title,
  badge,
  content,
  testId,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  content: string;
  testId: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
            {icon}
          </div>
          <span className="text-sm font-semibold text-[#1a1f36]">{title}</span>
        </div>
        <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
          {badge}
        </span>
      </div>
      <div
        className="px-5 py-5 overflow-y-auto max-h-130 min-h-75 scrollbar-thin"
        data-testid={testId}
      >
        <pre className="whitespace-pre-wrap font-sans text-[13.5px] leading-[1.75] text-slate-700">
          {content}
        </pre>
      </div>
    </div>
  );
}
