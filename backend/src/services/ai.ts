import OpenAI from "openai";

export interface CVAnalysisResult {
  optimizedCV: string;
  coverLetter: string;
}

const SYSTEM_PROMPT = `You are a professional German CV (Lebenslauf) and cover letter (Anschreiben) expert.

Your output MUST be immediately usable for job applications in Germany.

====================
CV (LEBENSLAUF)
====================
- MUST fit on ONE page (max ~400–600 words)
- MUST follow tabellarischer Lebenslauf format
- NO paragraphs — ONLY structured bullet points
- Use clean section headers:

PERSONAL INFORMATION
Name, Email, Location

WORK EXPERIENCE
Company — Role (Date)
- Bullet point
- Bullet point

EDUCATION
Institution — Degree (Date)
- Bullet point

SKILLS
- Bullet list

RULES:
- Max 2–4 bullet points per role
- Prioritize relevance to the job
- Remove weak or irrelevant content
- Use strong action verbs
- Be concise and scannable

====================
COVER LETTER (ANSCHREIBEN)
====================
- MUST fit on ONE page (max ~250–350 words)
- Formal German business style
- Structure:

[Header placeholder]

Betreff: Application for [Job Title]

Opening (1 short paragraph)
- Who you are + what role

Body (1–2 short paragraphs)
- Why you fit
- Match skills to job

Closing (short)
- Availability + polite ending

RULES:
- No repetition of CV
- Direct and confident tone
- No fluff

====================
GENERAL
====================
- Match language of job description
- Optimize for ATS keywords
- Be concise and impactful
- Do NOT explain anything

====================
OUTPUT FORMAT
====================
Return ONLY valid JSON:

{
  "optimizedCV": "...",
  "coverLetter": "..."
}`;

function buildUserPrompt(cvText: string, jobDescription: string): string {
  const cvSection = cvText.trim()
    ? `=== CANDIDATE CV ===\n${cvText.trim()}`
    : "=== CANDIDATE CV ===\n[No CV provided — generate a professional template structure based on the job description]";

  return `${cvSection}

=== JOB DESCRIPTION ===
${jobDescription.trim()}

=== TASK ===
1. Rewrite the CV into a ONE-PAGE German-style tabellarischer Lebenslauf.
2. Generate a ONE-PAGE professional cover letter.

IMPORTANT:
- CV must be concise, structured, and scannable
- Cover letter must be short and impactful
- Prioritize relevance over completeness
- Do NOT exceed one page for each

Return JSON only:
{
  "optimizedCV": "<CV>",
  "coverLetter": "<LETTER>"
}`;
}

export async function generateCVAndCoverLetter(
  cvText: string,
  jobDescription: string,
): Promise<CVAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // cheaper + fast + good quality
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(cvText, jobDescription) },
    ],
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("OpenAI returned an empty response");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI response was not valid JSON");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).optimizedCV !== "string" ||
    typeof (parsed as Record<string, unknown>).coverLetter !== "string"
  ) {
    throw new Error("OpenAI response did not contain expected fields");
  }

  const result = parsed as CVAnalysisResult;

  return {
    optimizedCV: result.optimizedCV,
    coverLetter: result.coverLetter,
  };
}