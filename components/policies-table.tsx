"use client";

import { Fragment, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { FilterControls } from "@/components/filter-controls";
import type { Policy, PolicyStatus } from "@/types/policy";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

type SortKey = keyof Pick<Policy, "title" | "status">;

type SortDirection = "asc" | "desc";

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

interface PoliciesTableProps {
  data: Policy[];
}

const SORTABLE_COLUMNS: SortKey[] = ["title", "status"];

const STATUS_ORDER: Record<PolicyStatus, number> = {
  "Fully Compliant": 1,
  "Slightly Compliant": 2,
  "Non-Existent": 3,
};

function formatMultilineText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\s{2,}-/g, "\n-" )
    .replace(/\s{2,}/g, "\n")
    .trim();
}

export function PoliciesTable({ data }: PoliciesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | "all">("all");
  const [expandedRow, setExpandedRow] = useState<{ id: string; type: "policy" | "status" } | null>(null);
  const [sortState, setSortState] = useState<SortState>({
    key: "title",
    direction: "asc",
  });

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

  return data.filter((policy) => {
      const matchesSearch = normalizedSearch
        ? [
            policy.title,
            policy.bspReference,
          policy.compliance_Gap,
          policy.subject,
          policy.policy,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      const matchesStatus =
        statusFilter === "all" ? true : policy.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = a[sortState.key];
      const valueB = b[sortState.key];

      if (sortState.key === "status") {
        return STATUS_ORDER[valueA as PolicyStatus] - STATUS_ORDER[valueB as PolicyStatus];
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB);
      }

      return 0;
    });

    return sortState.direction === "asc" ? sorted : sorted.reverse();
  }, [filteredData, sortState]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handleSort = (key: SortKey) => {
    setSortState((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: "asc",
      };
    });
  };

  const toggleExpansion = (id: string, type: "policy" | "status") => {
    setExpandedRow((prev) => {
      if (prev?.id === id && prev.type === type) {
        return null;
      }

      return { id, type };
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <FilterControls
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onReset={resetFilters}
        />

        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                {SORTABLE_COLUMNS.map((columnKey) => (
                  <TableHead key={columnKey} className="whitespace-nowrap">
                    <Button
                      variant="ghost"
                      className="-ml-2 flex items-center gap-1 text-sm font-semibold"
                      onClick={() => handleSort(columnKey)}
                    >
                      {columnKey === "title" ? "Policy Number" : "Status"}
                      {sortState.key === columnKey ? (
                        sortState.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : null}
                    </Button>
                  </TableHead>
                ))}
                <TableHead className="w-[200px]">BSP Reference</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedData.map((policy) => {
                const isPolicyExpanded =
                  expandedRow?.id === policy.id && expandedRow.type === "policy";
                const isStatusExpanded =
                  expandedRow?.id === policy.id && expandedRow.type === "status";

                return (
                  <Fragment key={policy.id}>
                    <TableRow className="align-top">
                      <TableCell className="font-medium">
                        <button
                          type="button"
                          onClick={() => toggleExpansion(policy.id, "policy")}
                          className={cn(
                            "flex w-full flex-col gap-1 text-left text-sm font-semibold text-primary",
                            "hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                          )}
                          aria-expanded={isPolicyExpanded}
                        >
                          {policy.title}
                          <span className="text-xs font-normal text-neutral-500">
                            {policy.subject}
                          </span>
                        </button>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={policy.status}
                          onClick={() => toggleExpansion(policy.id, "status")}
                          isExpanded={isStatusExpanded}
                        />
                      </TableCell>
                      <TableCell>
                        <a
                          href={`/pdfs/${policy.bspIssuance}.pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          {policy.bspReference}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>

                    {isPolicyExpanded ? (
                      <TableRow>
                        <TableCell colSpan={3} className="bg-neutral-50">
                          <div className="flex flex-col gap-2 p-4">
                            <div className="flex flex-col gap-1 text-sm text-neutral-700">
                              <span className="font-semibold text-neutral-900">
                                Effective Date
                              </span>
                              <span>{policy.effectiveDate}</span>
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-neutral-700">
                              <span className="font-semibold text-neutral-900">
                                Policy
                              </span>
                              <p className="whitespace-pre-wrap">
                                {formatMultilineText(policy.policy)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}

                    {isStatusExpanded ? (
                      <TableRow>
                        <TableCell colSpan={3} className="bg-neutral-50">
                          <div className="flex flex-col gap-2 p-4">
                            <p className="whitespace-pre-wrap text-sm text-neutral-700">
                              {formatMultilineText(policy.compliance_Gap)}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>

          {sortedData.length === 0 ? (
            <div className="border-t border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
              No policies match the current filters.
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

