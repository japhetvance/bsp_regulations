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
import { Policy, PolicyPriority, PolicyStatus } from "@/types/policy";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

type SortKey = keyof Pick<
  Policy,
  | "title"
  | "category"
  | "status"
  | "priority"
  | "lastReviewed"
  | "nextDeadline"
>;

type SortDirection = "asc" | "desc";

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

interface PoliciesTableProps {
  data: Policy[];
}

const SORTABLE_COLUMNS: SortKey[] = [
  "title",
  "category",
  "status",
  "priority",
  "lastReviewed",
  "nextDeadline",
];

const PRIORITY_CLASSNAMES: Record<PolicyPriority, string> = {
  High: "text-rose-600",
  Medium: "text-amber-600",
  Low: "text-emerald-600",
};

const PRIORITY_ORDER: Record<PolicyPriority, number> = {
  High: 1,
  Medium: 2,
  Low: 3,
};

export function PoliciesTable({ data }: PoliciesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<PolicyPriority | "all">(
    "all",
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortState, setSortState] = useState<SortState>({
    key: "priority",
    direction: "asc",
  });

  const categories = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((policy) => unique.add(policy.category));
    return Array.from(unique).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return data.filter((policy) => {
      const matchesSearch = normalizedSearch
        ? [
            policy.title,
            policy.bspReference,
            policy.proof,
            policy.category,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch)
        : true;

      const matchesStatus =
        statusFilter === "all" ? true : policy.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ? true : policy.category === categoryFilter;

      const matchesPriority =
        priorityFilter === "all" ? true : policy.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [data, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = a[sortState.key];
      const valueB = b[sortState.key];

      if (sortState.key === "priority") {
        return PRIORITY_ORDER[valueA as PolicyPriority] - PRIORITY_ORDER[valueB as PolicyPriority];
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        if (sortState.key === "lastReviewed" || sortState.key === "nextDeadline") {
          return new Date(valueA).getTime() - new Date(valueB).getTime();
        }

        return valueA.localeCompare(valueB);
      }

      return 0;
    });

    return sortState.direction === "asc" ? sorted : sorted.reverse();
  }, [filteredData, sortState]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPriorityFilter("all");
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

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <FilterControls
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(value) =>
            setCategoryFilter(value === "all" ? "all" : value)
          }
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          categories={categories}
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
                      {columnKey === "title"
                        ? "Policy"
                        : columnKey === "lastReviewed"
                          ? "Last Reviewed"
                          : columnKey === "nextDeadline"
                            ? "Next Deadline"
                            : columnKey === "priority"
                              ? "Priority"
                              : columnKey === "category"
                                ? "Category"
                                : "Status"}
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
                <TableHead className="w-[180px]">BSP Reference</TableHead>
                <TableHead className="w-[120px] text-right">Proof / Reason</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedData.map((policy) => {
                const isExpanded = expandedRow === policy.id;

                return (
                  <Fragment key={policy.id}>
                    <TableRow key={policy.id} className="align-top">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span>{policy.title}</span>
                          <span className="text-xs text-neutral-500">
                            {policy.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{policy.category}</TableCell>
                      <TableCell>
                        <StatusBadge status={policy.status} />
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            PRIORITY_CLASSNAMES[policy.priority],
                          )}
                        >
                          {policy.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <time className="text-sm text-neutral-600">
                          {new Date(policy.lastReviewed).toLocaleDateString(
                            "en-PH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </time>
                      </TableCell>
                      <TableCell>
                        <time className="text-sm font-semibold text-neutral-800">
                          {new Date(policy.nextDeadline).toLocaleDateString(
                            "en-PH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </time>
                      </TableCell>
                      <TableCell>
                        <a
                          href={"https://www.bsp.gov.ph"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          {policy.bspReference}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setExpandedRow((prev) =>
                              prev === policy.id ? null : policy.id,
                            )
                          }
                        >
                          {isExpanded ? "Hide" : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {isExpanded ? (
                      <TableRow key={`${policy.id}-details`}>
                        <TableCell colSpan={8} className="bg-neutral-50">
                          <div className="flex flex-col gap-2 p-4">
                            <p className="text-sm text-neutral-700">
                              {policy.proof}
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

