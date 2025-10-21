import { promises as fs } from "fs";
import path from "path";

import { PoliciesTable } from "@/components/policies-table";
import { Policy, PolicyStatus } from "@/types/policy";
import NavigationButton from "../components/NavigationButton";
import Logo from "@/components/Logo";
import { getStatusDisplayLabel } from "@/lib/utils";

async function getPolicies(): Promise<Policy[]> {
  const dataPath = path.join(process.cwd(), "data", "rural_bank_docs.json");
  const raw = await fs.readFile(dataPath, "utf-8");
  const rawData = JSON.parse(raw) as Array<Record<string, string>>;

  return rawData.map((item, index) => {
    const complianceStatus = normalizeStatus(item["Compliance_Status"]);
    const policyNumber = item["Policy Number"];

    return {
      id: `${policyNumber}-${index}`,
      title: item["Policy Number"],
      policyNumber: item["Policy Number"],
      subject: item["Subject"],
      effectiveDate: item["Effective Date"],
      policy: item["Policy"],
      status: complianceStatus,
      compliance_Gap: item["Compliance_Gap"],
      bspIssuance: item["BSP Issuance"],
      bspReference: `BSP Circular ${item["BSP Issuance"]}`,
    } satisfies Policy;
  });
}

function normalizeStatus(status: string): PolicyStatus {
  if (status.startsWith("Non-Existent")) {
    return "Non-Existent";
  }

  if (status === "Fully Compliant" || status === "Slightly Compliant") {
    return status;
  }

  return "Non-Existent";
}

function getSummary(policies: Policy[]) {
  return policies.reduce(
    (acc, policy) => {
      acc.total += 1;
      acc.byStatus[policy.status] += 1;
      return acc;
    },
    {
      total: 0,
      byStatus: {
        "Fully Compliant": 0,
        "Slightly Compliant": 0,
        "Non-Existent": 0,
      } satisfies Record<PolicyStatus, number>,
    },
  );
}

const STATUS_COLORS: Record<PolicyStatus, string> = {
  "Fully Compliant": "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  "Slightly Compliant": "bg-amber-500/10 text-amber-700 border-amber-200",
  "Non-Existent": "bg-red-500/10 text-red-700 border-red-200",
};

export default async function ComplianceDashboard() {
  const policies = await getPolicies();
  const summary = getSummary(policies);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            <Logo />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Rural Bank Compliance Command Center
              </h1>
              <p className="mt-2 text-gray-600">
                Monitors mandatory policies for rural banking operations under BSP
                supervision. Updated by the Compliance Officer to ensure
                adherence to prudential, AML/CFT, governance, and consumer
                protection requirements.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="flex flex-col gap-4 border-b border-neutral-200 pb-10">

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-neutral-500">Total Policies</p>
              <p className="text-2xl font-semibold text-neutral-900">
                {summary.total}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                BSP-mandated requirements under monitoring
              </p>
            </div>
            {Object.entries(summary.byStatus).map(([status, count]) => (
              <div
                key={status}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs text-neutral-500">{status}</p>
                <p className="text-2xl font-semibold text-neutral-900">
                  {count}
                </p>
                <span
                  className={`mt-2 inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[status as PolicyStatus]}`}
                >
                  {getStatusDisplayLabel(status as PolicyStatus)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Policy Compliance Tracker
            </h2>
            <p className="text-sm text-neutral-600">
              Includes proof or reason for each status aligned with BSP circulars.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NavigationButton href="/reports" label="View Reports Dashboard" />
            <div className="text-xs text-neutral-500">
              Last updated:
              <span className="ml-2 font-medium text-neutral-700">
                {new Date().toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <PoliciesTable data={policies} />
      </section>
      </main>
    </div>
  );
}

