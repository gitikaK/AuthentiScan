import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Sparkles, Eye } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { MediaUploadDropzone } from "@/components/MediaUploadDropzone";
import { MediaScanningSequence } from "@/components/MediaScanningSequence";
import { MediaReportCard } from "@/components/MediaReportCard";
import { analyzeMedia, type MediaForensicReport } from "@/lib/gemini";

export const Route = createFileRoute("/audio-video")({
  head: () => ({
    meta: [
      { title: "Deepfake Recruiter Scanner · AuthentiScan" },
      {
        name: "description",
        content:
          "Detect synthetic recruiter videos and cloned-voice phone interviews used in placement scams.",
      },
    ],
  }),
  component: AudioVideoPage,
});

const MAX_BYTES = 18 * 1024 * 1024; // 18 MB inline limit safety margin

function AudioVideoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<MediaForensicReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzedFileName, setAnalyzedFileName] = useState("");

  const handleFile = (f: File | null) => {
    setError(null);
    if (f && f.size > MAX_BYTES) {
      setError(
        `File is ${(f.size / 1024 / 1024).toFixed(1)} MB. Max 18 MB for inline analysis — please trim the clip first.`
      );
      setFile(null);
      return;
    }
    setFile(f);
  };

  const run = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const result = await analyzeMedia(file, note);
      setReport(result);
      setAnalyzedFileName(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setNote("");
    setReport(null);
    setError(null);
    setAnalyzedFileName("");
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Deepfake Scanner"
        title="Detect synthetic recruiters & cloned voices"
        description="Upload a recorded interview clip or a voice note from a recruiter. The model inspects facial micro-expressions, lip-sync drift, and audio spectrum artefacts."
        status={{ label: "Engine ready", tone: "cyan" }}
      />

      {report ? (
        <MediaReportCard report={report} fileName={analyzedFileName} onReset={reset} />
      ) : loading && file ? (
        <MediaScanningSequence fileName={file.name} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <MediaUploadDropzone file={file} onFile={handleFile} disabled={loading} />

            <div className="glass rounded-lg p-5">
              <label
                htmlFor="ctx"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
              >
                Optional context for the analyst
              </label>
              <textarea
                id="ctx"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. 'Recruiter from “Globaltech HR” sent this 47-second voice note on WhatsApp.'"
                rows={3}
                className="mt-2 w-full resize-none rounded-md border border-border bg-black/30 px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-cyber-cyan/60 focus:ring-1 focus:ring-cyber-cyan/40"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-md border border-cyber-crimson/40 bg-cyber-crimson/10 p-4">
                <AlertCircle className="h-5 w-5 text-cyber-crimson mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-cyber-crimson">
                    Analysis failed
                  </div>
                  <p className="text-sm text-foreground/90 mt-1">{error}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={run}
              disabled={!file || loading}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-md px-5 py-3.5 font-mono text-sm uppercase tracking-[0.25em] transition ${
                !file || loading
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-cyber-cyan text-primary-foreground hover:bg-cyber-cyan/90 animate-pulse-glow"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Run deepfake analysis
            </button>
          </div>

          <aside className="space-y-4">
            <div className="glass rounded-lg p-5">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan mb-3">
                <Eye className="h-3.5 w-3.5" /> What we inspect
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Lip-sync drift & frame stutters",
                  "Eye-blink cadence & micro-expressions",
                  "Background loops & lighting cues",
                  "Voice-cloning spectral artefacts",
                  "Robotic prosody & breath patterns",
                  "Scripted recruiter language",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyber-cyan shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-lg p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-cyber-emerald mb-3">
                Tips for best results
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep clips under 60 seconds and 18 MB. For video, framerate ≥
                24 fps and audible speech improve detection accuracy.
              </p>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
