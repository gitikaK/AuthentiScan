import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { formatBytes } from "@/lib/file-utils";

interface UploadDropzoneProps {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}

const ACCEPT = "application/pdf,image/png,image/jpeg,image/webp";

export function UploadDropzone({ file, onFile, disabled }: UploadDropzoneProps) {
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
    return (
      <div className="glass-elevated rounded-lg p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cyber-cyan/10 border border-cyber-cyan/40">
          <FileText className="h-6 w-6 text-cyber-cyan" />
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
        Drop offer letter or recruiter screenshot
      </div>
      <div className="font-mono text-xs text-muted-foreground mt-1">
        PDF · PNG · JPG · WEBP &nbsp;|&nbsp; Max 10 MB
      </div>
      <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-cyber-cyan/40 bg-cyber-cyan/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-cyber-cyan">
        Browse files
      </div>
    </label>
  );
}
