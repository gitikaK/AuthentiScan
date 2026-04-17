import { useEffect, useState } from "react";
import { Radar } from "lucide-react";

const STAGES = [
  "Decoding container ·",
  "Extracting frames & audio ·",
  "Measuring lip-sync drift ·",
  "Profiling voice spectrum ·",
  "Scoring synthetic-media patterns ·",
  "Compiling forensic report ·",
];

export function MediaScanningSequence({ fileName }: { fileName: string }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-elevated rounded-lg p-8 scanline">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-cyber-cyan/40 blur-lg animate-pulse" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyber-cyan/60 bg-cyber-cyan/10">
            <Radar className="h-5 w-5 text-cyber-cyan animate-pulse" />
          </div>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-cyber-cyan">
            Deepfake engine running
          </div>
          <div className="font-mono text-sm text-foreground mt-0.5 truncate max-w-md">
            {fileName}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {STAGES.map((label, i) => {
          const done = i < stage;
          const active = i === stage;
          return (
            <div
              key={label}
              className={`flex items-center gap-3 font-mono text-xs ${
                done
                  ? "text-cyber-emerald"
                  : active
                  ? "text-cyber-cyan"
                  : "text-muted-foreground/60"
              }`}
            >
              <span className="w-4">{done ? "✓" : active ? ">" : "·"}</span>
              <span>{label}</span>
              {active && (
                <span className="ml-1 inline-block h-3 w-2 bg-cyber-cyan animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-end gap-1 h-16">
        {Array.from({ length: 48 }).map((_, i) => {
          const h = 18 + Math.abs(Math.sin((i + stage * 3) * 0.55) * 70) + (i % 4) * 4;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-cyber-cyan/30 to-cyber-cyan transition-all"
              style={{ height: `${Math.min(100, h)}%` }}
            />
          );
        })}
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/40 border border-border/60">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-emerald to-cyber-cyan transition-all duration-700"
          style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
