export type PolicyStatus = "Fully Compliant" | "Slightly Compliant" | "Non-Existent";

export type PolicyPriority = "High" | "Medium" | "Low";

export interface Policy {
  id: string;
  title: string;
  status: PolicyStatus;
  policyDetails: string;
  complianceGap: string;
  bspIssuance: string;
  bspReference: string;
  policyText: string;
}

