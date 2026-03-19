import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { truncateAddress } from "@/lib/multisig-types";

interface ThresholdTrackerProps {
  approvals: number;
  threshold: number;
  maxSigners: number;
  signerAddresses?: string[];
}

export function ThresholdTracker({ approvals, threshold, maxSigners, signerAddresses = [] }: ThresholdTrackerProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: maxSigners }).map((_, i) => {
          const isFilled = i < approvals;
          const isThreshold = i === threshold - 1;
          const addr = signerAddresses[i];

          const dot = (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full border transition-all duration-200
                ${isFilled ? "bg-primary border-primary glow-dot" : "bg-muted border-border"}
                ${isThreshold ? "ring-1 ring-primary/40 ring-offset-1 ring-offset-background" : ""}
              `}
            />
          );

          if (addr) {
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>{dot}</TooltipTrigger>
                <TooltipContent side="top" className="bg-popover border-border">
                  <span className="font-mono text-xs">{truncateAddress(addr)}</span>
                </TooltipContent>
              </Tooltip>
            );
          }

          return dot;
        })}
      </div>
    </TooltipProvider>
  );
}