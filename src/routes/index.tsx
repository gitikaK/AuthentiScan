import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ScanningSequence } from "@/components/ScanningSequence";
import { ForensicReportCard } from "@/components/ForensicReportCard";
import { analyzeOfferLetter, type ForensicReport } from "@/lib/gemini";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Forensic Upload Terminal · AuthentiScan" },
      {
        name: "description",
        content:
          "Drop a job offer letter or recruiter screenshot. AuthentiScan returns a forensic report flagging fake domains, urgency tactics, and fraudulent fees.",
      },
    ],
  }),
  component: ForensicTerminalPage,
});

function ForensicTerminalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzedFileName, setAnalyzedFileName] = useState<string>("");

  const run = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const result = await analyzeOfferLetter(file, note);
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
        eyebrow="Forensic Terminal"
        title="Upload an artefact for forensic analysis"
        description="Drop an offer letter (PDF) or a screenshot of a recruiter message. The engine extracts text, validates domains, and scores placement-scam indicators in seconds."
        status={{ label: "Engine ready", tone: "cyan" }}
      />

      {report ? (
        <ForensicReportCard
          report={report}
          fileName={analyzedFileName}
          onReset={reset}
        />
      ) : loading && file ? (
        <ScanningSequence fileName={file.name} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <UploadDropzone file={file} onFile={setFile} disabled={loading} />

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
                placeholder="e.g. 'Received this on WhatsApp from a number not on the company website.'"
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
              Run forensic analysis
            </button>
          </div>

          <aside className="space-y-4">
            <div className="glass rounded-lg p-5">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan mb-3">
                What we look for
              </h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  "Lookalike & free-mail domains",
                  "Up-front payment / training fees",
                  "Urgency & 24-hour deadlines",
                  "Brand impersonation patterns",
                  "Generic greetings, missing JD",
                  "Unrealistic compensation",
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
                Privacy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your file is sent directly to the analysis model and is not
                stored on any AuthentiScan server.
              </p>
            </div>
          </aside>
        </div>
      )}
    </AppShell>
  );
}
