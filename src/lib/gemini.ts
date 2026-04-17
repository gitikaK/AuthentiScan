import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { fileToGenerativePart } from "./file-utils";

export interface RedFlag {
  category:
    | "urgency"
    | "fake_domain"
    | "requested_fee"
    | "grammar"
    | "impersonation"
    | "suspicious_contact"
    | "unrealistic_offer"
    | "other";
  severity: "low" | "medium" | "high" | "critical";
  evidence: string;
  explanation: string;
}

export interface ForensicReport {
  verdict: "legitimate" | "suspicious" | "fraudulent";
  confidence: number; // 0-100
  summary: string;
  company_claimed: string | null;
  domains_found: string[];
  red_flags: RedFlag[];
  recommended_actions: string[];
}

const SYSTEM_PROMPT = `You are a senior Cyber-Forensic Analyst specialising in
employment-fraud and placement-scam detection for university students in India
and worldwide. You will be shown an uploaded artefact (offer letter PDF,
recruiter email screenshot, WhatsApp chat, or job posting image).

Analyse it like a forensic investigator. Look for:
- Urgency / pressure language ("respond in 24 hours", "limited seats")
- Requests for any kind of payment (registration, training, laptop deposit, GST)
- Mismatched, lookalike, or free-mail domains pretending to be a real company
- Grammar / formatting inconsistencies vs a real corporate template
- Impersonation of well-known recruiters or HR brands
- Suspicious contact channels (personal Gmail, random WhatsApp numbers)
- Unrealistic compensation for the role / experience level
- Generic greetings, missing JD, missing official seal/signature

Return ONLY valid JSON matching this exact schema (no markdown fences):

{
  "verdict": "legitimate" | "suspicious" | "fraudulent",
  "confidence": <integer 0-100, your confidence in the verdict>,
  "summary": "<1-2 sentence executive summary>",
  "company_claimed": "<company name shown in the document, or null>",
  "domains_found": ["<every email/url domain you can read>"],
  "red_flags": [
    {
      "category": "urgency" | "fake_domain" | "requested_fee" | "grammar" | "impersonation" | "suspicious_contact" | "unrealistic_offer" | "other",
      "severity": "low" | "medium" | "high" | "critical",
      "evidence": "<exact quote or specific element from the document>",
      "explanation": "<why this is suspicious, plain English>"
    }
  ],
  "recommended_actions": ["<actionable next step for the student>"]
}`;

function getClient(): GoogleGenerativeAI {
  const key = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!key) {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY. Copy .env.example to .env and add your Gemini API key."
    );
  }
  return new GoogleGenerativeAI(key);
}

function stripJsonFences(text: string): string {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  // Pull out the first {...} block as a safety net.
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first >= 0 && last > first) {
    t = t.slice(first, last + 1);
  }
  return t;
}

export async function analyzeOfferLetter(
  file: File,
  userNote?: string
): Promise<ForensicReport> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const filePart = await fileToGenerativePart(file);

  const userText = userNote?.trim()
    ? `Additional context from the student: "${userNote.trim()}"`
    : "Analyse the attached artefact and return the JSON forensic report.";

  const parts: Part[] = [
    { text: SYSTEM_PROMPT },
    filePart as Part,
    { text: userText },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
  });

  const text = result.response.text();
  const cleaned = stripJsonFences(text);

  let parsed: ForensicReport;
  try {
    parsed = JSON.parse(cleaned) as ForensicReport;
  } catch {
    throw new Error("Gemini returned a response that could not be parsed as JSON.");
  }

  // Defensive defaults
  parsed.red_flags = parsed.red_flags ?? [];
  parsed.domains_found = parsed.domains_found ?? [];
  parsed.recommended_actions = parsed.recommended_actions ?? [];
  parsed.confidence = Math.max(0, Math.min(100, Number(parsed.confidence ?? 0)));

  return parsed;
}

// ============================================================================
// Deepfake / synthetic media analysis
// ============================================================================

export interface MediaSignal {
  label: string;
  status: "ok" | "warn" | "fail";
  detail: string;
}

export interface MediaForensicReport {
  verdict: "authentic" | "suspicious" | "synthetic";
  confidence: number; // 0-100
  media_type: "audio" | "video" | "unknown";
  duration_estimate: string | null;
  summary: string;
  signals: MediaSignal[];
  red_flags: RedFlag[];
  recommended_actions: string[];
}

const MEDIA_SYSTEM_PROMPT = `You are a senior Audio/Video Forensic Analyst
specialising in detecting deepfake recruiters, AI-cloned voices, and
synthetic interview media used in placement and employment scams.

You will be given a short audio clip or video clip uploaded by a student
who suspects it may be a fake recruiter.

Inspect the media for:
- Lip-sync drift, frame stutters, facial-mesh inconsistencies (video)
- Unnatural eye-blink cadence, frozen micro-expressions (video)
- Background loops, lighting inconsistencies, edge artefacts (video)
- Robotic prosody, flat affect, unnatural breath patterns (audio)
- Voice-cloning artefacts: clipped sibilants, spectral smear (audio)
- Scripted recruiter language: urgency, fees, off-platform contact
- Mention of suspicious domains, phone numbers, or payment requests

Return ONLY valid JSON matching this exact schema (no markdown fences):

{
  "verdict": "authentic" | "suspicious" | "synthetic",
  "confidence": <integer 0-100>,
  "media_type": "audio" | "video" | "unknown",
  "duration_estimate": "<e.g. '47 seconds' or null>",
  "summary": "<1-2 sentence executive summary>",
  "signals": [
    {
      "label": "<short signal name, e.g. 'Lip-sync drift'>",
      "status": "ok" | "warn" | "fail",
      "detail": "<one-line specific observation>"
    }
  ],
  "red_flags": [
    {
      "category": "urgency" | "fake_domain" | "requested_fee" | "grammar" | "impersonation" | "suspicious_contact" | "unrealistic_offer" | "other",
      "severity": "low" | "medium" | "high" | "critical",
      "evidence": "<specific moment, quote, or visual cue>",
      "explanation": "<why this is suspicious, plain English>"
    }
  ],
  "recommended_actions": ["<actionable next step for the student>"]
}

Provide 4-6 signals covering both visual and acoustic dimensions when video
is present, or acoustic-only when audio. Be specific — name timestamps,
quoted phrases, or visual cues whenever possible.`;

export async function analyzeMedia(
  file: File,
  userNote?: string
): Promise<MediaForensicReport> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const filePart = await fileToGenerativePart(file);

  const userText = userNote?.trim()
    ? `Additional context from the student: "${userNote.trim()}"`
    : "Analyse the attached recording and return the JSON forensic report.";

  const parts: Part[] = [
    { text: MEDIA_SYSTEM_PROMPT },
    filePart as Part,
    { text: userText },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
  });

  const text = result.response.text();
  const cleaned = stripJsonFences(text);

  let parsed: MediaForensicReport;
  try {
    parsed = JSON.parse(cleaned) as MediaForensicReport;
  } catch {
    throw new Error("Gemini returned a response that could not be parsed as JSON.");
  }

  parsed.signals = parsed.signals ?? [];
  parsed.red_flags = parsed.red_flags ?? [];
  parsed.recommended_actions = parsed.recommended_actions ?? [];
  parsed.confidence = Math.max(0, Math.min(100, Number(parsed.confidence ?? 0)));
  parsed.media_type = parsed.media_type ?? "unknown";

  return parsed;
}
