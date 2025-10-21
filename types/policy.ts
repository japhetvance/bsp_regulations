export type PolicyStatus = "Compliant" | "Not Compliant" | "Outdated";

export type PolicyPriority = "High" | "Medium" | "Low";

export interface Policy {
  id: string;
  title: string;
  category: string;
  status: PolicyStatus;
  proof: string;
  lastReviewed: string;
  nextDeadline: string;
  bspReference: string;
  priority: PolicyPriority;
}

