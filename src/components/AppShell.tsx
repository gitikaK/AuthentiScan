import { Link, useLocation } from "@tanstack/react-router";
import { ShieldCheck, FileScan, Radio, Activity } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/",             label: "Forensic Terminal",  icon: FileScan },
  { to: "/audio-video",  label: "Deepfake Scanner",   icon: Radio },
  { to: "/threat-intel", label: "Threat Registry",    icon: Activity },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col glass border-r border-border/60 px-5 py-6">
        <Link to="/" className="flex items-center gap-3 mb-10 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-md bg-cyber-cyan/30 blur-md group-hover:bg-cyber-cyan/50 transition" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-md border border-cyber-cyan/60 bg-cyber-cyan/10">
              <ShieldCheck className="h-5 w-5 text-cyber-cyan" />
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-mono text-sm font-semibold tracking-widest text-foreground">
              AUTHENTI<span className="text-cyber-cyan">SCAN</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              v2.4 · forensic
            </div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition border ${
                  active
                    ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/40 glow-cyan"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-mono tracking-wide">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-md border border-border/60 bg-black/30 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-emerald opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-emerald" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyber-emerald">
                online
              </span>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
              Threat-intel feed synced.
              <br />
              Engine: gemini-2.5-flash
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (mobile) */}
        <header className="lg:hidden sticky top-0 z-20 glass border-b border-border/60 px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyber-cyan" />
            <span className="font-mono text-sm font-semibold tracking-widest">
              AUTHENTI<span className="text-cyber-cyan">SCAN</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map(({ to, icon: Icon, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  className={`p-2 rounded-md border ${
                    active
                      ? "border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/10"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 grid-bg">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
