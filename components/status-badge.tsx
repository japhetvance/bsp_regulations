"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { PolicyStatus } from "@/types/policy";

const STATUS_VARIANTS: Record<string, string> = {
  "fully compliant": "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  "slightly compliant": "bg-amber-500/10 text-amber-600 border-amber-200",
  "non-existent": "bg-neutral-500/10 text-neutral-600 border-neutral-200",
};

export type PolicyStatus = "Fully Compliant" | "Slightly Compliant" | "Non-Existent";

interface StatusBadgeProps {
  status: PolicyStatus;
  onClick?: () => void;
  isExpanded?: boolean;
}

export function StatusBadge({ status, onClick, isExpanded }: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status.toLowerCase()] ?? STATUS_VARIANTS.outdated;
  const isInteractive = typeof onClick === "function";

  if (isInteractive) {
    return (
      <Badge
        asChild
        className={cn(
          "capitalize border transition-colors duration-150",
          variant,
          "cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/40",
        )}
      >
        <button
          type="button"
          onClick={onClick}
          className="flex items-center gap-1 outline-none"
          aria-expanded={isExpanded}
        >
          <span>{status}</span>
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
          )}
        </button>
      </Badge>
    );
  }

  return <Badge className={cn("capitalize border", variant)}>{status}</Badge>;
}

