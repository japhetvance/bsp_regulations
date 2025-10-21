"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from "lucide-react";
import { PolicyPriority, PolicyStatus } from "@/types/policy";

interface FilterControlsProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: PolicyStatus | "all";
  onStatusFilterChange: (value: PolicyStatus | "all") => void;
  categoryFilter: string | "all";
  onCategoryFilterChange: (value: string | "all") => void;
  priorityFilter: PolicyPriority | "all";
  onPriorityFilterChange: (value: PolicyPriority | "all") => void;
  categories: string[];
  onReset: () => void;
}

export function FilterControls({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categories,
  onReset,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search policies, references, or proof"
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-sm text-neutral-500">
          <Filter className="h-4 w-4" /> Filters
        </span>
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as PolicyStatus | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Compliant">Compliant</SelectItem>
            <SelectItem value="Not Compliant">Not compliant</SelectItem>
            <SelectItem value="Outdated">Outdated</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoryFilter}
          onValueChange={(value) => onCategoryFilterChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(value) =>
            onPriorityFilterChange(value as PolicyPriority | "all")
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" type="button" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
}

