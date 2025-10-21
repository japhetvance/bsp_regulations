"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANTS: Record<string, string> = {
  compliant: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  "not compliant": "bg-destructive/10 text-destructive border-destructive/40",
  outdated: "bg-amber-500/10 text-amber-600 border-amber-200",
};

export type PolicyStatus = "Compliant" | "Not Compliant" | "Outdated";

interface StatusBadgeProps {
  status: PolicyStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status.toLowerCase()] ?? STATUS_VARIANTS.outdated;

  return <Badge className={cn("capitalize border", variant)}>{status}</Badge>;
}

