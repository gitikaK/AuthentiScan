import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  status?: { label: string; tone: "cyan" | "emerald" | "crimson" | "amber" };
}

export function PageHeader({ eyebrow, title, description, status }: PageHeaderProps) {
  const toneClass =
    status?.tone === "emerald"
      ? "border-cyber-emerald/40 text-cyber-emerald bg-cyber-emerald/10"
      : status?.tone === "crimson"
      ? "border-cyber-crimson/40 text-cyber-crimson bg-cyber-crimson/10"
      : status?.tone === "amber"
      ? "border-cyber-amber/40 text-cyber-amber bg-cyber-amber/10"
      : "border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/10";

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
        <span>AuthentiScan</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-cyber-cyan">{eyebrow}</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
            {description}
          </p>
        </div>
        {status && (
          <div
            className={`self-start md:self-end inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] ${toneClass}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
            </span>
            {status.label}
          </div>
        )}
      </div>
    </div>
  );
}
