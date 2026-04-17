import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, Filter, Globe2, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { THREAT_FEED, type ThreatEntry } from "@/lib/threat-data";

export const Route = createFileRoute("/threat-intel")({
  head: () => ({
    meta: [
      { title: "Global Threat Registry · AuthentiScan" },
      {
        name: "description",
        content:
          "Live registry of recently intercepted job-offer scams, deepfake recruiters, and impersonated brands across the AuthentiScan network.",
      },
    ],
  }),
  component: ThreatIntelPage,
});

const SEVERITY_TONE: Record<ThreatEntry["severity"], string> = {
  low: "text-muted-foreground",
  medium: "text-cyber-amber",
  high: "text-cyber-crimson",
  critical: "text-cyber-crimson",
};

const SEVERITY_DOT: Record<ThreatEntry["severity"], string> = {
  low: "bg-muted-foreground",
  medium: "bg-cyber-amber",
  high: "bg-cyber-crimson",
  critical: "bg-cyber-crimson animate-pulse",
};

function ThreatIntelPage() {
  const [filter, setFilter] = useState<"all" | ThreatEntry["severity"]>("all");
  const [tick, setTick] = useState(0);

  // Simulate live counter increment
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? THREAT_FEED : THREAT_FEED.filter((t) => t.severity === filter)),
    [filter]
  );

  // Duplicate for seamless ticker loop
  const tickerData = useMemo(() => [...filtered, ...filtered], [filtered]);

  const stats = {
    intercepted: 18420 + tick,
    today: 312 + (tick % 7),
    critical: THREAT_FEED.filter((t) => t.severity === "critical").length,
    countries: 14,
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Threat Registry"
        title="Live feed of intercepted placement scams"
        description="Anonymised intelligence from every artefact analysed across the AuthentiScan network. Updated in real time as new fraud patterns emerge."
        status={{ label: "Streaming live", tone: "emerald" }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Intercepted (all-time)" value={stats.intercepted.toLocaleString()} icon={ShieldAlert} tone="cyan" />
        <StatCard label="Logged today"           value={String(stats.today)}                icon={Activity}    tone="emerald" />
        <StatCard label="Critical · last hour"   value={String(stats.critical)}             icon={ShieldAlert} tone="crimson" />
        <StatCard label="Countries reporting"    value={String(stats.countries)}            icon={Globe2}      tone="amber" />
      </div>

      <div className="glass-elevated rounded-lg overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 flex-wrap gap-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <Activity className="h-3.5 w-3.5" />
            Live intercept stream
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {(["all", "critical", "high", "medium"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                  filter === f
                    ? "border-cyber-cyan/60 bg-cyber-cyan/10 text-cyber-cyan"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Header row */}
        <div className="hidden md:grid grid-cols-[100px_120px_1fr_110px_100px_90px] gap-4 px-5 py-2.5 border-b border-border/60 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground bg-black/20">
          <div>ID</div>
          <div>Time</div>
          <div>Impersonated · Technique</div>
          <div>Vector</div>
          <div>Region</div>
          <div className="text-right">Severity</div>
        </div>

        {/* Ticker rows */}
        <div className="relative h-[480px] overflow-hidden">
          <div className="animate-ticker">
            {tickerData.map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="grid grid-cols-2 md:grid-cols-[100px_120px_1fr_110px_100px_90px] gap-2 md:gap-4 px-5 py-3 border-b border-border/40 hover:bg-cyber-cyan/5 transition"
              >
                <div className="font-mono text-xs text-cyber-cyan">{t.id}</div>
                <div className="font-mono text-xs text-muted-foreground">{t.timestamp}</div>
                <div className="col-span-2 md:col-span-1">
                  <div className="text-sm text-foreground">{t.impersonated}</div>
                  <div className="font-mono text-xs text-muted-foreground mt-0.5 truncate">
                    {t.technique}
                  </div>
                </div>
                <div className="font-mono text-xs text-foreground/90">{t.vector}</div>
                <div className="font-mono text-xs text-muted-foreground">{t.region}</div>
                <div className="md:text-right flex items-center md:justify-end gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${SEVERITY_DOT[t.severity]}`} />
                  <span className={`font-mono text-[11px] uppercase tracking-[0.15em] ${SEVERITY_TONE[t.severity]}`}>
                    {t.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[oklch(0.18_0.03_250)] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[oklch(0.18_0.03_250)] to-transparent" />
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "cyan" | "emerald" | "crimson" | "amber";
}) {
  const toneText =
    tone === "emerald"
      ? "text-cyber-emerald"
      : tone === "crimson"
      ? "text-cyber-crimson"
      : tone === "amber"
      ? "text-cyber-amber"
      : "text-cyber-cyan";

  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${toneText}`} />
      </div>
      <div className={`font-mono text-2xl ${toneText}`}>{value}</div>
    </div>
  );
}
