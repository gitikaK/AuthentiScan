import { useCallback, useRef, useState } from "react";
import { UploadCloud, Film, Mic2, X } from "lucide-react";
import { formatBytes } from "@/lib/file-utils";

interface Props {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}

const ACCEPT =
  "video/mp4,video/quicktime,video/webm,audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/x-m4a,audio/mp4,audio/aac,audio/ogg";

export function MediaUploadDropzone({ file, onFile, disabled }: Props) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      if (disabled) return;
      const f = e.dataTransfer.files?.[0];
      if (f) onFile(f);
    },
    [onFile, disabled]
  );

  if (file) {
    const isVideo = file.type.startsWith("video/");
    const Icon = isVideo ? Film : Mic2;
    return (
      <div className="glass-elevated rounded-lg p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cyber-cyan/10 border border-cyber-cyan/40">
          <Icon className="h-6 w-6 text-cyber-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm text-foreground truncate">{file.name}</div>
          <div className="font-mono text-xs text-muted-foreground mt-0.5">
            {file.type || "unknown"} · {formatBytes(file.size)}
          </div>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => onFile(null)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-border transition"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 cursor-pointer transition-all text-center ${
        disabled
          ? "border-border/40 opacity-60 cursor-not-allowed"
          : drag
          ? "border-cyber-cyan bg-cyber-cyan/5 glow-cyan"
          : "border-border hover:border-cyber-cyan/60 hover:bg-white/[0.02]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyber-cyan/10 border border-cyber-cyan/40 mb-4">
        <UploadCloud className="h-7 w-7 text-cyber-cyan" />
      </div>
      <div className="font-mono text-sm text-foreground">
        Drop recruiter video clip or voice note
      </div>
      <div className="font-mono text-xs text-muted-foreground mt-1">
        MP4 · MOV · WEBM · MP3 · WAV · M4A &nbsp;|&nbsp; Max 18 MB · ≤ 60 s recommended
      </div>
      <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-cyber-cyan/40 bg-cyber-cyan/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-cyber-cyan">
        Browse media
      </div>
    </label>
  );
}
