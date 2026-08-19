import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-border bg-muted/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span> outputs are
        AI-generated and may be incomplete or inaccurate. Review and edit before sending, avoid
        entering confidential or personal data, and keep a human accountable for every decision.
      </p>
    </div>
  );
}
