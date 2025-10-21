import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PolicyStatus } from "@/types/policy"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStatusDisplayLabel(status: PolicyStatus): string {
  const labels: Record<PolicyStatus, string> = {
    "Non-Existent": "NA - Information Only",
    "Slightly Compliant": "Partial Compliance",
    "Fully Compliant": "Fully Compliant",
  };
  return labels[status];
}
