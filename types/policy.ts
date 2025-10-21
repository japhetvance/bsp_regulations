export type PolicyStatus = "Fully Compliant" | "Slightly Compliant" | "Non-Existent";

export type PolicyPriority = "High" | "Medium" | "Low";

export interface Policy {
  id: string;
  title: string;
  policyNumber: string;
  subject: string;
  effectiveDate: string;
  policy: string;
  status: PolicyStatus;
  compliance_Gap: string;
  bspIssuance: string;
  bspReference: string;
}

