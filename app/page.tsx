import { promises as fs } from "fs";
import path from "path";

import { PoliciesTable } from "@/components/policies-table";
import { Policy } from "@/types/policy";

async function getPolicies(): Promise<Policy[]> {
  const dataPath = path.join(process.cwd(), "data", "policies.json");
  const raw = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(raw) as Policy[];
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
        Compliant: 0,
        "Not Compliant": 0,
        Outdated: 0,
      },
    },
  );
}

const STATUS_COLORS: Record<string, string> = {
  Compliant: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  "Not Compliant": "bg-destructive/10 text-destructive border-destructive/30",
  Outdated: "bg-amber-500/10 text-amber-700 border-amber-200",
};

export default async function ComplianceDashboard() {
  const policies = await getPolicies();
  const summary = getSummary(policies);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
      <section className="flex flex-col gap-4 border-b border-neutral-200 pb-10">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Rural Bank Compliance Command Center
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-neutral-600">
              Monitors mandatory policies for rural banking operations under BSP
              supervision. Updated by the Compliance Officer to ensure
              adherence to prudential, AML/CFT, governance, and consumer
              protection requirements.
            </p>
          </div>

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
                  className={`mt-2 inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLORS[status]}`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
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

        <PoliciesTable data={policies} />
      </section>
    </main>
  );
}

