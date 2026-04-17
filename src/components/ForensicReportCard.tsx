import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Globe,
  Building2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import type { ForensicReport, RedFlag } from "@/lib/gemini";

interface Props {
  report: ForensicReport;
  fileName: string;
  onReset: () => void;
}

const VERDICT_META = {
  legitimate: {
    label: "Likely Legitimate",
    Icon: ShieldCheck,
    tone: "emerald" as const,
  },
  suspicious: {
    label: "Suspicious",
    Icon: ShieldAlert,
    tone: "amber" as const,
  },
  fraudulent: {
    label: "Fraudulent",
    Icon: ShieldX,
    tone: "crimson" as const,
  },
};

const SEVERITY_TONE: Record<RedFlag["severity"], string> = {
  low: "border-cyber-amber/30 text-cyber-amber bg-cyber-amber/5",
  medium: "border-cyber-amber/50 text-cyber-amber bg-cyber-amber/10",
  high: "border-cyber-crimson/40 text-cyber-crimson bg-cyber-crimson/10",
  critical: "border-cyber-crimson/60 text-cyber-crimson bg-cyber-crimson/15",
};

const CATEGORY_LABEL: Record<RedFlag["category"], string> = {
  urgency: "Urgency Pressure",
  fake_domain: "Suspicious Domain",
  requested_fee: "Payment Requested",
  grammar: "Grammar / Format",
  impersonation: "Brand Impersonation",
  suspicious_contact: "Suspicious Contact",
  unrealistic_offer: "Unrealistic Offer",
  other: "Other Anomaly",
};

export function ForensicReportCard({ report, fileName, onReset }: Props) {
  const meta = VERDICT_META[report.verdict] ?? VERDICT_META.suspicious;
  const Icon = meta.Icon;

  const toneText =
    meta.tone === "emerald"
      ? "text-cyber-emerald"
      : meta.tone === "crimson"
      ? "text-cyber-crimson"
      : "text-cyber-amber";
  const toneBorder =
    meta.tone === "emerald"
      ? "border-cyber-emerald/40"
      : meta.tone === "crimson"
      ? "border-cyber-crimson/40"
      : "border-cyber-amber/40";
  const toneGlow =
    meta.tone === "emerald"
      ? "glow-emerald"
      : meta.tone === "crimson"
      ? "glow-crimson"
      : "";
  const toneBg =
    meta.tone === "emerald"
      ? "bg-cyber-emerald/10"
      : meta.tone === "crimson"
      ? "bg-cyber-crimson/10"
      : "bg-cyber-amber/10";

  return (
    <div className="space-y-6">
      {/* Verdict header */}
      <div className={`glass-elevated rounded-lg border ${toneBorder} ${toneGlow} p-6`}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg ${toneBg} border ${toneBorder}`}>
            <Icon className={`h-8 w-8 ${toneText}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Verdict · {fileName}
            </div>
            <div className={`mt-1 text-2xl md:text-3xl font-semibold ${toneText}`}>
              {meta.label}
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              {report.summary}
            </p>
          </div>

          <div className="flex md:flex-col items-end gap-2">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Confidence
            </div>
            <div className={`font-mono text-3xl font-semibold ${toneText}`}>
              {report.confidence}%
            </div>
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            <Building2 className="h-3.5 w-3.5" /> Company claimed
          </div>
          <div className="font-mono text-sm text-foreground truncate">
            {report.company_claimed || "—"}
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            <Globe className="h-3.5 w-3.5" /> Domains found
          </div>
          <div className="font-mono text-xs text-foreground space-y-0.5 max-h-16 overflow-auto">
            {report.domains_found.length === 0 ? (
              <span className="text-muted-foreground">none detected</span>
            ) : (
              report.domains_found.map((d) => <div key={d} className="truncate">{d}</div>)
            )}
          </div>
        </div>
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            <AlertTriangle className="h-3.5 w-3.5" /> Anomalies
          </div>
          <div className="font-mono text-2xl text-foreground">
            {report.red_flags.length}
            <span className="ml-1 text-xs text-muted-foreground">flagged</span>
          </div>
        </div>
      </div>

      {/* Red flags */}
      <div className="glass-elevated rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            Red flags
          </h2>
          <span className="font-mono text-[11px] text-muted-foreground">
            {report.red_flags.length} item{report.red_flags.length === 1 ? "" : "s"}
          </span>
        </div>

        {report.red_flags.length === 0 ? (
          <div className="rounded-md border border-cyber-emerald/30 bg-cyber-emerald/5 p-4 font-mono text-sm text-cyber-emerald">
            No red flags detected by the forensic engine.
          </div>
        ) : (
          <ul className="space-y-3">
            {report.red_flags.map((flag, i) => (
              <li key={i} className="rounded-md border border-border bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-foreground">
                    {CATEGORY_LABEL[flag.category] ?? flag.category}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${SEVERITY_TONE[flag.severity]}`}
                  >
                    {flag.severity}
                  </span>
                </div>
                <blockquote className="font-mono text-xs text-cyber-cyan border-l-2 border-cyber-cyan/40 pl-3 mb-2">
                  “{flag.evidence}”
                </blockquote>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {flag.explanation}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recommendations */}
      {report.recommended_actions.length > 0 && (
        <div className="glass-elevated rounded-lg p-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan mb-4">
            Recommended actions
          </h2>
          <ul className="space-y-2.5">
            {report.recommended_actions.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-cyber-cyan" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground hover:border-cyber-cyan/60 hover:text-cyber-cyan transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Scan another artefact
        </button>
      </div>
    </div>
  );
}
